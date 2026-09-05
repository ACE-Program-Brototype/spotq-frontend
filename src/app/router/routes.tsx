import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import DemoLayout from "@/layouts/DemoLayout";
import RootLayout from "@/layouts/RootLayout";

import NotFoundPage from "../pages/NotFoundPage";
import { adminRoutes } from "./admin.routes";
import { authRoutes } from "./auth.routes";
import { customerRoutes } from "./customer.routes";
import { demoRoutes } from "./demo.routes";
import { restaurantRoutes } from "./restaurant.routes";
import { staffRoutes } from "./staff.routes";

const AdminIndexRedirect = () => <Navigate to="/admin/dashboard" replace />;

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        Component: AuthLayout,
        children: authRoutes,
      },
      {
        Component: DemoLayout,
        children: demoRoutes,
      },
      ...customerRoutes,
      {
        path: "admin",
        children: [
          {
            index: true,
            Component: AdminIndexRedirect,
          },
          ...adminRoutes,
        ],
      },
      {
        path: "restaurant",
        children: [
          {
            index: true,
            Component: () => <Navigate to="/restaurant/email/verification" replace />,
          },
          ...restaurantRoutes,
        ],
      },
      {
        path: "staff",
        children: [
          {
            index: true,
            Component: () => <Navigate to="/staff/dashboard" replace />,
          },
          ...staffRoutes,
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
