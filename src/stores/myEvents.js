import { defineStore } from "pinia";
import { Device } from "@capacitor/device";

let deviceId;

export const useMyEventsStore = defineStore("myEvents", {
  state: () => ({
    myEventsState: [],
  }),

  actions: {
    async fetchMyEvents() {
      const response = await fetch(await apiUrl());

      if (!response.ok) {
        throw new Error("Fetch error: ${response.status}");
      }

      response.json().then((result) => {
        this.myEventsState = result;
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
