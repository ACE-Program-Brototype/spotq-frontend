import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import CustomerLayout from "@/layouts/CustomerLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { CUSTOMER_ROUTE_PATHS, CUSTOMER_ROUTES } from "./customer.routes.constants";

// Lazy-loaded customer discovery and detail pages
const HomePage = lazy(() => import("@/features/restaurants/pages/HomePage"));
const CustomerRestaurantDetailPage = lazy(
  () => import("@/features/restaurants/pages/CustomerRestaurantDetailPage"),
);
const AboutPage = lazy(() => import("@/features/demo/pages/AboutPage"));
const ViewProfilePage = lazy(() => import("@/features/profile/pages/ViewProfilePage"));
const EditProfilePage = lazy(() => import("@/features/profile/pages/EditProfilePage"));

// Lazy-loaded auth pages
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/features/auth/pages/ForgotPasswordPage"));
const VerifyOtpPage = lazy(() => import("@/features/auth/pages/VerifyOtpPage"));
const ResetPasswordPage = lazy(() => import("@/features/auth/pages/ResetPasswordPage"));
const OtpVerificationPage = lazy(() => import("@/features/auth/pages/OtpVerificationPage"));

// Lazy-loaded legal pages
const TermsAndConditionsPage = lazy(() => import("@/features/legal/pages/TermsAndConditionsPage"));
const PrivacyPolicyPage = lazy(() => import("@/features/legal/pages/PrivacyPolicyPage"));
const CookiePolicyPage = lazy(() => import("@/features/legal/pages/CookiePolicyPage"));

const CustomerProtectedLayout = () => (
  <ProtectedLayout allowedRoles={["CUSTOMER"]} redirectTo={CUSTOMER_ROUTES.AUTH.LOGIN} />
);

export const customerRoutes: RouteObject[] = [
  {
    Component: CustomerLayout,
    children: [
      {
        path: CUSTOMER_ROUTE_PATHS.HOME,
        Component: HomePage,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.RESTAURANTS,
        Component: HomePage,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.RESTAURANT_DETAIL,
        Component: CustomerRestaurantDetailPage,
      },
      {
        path: CUSTOMER_ROUTE_PATHS.ABOUT,
        Component: AboutPage,
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
        ],
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
