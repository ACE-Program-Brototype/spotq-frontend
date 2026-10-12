import { createBrowserRouter, Navigate } from "react-router-dom";
import StaffAcceptInvitationPage from "@/features/auth/pages/StaffAcceptInvitationPage";
import RootLayout from "@/layouts/RootLayout";
import NotFoundPage from "../pages/NotFoundPage";
import { adminRoutes } from "./admin/admin.routes";
import { customerRoutes } from "./customer/customer.routes";
import { restaurantRoutes } from "./restaurant/restaurant.routes";
import {
  ADMIN_ROUTES,
  RESTAURANT_ROUTES,
  ROOT_ROUTE_PATHS,
  STAFF_ROUTES,
} from "./routes.constants";
import { staffRoutes } from "./staff/staff.routes";

const router = createBrowserRouter(
  [
    {
      Component: RootLayout,
      children: [
        {
          path: ROOT_ROUTE_PATHS.SUBSCRIPTION,
          element: <Navigate to={RESTAURANT_ROUTES.SUBSCRIPTION} replace />,
        },
        ...customerRoutes,
        {
          path: ROOT_ROUTE_PATHS.INVITATIONS.ROOT,
          children: [
            {
              path: ROOT_ROUTE_PATHS.INVITATIONS.ACCEPT,
              Component: StaffAcceptInvitationPage,
            },
          ],
        },
        {
          path: ROOT_ROUTE_PATHS.ADMIN,
          children: [
            {
              index: true,
              element: <Navigate to={ADMIN_ROUTES.LOGIN} replace />,
            },
            ...adminRoutes,
          ],
        },
        {
          path: ROOT_ROUTE_PATHS.RESTAURANT,
          children: [
            {
              index: true,
              element: <Navigate to={RESTAURANT_ROUTES.LOGIN} replace />,
            },
            ...restaurantRoutes,
          ],
        },
        {
          path: ROOT_ROUTE_PATHS.STAFF,
          children: [
            {
              index: true,
              element: <Navigate to={STAFF_ROUTES.LOGIN} replace />,
            },
            ...staffRoutes,
          ],
        },
        {
          path: ROOT_ROUTE_PATHS.CATCH_ALL,
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
