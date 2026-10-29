import type { RouteObject } from "react-router-dom";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import OtpVerificationPage from "@/features/auth/pages/OtpVerificationPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import VerifyOtpPage from "@/features/auth/pages/VerifyOtpPage";
import AboutPage from "@/features/demo/pages/AboutPage";
import CookiePolicyPage from "@/features/legal/pages/CookiePolicyPage";
import PrivacyPolicyPage from "@/features/legal/pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "@/features/legal/pages/TermsAndConditionsPage";
import OrderHistoryPage from "@/features/orders/pages/OrderHistoryPage";
import OrderReceiptPage from "@/features/orders/pages/OrderReceiptPage";
import EditProfilePage from "@/features/profile/pages/EditProfilePage";
import ViewProfilePage from "@/features/profile/pages/ViewProfilePage";
import HomePage from "@/features/restaurants/pages/HomePage";
import AuthLayout from "@/layouts/AuthLayout";
import CustomerLayout from "@/layouts/CustomerLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { CUSTOMER_ROUTE_PATHS, CUSTOMER_ROUTES } from "./customer.routes.constants";

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
        path: CUSTOMER_ROUTE_PATHS.ORDER_RECEIPT,
        Component: OrderReceiptPage,
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
