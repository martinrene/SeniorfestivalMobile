import { defineStore } from "pinia";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useMyEventsStore } from "@/stores/myEvents";
import { Storage } from "@ionic/storage";

const store = new Storage();
const dataUrl = import.meta.env.VITE_DATA_API_URL;
const storeKey = "SFdata";

/**
 * Cap on how long we wait for the native build number. A bridge call that never
 * settles must not stall the data load behind it.
 */
const buildLookupTimeoutMs = 1500;

export const useDataStore = defineStore("data", {
  state: () => ({
    data: null,
  }),

  actions: {
    async fetchData() {
      await store.create();
      this.data = await store.get(storeKey);

      const response = await fetch(await dataApiUrl());

      if (!response.ok) {
        throw new Error("Fetch error: ${response.status}");
      }

      response.json().then((result) => {
        result.scheduleEvents = sortEventsOnStartTime(result.scheduleEvents);
        result.activityEvents = sortEventsOnStartTime(result.activityEvents);

        this.data = result;
        store.set(storeKey, result);
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

      return sortEventsOnStartTime(sevents.concat(aevents));
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
    shops: (state) => state.data?.shops.filter((s) => s.isShop),
    committees: (state) => state.data?.shops.filter((s) => !s.isShop),

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

/**
 * Tags the call with the platform and build it came from. The API compares the
 * build against currentIosVersion / currentAndroidVersion in Settings and swaps
 * frontpageText for an update prompt when they differ, so it needs to know which
 * of the two to check against. The configured URL already carries ?code=, so
 * parameters are appended with & as the votings endpoint does it. The build is
 * left off rather than faked when there is none, which is the case on web.
 */
async function dataApiUrl() {
  // This is diagnostics, so it must never be the reason the app fails to load
  // its data: anything that goes wrong falls back to the plain URL.
  try {
    const params = new URLSearchParams({ platform: Capacitor.getPlatform() });
    const build = await withTimeout(nativeBuildNumber());

    if (build) {
      params.set("build", build);
    }

    return `${dataUrl}&${params}`;
  } catch (e) {
    console.log(`SF data url: ${e}`);
    return dataUrl;
  }
}

let buildNumberLookup;

function nativeBuildNumber() {
  if (Capacitor.getPlatform() === "web") {
    return Promise.resolve(null);
  }

  buildNumberLookup ||= App.getInfo()
    .then((info) => info.build)
    .catch(() => null);

  return buildNumberLookup;
}

function withTimeout(promise) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(null), buildLookupTimeoutMs)),
  ]);
}

function sortEventsOnStartTime(events) {
  const eventsWithStartTime = events.filter((e) => e.start && e.start !== "");

  const eventsSorted = eventsWithStartTime.sort((a, b) => {
    const splitA = a.start.split(":");
    const dateA = new Date(
      2025,
      1,
      Number(splitA[0]) < 4 ? 2 : 1,
      Number(splitA[0]),
      Number(splitA[1]),
      0,
      0
    );

    const splitB = b.start.split(":");
    const dateB = new Date(
      2025,
      1,
      Number(splitB[0]) < 4 ? 2 : 1,
      Number(splitB[0]),
      Number(splitB[1]),
      0,
      0
    );

    return dateA.valueOf() - dateB.valueOf();
  });

  const eventsWithoutStartTime = events.filter(
    (e) => !e.start || e.start == ""
  );

  return eventsSorted.concat(eventsWithoutStartTime);
}
