<template>
  <ion-app>
    <voting-item />
    <div
      v-if="!isQrScannerActive"
      class="app-background"
      :class="{ active: state.isBackgroundBlack }"
    >
      <ul :class="{ close: !state.isMenuOpen, pop: state.isMenuOpen }">
        <li
          v-if="
            dataStore.setting('ticketUrl') &&
            dataStore.setting('ticketUrl') !== ''
          "
          class="ticket-link"
        >
          <a :href="dataStore.setting('ticketUrl').value" target="_blank">
            <ion-label @click="closeMenu">
              <span>
                <ion-icon :icon="ticket"></ion-icon>
              </span>
              <ion-text>Køb billet</ion-text>
            </ion-label>
          </a>
        </li>

        <li v-if="dataStore.settingBoolean('menuDeluxe')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/text/deluxe"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="diamond"></ion-icon>
              </span>
              <ion-text>Deluxe</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuInformation')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/text/info"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="information"></ion-icon>
              </span>
              <ion-text>Information</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuRap')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/rap"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="headset"></ion-icon>
              </span>
              <ion-text>Lyden af festival</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuGuests')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/guests"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="happy"></ion-icon>
              </span>
              <ion-text>Deltagere</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuQueues')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/queues"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="footstepsOutline"></ion-icon>
              </span>
              <ion-text>Tilmelding og kø</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuShops')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/shops"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="fastFood"></ion-icon>
              </span>
              <ion-text>Mad og Udvalg</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuActivities')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/activities"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="tennisball"></ion-icon>
              </span>
              <ion-text>Aktiviteter</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuSchedule')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/schedule"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="musicalNotes"></ion-icon>
              </span>
              <ion-text>Sceneprogram</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuMySchedule')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/myschedule"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="heart"></ion-icon>
              </span>
              <ion-text>Min festival</ion-text>
            </ion-label>
          </ion-button>
        </li>
      </ul>

      <ion-button
        v-if="dataStore.settingBoolean('gameEnabled')"
        fill="clear"
        class="gameButton"
        :class="{ visible: state.isMenuOpen }"
        router-link="/game"
        router-direction="root"
        @click="closeMenu"
      >
        <span class="gameButtonIcon">🍟</span>
      </ion-button>
    </div>

    <div class="wrap">
      <div class="rect-left">
        <div class="inner"></div>
      </div>
      <div class="rect">
        &nbsp;<span class="circle"></span>
        <div class="avatar" @click="toggleMenu">
          <img src="/image/sfwhite.png" :class="{ squish: state.isMenuOpen }" />
          <ion-icon
            :icon="closeOutline"
            :class="{ squish: !state.isMenuOpen }"
          ></ion-icon>
        </div>
      </div>
      <div class="rect-right">
        <div class="inner"></div>
      </div>
    </div>

    <ion-button
      fill="clear"
      class="link homeButton"
      router-link="/"
      router-direction="root"
      @click="closeMenu"
    >
      <ion-icon :icon="home"></ion-icon>
    </ion-button>

    <ion-button
      fill="clear"
      class="link heartButton"
      router-link="/myschedule"
      router-direction="root"
      @click="closeMenu"
    >
      <ion-icon :icon="heart"></ion-icon>
    </ion-button>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="js">
import { reactive, onBeforeMount, computed } from "vue";
import { IonApp, IonRouterOutlet, IonIcon, IonText, IonLabel, IonButton } from "@ionic/vue";
import { home, heart, musicalNotes, tennisball, fastFood, footstepsOutline, information, diamond, closeOutline, ticket, happy, headset } from "ionicons/icons"

import votingItem from "./components/votingItem.vue";

import { useDataStore } from "@/stores/data";

const dataStore = useDataStore();

const state = reactive({
      isMenuOpen: false,
      isBackgroundBlack: false,
      isQrScannerActive: false,
      isRadioPlaying: false
    });

onBeforeMount(async () => {

});

const isQrScannerActive = computed(() => false);


function toggleMenu() {
      state.isMenuOpen = !state.isMenuOpen;
      if (!state.isMenuOpen) {
        setTimeout(() => {
          state.isBackgroundBlack = false;
        }, 400);
      } else {
        state.isBackgroundBlack = true;
      }
}

    function closeMenu() {
      state.isMenuOpen = false;
      setTimeout(() => {
        state.isBackgroundBlack = false;
      }, 400);
    }
</script>

<style lang="css" scoped>
ion-button.link {
  --color: white;
  font-size: 2rem;
}

ion-button.homeButton {
  position: absolute;
  bottom: 0px;
  left: calc(25% - 35px);
  z-index: 50;
  color: white;
  font-size: 1rem;
}

