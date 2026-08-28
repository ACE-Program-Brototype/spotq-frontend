// src/app/router/staff.routes.tsx

import type { RouteObject } from "react-router-dom";

import StaffLoginPage from "@/features/auth/pages/StaffLoginPage";

export const staffRoutes: RouteObject[] = [
  {
    path: "login",
    Component: StaffLoginPage,
  },
];