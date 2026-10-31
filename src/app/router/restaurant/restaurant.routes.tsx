import { Navigate, type RouteObject, useParams } from "react-router-dom";

import RestaurantEmailVerificationPage from "@/features/auth/pages/RestaurantEmailVerification";
import OtpVerificationPage from "@/features/auth/pages/ResturantOtpVerification";
import RestaurantDashboardPage from "@/features/dashboard/pages/RestaurantDashboardPage";
import RestaurantPrivacyPage from "@/features/legal/pages/RestaurantPrivacyPage";
import RestaurantTermsPage from "@/features/legal/pages/RestaurantTermsPage";
import CreateMenuItemPage from "@/features/menu/pages/CreateMenuItemPage";
import EditMenuItemPage from "@/features/menu/pages/EditMenuItemPage";
import RestaurantMenuAddonsPage from "@/features/menu/pages/RestaurantMenuAddonsPage";
import RestaurantMenuCategoriesPage from "@/features/menu/pages/RestaurantMenuCategoriesPage";
import RestaurantMenuItemDetailPage from "@/features/menu/pages/RestaurantMenuItemDetailPage";
import RestaurantMenuItemsPage from "@/features/menu/pages/RestaurantMenuItemsPage";
import BusinessInformationPage from "@/features/onboard/pages/BusinessInformationPage";
import DocumentsPage from "@/features/onboard/pages/DocumentsPage";
import LocationPage from "@/features/onboard/pages/LocationPage";
import ReviewPage from "@/features/onboard/pages/ReviewPage";
import VerificationStatusPage from "@/features/onboard/pages/VerificationStatusPage";
import RestaurantProfilePage from "@/features/profile/pages/RestaurantProfilePage";
import RestaurantStaffDetailPage from "@/features/staff/pages/RestaurantStaffDetailPage";
import RestaurantStaffInvitationsPage from "@/features/staff/pages/RestaurantStaffInvitationsPage";
import RestaurantStaffPage from "@/features/staff/pages/RestaurantStaffPage";
import RestaurantSubscriptionPage from "@/features/subscription/pages/RestaurantSubscriptionPage";
import SubscriptionFailurePage from "@/features/subscription/pages/SubscriptionFailurePage";
import SubscriptionSuccessPage from "@/features/subscription/pages/SubscriptionSuccessPage";
import CreateTablePage from "@/features/tables/pages/CreateTablePage";
import RestaurantTableDetailPage from "@/features/tables/pages/RestaurantTableDetailPage";
import RestaurantTablePage from "@/features/tables/pages/RestaurantTablePage";
import AuthLayout from "@/layouts/AuthLayout";
import OnboardLayout from "@/layouts/OnboardLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import RestaurantAdminLayout from "@/layouts/RestaurantAdminLayout";
import VerificationStatusLayout from "@/layouts/VerificationStatusLayout";
import { RESTAURANT_ROUTE_PATHS, RESTAURANT_ROUTES } from "./restaurant.routes.constants";

const RestaurantAuthGuard = () => <AuthLayout redirectTo={RESTAURANT_ROUTES.DASHBOARD} />;
const RestaurantProtectedLayout = () => (
  <ProtectedLayout allowedRoles={["RESTAURANT_ADMIN"]} redirectTo={RESTAURANT_ROUTES.LOGIN} />
);

const StaffEditRedirect = () => {
  const { staffId } = useParams();
  return <Navigate to={RESTAURANT_ROUTES.STAFF.DETAIL(staffId ?? "")} replace />;
};

export const restaurantRoutes: RouteObject[] = [
  {
    path: RESTAURANT_ROUTE_PATHS.TERMS,
    Component: RestaurantTermsPage,
  },
  {
    path: RESTAURANT_ROUTE_PATHS.PRIVACY,
    Component: RestaurantPrivacyPage,
  },
  {
    Component: RestaurantAuthGuard,
    children: [
      {
        path: RESTAURANT_ROUTE_PATHS.AUTH.LOGIN,
        Component: RestaurantEmailVerificationPage,
      },
      {
        path: RESTAURANT_ROUTE_PATHS.AUTH.VERIFY,
        Component: OtpVerificationPage,
      },
    ],
  },
  {
    Component: RestaurantProtectedLayout,
    children: [
      {
        path: RESTAURANT_ROUTE_PATHS.SUBSCRIPTION.INDEX,
        Component: RestaurantSubscriptionPage,
      },
      {
        path: RESTAURANT_ROUTE_PATHS.SUBSCRIPTION.SUCCESS,
        Component: SubscriptionSuccessPage,
      },
      {
        path: RESTAURANT_ROUTE_PATHS.SUBSCRIPTION.FAILURE,
        Component: SubscriptionFailurePage,
      },
      {
        path: RESTAURANT_ROUTE_PATHS.ONBOARDING.ROOT,
        children: [
          {
            index: true,
            element: <Navigate to={RESTAURANT_ROUTES.ONBOARDING.BUSINESS_INFORMATION} replace />,
          },
          {
            Component: VerificationStatusLayout,
            children: [
              {
                path: RESTAURANT_ROUTE_PATHS.ONBOARDING.STATUS,
                Component: VerificationStatusPage,
              },
            ],
          },
          {
            Component: OnboardLayout,
            children: [
              {
                path: RESTAURANT_ROUTE_PATHS.ONBOARDING.BUSINESS_INFORMATION,
                Component: BusinessInformationPage,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.ONBOARDING.DOCUMENTS,
                Component: DocumentsPage,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.ONBOARDING.LOCATION,
                Component: LocationPage,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.ONBOARDING.REVIEW,
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
            path: RESTAURANT_ROUTE_PATHS.DASHBOARD,
            Component: RestaurantDashboardPage,
          },
          {
            path: RESTAURANT_ROUTE_PATHS.PROFILE,
            Component: RestaurantProfilePage,
          },
          {
            path: RESTAURANT_ROUTE_PATHS.SETTINGS_ACCOUNT,
            Component: RestaurantProfilePage,
          },
          {
            path: RESTAURANT_ROUTE_PATHS.STAFF.ROOT,
            children: [
              {
                index: true,
                Component: RestaurantStaffPage,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.STAFF.INVITATIONS,
                Component: RestaurantStaffInvitationsPage,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.STAFF.DETAIL,
                Component: RestaurantStaffDetailPage,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.STAFF.EDIT,
                Component: StaffEditRedirect,
              },
            ],
          },
          {
            path: RESTAURANT_ROUTE_PATHS.MENU.ROOT,
            children: [
              {
                index: true,
                element: <Navigate to={RESTAURANT_ROUTES.MENU.ITEMS} replace />,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.MENU.ITEMS,
                Component: RestaurantMenuItemsPage,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.MENU.CREATE,
                Component: CreateMenuItemPage,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.MENU.DETAIL,
                Component: RestaurantMenuItemDetailPage,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.MENU.EDIT,
                Component: EditMenuItemPage,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.MENU.CATEGORIES,
                Component: RestaurantMenuCategoriesPage,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.MENU.MODIFIERS,
                Component: RestaurantMenuAddonsPage,
              },
            ],
          },
          {
            path: RESTAURANT_ROUTE_PATHS.TABLE.ROOT,
            children: [
              { index: true, Component: RestaurantTablePage },
              { path: RESTAURANT_ROUTE_PATHS.TABLE.CREATE, Component: CreateTablePage },
              { path: RESTAURANT_ROUTE_PATHS.TABLE.VIEW, Component: RestaurantTableDetailPage },
            ],
          },
        ],
      },
    ],
  },
];
