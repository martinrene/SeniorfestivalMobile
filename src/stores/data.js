import { defineStore } from "pinia";
import { useMyEventsStore } from "@/stores/myEvents";

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
    myEvents: (state) => {
      const myEventsStore = useMyEventsStore();

      const myEventIds = myEventsStore.myEvents.map((me) => me.rowKey);

      const sevents = state.scheduleEvents.filter((se) =>
        myEventIds.includes(se.rowKey)
      );

      const aevents = state.activityEvents.filter((ae) =>
        myEventIds.includes(ae.rowKey)
      );

      return sevents.concat(aevents);
    },
    event: (state) => {
      return (id) => {
        let evnt = state.scheduleEvents.find((t) => t.rowKey === id);
        if (!evnt) {
          evnt = state.activityEvents.find((t) => t.rowKey === id);
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
