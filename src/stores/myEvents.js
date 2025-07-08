import { defineStore } from "pinia";

const dataUrl = import.meta.env.VITE_MYEVENTS_API_URL;

export const useDataStore = defineStore("myEvents", {
  state: () => ({
    myEventsState: [],
  }),

  actions: {
    async fetchMyEvents() {
      const response = await fetch(dataUrl);

      if (!response.ok) {
        throw new Error("Fetch error: ${response.status}");
      }

      response.json().then((result) => {
        this.myEventsState = result;
      });
    },
  },

  getters: {
    myEvents: (state) => state.myEventsState,
  },
});
