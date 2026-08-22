import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import DemoLayout from "@/layouts/DemoLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import RootLayout from "@/layouts/RootLayout";
import NotFoundPage from "../pages/NotFoundPage";
import { authRoutes } from "./auth.routes";
import { demoRoutes } from "./demo.routes";

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        Component: AuthLayout,
        children: authRoutes,
      },
      {
        Component: ProtectedLayout,
        children: [
          {
            Component: DemoLayout,
            children: demoRoutes,
          },
        ],
      },
      {
        path: "*",
        Component:NotFoundPage
      },
    ],
  },
]);

export default router;
