<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="pageContainer">
        <h1>Fredag</h1>
        <ion-list lines="none">
          <ion-item
            v-for="event in eventsFriday"
            :key="event.id"
            :router-link="`/schedule/${event.rowKey}`"
            routerDirection="forward"
            mode="ios"
            tappable
          >
            <schedule-event :event="event" />
          </ion-item>
        </ion-list>

        <h1>Lørdag</h1>
        <ion-list lines="none">
          <ion-item
            v-for="event in eventsSaturday"
            :key="event.id"
            :router-link="`/schedule/${event.rowKey}`"
            routerDirection="forward"
            mode="ios"
            tappable
          >
            <schedule-event :event="event" />
          </ion-item>
        </ion-list>

        <h1>Søndag</h1>
        <ion-list lines="none">
          <ion-item
            v-for="event in eventsSunday"
            :key="event.id"
            :router-link="`/schedule/${event.rowKey}`"
            routerDirection="forward"
            mode="ios"
            tappable
          >
            <schedule-event :event="event" />
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import { IonContent, IonPage, IonList, IonItem } from "@ionic/vue";
import { computed } from "vue";
import { useDataStore } from "@/stores/data";
import scheduleEvent from "@/components/event.vue";

const dataStore = useDataStore();

const props = defineProps({
  type: { type: String, required: true }
});

const eventsFriday = computed(() => { switch (props.type) {
  case "schedule":
    return dataStore.scheduleEvents?.filter(evt => evt.day === "fredag");

  case "activities":
    return dataStore.activityEvents?.filter(evt => evt.day === "fredag");

  case "mySchedule":
    return dataStore.scheduleEvents?.filter(evt => evt.day === "fredag");

    default:
      return [];
}});

const eventsSaturday = computed(() => { switch (props.type) {
  case "schedule":
    return dataStore.scheduleEvents?.filter(evt => evt.day === "lordag");

  case "activities":
    return dataStore.activityEvents?.filter(evt => evt.day === "lordag");

  case "mySchedule":
    return dataStore.scheduleEvents?.filter(evt => evt.day === "lordag");

    default:
      return [];
}});

const eventsSunday = computed(() => { switch (props.type) {
  case "schedule":
    return dataStore.scheduleEvents?.filter(evt => evt.day === "sondag");

  case "activities":
    return dataStore.activityEvents?.filter(evt => evt.day === "sondag");

  case "mySchedule":
    return dataStore.scheduleEvents?.filter(evt => evt.day === "sondag");

    default:
      return [];
}});
</script>

<style lang="css" scoped>
a {
  color: var(--ion-color);
}
</style>
