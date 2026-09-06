import type { RouteObject } from "react-router-dom";

import RestaurantDashboardPage from "@/features/auth/pages/RestaurantDashboardPage";
import RestaurantEmailVerificationPage from "@/features/auth/pages/RestaurantEmailVerification";
import RestaurantOnboardingPage from "@/features/auth/pages/RestaurantOnboardingPage";
import RestaurantTermsPage from "@/features/auth/pages/RestaurantTermsPage";
import OtpVerificationPage from "@/features/auth/pages/ResturantOtpVerification";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import RestaurantAdminLayout from "@/layouts/RestaurantAdminLayout";

const RestaurantAuthLayout = () => <AuthLayout redirectTo="/restaurant/dashboard" />;
const RestaurantProtectedLayout = () => (
  <ProtectedLayout
    allowedRoles={["RESTAURANT_ADMIN", "RESTAURANT_STAFF"]}
    redirectTo="/restaurant/email/verification"
  />
);

export const restaurantRoutes: RouteObject[] = [
  {
    path: "terms",
    Component: RestaurantTermsPage,
  },
  {
    path: "terms-and-conditions",
    Component: RestaurantTermsPage,
  },
  {
    Component: RestaurantAuthLayout,
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
        ],
      },
    ],
  },
];
