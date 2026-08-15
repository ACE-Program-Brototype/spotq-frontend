import { RouterProvider } from "react-router-dom";
import router from "@/app/router/routes";

function AppProviders() {
  return <RouterProvider router={router} />;
}

export default AppProviders;
