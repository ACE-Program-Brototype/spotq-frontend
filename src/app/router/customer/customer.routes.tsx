import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

const ForgotPasswordPage = lazy(() => import("@/features/auth/pages/customer/ForgotPasswordPage"));
const LoginPage = lazy(() => import("@/features/auth/pages/customer/LoginPage"));
const OtpVerificationPage = lazy(() => import("@/features/auth/pages/customer/OtpVerificationPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/customer/RegisterPage"));
const ResetPasswordPage = lazy(() => import("@/features/auth/pages/customer/ResetPasswordPage"));
const VerifyOtpPage = lazy(() => import("@/features/auth/pages/customer/VerifyOtpPage"));
const CartPage = lazy(() => import("@/features/cart/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/features/checkout/pages/CheckoutPage"));
const AboutPage = lazy(() => import("@/features/demo/pages/AboutPage"));
const LandingPage = lazy(() => import("@/features/landing/pages/LandingPage"));
const CookiePolicyPage = lazy(() => import("@/features/legal/pages/CookiePolicyPage"));
const PrivacyPolicyPage = lazy(() => import("@/features/legal/pages/PrivacyPolicyPage"));
const TermsAndConditionsPage = lazy(() => import("@/features/legal/pages/TermsAndConditionsPage"));
const CustomerOrderDetailPage = lazy(() => import("@/features/orders/pages/CustomerOrderDetailPage"));
const OrderHistoryPage = lazy(() => import("@/features/orders/pages/OrderHistoryPage"));
const OrderReceiptPage = lazy(() => import("@/features/orders/pages/OrderReceiptPage"));
const CustomerPaymentHistoryPage = lazy(() => import("@/features/payments/pages/CustomerPaymentHistoryPage"));
const EditProfilePage = lazy(() => import("@/features/profile/pages/EditProfilePage"));
const ViewProfilePage = lazy(() => import("@/features/profile/pages/ViewProfilePage"));
const CustomerQueueTrackerPage = lazy(() => import("@/features/queue/pages/CustomerQueueTrackerPage"));
const CustomerRestaurantDetailsPage = lazy(() => import("@/features/restaurants/pages/CustomerRestaurantDetailsPage"));
const HomePage = lazy(() => import("@/features/restaurants/pages/HomePage"));

import AuthLayout from "@/layouts/AuthLayout";
import CustomerLayout from "@/layouts/CustomerLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { CUSTOMER_ROUTE_PATHS, CUSTOMER_ROUTES } from "./customer.routes.constants";

const CustomerProtectedLayout = () => (
  <ProtectedLayout allowedRoles={["CUSTOMER"]} redirectTo={CUSTOMER_ROUTES.AUTH.LOGIN} />
);

export const customerRoutes: RouteObject[] = [
  {
    path: CUSTOMER_ROUTE_PATHS.LANDING,
    Component: LandingPage,
  },
  {
    Component: CustomerLayout,
    children: [
      {
        path: CUSTOMER_ROUTE_PATHS.HOME,
        Component: HomePage,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.RESTAURANTS,
        element: <Navigate to={CUSTOMER_ROUTES.HOME} replace />,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.RESTAURANT_DETAIL,
        Component: CustomerRestaurantDetailsPage,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.ABOUT,
        Component: AboutPage,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.CART,
        Component: CartPage,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.PROFILE.ROOT,
        Component: CustomerProtectedLayout,
        children: [
          {
            index: true,
            Component: ViewProfilePage,
          },
          {
            path: CUSTOMER_ROUTE_PATHS.PROFILE.EDIT,
            Component: EditProfilePage,
          },
          {
            path: CUSTOMER_ROUTE_PATHS.PROFILE.PAYMENTS,
            Component: CustomerPaymentHistoryPage,
          },
        ],
      },
      {
        path: CUSTOMER_ROUTE_PATHS.CHECKOUT,
        Component: CheckoutPage,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.ORDERS,
        Component: CustomerProtectedLayout,
        children: [
          {
            index: true,
            Component: OrderHistoryPage,
          },
        ],
      },
      {
        path: CUSTOMER_ROUTE_PATHS.ORDER_DETAILS,
        Component: CustomerProtectedLayout,
        children: [
          {
            index: true,
            Component: CustomerOrderDetailPage,
          },
        ],
      },
      {
        path: CUSTOMER_ROUTE_PATHS.ORDER_RECEIPT,
        Component: OrderReceiptPage,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.QUEUE_STATUS,
        Component: CustomerQueueTrackerPage,
      },
    ],
  },
  {
    Component: AuthLayout,
    children: [
      {
        path: CUSTOMER_ROUTE_PATHS.AUTH.LOGIN,
        Component: LoginPage,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.AUTH.REGISTER,
        Component: RegisterPage,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.AUTH.REGISTRATION,
        element: <Navigate to={CUSTOMER_ROUTES.AUTH.REGISTER} replace />,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.AUTH.FORGOT_PASSWORD,
        Component: ForgotPasswordPage,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.AUTH.FORGOT_PASSWORD_VERIFY,
        Component: VerifyOtpPage,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.AUTH.FORGOT_PASSWORD_RESET,
        Component: ResetPasswordPage,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.AUTH.VERIFY_OTP,
        Component: OtpVerificationPage,
      },
    ],
  },
  {
    path: CUSTOMER_ROUTE_PATHS.LEGAL.TERMS,
    Component: TermsAndConditionsPage,
  },
  {
    path: CUSTOMER_ROUTE_PATHS.LEGAL.PRIVACY,
    Component: PrivacyPolicyPage,
  },
  {
    path: CUSTOMER_ROUTE_PATHS.LEGAL.COOKIES,
    Component: CookiePolicyPage,
  },
];
