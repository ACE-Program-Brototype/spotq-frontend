/**
 * Customer Routes Configuration
 * Defines public routes for customer terms of service, privacy policies, and general customer pages.
 */

import type { RouteObject } from "react-router-dom";
import AboutPage from "@/features/demo/pages/AboutPage";
import PrivacyPolicyPage from "@/features/demo/pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "@/features/demo/pages/TermsAndConditionsPage";

export const customerRoutes: RouteObject[] = [
  {
    path: "/about-us",
    Component: AboutPage,
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
