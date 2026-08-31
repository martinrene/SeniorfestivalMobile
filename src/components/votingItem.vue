<script setup lang="js">
import { computed } from 'vue';
import { IonList, IonCard, IonCardHeader, IonCardTitle, IonButton } from "@ionic/vue";


import { useVotingsStore } from "@/stores/votings"


const votingsStore = useVotingsStore();

const currentActiveVoting = computed(() => votingsStore.currentVoting?.voting);
const currentActiveVote = computed(() => votingsStore.currentVoting?.vote);

const currentActiveVotingChoices = computed(() => {
  if (currentActiveVoting.value) {
    return currentActiveVoting.value.choices?.split(";");
  }
  return [];
});

function doVote(choice) {
  votingsStore.addVote(currentActiveVoting.value.votingId, choice);
}

function isUserVotedAndThisIsNotSelected(choice) {
  return currentActiveVote.value && currentActiveVote.value.choice != choice;
}

function stopVoting() {
  votingsStore.stopVoting(currentActiveVoting.value.votingId);
}
</script>

<template>
  <div
    class="voting-container"
    :class="{ open: votingsStore.isCurrentVotingVisible }"
  >
    <p>{{ currentActiveVoting?.description }}</p>

    <ion-list>
      <ion-card
        v-for="choice in currentActiveVotingChoices"
        :key="choice"
        :class="{ 'not-selected': isUserVotedAndThisIsNotSelected(choice) }"
        :disabled="currentActiveVote"
        button="true"
        @click="doVote(choice)"
      >
        <ion-card-header>
          <ion-card-title>
            {{ choice }}
          </ion-card-title>
        </ion-card-header>
      </ion-card>
    </ion-list>

    <div class="close-button">
      <ion-button shape="round" @click="stopVoting"> Luk </ion-button>
    </div>
  </div>
</template>

<style lang="css" scoped>
p {
  margin: 26px 20px 18px;
  text-align: center;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.4;
}

ion-list {
  margin: 0;
}

ion-card-title {
  text-align: center;
}

.voting-container {
  background: var(--sf-primary-color);
  opacity: 0.95;
  width: 92%;
  left: 4%;
  right: 4%;
  position: absolute;
  top: 0px;
  z-index: 500;
  transition: transform 0.5s ease-out;
  transform: translateY(calc(var(--safe-area-inset-top, 0px) * -1 - 100%));
  color: white;
}

.voting-container.open {
  transform: translateY(calc(var(--safe-area-inset-top, 0px)));
}

ion-card,
ion-card:disabled {
  opacity: 1;
  background: var(--sf-surface-color);
  color: var(--ion-text-color);
  border-radius: var(--sf-card-radius);
  box-shadow: 0 6px 16px rgba(21, 18, 26, 0.18);
  margin: 0 14px 14px;
  transition: background 0.25s ease, box-shadow 0.25s ease;
}

ion-card ion-card-title {
  color: var(--ion-text-color);
  font-size: 1.15rem;
  font-weight: 800;
}

/* After voting, the choices the user did not pick recede into the panel */
ion-card.not-selected,
ion-card.not-selected:disabled {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: none;
}

ion-card.not-selected ion-card-title {
  color: #fff;
  font-weight: 600;
}

ion-list {
  margin-bottom: 0px !important;
}

.close-button {
  text-align: center;
  margin-bottom: 20px;
}

.close-button ion-button {
  margin-left: auto;
  margin-right: auto;
  --background: #fff;
  --background-activated: #fff;
  --background-focused: #fff;
  --color: var(--sf-primary-color);
  --border-radius: 999px;
  --box-shadow: 0 4px 12px rgba(21, 18, 26, 0.18);
  min-width: 110px;
  font-weight: 800;
  text-transform: none;
}
</style>
