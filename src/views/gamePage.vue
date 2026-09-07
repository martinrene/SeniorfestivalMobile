<template>
  <ion-page>
    <div class="game">
      <div class="hud">
        <div class="hud-block">
          <span class="hud-label">Tid</span>
          <span class="hud-value">{{ secondsLeft }}</span>
        </div>
        <div class="hud-block">
          <span class="hud-label">Træf</span>
          <span class="hud-value">{{ state.hits }}</span>
        </div>
      </div>

      <div
        ref="arena"
        class="arena"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <div class="target" :class="{ pop: state.targetPop }" :style="targetStyle">
          {{ state.targetEmoji }}
        </div>

        <div
          v-for="item in items"
          :key="item.id"
          class="food"
          :class="{ scored: item.hit }"
          :style="foodStyle(item)"
        >
          {{ item.emoji }}
        </div>

        <div v-if="state.phase === 'playing'" class="food hand" :style="handStyle">
          {{ state.handEmoji }}
        </div>

        <p v-if="state.phase === 'playing' && !state.hasThrown" class="hint">
          Svirp maden op i fjæset
        </p>
      </div>

      <div v-if="state.phase !== 'playing'" class="overlay">
        <div class="card">
          <template v-if="state.phase === 'idle'">
            <h1>Madkast</h1>
            <p class="lead">
              Svirp pommes, burgere, hotdogs, tacos, pizzaer og vafler op i
              de glade fjæs. Du har ét minut.
            </p>
            <p v-if="state.best > 0" class="best">Din rekord: {{ state.best }}</p>
            <ion-button expand="block" class="play" @click="startRound">
              Start
            </ion-button>
          </template>

          <template v-else>
            <h1 class="score">{{ state.hits }}</h1>
            <p class="lead">træf på ét minut</p>
            <p v-if="state.isNewBest" class="best">Ny rekord! 🎉</p>
            <p v-else-if="state.best > 0" class="best">Din rekord: {{ state.best }}</p>
            <ion-button expand="block" class="play" @click="startRound">
              Spil igen
            </ion-button>
          </template>
        </div>
      </div>
    </div>
  </ion-page>
</template>

<script setup lang="js">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import {
  IonButton,
  IonPage,
  onIonViewDidEnter,
  onIonViewWillLeave
} from "@ionic/vue";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Storage } from "@ionic/storage";

import { useAppStore } from "@/stores/app";
import {
  ROUND_MS,
  createProjectile,
  hitsTarget,
  isValidThrow,
  projectileScale,
  randomFood,
  randomTarget,
  targetCentre,
  targetSpeed,
  stepProjectile,
  throwVelocity,
  toProjectileVelocity
} from "@/game/throwPhysics";

/** How long a scored item stays on screen for its pop animation. */
const SCORE_POP_MS = 300;

/** How long the face reacts after being fed. */
const TARGET_POP_MS = 260;

/** Distance past the edge at which a thrown item is considered gone. */
const OFF_SCREEN_MARGIN = 160;

const store = new Storage();
const storeKey = "SFgameBest";

const appStore = useAppStore();

const arena = ref(null);
const items = ref([]);
const targetX = ref(0);

const state = reactive({
  phase: "idle", // idle | playing | finished
  hits: 0,
  best: 0,
  isNewBest: false,
  remainingMs: ROUND_MS,
  handEmoji: randomFood(),
  targetEmoji: randomTarget(),
  targetPop: false,
  hasThrown: false
});

const arenaSize = reactive({ width: 0, height: 0 });
const drag = reactive({ dx: 0, dy: 0 });

// Loop and gesture bookkeeping is deliberately outside reactivity: it changes
// every frame and nothing in the template reads it.
let frameId = null;
let lastFrameAt = 0;
let endsAt = 0;
let targetPhase = 0;
let nextItemId = 1;
let activePointerId = null;
let samples = [];
let dragOrigin = null;
let pausedRemainingMs = null;
let targetPopUntil = 0;

const secondsLeft = computed(() => Math.ceil(state.remainingMs / 1000));

/** The hand sits above the bottom nav; the face rides in the upper quarter. */
const handY = computed(() => Math.max(120, arenaSize.height - 96));
const targetY = computed(() => Math.max(90, arenaSize.height * 0.26));

const targetStyle = computed(() => ({
  transform: `translate3d(${targetX.value}px, ${targetY.value}px, 0)`
}));

const handStyle = computed(() => ({
  transform: `translate3d(${arenaSize.width / 2 + drag.dx}px, ${handY.value + drag.dy}px, 0)`
}));

function foodStyle(item) {
  return {
    transform:
      `translate3d(${item.x}px, ${item.y}px, 0) ` +
      `scale(${item.scale}) rotate(${item.rotation}deg)`
  };
}

onMounted(async () => {
  measureArena();
  window.addEventListener("resize", measureArena);
  document.addEventListener("visibilitychange", onVisibilityChange);
  await loadBest();
});

