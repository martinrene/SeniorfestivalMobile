import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { createPinia } from "pinia";
import { IonicVue } from "@ionic/vue";

import { Capacitor } from "@capacitor/core";
import * as capacitorApp from "@capacitor/app";
import OneSignal, { LogLevel } from "@onesignal/capacitor-plugin";

import { useAppStore } from "@/stores/app";
import { useDataStore } from "@/stores/data";
import { useMyEventsStore } from "@/stores/myEvents";
import { useVotingsStore } from "@/stores/votings";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import "@ionic/vue/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/theming.css";

const pinia = createPinia();

const app = createApp(App).use(IonicVue).use(router).use(pinia);

router.isReady().then(() => {
  const dataStore = useDataStore();
  dataStore.fetchData();

  const myEventsStore = useMyEventsStore();
  myEventsStore.fetchMyEvents();

  const votingsStore = useVotingsStore();
  votingsStore.startVotingsLoading();

  if (Capacitor.getPlatform() !== "web") {
    oneSignalInit();
    capacitorSubscriptionsInit();
  }

  app.mount("#app");
});

async function oneSignalInit() {
  try {
    // TODO remove once push is confirmed working: makes the OneSignal SDK log
    // its registration steps to logcat / Xcode console.
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    // initialize/login return promises; awaiting them matters because
    // requestPermission on an uninitialised SDK silently does nothing.
    await OneSignal.initialize("67227112-3773-4d4d-96f3-3540cf972f47");

    const appStore = useAppStore();
    const identifier = await appStore.fetchDeviceId();
    await OneSignal.login(identifier);

    OneSignal.Notifications.addEventListener("click", handleNotificationEvent);
    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      handleNotificationEvent,
    );

    const alreadyGranted = await OneSignal.Notifications.hasPermission();
    const canPrompt = await OneSignal.Notifications.canRequestPermission();
    console.log(
      `SF OneSignal: hasPermission=${alreadyGranted} canRequestPermission=${canPrompt}`
    );

    // fallbackToSettings: true so a user who previously denied is offered the
    // system settings page instead of nothing happening at all.
    const granted = await OneSignal.Notifications.requestPermission(true);
    console.log(`SF OneSignal: requestPermission granted=${granted}`);
  } catch (e) {
    console.log(`SF OneSignalInit failed: ${e?.message ?? e}`);
  }
}

function capacitorSubscriptionsInit() {
  capacitorApp.App.addListener("appStateChange", ({ isActive }) => {
    const appStore = useAppStore();

    if (isActive) {
      const dataStore = useDataStore();
      dataStore.fetchData();

      const myEventsStore = useMyEventsStore();
      myEventsStore.fetchMyEvents();

      const votingsStore = useVotingsStore();
      votingsStore.startVotingsLoading();
      appStore.setAppActive();
    } else {
      const votingsStore = useVotingsStore();
      votingsStore.stopVotingsLoading();
      appStore.setAppPaused();
    }
  });
}

function handleNotificationEvent(evnt) {
  const additionalData = evnt?.notification?.additionalData;

  if (additionalData) {
    if (additionalData.vote) {
      router.replace("/vote");
    } else if (additionalData.eventId && additionalData.eventDay) {
      router.replace(`/myschedule`);
      router.push(
        `/myschedule/${additionalData.eventId}/${additionalData.eventDay}`,
      );
    } else if (additionalData.shopId && additionalData.shopType) {
      router.replace(`/shops/${additionalData.shopType}`);
      router.push(
        `/shops/${additionalData.shopType}/${additionalData.shopId}/details`,
      );
    } else if (additionalData.eventQueueNumber) {
      router.replace(`/queues`);
      router.push(`/queues/${additionalData.eventQueueNumber}`);
    } else if (additionalData.notificationText) {
      router.replace("/home");
    } else if (additionalData.startRadio) {
      router.replace("/home?start=true");
    }
  }
}
