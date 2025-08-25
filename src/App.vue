<template>
  <ion-app>
    <div
      v-if="!isQrScannerActive"
      class="app-background"
      :class="{ active: state.isBackgroundBlack }"
    >
      <ul :class="{ close: !state.isMenuOpen, pop: state.isMenuOpen }">
        <li
          v-if="
            dataStore.setting('ticketUrl') &&
            dataStore.setting('ticketUrl') !== ''
          "
        >
          <a :href="dataStore.setting('ticketUrl').value" target="_blank">
            <ion-label @click="closeMenu">
              <span>
                <ion-icon :icon="ticket"></ion-icon>
              </span>
              <ion-text>Køb billet</ion-text>
            </ion-label>
          </a>
        </li>

        <li v-if="dataStore.settingBoolean('menuVoting')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/vote"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="thumbsUp"></ion-icon>
              </span>
              <ion-text>Afstemning</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuDeluxe')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/text/deluxe"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="diamond"></ion-icon>
              </span>
              <ion-text>Deluxe</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuInformation')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/text/info"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="information"></ion-icon>
              </span>
              <ion-text>Information</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuGuests')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/guests"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="happy"></ion-icon>
              </span>
              <ion-text>Deltagere</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuQueues')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/queues"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="footstepsOutline"></ion-icon>
              </span>
              <ion-text>Tilmelding og kø</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuShops')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/shops"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="fastFood"></ion-icon>
              </span>
              <ion-text>Mad og Udvalg</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuActivities')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/activities"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="tennisball"></ion-icon>
              </span>
              <ion-text>Aktiviteter</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuSchedule')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/schedule"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="musicalNotes"></ion-icon>
              </span>
              <ion-text>Program</ion-text>
            </ion-label>
          </ion-button>
        </li>

        <li v-if="dataStore.settingBoolean('menuMySchedule')">
          <ion-button
            fill="clear"
            class="link"
            router-link="/myschedule"
            router-direction="root"
            @click="closeMenu"
          >
            <ion-label>
              <span>
                <ion-icon :icon="heart"></ion-icon>
              </span>
              <ion-text>Min festival</ion-text>
            </ion-label>
          </ion-button>
        </li>
      </ul>
    </div>

    <div class="wrap">
      <div class="rect-left">
        <div class="inner"></div>
      </div>
      <div class="rect">
        &nbsp;<span class="circle"></span>
        <div class="avatar" @click="toggleMenu">
          <img src="/image/sfwhite.png" :class="{ squish: state.isMenuOpen }" />
          <ion-icon
            :icon="closeOutline"
            :class="{ squish: !state.isMenuOpen }"
          ></ion-icon>
        </div>
      </div>
      <div class="rect-right">
        <div class="inner"></div>
      </div>
    </div>

    <ion-button
      fill="clear"
      class="link homeButton"
      router-link="/"
      router-direction="root"
      @click="closeMenu"
    >
      <ion-icon :icon="home"></ion-icon>
    </ion-button>

    <ion-button
      fill="clear"
      class="link heartButton"
      router-link="/myschedule"
      router-direction="root"
      @click="closeMenu"
    >
      <ion-icon :icon="heart"></ion-icon>
    </ion-button>

    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="js">
import { reactive, onBeforeMount, computed } from "vue";
import { IonApp, IonRouterOutlet, IonIcon, IonText, IonLabel, IonButton } from "@ionic/vue";
import { home, heart, musicalNotes, tennisball, fastFood, footstepsOutline, information, diamond, thumbsUp, closeOutline, ticket, happy } from "ionicons/icons"

import { useDataStore } from "@/stores/data";

const dataStore = useDataStore();

const state = reactive({
      isMenuOpen: false,
      isBackgroundBlack: false,
      isQrScannerActive: false,
      isRadioPlaying: false
    });

onBeforeMount(async () => {

});

const isQrScannerActive = computed(() => false);

function toggleMenu() {
      state.isMenuOpen = !state.isMenuOpen;
      if (!state.isMenuOpen) {
        setTimeout(() => {
          state.isBackgroundBlack = false;
        }, 400);
      } else {
        state.isBackgroundBlack = true;
      }
}

    function closeMenu() {
      state.isMenuOpen = false;
      setTimeout(() => {
        state.isBackgroundBlack = false;
      }, 400);
    }
</script>

<style lang="css" scoped>
ion-button.link {
  --color: white;
  font-size: 2rem;
}

ion-button.homeButton {
  position: absolute;
  bottom: 0px;
  left: calc(25% - 35px);
  z-index: 50;
  color: white;
  font-size: 1rem;
}

ion-button.heartButton {
  position: absolute;
  bottom: 0px;
  right: calc(25% - 35px);
  z-index: 50;
  color: white;
  font-size: 1rem;
}

/* Bottom menu */

