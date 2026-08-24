import type { RouteObject } from "react-router-dom";
import AboutPage from "@/features/demo/pages/AboutPage";
import HomePage from "@/features/demo/pages/HomePage";

export const demoRoutes: RouteObject[] = [
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/about",
    Component: AboutPage,
  },
];
