<template>
  <ion-page>
    <ion-segment :value="dayOfWeek">
      <ion-segment-button value="fredag" content-id="fredag">
        <ion-label>Fredag</ion-label>
      </ion-segment-button>

      <ion-segment-button value="lordag" content-id="lordag">
        <ion-label>Lørdag</ion-label>
      </ion-segment-button>

      <ion-segment-button value="sondag" content-id="sondag">
        <ion-label>Søndag</ion-label>
      </ion-segment-button>
    </ion-segment>

    <ion-segment-view>
      <ion-segment-content id="fredag">
        <ion-list lines="none">
          <ion-item
            v-for="event in eventsFriday"
            :key="event.id"
            :router-link="`/${props.type}/${event.rowKey}`"
            routerDirection="forward"
            mode="ios"
            tappable
          >
            <schedule-event :event="event" />
          </ion-item>
        </ion-list>
      </ion-segment-content>

      <ion-segment-content id="lordag">
        <ion-list lines="none">
          <ion-item
            v-for="event in eventsSaturday"
            :key="event.id"
            :router-link="`/${props.type}/${event.rowKey}`"
            routerDirection="forward"
            mode="ios"
            tappable
          >
            <schedule-event :event="event" />
          </ion-item>
        </ion-list>
      </ion-segment-content>

      <ion-segment-content id="sondag">
        <ion-list lines="none">
          <ion-item
            v-for="event in eventsSunday"
            :key="event.id"
            :router-link="`/${props.type}/${event.rowKey}`"
            routerDirection="forward"
            mode="ios"
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
import { IonPage, IonList, IonItem, IonSegment, IonSegmentView, IonSegmentContent, IonSegmentButton, IonLabel } from "@ionic/vue";
import { computed } from "vue";
import { useDataStore } from "@/stores/data";
import scheduleEvent from "@/components/eventItem.vue";

const dataStore = useDataStore();

const props = defineProps({
  type: { type: String, required: true }
});

const dayOfWeek = computed(() => {
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
</script>

<style lang="css" scoped>
a {
  color: var(--ion-color);
}

ion-content::part(scroll) {
  padding-top: var(--safe-area-inset-top, 0);
}
</style>
