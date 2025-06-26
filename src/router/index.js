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
    component: () => import("@/views/ScheduleEventPage.vue"),
    props: true,
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: () => import("@/views/SchedulePage.vue"),
    children: [],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
