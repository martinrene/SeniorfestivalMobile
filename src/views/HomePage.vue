<template>
  <ion-page>
    <div class="imagecontainer">
      <div class="imageelement"></div>
    </div>

    <div v-if="isRadioAvailable">
      <audio preload="meta">
        <source type="application/x-mpegURL" />
      </audio>

      <div class="spinner">
        <div
          @click="toggleAudio"
          :class="{
            spinup: state.isSpinningUp,
            spinning: state.isSpinning,
            spindown: state.isSpinningDown,
          }"
        >
          <img src="/image/liveradio.png" />
        </div>
      </div>
      <img
        v-if="!state.isSpinningUp && !state.isSpinning && !state.isSpinningDown"
        src="/image/playbutton.png"
        class="playbutton"
        @click="toggleAudio"
      />
    </div>
  </ion-page>
</template>

<script setup>
import { reactive, computed } from "vue";
import { IonPage } from "@ionic/vue";
import { useDataStore } from "@/stores/data";

const dataStore = useDataStore();

const state = reactive({
  isRadioPlaying: false,
  isSpinningUp: false,
  isSpinning: false,
  isSpinningDown: false,
});

const isRadioAvailable = computed(() => {
  return !!dataStore.setting("radioUrl");
});

function toggleAudio() {
  var myPlayer = document.getElementsByTagName("audio")[0];
  if (state.isRadioPlaying) {
    stopSpinning();
    myPlayer.pause();
    setTimeout(() => {
      myPlayer.load();
    });
    state.isRadioPlaying = false;
  } else {
    startSpinnig();

    myPlayer.src = dataStore.setting("radioUrl").value;
    myPlayer.load();
    myPlayer.play();
    state.isRadioPlaying = true;
  }
}

let seconds;
let milliseconds;

function startSpinnig() {
  state.isSpinningUp = true;

  setTimeout(() => {
    const now = new Date();
    seconds = now.getSeconds();
    milliseconds = now.getMilliseconds();

    state.isSpinning = true;
    state.isSpinningUp = false;
  }, 2000);
}

function stopSpinning() {
  const now = new Date();
  const secondsToWait = (now.getSeconds() - seconds) % 2;
  const millisecondsToWait = now.getMilliseconds() - milliseconds;
  const waitTime = secondsToWait * 1000 - millisecondsToWait;

  setTimeout(() => {
    state.isSpinningDown = true;
    state.isSpinning = false;

    setTimeout(() => {
      state.isSpinningDown = false;
    }, 4000);
  }, waitTime);
}
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

.spinner {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 50;
  width: 200px;
  transform: rotate(10deg);
}

.spinup {
  animation: spin-up 2s linear;
}

@keyframes spin-up {
  0% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(22deg);
  }
  40% {
    transform: rotate(45deg);
  }
  60% {
    transform: rotate(90deg);
  }
  80% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spindown {
  animation: spin-down 4s linear forwards;
}

@keyframes spin-down {
  0% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(360deg);
  }
  40% {
    transform: rotate(540deg);
  }
  60% {
    transform: rotate(630deg);
  }
  80% {
    transform: rotate(675deg);
  }
  100% {
    transform: rotate(720deg);
  }
}

.spinning {
  animation: spinning 2s linear infinite;
}

@keyframes spinning {
  100% {
    -webkit-transform: rotate(720deg);
    transform: rotate(720deg);
  }
}

.playbutton {
  position: absolute;
  top: 180px;
  right: 110px;
  z-index: 51;
  width: 50px;
  animation: shake 0.8s;
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>
