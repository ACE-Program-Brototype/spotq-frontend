import type { RouteObject } from "react-router-dom";
import StaffForgotPasswordPage from "@/features/auth/pages/StaffForgotPasswordPage";
import StaffResetPasswordPage from "@/features/auth/pages/StaffResetPasswordPage";
import StaffVerifyOtpPage from "@/features/auth/pages/StaffVerifyOtpPage";
import AuthLayout from "@/layouts/AuthLayout";
import StaffAuthLayout from "@/layouts/StaffAuthLayout";

const StaffAuthGuard = () => <AuthLayout redirectTo="/staff/dashboard" />;

export const staffRoutes: RouteObject[] = [
  {
    Component: StaffAuthGuard,
    children: [
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
];
