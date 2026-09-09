import type { RouteObject } from "react-router-dom";

import RestaurantEmailVerificationPage from "@/features/auth/pages/RestaurantEmailVerification";
import RestaurantOnboardingPage from "@/features/auth/pages/RestaurantOnboardingPage";
import OtpVerificationPage from "@/features/auth/pages/ResturantOtpVerification";
import RestaurantDashboardPage from "@/features/dashboard/pages/RestaurantDashboardPage";
import RestaurantPrivacyPage from "@/features/legal/pages/RestaurantPrivacyPage";
import RestaurantTermsPage from "@/features/legal/pages/RestaurantTermsPage";
import RestaurantStaffInvitationsPage from "@/features/staff/pages/RestaurantStaffInvitationsPage";
import RestaurantStaffPage from "@/features/staff/pages/RestaurantStaffPage";
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
    path: "privacy",
    Component: RestaurantPrivacyPage,
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
