import { defineStore } from "pinia";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Device } from "@capacitor/device";

export const useAppStore = defineStore("app", {
  state: () => ({
    isAppActiveState: false,
    deviceId: null,
    buildNumber: null,
  }),

  actions: {
    setAppActive() {
      this.isAppActiveState = true;
    },

    setAppPaused() {
      this.isAppActiveState = false;
    },

    async fetchDeviceId() {
      if (!this.deviceId) {
        if (Capacitor.getPlatform() === "web") {
          return "ost";
        } else {
          this.deviceId = (await Device.getId())?.identifier;
        }
      }
      return this.deviceId;
    },

    /**
     * The native build number: versionCode on Android, CFBundleVersion on iOS.
     * Cached after the first lookup, and null in a browser, where the app was
     * never packaged and so has no build to report.
     */
    async fetchBuildNumber() {
      if (this.buildNumber !== null) {
        return this.buildNumber;
      }

      if (Capacitor.getPlatform() === "web") {
        return null;
      }

      try {
        this.buildNumber = (await App.getInfo()).build;
      } catch (e) {
        console.log(`SF build number: ${e}`);
      }

      return this.buildNumber;
    },
  },

  getters: {
    isAppActive: (state) => state.isAppActiveState,

    /** "ios", "android" or "web". */
    platform: () => Capacitor.getPlatform(),
  },
});
