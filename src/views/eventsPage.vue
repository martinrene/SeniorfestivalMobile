<template>
  <ion-page>
    <ion-segment :value="dayToShow" @ion-change="onDayChanged">
      <ion-segment-button value="fredag" :content-id="`fredag${props.type}`">
        <ion-label>Fredag</ion-label>
      </ion-segment-button>

      <ion-segment-button value="lordag" :content-id="`lordag${props.type}`">
        <ion-label>Lørdag</ion-label>
      </ion-segment-button>

      <ion-segment-button value="sondag" :content-id="`sondag${props.type}`">
        <ion-label>Søndag</ion-label>
      </ion-segment-button>
    </ion-segment>

    <ion-segment-view>
      <ion-segment-content :id="`fredag${props.type}`">
        <div
          v-if="props.type == 'mySchedule' && eventsFriday.length < 1"
          class="noeventscontainer"
        >
          <p>Her kan du lave din egen Seniorfestival.</p>
          <p>
            Find de events og aktiviteter, som du SKAL nå på festivalen og klik
            på <ion-icon :icon="heart"></ion-icon> for at tilføje dem til dit
            eget program.
          </p>
        </div>

        <ion-list v-else lines="none">
          <ion-item
            v-for="event in eventsFriday"
            :key="event.id"
            :router-link="`/${props.type}/${event.rowKey}/fredag`"
            routerDirection="forward"
            mode="ios"
            detail="false"
            button
          >
            <schedule-event :event="event" />
          </ion-item>
        </ion-list>
      </ion-segment-content>

      <ion-segment-content :id="`lordag${props.type}`">
        <div
          v-if="props.type == 'mySchedule' && eventsSaturday.length < 1"
          class="noeventscontainer"
        >
          <p>Her kan du lave din egen Seniorfestival.</p>
          <p>
            Find de events og aktiviteter, som du SKAL nå på festivalen og klik
            på <ion-icon :icon="heart"></ion-icon> for at tilføje dem til dit
            eget program.
          </p>
        </div>

        <ion-list v-else lines="none">
          <ion-item
            v-for="event in eventsSaturday"
            :key="event.id"
            :router-link="`/${props.type}/${event.rowKey}/lordag`"
            routerDirection="forward"
            mode="ios"
            detail="false"
            tappable
          >
            <schedule-event :event="event" />
          </ion-item>
        </ion-list>
      </ion-segment-content>

      <ion-segment-content :id="`sondag${props.type}`">
        <div
          v-if="props.type == 'mySchedule' && eventsSunday.length < 1"
          class="noeventscontainer"
        >
          <p>Her kan du lave din egen Seniorfestival.</p>
          <p>
            Find de events og aktiviteter, som du SKAL nå på festivalen og klik
            på <ion-icon :icon="heart"></ion-icon> for at tilføje dem til dit
            eget program.
          </p>
        </div>

        <ion-list v-else lines="none">
          <ion-item
            v-for="event in eventsSunday"
            :key="event.id"
            :router-link="`/${props.type}/${event.rowKey}/sondag`"
            routerDirection="forward"
            mode="ios"
            detail="false"
            tappable
          >
            <schedule-event :event="event" />
          </ion-item>
        </ion-list>
      </ion-segment-content>
    </ion-segment-view>
  </ion-page>
</template>

<script setup lang="js">
import { IonPage, IonList, IonItem, IonIcon, IonSegment, IonSegmentView, IonSegmentContent, IonSegmentButton, IonLabel } from "@ionic/vue";
import { heart } from "ionicons/icons"
import { computed, reactive } from "vue";
import { useRoute } from "vue-router";
import { useDataStore } from "@/stores/data";
import scheduleEvent from "@/components/eventItem.vue";

const dataStore = useDataStore();
const route = useRoute();

const state = reactive({ currentSelectedDay: null});

const props = defineProps({
  type: { type: String, required: true }
});

const dayToShow = computed(() => {
  if (state.currentSelectedDay) {
    return state.currentSelectedDay;
  }

  if (route.query?.day) {
    return route.query?.day;
  }

  const today = new Date();
  today.setHours(today.getHours()-3);
  switch(today.getDay()) {
    case 6:
      return "lordag";

    case 0:
      return "sondag";

    default:
      return "fredag";
  }
});


const eventsFriday = computed(() => {
  switch (props.type) {
  case "schedule":
    return dataStore.scheduleEvents?.filter(evt => evt.day === "fredag");

  case "activities":
    return dataStore.activityEvents?.filter(evt => evt.day === "fredag");

  case "mySchedule":
    return dataStore.myEvents?.filter(evt => evt.day === "fredag");

    default:
      return [];
}});

const eventsSaturday = computed(() => {
  switch (props.type) {
  case "schedule":
    return dataStore.scheduleEvents?.filter(evt => evt.day === "lordag");

  case "activities":
    return dataStore.activityEvents?.filter(evt => evt.day === "lordag");

  case "mySchedule":
    return dataStore.myEvents?.filter(evt => evt.day === "lordag");

    default:
      return [];
}});

const eventsSunday = computed(() => {
  switch (props.type) {
  case "schedule":
    return dataStore.scheduleEvents?.filter(evt => evt.day === "sondag");

  case "activities":
    return dataStore.activityEvents?.filter(evt => evt.day === "sondag");

  case "mySchedule":
    return dataStore.myEvents?.filter(evt => evt.day === "sondag");

    default:
      return [];
}});

function onDayChanged(evt) {
  state.currentSelectedDay = evt.detail.value;
}
</script>

<style lang="css" scoped>
a {
  color: var(--ion-color);
}

.noeventscontainer {
  margin-top: 50px;
  margin-left: 40px;
  margin-right: 40px;
  line-height: 1.5;
}

ion-icon {
  color: var(--sf-primary-color);

  position: relative;
  top: 2px;
}

ion-content::part(scroll) {
  padding-top: var(--safe-area-inset-top, 0);
}
</style>
