<template>
  <ion-page>
    <ion-content>
      <!-- Step: list of queues -->
      <div v-if="state.step === 'list'">
        <div class="joinSection">
          <ion-button expand="block" class="joinButton" @click="startJoinFlow">
            <ion-icon slot="start" :icon="qrCodeOutline"></ion-icon>
            Hop ind i en kø
          </ion-button>

          <p v-if="state.joinError" class="joinError">{{ state.joinError }}</p>
          <p v-if="state.isJoining" class="joinPending">Stiller dig i kø …</p>
        </div>

        <ion-list v-if="queuesStore.queues.length > 0" lines="none">
          <ion-item v-for="queue in queuesStore.queues" :key="queue.id">
            <div class="queueCard">
              <div class="queueName">{{ queue.activityName }}</div>
              <div class="queueDetails">
                <span class="queuePosition">
                  Placering {{ queue.position }}
                </span>
                <span>{{ formatWaitTime(queue.estimatedWaitMinutes) }}</span>
              </div>
            </div>
          </ion-item>
        </ion-list>

        <div v-else class="noQueuesContainer">
          <p>Du er ikke tilmeldt nogen køer endnu.</p>
          <p>
            Tryk på <strong>Hop ind i en kø</strong> og scan QR-koden ved
            aktiviteten.
          </p>
        </div>
      </div>

      <!-- Step: enter name -->
      <div v-else-if="state.step === 'name'" class="stepContainer">
        <h2>Hvad hedder du?</h2>
        <p class="stepHint">
          Dit navn bliver vist ved aktiviteten, så de kan kalde dig op.
        </p>

        <ion-input
          v-model="state.nameDraft"
          placeholder="Dit navn"
          clear-input
          class="stepInput"
          @keyup.enter="saveName"
        ></ion-input>

        <ion-button
          expand="block"
          class="joinButton"
          :disabled="!state.nameDraft.trim()"
          @click="saveName"
        >
          Gem navn
        </ion-button>

        <ion-button expand="block" fill="clear" class="cancelButton" @click="cancelFlow">
          Annuller
        </ion-button>
      </div>

      <!-- Step: manual code fallback -->
      <div v-else-if="state.step === 'code'" class="stepContainer">
        <h2>Indtast aktivitetens kode</h2>
        <p class="stepHint">{{ scannerFallbackHint }}</p>

        <ion-input
          v-model="state.textCode"
          placeholder="Aktivitetskode"
          clear-input
          class="stepInput"
          @keyup.enter="joinWithTextCode"
        ></ion-input>

        <ion-button
          expand="block"
          class="joinButton"
          :disabled="!state.textCode.trim()"
          @click="joinWithTextCode"
        >
          Deltag
        </ion-button>

        <ion-button expand="block" fill="clear" class="cancelButton" @click="cancelFlow">
          Annuller
        </ion-button>
      </div>
    </ion-content>

    <qr-scanner
      v-if="state.step === 'scanner'"
      @scanned="onScanned"
      @unavailable="onScannerUnavailable"
      @close="cancelFlow"
    />
  </ion-page>
</template>

<script setup lang="js">
import { reactive, computed, onBeforeMount, onUnmounted } from "vue";
import { IonPage, IonContent, IonList, IonItem, IonButton, IonInput, IonIcon } from "@ionic/vue";
import { qrCodeOutline } from "ionicons/icons";
import { useQueuesStore } from "@/stores/queues";
import qrScanner from "@/components/qrScanner.vue";

const queuesStore = useQueuesStore();

const state = reactive({
  step: "list",
  nameDraft: "",
  textCode: "",
  joinError: null,
  isJoining: false,
  scannerFailure: null,
});

const scannerFallbackHint = computed(() => {
  switch (state.scannerFailure) {
    case "denied":
      return "Appen har ikke adgang til kameraet. Du kan give adgang under Indstillinger, eller indtaste koden her.";
    case "unsupported":
    case "failed":
      return "Kameraet kunne ikke åbnes. Indtast koden, der står ved aktiviteten.";
    default:
      return "Indtast koden, der står ved aktiviteten.";
  }
});

