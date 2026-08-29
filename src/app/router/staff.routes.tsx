// src/app/router/staff.routes.tsx

import type { RouteObject } from "react-router-dom";
import StaffDashboardPage from "@/features/auth/pages/StaffDashboardPage";
import StaffLoginPage from "@/features/auth/pages/StaffLoginPage";
import ProtectedLayout from "@/layouts/ProtectedLayout";

const StaffProtectedLayout = () => (
  <ProtectedLayout allowedRoles={["RESTAURANT_STAFF"]} redirectTo="/staff/login" />
);

export const staffRoutes: RouteObject[] = [
  {
    path: "login",
    Component: StaffLoginPage,
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
