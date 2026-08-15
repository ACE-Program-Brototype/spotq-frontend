import { createBrowserRouter } from "react-router-dom";
import DemoLayout from "@/layouts/DemoLayout";
import RootLayout from "@/layouts/RootLayout";
import NotFoundPage from "../pages/NotFoundPage";
import { demoRoutes } from "./demo.routes";

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
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
