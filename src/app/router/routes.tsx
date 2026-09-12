import { createBrowserRouter, Navigate } from "react-router-dom";
import StaffAcceptInvitationPage from "@/features/auth/pages/StaffAcceptInvitationPage";
import RootLayout from "@/layouts/RootLayout";
import NotFoundPage from "../pages/NotFoundPage";
import { adminRoutes } from "./admin.routes";
import { customerRoutes } from "./customer.routes";
import { restaurantRoutes } from "./restaurant.routes";
import { staffRoutes } from "./staff.routes";

const router = createBrowserRouter(
  [
    {
      Component: RootLayout,
      children: [
        {
          path: "subscription",
          element: <Navigate to="/restaurant/subscription" replace />,
        },
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
              element: <Navigate to="login" replace />,
            },
            ...adminRoutes,
          ],
        },
        {
          path: "restaurant",
          children: restaurantRoutes,
        },
        {
          path: "staff",
          children: [
            {
              index: true,
              element: <Navigate to="login" replace />,
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
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

export default router;
