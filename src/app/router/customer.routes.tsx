import type { RouteObject } from "react-router-dom";
import PrivacyPolicyPage from "@/features/demo/pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "@/features/demo/pages/TermsAndConditionsPage";

export const customerRoutes: RouteObject[] = [
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
