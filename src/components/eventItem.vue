<template>
  <div class="eventContainer">
    <div></div>
    <div class="eventPicture">
      <img :src="props.event.pictureUrl" />
    </div>
    <div class="eventTime">
      {{ props.event.start.replace(/^0(?=[1-9])/, "") }}
    </div>
    <div class="eventDescription">
      <h2>
        {{ props.event.title }}
      </h2>
      <div v-html="props.event.description" class="description-content"></div>
    </div>
  </div>
</template>

<script setup lang="js">


const props = defineProps({
  event: { type: Object, required: true }
});
</script>
