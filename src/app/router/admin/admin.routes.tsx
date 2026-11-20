import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

const AdminForgotPasswordPage = lazy(() => import("@/features/auth/pages/admin/AdminForgotPasswordPage"));
const AdminLoginPage = lazy(() => import("@/features/auth/pages/admin/AdminLoginPage"));
const AdminResetPasswordPage = lazy(() => import("@/features/auth/pages/admin/AdminResetPasswordPage"));
const AdminVerifyOtpPage = lazy(() => import("@/features/auth/pages/admin/AdminVerifyOtpPage"));
const ComingSoonPage = lazy(() => import("@/components/common/ComingSoonPage"));
const AdminCustomerDetailsPage = lazy(() => import("@/features/customers/pages/AdminCustomerDetailsPage"));
const AdminCustomersPage = lazy(() => import("@/features/customers/pages/AdminCustomersPage"));
const AdminDashboardPage = lazy(() => import("@/features/dashboard/pages/AdminDashboardPage"));
const PlatformFinancePage = lazy(() => import("@/features/finance/pages/PlatformFinancePage"));
const AdminOrdersPage = lazy(() => import("@/features/orders/pages/AdminOrdersPage"));
const AdminRestaurantApplicationReviewPage = lazy(
  () => import("@/features/restaurants/pages/AdminRestaurantApplicationReviewPage"),
);
const AdminRestaurantApplicationsPage = lazy(
  () => import("@/features/restaurants/pages/AdminRestaurantApplicationsPage"),
);
const AdminRestaurantDetailsPage = lazy(() => import("@/features/restaurants/pages/AdminRestaurantDetailsPage"));
const AdminRestaurantsPage = lazy(() => import("@/features/restaurants/pages/AdminRestaurantsPage"));
const AdminSubscriberDetailsPage = lazy(() => import("@/features/subscribers/pages/AdminSubscriberDetailsPage"));
const AdminSubscribersPage = lazy(() => import("@/features/subscribers/pages/AdminSubscribersPage"));

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
          {
            path: ADMIN_ROUTE_PATHS.SUBSCRIBERS,
            Component: AdminSubscribersPage,
          },
          {
            path: ADMIN_ROUTE_PATHS.SUBSCRIBER_DETAIL,
            Component: AdminSubscriberDetailsPage,
          },
          { path: ADMIN_ROUTE_PATHS.FINANCE, Component: PlatformFinancePage },
          { path: ADMIN_ROUTE_PATHS.ORDERS, Component: AdminOrdersPage },
          { path: ADMIN_ROUTE_PATHS.CAMPAIGNS, Component: ComingSoonPage },
          { path: ADMIN_ROUTE_PATHS.COUPONS, Component: ComingSoonPage },
          {
            path: ADMIN_ROUTE_PATHS.PAYMENTS.ORDERS,
            element: <Navigate to={ADMIN_ROUTES.ORDERS} replace />,
          },
        ],
      },
    ],
  },
];