// Ionic keeps a page mounted after you navigate away, so onUnmounted is not a
// reliable "the user left" signal. These two hooks are, and stopGame is safe to
// call more than once.
onIonViewDidEnter(() => {
  measureArena();
  state.phase = "idle";
});

onIonViewWillLeave(stopGame);

onUnmounted(() => {
  stopGame();
  window.removeEventListener("resize", measureArena);
  document.removeEventListener("visibilitychange", onVisibilityChange);
});

// main.js flips this flag from Capacitor's appStateChange, the same way the
// votings poller is suspended when the app goes to the background.
watch(() => appStore.isAppActive, (active) => (active ? resume() : pause()));

function onVisibilityChange() {
  return document.hidden ? pause() : resume();
}

function pause() {
  if (state.phase !== "playing" || pausedRemainingMs !== null) {
    return;
  }

  pausedRemainingMs = state.remainingMs;
  stopLoop();
}

function resume() {
  if (state.phase !== "playing" || pausedRemainingMs === null) {
    return;
  }

  // Bank the remaining time rather than the wall clock, so a minute in the
  // background does not silently end the round.
  endsAt = Date.now() + pausedRemainingMs;
  pausedRemainingMs = null;
  startLoop();
}

function measureArena() {
  const element = arena.value;

  if (!element) {
    return;
  }

  const rect = element.getBoundingClientRect();
  arenaSize.width = rect.width;
  arenaSize.height = rect.height;

  if (state.phase !== "playing") {
    targetX.value = arenaSize.width / 2;
  }
}

function startRound() {
  measureArena();

  items.value = [];
  state.phase = "playing";
  state.hits = 0;
  state.isNewBest = false;
  state.hasThrown = false;
  state.handEmoji = randomFood();
  state.targetEmoji = randomTarget();
  state.targetPop = false;
  state.remainingMs = ROUND_MS;

  endsAt = Date.now() + ROUND_MS;
  targetPhase = 0;
  pausedRemainingMs = null;

  startLoop();
}

async function finishRound() {
  stopLoop();
  state.phase = "finished";
  items.value = [];

  if (state.hits > state.best) {
    state.best = state.hits;
    state.isNewBest = true;
    await saveBest(state.hits);
  }
}

function stopGame() {
  stopLoop();
  activePointerId = null;
  dragOrigin = null;
  samples = [];
  drag.dx = 0;
  drag.dy = 0;
  pausedRemainingMs = null;

  // Abandon an unfinished round rather than leaving it to resume days later.
  if (state.phase === "playing") {
    state.phase = "idle";
    items.value = [];
  }
}

function startLoop() {
  if (frameId !== null) {
    return;
  }

  lastFrameAt = performance.now();
  frameId = requestAnimationFrame(loop);
}

function stopLoop() {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }
}

function loop(now) {
  frameId = requestAnimationFrame(loop);

  // Cap the step so a stalled tab does not teleport everything off screen.
  const dt = Math.min((now - lastFrameAt) / 1000, 0.05);
  lastFrameAt = now;

  if (state.phase !== "playing") {
    return;
  }

  state.remainingMs = Math.max(0, endsAt - Date.now());

  targetPhase += targetSpeed(state.remainingMs) * dt;
  targetX.value = targetCentre(arenaSize.width, targetPhase);

  advanceItems(dt, now);
  state.targetPop = now < targetPopUntil;

  if (state.remainingMs <= 0) {
    finishRound();
  }
}

function advanceItems(dt, now) {
  const targetCentreY = targetY.value;
  const remaining = [];

  for (const item of items.value) {
    if (item.settled) {
      if (item.removeAt > now) {
        remaining.push(item);
      }
      continue;
    }

    stepProjectile(item, dt);
    item.scale = projectileScale(item.y, handY.value, targetCentreY);

    if (hitsTarget(item, targetX.value, targetCentreY)) {
      item.hit = true;
      item.settled = true;
      item.removeAt = now + SCORE_POP_MS;
      state.hits += 1;
      state.targetEmoji = randomTarget(state.targetEmoji);
      targetPopUntil = now + TARGET_POP_MS;
      pulse();
      remaining.push(item);
      continue;
    }

    const gone =
      item.y > arenaSize.height + OFF_SCREEN_MARGIN ||
      item.x < -OFF_SCREEN_MARGIN ||
      item.x > arenaSize.width + OFF_SCREEN_MARGIN;

    if (!gone) {
      remaining.push(item);
    }
  }

  items.value = remaining;
}

function samplePoint(event) {
  const rect = arena.value.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    t: event.timeStamp
  };
}

function onPointerDown(event) {
  if (state.phase !== "playing" || activePointerId !== null) {
    return;
  }

  activePointerId = event.pointerId;
  arena.value?.setPointerCapture?.(event.pointerId);

  dragOrigin = samplePoint(event);
  samples = [dragOrigin];
  drag.dx = 0;
  drag.dy = 0;
}

