import { defineStore } from "pinia";
import { Capacitor } from "@capacitor/core";
import { Device } from "@capacitor/device";

export const useAppStore = defineStore("app", {
  state: () => ({
    isAppActiveState: false,
    deviceId: null,
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
  },

  getters: {
    isAppActive: (state) => state.isAppActiveState,
  },
});
