<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div v-html="typeText" class="textcontainer"></div>
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

<style lang="css">
.textcontainer {
  margin-top: calc(var(--safe-area-inset-top, 0) + 30px);
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 110px;
}

.textcontainer a {
  color: var(--sf-primary-color);
}

.textcontainer h2 {
  margin-top: 40px;
}
</style>