ion-button.heartButton {
  position: absolute;
  bottom: 0px;
  right: calc(25% - 35px);
  z-index: 50;
  color: white;
  font-size: 1rem;
}

/* Shortcut to the game. It lives in the menu overlay and appears with it, so it
   is not in the way while you are reading a page. Fixed rather than absolute
   because the overlay is only positioned while it is open, and offset by
   --sf-inset-top since Android reports a 0 status bar inset -- see the comment
   in theme/variables.css. */
ion-button.gameButton {
  position: fixed;
  /* Roughly halfway between the top of the screen and the topmost menu item,
     which .pop li:nth-child(8) puts at bottom: 459px. Measuring from the bottom
     keeps that midpoint correct on both short and tall screens. */
  bottom: calc(50vh + 230px);
  right: 90px;
  z-index: 50;
  margin: 0;

  /* No chrome, just the fries. */
  --background: transparent;
  --background-hover: transparent;
  --background-activated: transparent;
  --background-focused: transparent;
  --box-shadow: none;
  --ripple-color: transparent;
  --padding-start: 4px;
  --padding-end: 4px;
  --padding-top: 4px;
  --padding-bottom: 4px;
  height: auto;

  opacity: 0;
  transform: scale(0.4);
  pointer-events: none;
  transition: opacity 0.25s linear,
    transform 0.3s cubic-bezier(0.6, 0, 0.735, 0.045);
}

