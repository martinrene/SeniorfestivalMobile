<template>
  <div class="scannerOverlay">
    <video ref="videoEl" class="scannerVideo" playsinline muted autoplay></video>
    <canvas ref="canvasEl" class="scannerCanvas"></canvas>

    <div class="scannerFrame"></div>

    <p v-if="state.errorMessage" class="scannerError">{{ state.errorMessage }}</p>

    <ion-button class="closeButton" fill="clear" @click="close">
      <ion-icon :icon="closeOutline"></ion-icon>
    </ion-button>
  </div>
</template>

<script setup lang="js">
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { IonButton, IonIcon } from "@ionic/vue";
import { closeOutline } from "ionicons/icons";
import jsQR from "jsqr";

const emit = defineEmits(["scanned", "close"]);

const videoEl = ref(null);
const canvasEl = ref(null);

const state = reactive({
  errorMessage: null,
});

let stream;
let animationFrameId;
let hasScanned = false;

onMounted(async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    videoEl.value.srcObject = stream;
    await videoEl.value.play();
    scanFrame();
  } catch {
    state.errorMessage = "Kunne ikke få adgang til kameraet.";
  }
});

onUnmounted(() => {
  stopScanning();
});

function scanFrame() {
  const video = videoEl.value;
  const canvas = canvasEl.value;

  if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
    animationFrameId = requestAnimationFrame(scanFrame);
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const result = jsQR(imageData.data, imageData.width, imageData.height);

  if (result?.data && !hasScanned) {
    hasScanned = true;
    stopScanning();
    emit("scanned", result.data);
    return;
  }

  animationFrameId = requestAnimationFrame(scanFrame);
}

function stopScanning() {
  cancelAnimationFrame(animationFrameId);
  stream?.getTracks().forEach((track) => track.stop());
}

function close() {
  stopScanning();
  emit("close");
}
</script>

<style scoped>
.scannerOverlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scannerVideo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scannerCanvas {
  display: none;
}

.scannerFrame {
  position: absolute;
  width: 70vw;
  max-width: 280px;
  aspect-ratio: 1;
  border: 3px solid var(--sf-primary-color);
  border-radius: 12px;
  box-shadow: 0 0 0 2000px rgba(0, 0, 0, 0.5);
}

.scannerError {
  position: absolute;
  bottom: 60px;
  left: 20px;
  right: 20px;
  text-align: center;
  color: white;
}

.closeButton {
  position: absolute;
  top: calc(var(--safe-area-inset-top, 0) + 10px);
  right: 10px;
  --color: white;
  font-size: 2rem;
  z-index: 1001;
}
</style>
