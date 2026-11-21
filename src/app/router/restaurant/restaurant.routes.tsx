import { lazy } from "react";
import { Navigate, type RouteObject, useParams } from "react-router-dom";

const RestaurantAnalyticsLayout = lazy(() => import("@/features/analytics/layouts/RestaurantAnalyticsLayout"));
const RestaurantAnalyticsOverviewPage = lazy(() => import("@/features/analytics/pages/RestaurantAnalyticsOverviewPage"));
const RestaurantMenuPerformancePage = lazy(() => import("@/features/analytics/pages/RestaurantMenuPerformancePage"));
const RestaurantRevenueAnalyticsPage = lazy(() => import("@/features/analytics/pages/RestaurantRevenueAnalyticsPage"));
const RestaurantEmailVerificationPage = lazy(() => import("@/features/auth/pages/restaurant/RestaurantEmailVerification"));
const OtpVerificationPage = lazy(() => import("@/features/auth/pages/restaurant/ResturantOtpVerification"));
const RestaurantDashboardPage = lazy(() => import("@/features/dashboard/pages/RestaurantDashboardPage"));
const RestaurantPrivacyPage = lazy(() => import("@/features/legal/pages/RestaurantPrivacyPage"));
const RestaurantTermsPage = lazy(() => import("@/features/legal/pages/RestaurantTermsPage"));
const CreateMenuItemPage = lazy(() => import("@/features/menu/pages/CreateMenuItemPage"));
const EditMenuItemPage = lazy(() => import("@/features/menu/pages/EditMenuItemPage"));
const RestaurantMenuAddonsPage = lazy(() => import("@/features/menu/pages/RestaurantMenuAddonsPage"));
const RestaurantMenuCategoriesPage = lazy(() => import("@/features/menu/pages/RestaurantMenuCategoriesPage"));
const RestaurantMenuItemDetailPage = lazy(() => import("@/features/menu/pages/RestaurantMenuItemDetailPage"));
const RestaurantMenuItemsPage = lazy(() => import("@/features/menu/pages/RestaurantMenuItemsPage"));
const BusinessInformationPage = lazy(() => import("@/features/onboard/pages/BusinessInformationPage"));
const DocumentsPage = lazy(() => import("@/features/onboard/pages/DocumentsPage"));
const LocationPage = lazy(() => import("@/features/onboard/pages/LocationPage"));
const ReviewPage = lazy(() => import("@/features/onboard/pages/ReviewPage"));
const VerificationStatusPage = lazy(() => import("@/features/onboard/pages/VerificationStatusPage"));
const RestaurantOrderDetailPage = lazy(() => import("@/features/orders/pages/RestaurantOrderDetailPage"));
const RestaurantOrdersPage = lazy(() => import("@/features/orders/pages/RestaurantOrdersPage"));
const RestaurantProfilePage = lazy(() => import("@/features/profile/pages/RestaurantProfilePage"));
const RestaurantStaffDetailPage = lazy(() => import("@/features/staff/pages/RestaurantStaffDetailPage"));
const RestaurantStaffInvitationsPage = lazy(() => import("@/features/staff/pages/RestaurantStaffInvitationsPage"));
const RestaurantStaffPage = lazy(() => import("@/features/staff/pages/RestaurantStaffPage"));
const BillingHistoryPage = lazy(() => import("@/features/subscription/pages/BillingHistoryPage"));
const RestaurantSubscriptionPage = lazy(() => import("@/features/subscription/pages/RestaurantSubscriptionPage"));
const SubscriptionFailurePage = lazy(() => import("@/features/subscription/pages/SubscriptionFailurePage"));
const SubscriptionSuccessPage = lazy(() => import("@/features/subscription/pages/SubscriptionSuccessPage"));
const CreateTablePage = lazy(() => import("@/features/tables/pages/CreateTablePage"));
const RestaurantTableDetailPage = lazy(() => import("@/features/tables/pages/RestaurantTableDetailPage"));
const RestaurantTablePage = lazy(() => import("@/features/tables/pages/RestaurantTablePage"));
const RestaurantTableSectionsPage = lazy(() => import("@/features/tables/pages/RestaurantTableSectionsPage"));
const RestaurantTransactionsPage = lazy(() =>
  import("@/features/transactions/pages/RestaurantTransactionsPage").then((m) => ({
    default: m.RestaurantTransactionsPage,
  })),
);
const RestaurantWalletPage = lazy(() => import("@/features/wallet/pages/RestaurantWalletPage"));

import AuthLayout from "@/layouts/AuthLayout";
import OnboardLayout from "@/layouts/OnboardLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import RestaurantAdminLayout from "@/layouts/RestaurantAdminLayout";
import VerificationStatusLayout from "@/layouts/VerificationStatusLayout";
import { RESTAURANT_ROUTE_PATHS, RESTAURANT_ROUTES } from "./restaurant.routes.constants";

const RestaurantAuthGuard = () => <AuthLayout redirectTo={RESTAURANT_ROUTES.DASHBOARD} />;
const RestaurantProtectedLayout = () => (
  <ProtectedLayout
    allowedRoles={["RESTAURANT_ADMIN", "RESTAURANT_OWNER"]}
    redirectTo={RESTAURANT_ROUTES.LOGIN}
  />
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
            path: RESTAURANT_ROUTE_PATHS.ANALYTICS.ROOT,
            Component: RestaurantAnalyticsLayout,
            children: [
              {
                index: true,
                Component: RestaurantAnalyticsOverviewPage,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.ANALYTICS.REVENUE,
                Component: RestaurantRevenueAnalyticsPage,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.ANALYTICS.MENU,
                Component: RestaurantMenuPerformancePage,
              },
            ],
          },
          {
            path: RESTAURANT_ROUTE_PATHS.ORDERS.ROOT,
            children: [
              {
                index: true,
                Component: RestaurantOrdersPage,
              },
              {
                path: RESTAURANT_ROUTE_PATHS.ORDERS.DETAIL,
                Component: RestaurantOrderDetailPage,
              },
            ],
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
            path: RESTAURANT_ROUTE_PATHS.SETTINGS_BILLING_HISTORY,
            Component: BillingHistoryPage,
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
              {
                path: RESTAURANT_ROUTE_PATHS.TABLE.SECTIONS,
                Component: RestaurantTableSectionsPage,
              },
              { path: RESTAURANT_ROUTE_PATHS.TABLE.CREATE, Component: CreateTablePage },
              { path: RESTAURANT_ROUTE_PATHS.TABLE.VIEW, Component: RestaurantTableDetailPage },
            ],
          },
          {
            path: RESTAURANT_ROUTE_PATHS.WALLET.ROOT,
            Component: RestaurantWalletPage,
          },
          {
            path: RESTAURANT_ROUTE_PATHS.FINANCE.TRANSACTIONS,
            Component: RestaurantTransactionsPage,
          },
          {
            path: RESTAURANT_ROUTE_PATHS.PAYMENTS_HISTORY,
            element: <Navigate to={RESTAURANT_ROUTES.FINANCE.TRANSACTIONS} replace />,
          },
          {
            path: RESTAURANT_ROUTE_PATHS.TRANSACTIONS,
            element: <Navigate to={RESTAURANT_ROUTES.FINANCE.TRANSACTIONS} replace />,
          },
        ],
      },
    ],
  },
];
