import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";

import NotFoundPage from "../pages/NotFoundPage";
import { adminRoutes } from "./admin.routes";
import { customerRoutes } from "./customer.routes";
import { restaurantRoutes } from "./restaurant.routes";
import { staffRoutes } from "./staff.routes";

const AdminIndexRedirect = () => <Navigate to="/admin/dashboard" replace />;

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
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
