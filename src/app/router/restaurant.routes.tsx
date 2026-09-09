import { Navigate, type RouteObject } from "react-router-dom";
import RestaurantDashboardPage from "@/features/auth/pages/RestaurantDashboardPage";
import RestaurantEmailVerificationPage from "@/features/auth/pages/RestaurantEmailVerification";
import RestaurantTermsPage from "@/features/auth/pages/RestaurantTermsPage";
import OtpVerificationPage from "@/features/auth/pages/ResturantOtpVerification";
import BusinessInformationPage from "@/features/onboard/pages/BusinessInformationPage";
import DocumentsPage from "@/features/onboard/pages/DocumentsPage";
import AuthLayout from "@/layouts/AuthLayout";
import OnboardLayout from "@/layouts/OnboardLayout";
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
        Component: OnboardLayout,
        children: [
          {
            index: true,
            Component: () => <Navigate to="business-information" replace />,
          },
          {
            path: "business-information",
            Component: BusinessInformationPage,
          },
          {
            path: "documents",
            Component: DocumentsPage,
          },
        ],
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