.avatar {
  width: 70px;
  height: 70px;
  position: absolute;
  background-color: var(--sf-primary-color);
  top: -100px;
  left: 18px;
  border-radius: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar img,
.avatar ion-icon {
  position: absolute;
  transition: all 0.3s ease-in-out;
}

.avatar img.squish,
.avatar ion-icon.squish {
  height: 0px;
  width: 0px;
  rotate: 0deg;
}

.avatar img {
  width: 65%;
  height: 65%;
  rotate: 360deg;
}

.avatar ion-icon {
  height: 90%;
  width: 90%;
  --ionicon-stroke-width: 44px;
  color: white;
  rotate: -360deg;
}

.wrap {
  display: block;
  width: 120%;
  position: fixed;
  bottom: -40px;
  left: -10%;
  z-index: 5;
}
.rect-left,
.rect-right {
  position: relative;
  width: calc(50% - 6px);
  height: 70px;
  float: left;
}
.rect-left {
  margin-left: -50px;
  transform: rotate(-5deg);
  translate: 7px 9px;
}
.rect-right {
  margin-right: -50px;
  transform: rotate(5deg);
  translate: -8px 9px;
}
.inner {
  position: absolute;
  top: 0;
  left: 50px;
  right: 0;
  bottom: 0;
  height: 100%;
}
.rect-left .inner {
  left: 50px;
  right: 0;
  -webkit-border-top-left-radius: 6px;
  -webkit-border-bottom-left-radius: 6px;
  -moz-border-radius-topleft: 6px;
  -moz-border-radius-bottomleft: 6px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  background: var(--sf-primary-color);
}
.rect-right .inner {
  left: 0;
  right: 50px;
  -webkit-border-top-right-radius: 6px;
  -webkit-border-bottom-right-radius: 6px;
  -moz-border-radius-topright: 6px;
  -moz-border-radius-bottomright: 6px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;

  background: var(--sf-primary-color);
  background: linear-gradient(
    145deg,
    rgba(255, 115, 60, 1) 20%,
    rgba(237, 221, 83, 1) 100%
  );
}

.rect {
  float: left;
  height: 100px;
  width: 112px;
  background: var(--sf-primary-color);
  position: relative;
  top: 50px;
  left: 3px;
}

.circle {
  display: block;
  width: 112px;
  height: 50px;
  top: -50px;
  left: 0;
  overflow: hidden;
  position: absolute;
}

.circle:after {
  content: "";
  width: 86px;
  height: 86px;
  -moz-border-radius: 86px;
  -webkit-border-radius: 86px;
  border-radius: 86px;
  background: rgba(0, 0, 0, 0);
  position: absolute;
  top: -96px;
  left: -30px;
  border: 40px solid var(--sf-primary-color);
}

/* Popup Menu */

.close {
  padding: 0px;
  list-style: none;
  position: absolute;
  bottom: 44px;
  left: 50%;
  font-size: 2em;
}

/*
.close li {
  width: 56px;
  height: 56px;
  position: absolute;
  bottom: -100px;
  left: -28px;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%;
  border: none;

  transition: all cubic-bezier(0.6, 0, 0.735, 0.045) 0.4s,
    opacity 0.4s linear 0.2s;
}
*/
.close li:nth-child(1) {
  transition-duration: 0.4s;
}

.close li:nth-child(2) {
  transition-duration: 0.35s;
}

.close li:nth-child(3) {
  transition-duration: 0.3s;
}

.close li:nth-child(4) {
  transition-duration: 0.25s;
}

.close li:nth-child(5) {
  transition-duration: 0.2s;
}

.close li:nth-child(6) {
  transition-duration: 0.15s;
}

.close li:nth-child(7) {
  transition-duration: 0.1s;
}

.pop {
  padding: 0px;
  list-style: none;
  position: absolute;
  bottom: 44px;
  left: 50%;
  font-size: 1.8rem;
}

li ion-button ion-label {
  font-size: 1.8rem;
  text-transform: none;
}

li {
  opacity: 1;
  position: absolute;
  left: -20px;
  bottom: 0px;
  width: 0px;
  overflow: hidden;
  transition: all cubic-bezier(0.6, 0, 0.735, 0.045) 0.3s,
    opacity 0.4s linear 0.2s;
}

.pop li {
  width: 360px;
  opacity: 1;
}

li span {
  background-color: var(--sf-primary-color);
  height: 45px;
  width: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

ion-label {
  display: flex;
  align-items: center;
}

ion-icon {
  height: 30px;
  width: 30px;
}

ion-text {
  margin-left: 15px;
}

.pop li:nth-child(8) {
  left: -155px;
  bottom: 459px;
  transition-duration: 0.2s;
}

.pop li:nth-child(7) {
  left: -185px;
  bottom: 404px;
  transition-duration: 0.2s;
}

.pop li:nth-child(6) {
  left: -205px;
  bottom: 344px;
  transition-duration: 0.25s;
}

.pop li:nth-child(5) {
  left: -210px;
  bottom: 284px;
  transition-duration: 0.3s;
}

.pop li:nth-child(4) {
  left: -200px;
  bottom: 224px;
  transition-duration: 0.35s;
}

.pop li:nth-child(3) {
  left: -180px;
  bottom: 164px;
  transition-duration: 0.4s;
}

.pop li:nth-child(2) {
  left: -140px;
  bottom: 104px;
  transition-duration: 0.45s;
}

.pop li:nth-child(1) {
  left: -60px;
  bottom: 65px;
  transition-duration: 0.5s;
}

.app-background.active {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  transition:/* easeInBack */ background-color 0.3s;
  background-color: rgba(0, 0, 0, 0.75);
}
</style>
