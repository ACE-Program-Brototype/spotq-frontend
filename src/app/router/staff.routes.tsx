import type { RouteObject } from "react-router-dom";
import StaffForgotPasswordPage from "@/features/auth/pages/StaffForgotPasswordPage";
import StaffLoginPage from "@/features/auth/pages/StaffLoginPage";
import StaffResetPasswordPage from "@/features/auth/pages/StaffResetPasswordPage";
import StaffVerifyOtpPage from "@/features/auth/pages/StaffVerifyOtpPage";
import StaffDashboardPage from "@/features/dashboard/pages/StaffDashboardPage";
import EditStaffProfilePage from "@/features/profile/pages/EditStaffProfilePage";
import StaffProfilePage from "@/features/profile/pages/StaffProfilePage";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import StaffAuthLayout from "@/layouts/StaffAuthLayout";
import StaffLayout from "@/layouts/StaffLayout";

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
        Component: StaffLayout,
        children: [
          {
            path: "dashboard",
            Component: StaffDashboardPage,
          },
          {
            path: "profile",
            Component: StaffProfilePage,
          },
          {
            path: "profile/edit",
            Component: EditStaffProfilePage,
          },
        ],
      },
    ],
  },
];
