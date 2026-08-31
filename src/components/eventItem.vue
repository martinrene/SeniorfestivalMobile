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
      <span v-if="badgeLabel" class="sf-badge" :class="badgeType">{{ badgeLabel }}</span>
      <h2>
        {{ props.event.title }}
      </h2>
      <div v-html="props.event.description" class="description-content"></div>
    </div>
  </div>
</template>

<script setup lang="js">
import { computed } from "vue";

const props = defineProps({
  event: { type: Object, required: true },
  type: { type: String, required: false, default: null }
});

const badgeType = computed(() => {
  if (props.type === "schedule" || props.type === "activities") {
    return props.type;
  }

  return null;
});

const badgeLabel = computed(() => {
  switch (badgeType.value) {
    case "schedule":
      return "Program";
    case "activities":
      return "Aktivitet";
    default:
      return null;
  }
});
</script>
