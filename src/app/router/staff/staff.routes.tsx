import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const StaffForgotPasswordPage = lazy(() => import("@/features/auth/pages/staff/StaffForgotPasswordPage"));
const StaffLoginPage = lazy(() => import("@/features/auth/pages/staff/StaffLoginPage"));
const StaffResetPasswordPage = lazy(() => import("@/features/auth/pages/staff/StaffResetPasswordPage"));
const StaffVerifyOtpPage = lazy(() => import("@/features/auth/pages/staff/StaffVerifyOtpPage"));
const StaffDashboardPage = lazy(() => import("@/features/dashboard/pages/StaffDashboardPage"));
const StaffMenuAddonsPage = lazy(() => import("@/features/menu/pages/StaffMenuAddonsPage"));
const StaffMenuItemsPage = lazy(() => import("@/features/menu/pages/StaffMenuItemsPage"));
const StaffOrderDetailPage = lazy(() => import("@/features/orders/pages/StaffOrderDetailPage"));
const StaffOrdersPage = lazy(() => import("@/features/orders/pages/StaffOrdersPage"));
const EditStaffProfilePage = lazy(() => import("@/features/profile/pages/EditStaffProfilePage"));
const StaffProfilePage = lazy(() => import("@/features/profile/pages/StaffProfilePage"));
const StaffQueuePage = lazy(() => import("@/features/queue/pages/StaffQueuePage"));
const StaffTablePage = lazy(() => import("@/features/tables/pages/StaffTablePage"));

import AuthLayout from "@/layouts/AuthLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import StaffAuthLayout from "@/layouts/StaffAuthLayout";
import StaffLayout from "@/layouts/StaffLayout";
import { STAFF_ROUTE_PATHS, STAFF_ROUTES } from "./staff.routes.constants";

const StaffAuthGuard = () => <AuthLayout redirectTo={STAFF_ROUTES.DASHBOARD} />;
const StaffProtectedLayout = () => (
  <ProtectedLayout allowedRoles={["STAFF"]} redirectTo={STAFF_ROUTES.LOGIN} />
);

export const staffRoutes: RouteObject[] = [
  {
    Component: StaffAuthGuard,
    children: [
      {
        path: STAFF_ROUTE_PATHS.AUTH.LOGIN,
        Component: StaffLoginPage,
      },
      {
        Component: StaffAuthLayout,
        children: [
          {
            path: STAFF_ROUTE_PATHS.AUTH.FORGOT_PASSWORD,
            Component: StaffForgotPasswordPage,
          },
          {
            path: STAFF_ROUTE_PATHS.AUTH.FORGOT_PASSWORD_VERIFY,
            Component: StaffVerifyOtpPage,
          },
          {
            path: STAFF_ROUTE_PATHS.AUTH.FORGOT_PASSWORD_RESET,
            Component: StaffResetPasswordPage,
          },
        ],
      },
    ],
  },
  {
    Component: StaffProtectedLayout,
    children: [
      {
        Component: StaffLayout,
        children: [
          {
            path: STAFF_ROUTE_PATHS.DASHBOARD,
            Component: StaffDashboardPage,
          },
          {
            path: STAFF_ROUTE_PATHS.PROFILE.ROOT,
            Component: StaffProfilePage,
          },
          {
            path: STAFF_ROUTE_PATHS.PROFILE.EDIT,
            Component: EditStaffProfilePage,
          },
          {
            path: STAFF_ROUTE_PATHS.MENU.ROOT,
            Component: StaffMenuItemsPage,
          },
          {
            path: STAFF_ROUTE_PATHS.MENU.ITEMS,
            Component: StaffMenuItemsPage,
          },
          {
            path: STAFF_ROUTE_PATHS.QUEUE,
            Component: StaffQueuePage,
          },
          {
            path: STAFF_ROUTE_PATHS.TABLES,
            Component: StaffTablePage,
          },
          {
            path: STAFF_ROUTE_PATHS.ORDERS,
            Component: StaffOrdersPage,
          },
          {
            path: STAFF_ROUTE_PATHS.ORDER_DETAILS,
            Component: StaffOrderDetailPage,
          },
          {
            path: "menu/addons",
            Component: StaffMenuAddonsPage,
          },
        ],
      },
    ],
  },
];
