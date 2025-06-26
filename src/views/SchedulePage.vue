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
import scheduleEvent from "@/components/scheduleEvent.vue";


const dataStore = useDataStore();

const eventsFriday = computed(() => dataStore.scheduleEvents?.filter(evt => evt.day === "fredag"));
const eventsSaturday = computed(() => dataStore.scheduleEvents?.filter(evt => evt.day === "lordag"));
const eventsSunday = computed(() => dataStore.scheduleEvents?.filter(evt => evt.day === "sondag"));
</script>

<style lang="css" scoped>
a {
  color: var(--ion-color);
}
</style>
