import { createBrowserRouter } from "react-router-dom";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import DemoLayout from "@/layouts/DemoLayout";
import RootLayout from "@/layouts/RootLayout";
import NotFoundPage from "../pages/NotFoundPage";
import { demoRoutes } from "./demo.routes";

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        Component: DemoLayout,
        children: demoRoutes,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
