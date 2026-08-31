import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivacyPolicyPage from "@/features/demo/pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "@/features/demo/pages/TermsAndConditionsPage";
import AuthLayout from "@/layouts/AuthLayout";
import DemoLayout from "@/layouts/DemoLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import RootLayout from "@/layouts/RootLayout";

import NotFoundPage from "../pages/NotFoundPage";
import { adminRoutes } from "./admin.routes";
import { authRoutes } from "./auth.routes";
import { demoRoutes } from "./demo.routes";
import { restaurantRoutes } from "./restaurant.routes";
import { staffRoutes } from "./staff.routes";

const CustomerProtectedLayout = () => (
  <ProtectedLayout allowedRoles={["CUSTOMER"]} redirectTo="/login" />
);

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
        Component: CustomerProtectedLayout,
        children: [
          {
            Component: DemoLayout,
            children: demoRoutes,
          },
        ],
      },
      {
        path: "/terms-and-conditions",
        Component: TermsAndConditionsPage,
      },
      {
        path: "/privacy-policy",
        Component: PrivacyPolicyPage,
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
