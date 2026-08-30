<template>
  <ion-page>
    <ion-content>
      <div class="joinSection">
        <ion-input
          v-model="nameModel"
          placeholder="Dit navn"
          clear-input
          class="nameInput"
        ></ion-input>

        <ion-button
          expand="block"
          :disabled="!queuesStore.name"
          @click="state.isScannerOpen = true"
        >
          <ion-icon slot="start" :icon="qrCodeOutline"></ion-icon>
          Scan QR-kode
        </ion-button>

        <div class="codeEntry">
          <ion-input
            v-model="state.textCode"
            placeholder="Indtast kode"
            clear-input
            @keyup.enter="joinWithTextCode"
          ></ion-input>
          <ion-button
            :disabled="!state.textCode || !queuesStore.name"
            @click="joinWithTextCode"
          >
            Deltag
          </ion-button>
        </div>

        <p v-if="!queuesStore.name" class="joinHint">
          Indtast dit navn for at kunne stille dig i kø.
        </p>

        <p v-if="state.joinError" class="joinError">{{ state.joinError }}</p>
      </div>

      <ion-list v-if="queuesStore.queues.length > 0" lines="inset">
        <ion-item v-for="queue in queuesStore.queues" :key="queue.id">
          <div class="queueRow">
            <div class="queueName">{{ queue.activityName }}</div>
            <div class="queueDetails">
              <span>Placering {{ queue.position }} af {{ queue.totalInQueue }}</span>
              <span>{{ formatWaitTime(queue.estimatedWaitMinutes) }}</span>
            </div>
          </div>
        </ion-item>
      </ion-list>

      <div v-else class="noQueuesContainer">
        <p>Du er ikke tilmeldt nogen køer endnu.</p>
        <p>
          Scan QR-koden ved aktiviteten, eller indtast koden herover, for at
          stille dig i kø.
        </p>
      </div>
    </ion-content>

    <qr-scanner
      v-if="state.isScannerOpen"
      @scanned="onScanned"
      @close="state.isScannerOpen = false"
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
  textCode: "",
  joinError: null,
  isScannerOpen: false,
});

const nameModel = computed({
  get: () => queuesStore.name,
  set: (value) => queuesStore.setName(value),
});

let refreshInterval;

onBeforeMount(() => {
  queuesStore.loadName();
  queuesStore.fetchQueues();
  refreshInterval = setInterval(() => {
    queuesStore.fetchQueues();
  }, 30000);
});

onUnmounted(() => {
  clearInterval(refreshInterval);
});

function onScanned(code) {
  state.isScannerOpen = false;
  joinQueue(code);
}

function joinWithTextCode() {
  if (!state.textCode) {
    return;
  }
  joinQueue(state.textCode);
}

async function joinQueue(code) {
  state.joinError = null;

  try {
    await queuesStore.joinQueueByCode(code);
    state.textCode = "";
  } catch (err) {
    state.joinError = err.message;
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
  padding: 20px 15px 10px;
}

.nameInput {
  --background: rgba(255, 255, 255, 0.8);
  --padding-start: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.codeEntry {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

.codeEntry ion-input {
  flex: 1;
  --background: rgba(255, 255, 255, 0.8);
  --padding-start: 12px;
  border-radius: 8px;
}

.joinHint {
  margin-top: 10px;
  font-size: 0.9rem;
}

.joinError {
  color: var(--sf-primary-color);
  margin-top: 10px;
}

.queueRow {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 0;
}

.queueName {
  font-size: 1.2rem;
  font-weight: bold;
}

.queueDetails {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 0.9rem;
}

.noQueuesContainer {
  margin-top: 30px;
  margin-left: 40px;
  margin-right: 40px;
  line-height: 1.5;
}

ion-content::part(scroll) {
  padding-top: var(--safe-area-inset-top, 0);
}
</style>
