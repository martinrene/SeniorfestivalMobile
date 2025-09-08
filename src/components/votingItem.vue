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
  margin-top: 30px;
  margin-left: 20px;
  margin-right: 20px;
  text-align: center;
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
  transform: translateY(calc(var(--safe-area-inset-top, 0) * -1 - 100%));
  color: white;
}

.voting-container.open {
  transform: translateY(calc(var(--safe-area-inset-top, 0)));
}

ion-card,
ion-card:disabled {
  opacity: 1;
  background-color: #7933d4;
  color: white;
  margin-bottom: 20px;
}

ion-card.not-selected {
  background-color: #cba3ff;
  color: white;
  opacity: 0.8;
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
  background-color: white;
  border-radius: 40px;
  width: 20%;
  color: var(--sf-primary-color);
}
</style>
