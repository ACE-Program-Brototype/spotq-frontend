import AboutPage from "@/features/demo/pages/AboutPage";
import HomePage from "@/features/demo/pages/HomePage";

export const demoRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
];
