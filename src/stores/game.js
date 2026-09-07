import { defineStore } from "pinia";
import { Storage } from "@ionic/storage";

import { useAppStore } from "@/stores/app";

const store = new Storage();
const nameStoreKey = "SFgameName";
const apiUrl = import.meta.env.VITE_GAME_API_URL;

export const useGameStore = defineStore("game", {
  state: () => ({
    // Remembered between rounds so a returning player does not retype it.
    name: "",
    leaderboard: null,
    isSaving: false,
    error: null,
  }),

  actions: {
    async loadName() {
      await store.create();
      this.name = (await store.get(nameStoreKey)) || "";
      return this.name;
    },

    clearError() {
      this.error = null;
    },

    /**
     * Reads the board without submitting anything, so it can be shown before a
     * round as well as after one. A failure here is silent and keeps whatever
     * board we already had: this is decoration on a screen someone came to play
     * on, not something worth an error message.
     */
    async fetchLeaderboard() {
      try {
        const appStore = useAppStore();

        // apiUrl already carries ?code=, so add to the query rather than replace it.
        const url = new URL(apiUrl, window.location.origin);
        url.searchParams.set("phoneId", await appStore.fetchDeviceId());

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Load failed: ${response.status}`);
        }

        this.leaderboard = await response.json();
      } catch (e) {
        console.log(`SF leaderboard: ${e}`);
      }
    },

    async submitScore(score, name) {
      this.isSaving = true;
      this.error = null;

      try {
        const appStore = useAppStore();
        const trimmed = (name || "").trim();

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneId: await appStore.fetchDeviceId(),
            name: trimmed,
            score,
          }),
        });

        if (!response.ok) {
          throw new Error(`Save failed: ${response.status}`);
        }

        this.leaderboard = await response.json();

        // Only remember the name once the score actually landed.
        this.name = trimmed;
        await store.create();
        await store.set(nameStoreKey, trimmed);
      } catch (e) {
        console.log(`SF game score: ${e}`);
        this.error = "Resultatet kunne ikke gemmes. Prøv igen.";
      } finally {
        this.isSaving = false;
      }
    },
  },
});
