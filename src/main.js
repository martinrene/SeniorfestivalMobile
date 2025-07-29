import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { createPinia } from "pinia";

import { IonicVue } from "@ionic/vue";

import OneSignal from "onesignal-cordova-plugin";

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
  app.mount("#app");

  // Enable verbose logging for debugging (remove in production)
  OneSignal.Debug.setLogLevel(6);
  // Initialize with your OneSignal App ID
  OneSignal.initialize("67227112-3773-4d4d-96f3-3540cf972f47");
  // Use this method to prompt for push notifications.
  // We recommend removing this method after testing and instead use In-App Messages to prompt for notification permission.
  OneSignal.Notifications.requestPermission(false).then((accepted) => {
    console.log("User accepted notifications: " + accepted);
  });
});
