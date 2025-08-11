import { defineStore } from "pinia";
import { Storage } from "@ionic/storage";

const store = new Storage();
const storeKey = "SFguests";

export const useGuestsStore = defineStore("guests", {
  state: () => ({
    guestsState: [],
  }),

  actions: {
    async fetchGuests() {
      await store.create();
      this.data = await store.get(storeKey);

      const response = await fetch(`${import.meta.env.VITE_GUESTS_API_URL}`);

      if (!response.ok) {
        throw new Error("Fetch error: ${response.status}");
      }

      response.json().then((result) => {
        this.guestsState = result;
        store.set(storeKey, result);
      });
    },
  },

  getters: {
    groupedByName: (state) => {
      const groups = {};

      state.guestsState.forEach((g) => {
        const firstLetter = Array.from(g.name)[0];
        if (!groups[firstLetter]) {
          groups[firstLetter] = {};
        }
        if (!groups[firstLetter].guests) {
          groups[firstLetter].label = firstLetter.toUpperCase();
          groups[firstLetter].guests = [];
        }
        groups[firstLetter].guests.push(g);
      });

      const groupsArray = Object.values(groups);
      groupsArray.forEach((ga) =>
        ga.guests.sort((a, b) => {
          const nameCompare = ("" + a.name).localeCompare(b.name);
          if (nameCompare !== 0) {
            return nameCompare;
          }
          return ("" + a.group).localeCompare(b.group);
        })
      );

      groupsArray.sort((a, b) => a.label.localeCompare(b.label));

      return groupsArray;
    },

    groupedByGroup: (state) => {
      const groups = {};

      state.guestsState.forEach((g) => {
        if (!groups[g.group]) {
          groups[g.group] = {};
        }
        if (!groups[g.group].guests) {
          groups[g.group].label = g.group;
          groups[g.group].guests = [];
        }
        groups[g.group].guests.push(g);
      });

      const groupsArray = Object.values(groups);
      groupsArray.forEach((ga) =>
        ga.guests.sort((a, b) => ("" + a.name).localeCompare(b.name))
      );

      groupsArray.sort((a, b) => a.label.localeCompare(b.label));

      return groupsArray;
    },
  },
});