function onPointerMove(event) {
  if (activePointerId !== event.pointerId || dragOrigin === null) {
    return;
  }

  const point = samplePoint(event);
  samples.push(point);

  // Only the tail of the gesture is ever read, so the buffer stays short.
  if (samples.length > 16) {
    samples.shift();
  }

  drag.dx = point.x - dragOrigin.x;
  drag.dy = point.y - dragOrigin.y;
}

function onPointerUp(event) {
  if (activePointerId !== event.pointerId) {
    return;
  }

  arena.value?.releasePointerCapture?.(event.pointerId);
  activePointerId = null;

  const velocity = throwVelocity(samples);
  const offsetX = drag.dx;
  const offsetY = drag.dy;

  samples = [];
  dragOrigin = null;
  drag.dx = 0;
  drag.dy = 0;

  if (isValidThrow(velocity)) {
    launch(velocity, offsetX, offsetY);
  }
}

function launch(gestureVelocity, offsetX, offsetY) {
  const velocity = toProjectileVelocity(gestureVelocity);

  items.value.push(
    createProjectile({
      id: nextItemId++,
      x: arenaSize.width / 2 + offsetX,
      y: handY.value + offsetY,
      vx: velocity.vx,
      vy: velocity.vy,
      emoji: state.handEmoji
    })
  );

  state.handEmoji = randomFood(state.handEmoji);
  state.hasThrown = true;
}

async function pulse() {
  if (Capacitor.getPlatform() === "web") {
    return;
  }

  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (e) {
    console.log(`SF haptics: ${e}`);
  }
}

async function loadBest() {
  try {
    await store.create();
    state.best = Number(await store.get(storeKey)) || 0;
  } catch (e) {
    console.log(`SF game best score: ${e}`);
  }
}

async function saveBest(hits) {
  try {
    await store.create();
    await store.set(storeKey, hits);
  } catch (e) {
    console.log(`SF game best score: ${e}`);
  }
}
</script>

<style lang="css" scoped>
.game {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--sf-page-background);
  overflow: hidden;
}

/* HUD */

.hud {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: calc(var(--sf-inset-top, 0px) + 8px) 26px 0;
  flex: 0 0 auto;
}

.hud-block {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.hud-label {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--sf-muted-color);
  margin-bottom: 2px;
}

.hud-value {
  font-family: "brico-condensed", sans-serif;
  font-size: 2.6rem;
  font-variation-settings: "wdth" 90.6;
  background: var(--sf-gradient);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Play area */

.arena {
  position: relative;
  flex: 1 1 auto;
  /* The nav petals are fixed to the bottom of the app shell. */
  margin-bottom: 96px;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  overflow: hidden;
}

.target,
.food {
  position: absolute;
  left: 0;
  top: 0;
  width: 72px;
  height: 72px;
  margin-left: -36px;
  margin-top: -36px;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
  pointer-events: none;
}

.target {
  font-size: 3.6rem;
  filter: drop-shadow(0 6px 10px rgba(21, 18, 26, 0.18));
}

.food {
  font-size: 2.6rem;
}

.hand {
  transition: transform 0.12s ease-out;
  filter: drop-shadow(0 8px 12px rgba(21, 18, 26, 0.2));
}

.target.pop {
  animation: fed 0.26s ease-out;
}

@keyframes fed {
  0% {
    scale: 1;
  }
  40% {
    scale: 1.25;
  }
  100% {
    scale: 1;
  }
}

.scored {
  animation: pop 0.3s ease-out forwards;
}

@keyframes pop {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    scale: 1.6;
  }
}

.hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 150px;
  margin: 0;
  text-align: center;
  font-weight: 700;
  color: var(--sf-muted-color);
  pointer-events: none;
}

/* Start and result cards */

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 26px;
  background: rgba(242, 236, 227, 0.82);
  backdrop-filter: blur(3px);
}

.card {
  width: 100%;
  max-width: 340px;
  padding: 30px 26px;
  border-radius: var(--sf-card-radius);
  background: var(--sf-surface-color);
  box-shadow: var(--sf-card-shadow);
  text-align: center;
}

.card h1 {
  font-size: 2.4rem;
  margin: 0 0 10px;
}

.card h1.score {
  font-family: "brico-condensed", sans-serif;
  font-size: 5.5rem;
  font-variation-settings: "wdth" 90.6;
  background: var(--sf-gradient);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0;
}

.lead {
  margin: 0 0 18px;
  color: var(--sf-muted-color);
  line-height: 1.45;
}

.best {
  margin: 0 0 18px;
  font-weight: 800;
  color: var(--sf-primary-color);
}

ion-button.play {
  --background: var(--sf-primary-color);
  --background-activated: var(--sf-primary-color-2);
  --border-radius: 999px;
  --box-shadow: 0 6px 16px rgba(255, 90, 60, 0.35);
  font-weight: 800;
  text-transform: none;
}
</style>
