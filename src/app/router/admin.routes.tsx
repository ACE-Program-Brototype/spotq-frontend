import type { RouteObject } from "react-router-dom";

import AdminDashboardPage from "@/features/auth/pages/AdminDashboardPage";
import AdminForgotPasswordPage from "@/features/auth/pages/AdminForgotPasswordPage";
import AdminLoginPage from "@/features/auth/pages/AdminLoginPage";
import AdminResetPasswordPage from "@/features/auth/pages/AdminResetPasswordPage";
import AdminVerifyOtpPage from "@/features/auth/pages/AdminVerifyOtpPage";
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";

const AdminAuthLayout = () => <AuthLayout redirectTo="/admin/dashboard" />;
const AdminProtectedLayout = () => (
  <ProtectedLayout allowedRoles={["ADMIN"]} redirectTo="/admin/login" />
);

export const adminRoutes: RouteObject[] = [
  {
    Component: AdminAuthLayout,
    children: [
      {
        path: "login",
        Component: AdminLoginPage,
      },
      {
        path: "forgot-password",
        Component: AdminForgotPasswordPage,
      },
      {
        path: "forgot-password/verify",
        Component: AdminVerifyOtpPage,
      },
      {
        path: "forgot-password/reset-password",
        Component: AdminResetPasswordPage,
      },
    ],
  },
  {
    Component: AdminProtectedLayout,
    children: [
      {
        Component: AdminLayout,
        children: [
          {
            path: "dashboard",
            Component: AdminDashboardPage,
          },
        ],
      },
    ],
  },
];
