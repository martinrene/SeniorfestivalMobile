import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { createPinia } from "pinia";
import { IonicVue } from "@ionic/vue";

import { Capacitor } from "@capacitor/core";
import * as capacitorApp from "@capacitor/app";
import OneSignal from "onesignal-cordova-plugin";

import { SafeArea } from "capacitor-plugin-safe-area";

import { useAppStore } from "@/stores/app";
import { useDataStore } from "@/stores/data";
import { useMyEventsStore } from "@/stores/myEvents";

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

  if (Capacitor.getPlatform() !== "web") {
    oneSignalInit();
    capacitorSubscriptionsInit();
  }

  app.mount("#app");

  fixSafeArea();
});

async function oneSignalInit() {
  try {
    OneSignal.initialize("67227112-3773-4d4d-96f3-3540cf972f47");
    const appStore = useAppStore();
    const identifier = await appStore.fetchDeviceId();
    OneSignal.login(identifier);

    OneSignal.Notifications.addEventListener("click", handleNotificationEvent);
    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      handleNotificationEvent
    );

    OneSignal.Notifications.requestPermission(false).then();
  } catch (e) {
    console.log("SF OneSignalInit: " + e);
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

      appStore.setAppActive();
    } else {
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
      router.replace(`/myschedule/${additionalData.eventDay}`);
      router.push(
        `/myschedule/${additionalData.eventDay}/${additionalData.eventId}/details`
      );
    } else if (additionalData.shopId && additionalData.shopType) {
      router.replace(`/shops/${additionalData.shopType}`);
      router.push(
        `/shops/${additionalData.shopType}/${additionalData.shopId}/details`
      );
    } else if (additionalData.eventQueueNumber) {
      router.replace(`/queues`);
      router.push(`/queues/${additionalData.eventQueueNumber}`);
    } else if (additionalData.notificationText) {
      router.replace("/home");
    }
  }
}

async function fixSafeArea() {
  SafeArea.getSafeAreaInsets().then((data) => {
    const { insets } = data;
    for (const [key, value] of Object.entries(insets)) {
      document.documentElement.style.setProperty(
        `--safe-area-inset-${key}`,
        `${value}px`
      );
    }
  });
}
