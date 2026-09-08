import type { RouteObject } from "react-router-dom";

import RestaurantDashboardPage from "@/features/auth/pages/RestaurantDashboardPage";
import RestaurantEmailVerificationPage from "@/features/auth/pages/RestaurantEmailVerification";
import RestaurantOnboardingPage from "@/features/auth/pages/RestaurantOnboardingPage";
import RestaurantStaffInvitationsPage from "@/features/auth/pages/RestaurantStaffInvitationsPage";
import RestaurantStaffPage from "@/features/auth/pages/RestaurantStaffPage";
import RestaurantTermsPage from "@/features/auth/pages/RestaurantTermsPage";
import OtpVerificationPage from "@/features/auth/pages/ResturantOtpVerification";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import RestaurantAdminLayout from "@/layouts/RestaurantAdminLayout";

const RestaurantAuthGuard = () => <AuthLayout redirectTo="/restaurant/dashboard" />;
const RestaurantProtectedLayout = () => (
  <ProtectedLayout
    allowedRoles={["RESTAURANT_ADMIN"]}
    redirectTo="/restaurant/email/verification"
  />
);

export const restaurantRoutes: RouteObject[] = [
  {
    path: "terms",
    Component: RestaurantTermsPage,
  },
  {
    Component: RestaurantAuthGuard,
    children: [
      {
        path: "email/verification",
        Component: RestaurantEmailVerificationPage,
      },
      {
        path: "otp/verification",
        Component: OtpVerificationPage,
      },
      {
        path: "onboarding",
        Component: RestaurantOnboardingPage,
      },
    ],
  },
  {
    Component: RestaurantProtectedLayout,
    children: [
      {
        Component: RestaurantAdminLayout,
        children: [
          {
            path: "dashboard",
            Component: RestaurantDashboardPage,
          },
          {
            path: "staff",
            Component: RestaurantStaffPage,
          },
          {
            path: "staff/invitations",
            Component: RestaurantStaffInvitationsPage,
          },
        ],
      },
    ],
  },
];
