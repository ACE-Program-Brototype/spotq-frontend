import type { RouteObject } from "react-router-dom";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import OtpVerificationPage from "@/features/auth/pages/OtpVerificationPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import VerifyOtpPage from "@/features/auth/pages/VerifyOtpPage";
import AboutPage from "@/features/demo/pages/AboutPage";
import HomePage from "@/features/demo/pages/HomePage";
import PrivacyPolicyPage from "@/features/demo/pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "@/features/demo/pages/TermsAndConditionsPage";
import AuthLayout from "@/layouts/AuthLayout";
import CustomerLayout from "@/layouts/CustomerLayout";

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
    path: "/terms-and-conditions",
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
];
