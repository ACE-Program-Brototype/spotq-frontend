import { type RouteObject } from "react-router-dom";
import RestaurantDashboardPage from "@/features/auth/pages/RestaurantDashboardPage";
import RestaurantEmailVerificationPage from "@/features/auth/pages/RestaurantEmailVerification";
import RestaurantTermsPage from "@/features/auth/pages/RestaurantTermsPage";
import OtpVerificationPage from "@/features/auth/pages/ResturantOtpVerification";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import RestaurantAdminLayout from "@/layouts/RestaurantAdminLayout";
import OnboardLayout from "@/layouts/OnboardLayout";

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
          // {
          //   index: true,
          //   Component: () => (
          //     <Navigate to="business-information" replace />
          //   ),
          // },
          // {
          //   path: "business-information",
          //   Component: BusinessInformationPage,
          // },
          // {
          //   path: "documents",
          //   Component: DocumentsPage,
          // },
          // {
          //   path: "location",
          //   Component: LocationPage,
          // },
          // {
          //   path: "review",
          //   Component: ReviewPage,
          // },
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
