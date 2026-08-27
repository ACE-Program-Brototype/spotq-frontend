import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivacyPolicyPage from "@/features/demo/pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "@/features/demo/pages/TermsAndConditionsPage";
import AuthLayout from "@/layouts/AuthLayout";
import DemoLayout from "@/layouts/DemoLayout";
import RootLayout from "@/layouts/RootLayout";

import NotFoundPage from "../pages/NotFoundPage";
import { adminRoutes } from "./admin.routes";
import { authRoutes } from "./auth.routes";
import { demoRoutes } from "./demo.routes";

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        Component: AuthLayout,
        children: authRoutes,
      },
      {
        Component: DemoLayout,
        children: demoRoutes,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditionsPage />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "admin",
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          ...adminRoutes,
        ],
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);

export default router;
