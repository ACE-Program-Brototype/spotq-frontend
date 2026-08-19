import { createBrowserRouter, Navigate } from "react-router-dom";

import DemoLayout from "@/layouts/DemoLayout";
import RootLayout from "@/layouts/RootLayout";

import NotFoundPage from "../pages/NotFoundPage";
import { adminRoutes } from "./admin.routes";
import { demoRoutes } from "./demo.routes";

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        Component: DemoLayout,
        children: demoRoutes,
      },
      {
        path: "admin",
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          ...adminRoutes,
        ],
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);

export default router;
