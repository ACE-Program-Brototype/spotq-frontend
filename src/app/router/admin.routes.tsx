import type { RouteObject } from "react-router-dom";

import AdminDashboardPage from "@/features/auth/pages/AdminDashboardPage";
import AdminForgotPasswordPage from "@/features/auth/pages/AdminForgotPasswordPage";
import AdminLoginPage from "@/features/auth/pages/AdminLoginPage";
import AdminResetPasswordPage from "@/features/auth/pages/AdminResetPasswordPage";
import AdminVerifyOtpPage from "@/features/auth/pages/AdminVerifyOtpPage";
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";

export const adminRoutes: RouteObject[] = [
  {
    element: <AuthLayout redirectTo="/admin/dashboard" />,
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
    element: <ProtectedLayout allowedRoles={["ADMIN"]} redirectTo="/admin/login" />,
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
