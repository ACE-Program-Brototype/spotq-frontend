import { createBrowserRouter, Navigate } from "react-router-dom";
import StaffAcceptInvitationPage from "@/features/auth/pages/StaffAcceptInvitationPage";
import RootLayout from "@/layouts/RootLayout";

import NotFoundPage from "../pages/NotFoundPage";
import { adminRoutes } from "./admin.routes";
import { customerRoutes } from "./customer.routes";
import { restaurantRoutes } from "./restaurant.routes";
import { staffRoutes } from "./staff.routes";

const AdminIndexRedirect = () => <Navigate to="/admin/dashboard" replace />;
const RestaurantIndexRedirect = () => <Navigate to="/restaurant/dashboard" replace />;
const StaffIndexRedirect = () => <Navigate to="/staff/dashboard" replace />;

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      ...customerRoutes,
      {
        path: "invitations",
        children: [
          {
            path: "accept",
            Component: StaffAcceptInvitationPage,
          },
        ],
      },
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
            Component: RestaurantIndexRedirect,
          },
          ...restaurantRoutes,
        ],
      },
      {
        path: "staff",
        children: [
          {
            index: true,
            Component: StaffIndexRedirect,
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
