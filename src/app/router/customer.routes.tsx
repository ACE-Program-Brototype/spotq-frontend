import type { RouteObject } from "react-router-dom";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import OtpVerificationPage from "@/features/auth/pages/OtpVerificationPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import VerifyOtpPage from "@/features/auth/pages/VerifyOtpPage";
import AboutPage from "@/features/demo/pages/AboutPage";
import HomePage from "@/features/demo/pages/HomePage";
import CookiePolicyPage from "@/features/legal/pages/CookiePolicyPage";
import PrivacyPolicyPage from "@/features/legal/pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "@/features/legal/pages/TermsAndConditionsPage";
import EditProfilePage from "@/features/profile/pages/EditProfilePage";
import ViewProfilePage from "@/features/profile/pages/ViewProfilePage";
import AuthLayout from "@/layouts/AuthLayout";
import CustomerLayout from "@/layouts/CustomerLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";

const CustomerProtectedLayout = () => (
  <ProtectedLayout allowedRoles={["CUSTOMER"]} redirectTo="/login" />
);

export const customerRoutes: RouteObject[] = [
  {
    Component: CustomerLayout,
    children: [
      {
        path: "/",
        Component: HomePage,
      },
      {
        path: "/about",
        Component: AboutPage,
      },
      {
        path: "/profile",
        Component: CustomerProtectedLayout,
        children: [
          {
            index: true,
            Component: ViewProfilePage,
          },
          {
            path: "edit",
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
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/register",
        Component: RegisterPage,
      },
      {
        path: "/forgot-password",
        Component: ForgotPasswordPage,
      },
      {
        path: "/forgot-password/verify",
        Component: VerifyOtpPage,
      },
      {
        path: "/forgot-password/reset-password",
        Component: ResetPasswordPage,
      },
      {
        path: "/verify-otp",
        Component: OtpVerificationPage,
      },
    ],
  },
  {
    path: "/terms",
    Component: TermsAndConditionsPage,
  },
  {
    path: "/privacy",
    Component: PrivacyPolicyPage,
  },
  {
    path: "/privacy-policy",
    Component: PrivacyPolicyPage,
  },
  {
    path: "/cookies",
    Component: CookiePolicyPage,
  },
  {
    path: "/cookie-policy",
    Component: CookiePolicyPage,
  },
];
