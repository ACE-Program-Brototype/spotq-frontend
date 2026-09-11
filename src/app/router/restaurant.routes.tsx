import { Navigate, type RouteObject } from "react-router-dom";
import RestaurantDashboardPage from "@/features/auth/pages/RestaurantDashboardPage";
import RestaurantEmailVerificationPage from "@/features/auth/pages/RestaurantEmailVerification";
import RestaurantTermsPage from "@/features/auth/pages/RestaurantTermsPage";
import OtpVerificationPage from "@/features/auth/pages/ResturantOtpVerification";
import BusinessInformationPage from "@/features/onboard/pages/BusinessInformationPage";
import DocumentsPage from "@/features/onboard/pages/DocumentsPage";
import LocationPage from "@/features/onboard/pages/LocationPage";
import ReviewPage from "@/features/onboard/pages/ReviewPage";
import VerificationStatusPage from "@/features/onboard/pages/VerificationStatusPage";
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

const VerificationStatusLayout = () => (
  <div className="min-h-screen bg-neutral-100">
    <header className="border-b border-neutral-200 bg-white">
      <div className="flex h-16 items-center px-6 sm:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <span className="text-lg">
            <span className="font-bold text-neutral-900">SpotQ</span>{" "}
            <span className="text-neutral-500">for restaurants</span>
          </span>
        </div>
      </div>
    </header>

    <div className="mx-auto flex max-w-4xl justify-center px-6 py-10 sm:px-10">
      <VerificationStatusPage />
    </div>
  </div>
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
    ],
  },
  {
    Component: RestaurantProtectedLayout,
    children: [
      {
        path: "onboarding",
        children: [
          {
            index: true,
            Component: () => <Navigate to="business-information" replace />,
          },
          {
            path: "status",
            Component: VerificationStatusLayout,
          },
          {
            Component: OnboardLayout,
            children: [
              {
                path: "business-information",
                Component: BusinessInformationPage,
              },
              {
                path: "documents",
                Component: DocumentsPage,
              },
              {
                path: "location",
                Component: LocationPage,
              },
              {
                path: "review",
                Component: ReviewPage,
              },
            ],
          },
        ],
      },
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
