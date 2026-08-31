<template>
  <div class="scannerOverlay">
    <video ref="videoEl" class="scannerVideo" playsinline muted autoplay></video>
    <canvas ref="canvasEl" class="scannerCanvas"></canvas>

    <div class="scannerFrame"></div>

    <p class="scannerHint">Hold kameraet hen over aktivitetens QR-kode</p>

    <ion-button class="closeButton" fill="clear" @click="close">
      <ion-icon :icon="closeOutline"></ion-icon>
    </ion-button>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted, onUnmounted } from "vue";
import { IonButton, IonIcon } from "@ionic/vue";
import { closeOutline } from "ionicons/icons";
import jsQR from "jsqr";

const emit = defineEmits(["scanned", "close", "unavailable"]);

const videoEl = ref(null);
const canvasEl = ref(null);

let stream;
let animationFrameId;
let hasScanned = false;

onMounted(async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    emit("unavailable", "unsupported");
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    videoEl.value.srcObject = stream;
    await videoEl.value.play();
    scanFrame();
  } catch (err) {
    console.log(`SF qrScanner: ${err?.name} ${err?.message}`);
    emit(
      "unavailable",
      err?.name === "NotAllowedError" ? "denied" : "failed"
    );
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

.scannerHint {
  position: absolute;
  top: calc(50% + 160px);
  left: 30px;
  right: 30px;
  text-align: center;
  color: white;
  font-size: 1rem;
  font-weight: 600;
}

.closeButton {
  position: absolute;
  top: calc(var(--safe-area-inset-top, 0px) + 10px);
  right: 10px;
  --color: white;
  font-size: 2rem;
  z-index: 1001;
}
</style>
