import type { RouteObject } from "react-router-dom";
import StaffDashboardPage from "@/features/auth/pages/StaffDashboardPage";
import StaffForgotPasswordPage from "@/features/auth/pages/StaffForgotPasswordPage";
import StaffLoginPage from "@/features/auth/pages/StaffLoginPage";
import StaffResetPasswordPage from "@/features/auth/pages/StaffResetPasswordPage";
import StaffVerifyOtpPage from "@/features/auth/pages/StaffVerifyOtpPage";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import RestaurantLayout from "@/layouts/RestaurantLayout";
import StaffAuthLayout from "@/layouts/StaffAuthLayout";

const StaffAuthGuard = () => <AuthLayout redirectTo="/staff/dashboard" />;

const StaffProtectedLayout = () => (
  <ProtectedLayout allowedRoles={["RESTAURANT_STAFF"]} redirectTo="/staff/login" />
);

export const staffRoutes: RouteObject[] = [
  {
    Component: StaffAuthGuard,
    children: [
      {
        path: "login",
        Component: StaffLoginPage,
      },
      {
        Component: StaffAuthLayout,
        children: [
          {
            path: "forgot-password",
            Component: StaffForgotPasswordPage,
          },
          {
            path: "forgot-password/verify",
            Component: StaffVerifyOtpPage,
          },
          {
            path: "forgot-password/reset-password",
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
        Component: RestaurantLayout,
        children: [
          {
            path: "dashboard",
            Component: StaffDashboardPage,
          },
        ],
      },
    ],
  },
];
