import type { RouteObject } from "react-router-dom";

import RestaurantDashboardPage from "@/features/auth/pages/RestaurantDashboardPage";
import RestaurantEmailVerificationPage from "@/features/auth/pages/RestaurantEmailVerification";
import RestaurantOnboardingPage from "@/features/auth/pages/RestaurantOnboardingPage";
import OtpVerificationPage from "@/features/auth/pages/ResturantOtpVerification";
import AuthLayout from "@/layouts/AuthLayout";

const RestaurantAuthLayout = () => <AuthLayout redirectTo="/restaurant/dashboard" />;

export const restaurantRoutes: RouteObject[] = [
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
      {
        path: "dashboard",
        Component: RestaurantDashboardPage,
      },
    ],
  },
];
