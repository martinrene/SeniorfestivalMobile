<template>
  <ion-page>
    <div class="imagecontainer">
      <div class="imageelement"></div>
    </div>
  </ion-page>
</template>

<script setup>
import { IonPage } from "@ionic/vue";
</script>

<style scoped>
.imagecontainer {
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 50%,
    transparent 100%
  );
  width: 100%;
  height: 50%;
}

.imageelement {
  background-image: url("/video/sfvideobackground.png");
  width: 100%;
  height: 100%;
}
</style>
