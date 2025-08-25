import { createRouter, createWebHistory } from "@ionic/vue-router";
import HomePage from "../views/HomePage.vue";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },

  {
    path: "/schedule/:id/:day",
    name: "ScheduleEvent",
    component: () => import("@/views/eventPage.vue"),
    props: (route) => ({
      id: route.params.id,
      type: "schedule",
      day: route.params.day,
    }),
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: () => import("@/views/eventsPage.vue"),
    props: { type: "schedule" },
  },
  {
    path: "/activities/:id/:day",
    name: "ActivitiesEvent",
    component: () => import("@/views/eventPage.vue"),
    props: (route) => ({
      id: route.params.id,
      type: "activities",
      day: route.params.day,
    }),
  },
  {
    path: "/activities",
    name: "Activities",
    component: () => import("@/views/eventsPage.vue"),
    props: { type: "activities" },
  },

  {
    path: "/myschedule/:id/:day",
    name: "MyScheduleEvent",
    component: () => import("@/views/eventPage.vue"),
    props: (route) => ({
      id: route.params.id,
      type: "mySchedule",
      day: route.params.day,
    }),
  },
  {
    path: "/myschedule",
    name: "MySchedule",
    component: () => import("@/views/eventsPage.vue"),
    props: { type: "mySchedule" },
  },

  {
    path: "/guests",
    name: "Guests",
    component: () => import("@/views/guestsPage.vue"),
  },

  {
    path: "/shops",
    name: "Shops",
    component: () => import("@/views/shopsPage.vue"),
  },

  {
    path: "/text/:type",
    name: "Text",
    component: () => import("@/views/textPage.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
