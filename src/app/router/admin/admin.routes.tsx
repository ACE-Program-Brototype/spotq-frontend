import type { RouteObject } from "react-router-dom";

import AdminForgotPasswordPage from "@/features/auth/pages/admin/AdminForgotPasswordPage";
import AdminLoginPage from "@/features/auth/pages/admin/AdminLoginPage";
import AdminResetPasswordPage from "@/features/auth/pages/admin/AdminResetPasswordPage";
import AdminVerifyOtpPage from "@/features/auth/pages/admin/AdminVerifyOtpPage";
import AdminCustomerDetailsPage from "@/features/customers/pages/AdminCustomerDetailsPage";
import AdminCustomersPage from "@/features/customers/pages/AdminCustomersPage";
import AdminDashboardPage from "@/features/dashboard/pages/AdminDashboardPage";
import AdminRestaurantApplicationReviewPage from "@/features/restaurants/pages/AdminRestaurantApplicationReviewPage";
import AdminRestaurantApplicationsPage from "@/features/restaurants/pages/AdminRestaurantApplicationsPage";
import AdminRestaurantDetailsPage from "@/features/restaurants/pages/AdminRestaurantDetailsPage";
import AdminRestaurantsPage from "@/features/restaurants/pages/AdminRestaurantsPage";
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { ADMIN_ROUTE_PATHS, ADMIN_ROUTES } from "./admin.routes.constants";

const AdminAuthLayout = () => <AuthLayout redirectTo={ADMIN_ROUTES.DASHBOARD} />;
const AdminProtectedLayout = () => (
  <ProtectedLayout allowedRoles={["ADMIN"]} redirectTo={ADMIN_ROUTES.LOGIN} />
);

export const adminRoutes: RouteObject[] = [
  {
    Component: AdminAuthLayout,
    children: [
      {
        path: ADMIN_ROUTE_PATHS.AUTH.LOGIN,
        Component: AdminLoginPage,
      },
      {
        path: ADMIN_ROUTE_PATHS.AUTH.FORGOT_PASSWORD,
        Component: AdminForgotPasswordPage,
      },
      {
        path: ADMIN_ROUTE_PATHS.AUTH.FORGOT_PASSWORD_VERIFY,
        Component: AdminVerifyOtpPage,
      },
      {
        path: ADMIN_ROUTE_PATHS.AUTH.FORGOT_PASSWORD_RESET,
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
            path: ADMIN_ROUTE_PATHS.DASHBOARD,
            Component: AdminDashboardPage,
          },
          {
            path: ADMIN_ROUTE_PATHS.RESTAURANTS,
            Component: AdminRestaurantsPage,
          },
          {
            path: ADMIN_ROUTE_PATHS.RESTAURANTS_MANAGEMENT,
            Component: AdminRestaurantsPage,
          },
          {
            path: ADMIN_ROUTE_PATHS.RESTAURANTS_ONBOARDING,
            Component: AdminRestaurantApplicationsPage,
          },
          {
            path: ADMIN_ROUTE_PATHS.RESTAURANTS_ONBOARDING_DETAIL,
            Component: AdminRestaurantApplicationReviewPage,
          },
          {
            path: ADMIN_ROUTE_PATHS.RESTAURANT_DETAIL,
            Component: AdminRestaurantDetailsPage,
          },
          {
            path: ADMIN_ROUTE_PATHS.CUSTOMERS,
            Component: AdminCustomersPage,
          },
          {
            path: ADMIN_ROUTE_PATHS.CUSTOMER_DETAIL,
            Component: AdminCustomerDetailsPage,
          },
        ],
      },
    ],
  },
];
