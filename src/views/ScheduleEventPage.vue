<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div v-if="event" class="pageContainer">
        <div class="pictureContainer">
          <img :src="event.pictureUrl" />
          <div>
            <ion-button
              class="btn-circle"
              routerDirection="back"
              router-link="/schedule"
              tappable
            >
              <ion-icon :icon="chevronBackOutline"></ion-icon>
            </ion-button>
            <ion-button class="btn-circle">
              <ion-icon :icon="heart"></ion-icon>
            </ion-button>
          </div>
        </div>

        <div class="infoContainer">
          <h2>{{ event.title }}</h2>
          <div class="tinyLabel">Hvor</div>
          <h3>{{ event.location }}</h3>
          <div class="tinyLabel">Hvornår</div>
          <h3>{{ dayString }} {{ event.start }}</h3>
          <p v-html="event.description"></p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import { computed } from "vue";
import { IonContent, IonPage, IonIcon, IonButton } from "@ionic/vue";
import { heart, chevronBackOutline } from "ionicons/icons"
import { useDataStore } from "@/stores/data"
const dataStore = useDataStore();

const props = defineProps({
  id: { type: String, required: true }
});

const event = computed(() => dataStore.event(props.id));

const dayString = computed(() => {
    switch (event.value.day) {
        case "fredag": return "Fredag";
        case "lordag": return "Lørdag";
        case "sondag": return "Søndag";
        default: return "";
    }
});
</script>

<style lang="css" scoped>
.pictureContainer {
  margin-top: 10px;
}

.pictureContainer > div {
  display: flex;
  justify-content: space-between;
  margin-top: -55px;
  margin-left: 15px;
  margin-right: 15px;
}

.infoContainer {
  margin-top: 30px;
  text-align: center;
  margin-left: 30px;
  margin-right: 30px;
}

.infoContainer > p {
  text-align: left;
  line-height: 1.7rem;
}

.tinyLabel {
  margin-top: 16px;
  margin-bottom: 6px;
}
</style>
