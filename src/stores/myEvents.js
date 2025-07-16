import { defineStore } from "pinia";
import { Device } from "@capacitor/device";
import { Storage } from "@ionic/storage";

const store = new Storage();
const storeKey = "SFmyEvents";
let deviceId;

export const useMyEventsStore = defineStore("myEvents", {
  state: () => ({
    myEventsState: [],
  }),

  actions: {
    async fetchMyEvents() {
      await store.create();
      this.data = await store.get(storeKey);
      const response = await fetch(await apiUrl());

      if (!response.ok) {
        throw new Error("Fetch error: ${response.status}");
      }

      response.json().then((result) => {
        this.myEventsState = result;
        store.set(storeKey, result);
      });
    },

    async addToMyEvents(eventId) {
      const response = await fetch(await apiUrl(), {
        method: "POST",
        body: JSON.stringify({
          myEventId: eventId,
        }),
      });
      if (response.status === 202) {
        this.myEventsState.push({ rowKey: eventId });
        setStorage(this.myEventsState);
      }
    },

    async removeFromMyEvents(eventId) {
      const response = await fetch(`${await apiUrl()}&eventId=${eventId}`, {
        method: "DELETE",
      });

      if (response.status === 202) {
        this.myEventsState = this.myEventsState.filter(
          (e) => e.rowKey !== eventId
        );
        setStorage(this.myEventsState);
      }
    },
  },

  getters: {
    myEvents: (state) => state.myEventsState,
    isEventInMyEvents: (state) => (eventId) => {
      return !!state.myEventsState.find((e) => e.rowKey === eventId);
    },
  },
});

async function apiUrl() {
  if (!deviceId) {
    deviceId = (await Device.getId())?.identifier;
  }
  return `${import.meta.env.VITE_MYEVENTS_API_URL}&phoneId=${deviceId}`;
}

async function setStorage(data) {
  await store.create();
  store.set(storeKey, data);
}
