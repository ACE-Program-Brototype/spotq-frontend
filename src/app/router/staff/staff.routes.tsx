import type { RouteObject } from "react-router-dom";
import StaffForgotPasswordPage from "@/features/auth/pages/StaffForgotPasswordPage";
import StaffLoginPage from "@/features/auth/pages/StaffLoginPage";
import StaffResetPasswordPage from "@/features/auth/pages/StaffResetPasswordPage";
import StaffVerifyOtpPage from "@/features/auth/pages/StaffVerifyOtpPage";
import StaffDashboardPage from "@/features/dashboard/pages/StaffDashboardPage";
import StaffMenuItemsPage from "@/features/menu/pages/StaffMenuItemsPage";
import EditStaffProfilePage from "@/features/profile/pages/EditStaffProfilePage";
import StaffProfilePage from "@/features/profile/pages/StaffProfilePage";
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
        ],
      },
    ],
  },
];
