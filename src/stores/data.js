import { defineStore } from "pinia";

const dataUrl = import.meta.env.VITE_DATA_API_URL;

export const useDataStore = defineStore("data", {
  state: () => ({
    data: null,
  }),

  actions: {
    async fetchData() {
      const response = await fetch(dataUrl);

      if (!response.ok) {
        throw new Error("Fetch error: ${response.status}");
      }

      response.json().then((result) => {
        this.data = result;
      });
    },
  },

  getters: {
    scheduleEvents: (state) => state.data?.scheduleEvents || [],
    activityEvents: (state) => state.data?.activityEvents || [],
    event: (state) => {
      return (id) => {
        let evnt = state.data?.scheduleEvents.find((t) => t.rowKey === id);
        if (!evnt) {
          evnt = state.data?.activityEvents.find((t) => t.rowKey === id);
        }
        return evnt;
      };
    },
    text: (state) => {
      return (key) =>
        state.data?.texts.find((t) => t.rowKey === key)?.description;
    },
    setting: (state) => {
      return (key) => state.data?.settings.find((t) => t.name === key);
    },
    settingBoolean: (state) => {
      return (key) => state.setting(key)?.value === "true";
    },
  },
});