let refreshInterval;

onBeforeMount(async () => {
  await queuesStore.loadName();
  queuesStore.fetchQueues();
  refreshInterval = setInterval(() => {
    queuesStore.fetchQueues();
  }, 30000);
});

onUnmounted(() => {
  clearInterval(refreshInterval);
});

function startJoinFlow() {
  state.joinError = null;
  state.scannerFailure = null;

  if (queuesStore.name) {
    state.step = "scanner";
    return;
  }

  state.nameDraft = "";
  state.step = "name";
}

async function saveName() {
  const name = state.nameDraft.trim();

  if (!name) {
    return;
  }

  await queuesStore.setName(name);
  state.step = "scanner";
}

function onScannerUnavailable(reason) {
  state.scannerFailure = reason;
  state.textCode = "";
  state.step = "code";
}

function cancelFlow() {
  state.step = "list";
}

function onScanned(code) {
  state.step = "list";
  joinQueue(code);
}

function joinWithTextCode() {
  const code = state.textCode.trim();

  if (!code) {
    return;
  }

  state.step = "list";
  joinQueue(code);
}

async function joinQueue(code) {
  state.joinError = null;
  state.isJoining = true;

  try {
    await queuesStore.joinQueueByCode(code);
    state.textCode = "";
  } catch (err) {
    state.joinError = err.message;
  } finally {
    state.isJoining = false;
  }
}

function formatWaitTime(minutes) {
  if (minutes <= 0) {
    return "Du er snart i gang";
  }
  if (minutes < 60) {
    return `Ventetid ca. ${minutes} min.`;
  }
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining
    ? `Ventetid ca. ${hours} t. ${remaining} min.`
    : `Ventetid ca. ${hours} t.`;
}
</script>

<style scoped>
.joinSection {
  padding: 20px 14px 6px;
}

.joinButton {
  --background: var(--sf-gradient);
  /* Solid pink while pressed, so there is still visible press feedback
     against the gradient. */
  --background-activated: var(--sf-primary-color-2);
  --background-focused: var(--sf-primary-color-2);
  --color: #fff;
  --border-radius: 999px;
  --box-shadow: var(--sf-card-shadow);
  height: 52px;
  font-size: 1.1rem;
  font-weight: 800;
  text-transform: none;
}

.cancelButton {
  --color: var(--sf-muted-color);
  margin-top: 6px;
  text-transform: none;
  font-weight: 600;
}

.joinError {
  color: var(--sf-primary-color);
  font-weight: 600;
  margin-top: 12px;
  text-align: center;
}

.joinPending {
  color: var(--sf-muted-color);
  margin-top: 12px;
  text-align: center;
}

.stepContainer {
  padding: 40px 30px 0;
  margin-top: var(--sf-inset-top, 0px);
  text-align: center;
}

.stepHint {
  color: var(--sf-muted-color);
  line-height: 1.6;
  margin-bottom: 24px;
}

.stepInput {
  --background: var(--sf-surface-color);
  --padding-start: 16px;
  --padding-end: 16px;
  border-radius: 14px;
  box-shadow: var(--sf-card-shadow);
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.queueCard {
  width: 100%;
  background: var(--sf-surface-color);
  border-radius: var(--sf-card-radius);
  border-left: 6px solid var(--sf-primary-color);
  box-shadow: var(--sf-card-shadow);
  padding: 16px 18px;
}

.queueName {
  font-size: 1.25rem;
  font-weight: 800;
}

.queueDetails {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 6px;
  font-size: 0.9rem;
  color: var(--sf-muted-color);
}

.queuePosition {
  color: var(--sf-primary-color);
  font-weight: 700;
}

.noQueuesContainer {
  margin: 20px 40px 0;
  line-height: 1.6;
  text-align: center;
  color: var(--sf-muted-color);
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  --background: transparent;
  margin: 0 14px 14px 14px;
}

ion-content::part(scroll) {
  padding-top: var(--sf-inset-top, 0px);
}
</style>
