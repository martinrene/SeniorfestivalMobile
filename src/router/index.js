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
    path: "/schedule/:id",
    name: "ScheduleEvent",
    component: () => import("@/views/eventPage.vue"),
    props: (route) => ({ id: route.params.id, type: "schedule" }),
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: () => import("@/views/eventsPage.vue"),
    props: { type: "schedule" },
  },
  {
    path: "/activities/:id",
    name: "ActivitiesEvent",
    component: () => import("@/views/eventPage.vue"),
    props: (route) => ({ id: route.params.id, type: "activities" }),
  },
  {
    path: "/activities",
    name: "Activities",
    component: () => import("@/views/eventsPage.vue"),
    props: { type: "activities" },
  },

  {
    path: "/myschedule/:id",
    name: "MyScheduleEvent",
    component: () => import("@/views/eventPage.vue"),
    props: (route) => ({ id: route.params.id, type: "mySchedule" }),
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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