ion-button.gameButton.visible {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

ion-button.gameButton .gameButtonIcon {
  /* inline-block because transforms do not apply to inline elements. */
  display: inline-block;
  font-size: 2.1rem;
  line-height: 1;
  filter: drop-shadow(0 6px 12px rgba(21, 18, 26, 0.35));
}

/* A wiggle every few seconds so the fries are noticed among the menu items.
   Scoped to .visible so it only runs while the menu is actually open, and put
   on the span so it does not fight the button's own show/hide transform. */
ion-button.gameButton.visible .gameButtonIcon {
  animation: friesShake 5s ease-in-out 1s infinite;
}

/* The shake occupies the first 16% of the cycle, which is the same 0.8s the
   rest of the app shakes for, and the remainder is rest. */
@keyframes friesShake {
  0%,
  16%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  1.6% {
    transform: translate(-1px, -2px) rotate(-5deg);
  }
  3.2% {
    transform: translate(-3px, 0) rotate(6deg);
  }
  4.8% {
    transform: translate(3px, 2px) rotate(-2deg);
  }
  6.4% {
    transform: translate(1px, -1px) rotate(7deg);
  }
  8% {
    transform: translate(-1px, 2px) rotate(-6deg);
  }
  9.6% {
    transform: translate(-3px, 1px) rotate(3deg);
  }
  11.2% {
    transform: translate(3px, 1px) rotate(-5deg);
  }
  12.8% {
    transform: translate(-1px, -1px) rotate(4deg);
  }
  14.4% {
    transform: translate(1px, 2px) rotate(-2deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  ion-button.gameButton.visible .gameButtonIcon {
    animation: none;
  }
}

/* Bottom menu */

.avatar {
  width: 70px;
  height: 70px;
  position: absolute;
  /* Safe to gradient: the circle sits in the cream notch, so it has no shared
     edge with the solid orange petals behind it. */
  background: var(--sf-gradient);
  top: -100px;
  left: 18px;
  border-radius: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar img,
.avatar ion-icon {
  position: absolute;
  transition: all 0.3s ease-in-out;
}

.avatar img.squish,
.avatar ion-icon.squish {
  height: 0px;
  width: 0px;
  rotate: 0deg;
}

.avatar img {
  width: 65%;
  height: 65%;
  rotate: 360deg;
}

.avatar ion-icon {
  height: 90%;
  width: 90%;
  --ionicon-stroke-width: 44px;
  color: white;
  rotate: -360deg;
}

.wrap {
  display: block;
  width: 120%;
  position: fixed;
  bottom: -40px;
  left: -10%;
  z-index: 5;
}
.rect-left,
.rect-right {
  position: relative;
  width: calc(50% - 6px);
  height: 70px;
  float: left;
}
.rect-left {
  margin-left: -50px;
  transform: rotate(-5deg);
  translate: 7px 9px;
}
.rect-right {
  margin-right: -50px;
  transform: rotate(5deg);
  translate: -8px 9px;
}
.inner {
  position: absolute;
  top: 0;
  left: 50px;
  right: 0;
  bottom: 0;
  height: 100%;
}
.rect-left .inner {
  left: 50px;
  right: 0;
  -webkit-border-top-left-radius: 6px;
  -webkit-border-bottom-left-radius: 6px;
  -moz-border-radius-topleft: 6px;
  -moz-border-radius-bottomleft: 6px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  background: var(--sf-primary-color);
}
.rect-right .inner {
  left: 0;
  right: 50px;
  -webkit-border-top-right-radius: 6px;
  -webkit-border-bottom-right-radius: 6px;
  -moz-border-radius-topright: 6px;
  -moz-border-radius-bottomright: 6px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;

  background: var(--sf-primary-color);
  /* Ends on the palette pink rather than the old yellow, so the petal matches
     the gradient now used on the avatar, the day selector and the badges. */
  background: linear-gradient(
    145deg,
    var(--sf-primary-color) 0%,
    var(--sf-primary-color) 30%,
    var(--sf-primary-color-2) 100%
  );
}

.rect {
  float: left;
  height: 100px;
  width: 112px;
  background: var(--sf-primary-color);
  position: relative;
  top: 50px;
  left: 3px;
}

.circle {
  display: block;
  width: 112px;
  height: 51px;
  top: -51px;
  left: 0;
  overflow: hidden;
  position: absolute;
  z-index: 100;
}

.circle:after {
  content: "";
  width: 86px;
  height: 86px;
  -moz-border-radius: 86px;
  -webkit-border-radius: 86px;
  border-radius: 86px;
  background: rgba(0, 0, 0, 0);
  position: absolute;
  top: -96px;
  left: -30px;
  border: 40px solid var(--sf-primary-color);
}

/* Popup Menu */

.close {
  padding: 0px;
  list-style: none;
  position: absolute;
  bottom: 44px;
  left: 50%;
  font-size: 2em;
}

/*
.close li {
  width: 56px;
  height: 56px;
  position: absolute;
  bottom: -100px;
  left: -28px;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%;
  border: none;

  transition: all cubic-bezier(0.6, 0, 0.735, 0.045) 0.4s,
    opacity 0.4s linear 0.2s;
}
*/
.close li:nth-child(1) {
  transition-duration: 0.4s;
}

.close li:nth-child(2) {
  transition-duration: 0.35s;
}

.close li:nth-child(3) {
  transition-duration: 0.3s;
}

.close li:nth-child(4) {
  transition-duration: 0.25s;
}

.close li:nth-child(5) {
  transition-duration: 0.2s;
}

.close li:nth-child(6) {
  transition-duration: 0.15s;
}

.close li:nth-child(7) {
  transition-duration: 0.1s;
}

.pop {
  padding: 0px;
  list-style: none;
  position: absolute;
  bottom: 44px;
  left: 50%;
  font-size: 1.8rem;
}

li ion-button ion-label {
  /* Android WebView scales text with the system font-size setting, and falls
     back to a wider face if Work Sans has not loaded. At 1.8rem the longest
     labels then wrapped onto two or three lines and collided with the page
     behind. Slightly smaller, and never wrapping, keeps every label on one
     line with headroom for that scaling. */
  font-size: 1.5rem;
  line-height: 1.2;
  text-transform: none;
  white-space: nowrap;
}

li {
  opacity: 1;
  position: absolute;
  left: -20px;
  bottom: 0px;
  width: 0px;
  overflow: hidden;
  transition: all cubic-bezier(0.6, 0, 0.735, 0.045) 0.3s,
    opacity 0.4s linear 0.2s;
}

.pop li {
  width: 360px;
  opacity: 1;
}

li span {
  background-color: var(--sf-primary-color);
  height: 45px;
  width: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

ion-label {
  display: flex;
  align-items: center;
}

ion-icon {
  height: 30px;
  width: 30px;
}

ion-text {
  margin-left: 15px;
}

.pop li:nth-child(8) {
  left: -155px;
  bottom: 459px;
  transition-duration: 0.2s;
}

.pop li:nth-child(7) {
  left: -185px;
  bottom: 404px;
  transition-duration: 0.2s;
}

.pop li:nth-child(6) {
  left: -205px;
  bottom: 344px;
  transition-duration: 0.25s;
}

.pop li:nth-child(5) {
  left: -210px;
  bottom: 284px;
  transition-duration: 0.3s;
}

.pop li:nth-child(4) {
  left: -200px;
  bottom: 224px;
  transition-duration: 0.35s;
}

.pop li:nth-child(3) {
  left: -180px;
  bottom: 164px;
  transition-duration: 0.4s;
}

.pop li:nth-child(2) {
  left: -140px;
  bottom: 104px;
  transition-duration: 0.45s;
}

.pop li:nth-child(1) {
  left: -60px;
  bottom: 45px;
  transition-duration: 0.5s;
}

.app-background.active {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  transition:/* easeInBack */ background-color 0.3s;
  background-color: rgba(0, 0, 0, 0.75);
}

.ticket-link {
  bottom: 65px !important;
}
</style>
