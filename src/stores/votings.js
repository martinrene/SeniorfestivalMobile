import { Device } from "@capacitor/device";
import { defineStore } from "pinia";
import { Storage } from "@ionic/storage";

let deviceId;
const store = new Storage();
const storeKey = "SFclosedVotings";

export const useVotingsStore = defineStore("votings", {
  state: () => ({
    votings: [],
    intervaller: null,
    closedVotings: [],
  }),

  actions: {
    async fetchVotings() {
      try {
        const response = await fetch(await apiUrl());

        if (!response.ok) {
          return;
        }

        response.json().then((result) => {
          const sorted = result.sort(
            (a, b) => a.voting.timeStamp - b.voting.timeStamp
          );

          // Keep votes registered on this device that the API has not
          // echoed back yet, so polling doesn't reset the user's choice.
          this.votings = sorted.map((incoming) => {
            if (incoming.vote) {
              return incoming;
            }

            const known = this.votings.find(
              (v) => v.voting?.votingId === incoming.voting?.votingId
            );

            return known?.vote ? { ...incoming, vote: known.vote } : incoming;
          });
        });
      } catch {
        // ignore fetch errors
      }
    },

    async startVotingsLoading() {
      await store.create();
      this.closedVotings = JSON.parse(await store.get(storeKey)) || [];

      this.fetchVotings();
      this.intervaller = setInterval(this.fetchVotings, 5000);
    },

    stopVotingsLoading() {
      clearInterval(this.intervaller);
    },

    async addVote(votingId, choice) {
      const voteObj = {
        votingId,
        phoneId: (await Device.getId())?.identifier,
        choice,
      };

      const voting = this.votings.find(
        (v) => v.voting?.votingId === votingId
      );

      // Show the choice immediately, but keep the previous value so a failed
      // submit does not leave the user looking at a vote that never landed.
      const previousVote = voting?.vote;

      if (voting) {
        voting.vote = voteObj;
      }

      try {
        const response = await fetch(await apiUrl(), {
          method: "POST",
          body: JSON.stringify(voteObj),
        });

        if (!response.ok) {
          throw new Error(`Vote failed: ${response.status}`);
        }
      } catch (e) {
        if (voting) {
          voting.vote = previousVote;
        }
        console.log(`SF addVote: ${e}`);
        throw e;
      }
    },

    async stopVoting(votingId) {
      await store.create();
      this.closedVotings.push(votingId);
      await store.set(storeKey, JSON.stringify(this.closedVotings));
    },
  },

  getters: {
    currentVoting: (state) => state.votings[0] || null,
    isCurrentVotingVisible: (state) =>
      state.currentVoting &&
      !state.closedVotings?.includes(state.currentVoting?.voting?.votingId),
  },
});

async function apiUrl() {
  if (!deviceId) {
    deviceId = (await Device.getId())?.identifier;
  }
  return `${import.meta.env.VITE_VOTINGS_API_URL}&phoneId=${deviceId}`;
}
