import { createBrowserRouter } from "react-router-dom";
import DemoLayout from "@/layouts/DemoLayout";
import RootLayout from "@/layouts/RootLayout";
import NotFoundPage from "../pages/NotFoundPage";
import { authRoutes } from "./auth.routes";
import { demoRoutes } from "./demo.routes";

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      ...authRoutes,
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
