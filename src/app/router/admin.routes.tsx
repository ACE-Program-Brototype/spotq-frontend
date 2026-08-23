import type { RouteObject } from "react-router-dom";

import AdminDashboardPage from "@/features/auth/pages/AdminDashboardPage";
import AdminForgotPasswordPage from "@/features/auth/pages/AdminForgotPasswordPage";
import AdminLoginPage from "@/features/auth/pages/AdminLoginPage";
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";

export const adminRoutes: RouteObject[] = [
  {
    element: <AuthLayout redirectTo="/admin/dashboard" />,
    children: [
      {
        path: "login",
        element: <AdminLoginPage />,
      },
      {
        path: "forgot-password",
        element: <AdminForgotPasswordPage />,
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
            element: <AdminDashboardPage />,
          },
        ],
      },
    ],
  },
];
