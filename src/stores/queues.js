import { defineStore } from "pinia";
import { Device } from "@capacitor/device";
import { Storage } from "@ionic/storage";

const store = new Storage();
const storeKey = "SFqueues";
const nameStoreKey = "SFqueueName";
let deviceId;

export const useQueuesStore = defineStore("queues", {
  state: () => ({
    queuesState: [],
    name: "",
    isLoading: false,
    error: null,
  }),

  actions: {
    async loadName() {
      await store.create();
      this.name = (await store.get(nameStoreKey)) || "";
    },

    async setName(name) {
      this.name = name;
      await store.create();
      store.set(nameStoreKey, name);
    },

    async fetchQueues() {
      await store.create();

      if (this.queuesState.length < 1) {
        this.queuesState = (await store.get(storeKey)) || [];
      }

      this.isLoading = true;
      this.error = null;

      try {
        const response = await fetch(await apiUrl());

        if (!response.ok) {
          throw new Error(`Fetch error: ${response.status}`);
        }

        this.queuesState = await response.json();
        store.set(storeKey, this.queuesState);
      } catch (err) {
        this.error = err;
      } finally {
        this.isLoading = false;
      }
    },

    async joinQueueByCode(code) {
      const normalizedCode = code.trim();

      if (!normalizedCode) {
        throw new Error("Indtast eller scan en kode");
      }

      const response = await fetch(await apiUrl(), {
        method: "POST",
        body: JSON.stringify({
          qrCode: normalizedCode,
          name: this.name,
        }),
      });

      if (response.status === 404) {
        throw new Error("Koden blev ikke genkendt");
      }

      if (response.status === 409) {
        throw new Error("Der er ikke flere ledige pladser i køen i dag");
      }

      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status}`);
      }

      await this.fetchQueues();
    },
  },

  getters: {
    queues: (state) => state.queuesState,
  },
});

async function apiUrl() {
  if (!deviceId) {
    deviceId = (await Device.getId())?.identifier;
  }
  return `${import.meta.env.VITE_QUEUES_API_URL}&phoneId=${deviceId}`;
}
