import type { RouteObject } from "react-router-dom";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import OtpVerificationPage from "@/features/auth/pages/OtpVerificationPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import VerifyOtpPage from "@/features/auth/pages/VerifyOtpPage";

export const authRoutes: RouteObject[] = [
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
];
