<template>
  <ion-page>
    <ion-content>
      <ion-segment value="default">
        <ion-segment-button value="default" content-id="name">
          <ion-label>Efter navn</ion-label>
        </ion-segment-button>
        <ion-segment-button value="group" content-id="group">
          <ion-label>Efter kreds</ion-label>
        </ion-segment-button>
      </ion-segment>
      <ion-segment-view>
        <ion-segment-content id="name">
          <ion-list lines="none">
            <ion-item-group
              v-for="group in guestsStore.groupedByName"
              :key="group.label"
            >
              <ion-item-divider>
                <ion-label>{{ group.label }}</ion-label>
              </ion-item-divider>

              <ion-item v-for="guest in group.guests" :key="guest.id">
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                  "
                >
                  <div>
                    {{ guest.name }}
                  </div>
                  <div class="text-sm" style="text-align: right">
                    {{ guest.group }}
                  </div>
                </div>
              </ion-item>
            </ion-item-group>
          </ion-list>
        </ion-segment-content>

        <ion-segment-content id="group">
          <ion-list lines="none">
            <ion-item-group
              v-for="group in guestsStore.groupedByGroup"
              :key="group.label"
            >
              <ion-item-divider>
                <ion-label>{{ group.label }}</ion-label>
              </ion-item-divider>

              <ion-item v-for="guest in group.guests" :key="guest.id">
                {{ guest.name }}
              </ion-item>
            </ion-item-group>
          </ion-list>
        </ion-segment-content>
      </ion-segment-view>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import { IonContent, IonPage, IonSegment, IonSegmentView, IonSegmentButton, IonSegmentContent, IonLabel, IonList, IonItemGroup, IonItemDivider, IonItem } from "@ionic/vue";
import { onBeforeMount } from "vue";

import { useGuestsStore } from "@/stores/guests";

const guestsStore = useGuestsStore();


onBeforeMount(() => {
  guestsStore.fetchGuests();
});
</script>

<style lang="css">
ion-item span {
  margin-left: 20px;
}

ion-content::part(scroll) {
  padding-top: var(--ion-safe-area-top, 0);
}

ion-segment-view {
  margin-top: 10px;
}
</style>
