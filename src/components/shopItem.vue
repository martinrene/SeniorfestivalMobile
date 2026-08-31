<template>
  <div v-if="props.shop" class="shopCard">
    <div class="pictureContainer" v-if="props.shop.pictureUrl">
      <img :src="props.shop.pictureUrl" />
    </div>

    <div class="infoContainer">
      <h2>{{ props.shop.title }}</h2>
      <div v-if="props.shop.location" class="locationBadge">
        <ion-icon :icon="locationOutline"></ion-icon>
        {{ props.shop.location }}
      </div>
      <p v-html="props.shop.description"></p>
    </div>
  </div>
</template>

<script setup lang="js">
import { IonIcon } from "@ionic/vue";
import { locationOutline } from "ionicons/icons";

const props = defineProps({
  shop: { type: Object, required: true }
});
</script>

<style lang="css" scoped>
.shopCard {
  width: 100%;
  background: var(--sf-surface-color);
  border-radius: var(--sf-card-radius);
  border-top: 6px solid var(--sf-primary-color);
  box-shadow: var(--sf-card-shadow);
  overflow: hidden;
}

.pictureContainer img {
  display: block;
  width: 100%;
  max-height: 160px;
  object-fit: cover;
}

.infoContainer {
  padding: 18px 20px 22px;
  text-align: center;
}

.infoContainer h2 {
  color: var(--ion-text-color);
}

.infoContainer > p {
  text-align: left;
  line-height: 1.7rem;
  color: var(--sf-muted-color);
  margin-top: 14px;
}

.locationBadge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 8px auto 0;
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--sf-secondary-color);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.locationBadge ion-icon {
  position: static;
  font-size: 0.95rem;
}
</style>
