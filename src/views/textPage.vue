<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div v-html="typeText" class="container"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import { computed } from "vue";
import { IonContent, IonPage } from "@ionic/vue";
import { useDataStore } from "@/stores/data";

const dataStore = useDataStore();

const props = defineProps({
  type: { type: String, required: true }
});

const typeText = computed(() => {
    return dataStore.text(props.type);
})
</script>

<style lang="css" scoped>
.container {
  margin-bottom: 110px;
}
</style>
