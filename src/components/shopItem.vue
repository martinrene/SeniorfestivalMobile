<template>
  <div v-if="props.shop">
    <div class="pictureContainer" v-if="props.shop.pictureUrl">
      <img :src="props.shop.pictureUrl" />
    </div>

    <div class="infoContainer">
      <h2>{{ props.shop.title }}</h2>
      <div class="tinyLabel">Hvor</div>
      <h3>{{ props.shop.location }}</h3>
      <p v-html="props.shop.description"></p>
    </div>
  </div>
</template>

<script setup lang="js">


const props = defineProps({
  shop: { type: Object, required: true }
});
</script>

<style lang="css" scoped>
.pictureContainer {
  margin-top: 10px;
}

.pictureContainer > div {
  display: flex;
  justify-content: space-between;
  margin-top: -55px;
  margin-left: 15px;
  margin-right: 15px;
}

.infoContainer {
  margin-top: 30px;
  text-align: center;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 30px;
}

.infoContainer > p {
  text-align: left;
  line-height: 1.7rem;
}

.tinyLabel {
  margin-top: 16px;
  margin-bottom: 6px;
}
</style>
