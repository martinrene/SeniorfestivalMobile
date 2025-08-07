<template>
  <ion-page>
    <ion-segment :value="type">
      <ion-segment-button value="shop" content-id="shop">
        <ion-label>Boder</ion-label>
      </ion-segment-button>

      <ion-segment-button value="committee" content-id="committee">
        <ion-label>Udvalg</ion-label>
      </ion-segment-button>
    </ion-segment>

    <ion-segment-view>
      <ion-segment-content id="shop">
        <ion-list lines="none">
          <ion-item
            v-for="shop in shops"
            :key="shop.id"
            :router-link="`/shops/${shop.id}`"
            routerDirection="forward"
            mode="ios"
            tappable
          >
            <schedule-event :event="event" />
          </ion-item>
        </ion-list>
      </ion-segment-content>

      <ion-segment-content id="committee">
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
    </ion-segment-view>
  </ion-page>
</template>

<script setup lang="js">
import { IonPage, IonList, IonItem, IonSegment, IonSegmentView, IonSegmentContent, IonSegmentButton, IonLabel } from "@ionic/vue";
import { computed } from "vue";
import { useDataStore } from "@/stores/data";

const dataStore = useDataStore();

const shops = computed(() => dataStore.shops);

const committees = computed(() => dataStore.committees);
</script>
