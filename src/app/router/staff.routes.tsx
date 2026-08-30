// src/app/router/staff.routes.tsx

import type { RouteObject } from "react-router-dom";
import StaffDashboardPage from "@/features/auth/pages/StaffDashboardPage";
import StaffLoginPage from "@/features/auth/pages/StaffLoginPage";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";

const StaffAuthLayout = () => <AuthLayout redirectTo="/staff/dashboard" />;

const StaffProtectedLayout = () => (
  <ProtectedLayout allowedRoles={["RESTAURANT_STAFF"]} redirectTo="/staff/login" />
);

export const staffRoutes: RouteObject[] = [
  {
    Component: StaffAuthLayout,
    children: [
      {
        path: "login",
        Component: StaffLoginPage,
      },
    ],
  },
  {
    Component: StaffProtectedLayout,
    children: [
      {
        path: "dashboard",
        Component: StaffDashboardPage,
      },
    ],
  },
];
