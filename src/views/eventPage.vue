<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div v-if="event" class="pageContainer">
        <div class="pictureContainer">
          <img
            v-if="event.pictureUrl && event.pictureUrl != ''"
            :src="event.pictureUrl"
          />
          <div v-else class="noPictureContainer"></div>
          <div>
            <ion-button
              class="btn-circle"
              routerDirection="back"
              :router-link="backRoutePath"
              tappable
            >
              <ion-icon :icon="chevronBackOutline"></ion-icon>
            </ion-button>
            <ion-button
              v-if="isInMyEvents"
              class="btn-circle"
              @click="removeFromMyEvents"
            >
              <ion-icon :icon="heart"></ion-icon>
            </ion-button>
            <ion-button v-else class="btn-circle" @click="addToMyEvents">
              <ion-icon :icon="heartOutline"></ion-icon>
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

        <div class="infoContainer">
          <div v-for="link in links" :key="link.key">
            <a :href="link.value" target="_blank" class="linkContainer">
              <ion-icon :icon="linkIcon(link.key)"></ion-icon>
              <span>{{
                link.key.toLowerCase() == "web" ? link.value : link.key
              }}</span>
            </a>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import { computed } from "vue";
import { IonContent, IonPage, IonIcon, IonButton } from "@ionic/vue";
import { heart, chevronBackOutline, heartOutline, logoInstagram, logoFacebook, desktop, musicalNotes } from "ionicons/icons"
import { useDataStore } from "@/stores/data";
import { useMyEventsStore } from "@/stores/myEvents";

const dataStore = useDataStore();
const myEventsStore = useMyEventsStore();

const props = defineProps({
  id: { type: String, required: true },
  type: { type: String, required: true },
  day: { type: String, required: true}
});

const event = computed(() => dataStore.event(props.id));

const backRoutePath = computed(() => `/${props.type}?day=${props.day}`);

const isInMyEvents = computed(() => event.value ? myEventsStore.isEventInMyEvents(event.value.rowKey) : false)

const dayString = computed(() => {
    switch (event.value.day) {
        case "fredag": return "Fredag";
        case "lordag": return "Lørdag";
        case "sondag": return "Søndag";
        default: return "";
    }
});

const links = computed(() => {
  if (!event.value || !event.value.links || event.value.links === '') {
    return null;
  }

  const linkSplit = event.value.links.split('|');

  return linkSplit.map(l => {
    const splt = l.split("!");

    return { key: splt[0], value: splt[1] };
  })
});



async function removeFromMyEvents() {
  await myEventsStore.removeFromMyEvents(props.id);
}

async function addToMyEvents() {
  await myEventsStore.addToMyEvents(props.id);
}

function linkIcon(key) {
  switch(key.toLowerCase()) {
    case "instagram":
      return logoInstagram;

      case "facebook":
      return logoFacebook;

      case "spotify":
      return musicalNotes;

    default:
      return desktop;
  }

}
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

.noPictureContainer {
  height: 100px;
}

.linkContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--sf-primary-color);
  font-size: 1.1rem;
}

.linkContainer ion-icon {
  margin-right: 6px;
}

.pageContainer {
  margin-top: calc(var(--safe-area-inset-top, 0) + 30px);
  margin-bottom: 130px;
}
</style>
