<template>
  <ion-page>
    <ion-segment :value="props.type">
      <ion-segment-button value="shop" content-id="shop">
        <ion-label>Boder</ion-label>
      </ion-segment-button>

      <ion-segment-button value="committee" content-id="committee">
        <ion-label>Udvalg</ion-label>
      </ion-segment-button>
    </ion-segment>

    <ion-segment-view>
      <ion-segment-content id="shop">
        <ion-list lines="inset">
          <ion-item v-for="shop in shops" :key="shop.id" mode="ios">
            <shop-item :shop="shop"></shop-item>
          </ion-item>
        </ion-list>
      </ion-segment-content>

      <ion-segment-content id="committee">
        <ion-list lines="inset">
          <ion-item
            v-for="committee in committees"
            :key="committee.id"
            mode="ios"
          >
            <shop-item :shop="committee"></shop-item>
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
import shopItem from "@/components/shopItem.vue";

const dataStore = useDataStore();

const props = defineProps({
  type: { type: String, required: false, default: "shop" }
});

const shops = computed(() => dataStore.shops);

const committees = computed(() => dataStore.committees);
</script>

<style scoped>
ion-item {
  --inner-padding-end: 0px;
  --padding-start: 0px;
}
</style>
