// src/app/router/staff.routes.tsx

import type { RouteObject } from "react-router-dom";
import StaffDashboardPage from "@/features/auth/pages/StaffDashboardPage";
import StaffLoginPage from "@/features/auth/pages/StaffLoginPage";

export const staffRoutes: RouteObject[] = [
  {
    path: "login",
    Component: StaffLoginPage,
  },
  {
    path: "dashboard",
    Component: StaffDashboardPage,
  },
];
