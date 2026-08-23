import type { RouteObject } from "react-router-dom";
import AboutPage from "@/features/demo/pages/AboutPage";
import HomePage from "@/features/demo/pages/HomePage";

export const demoRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
];
