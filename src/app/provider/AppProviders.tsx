import { RouterProvider } from "react-router-dom";
import QueryProvider from "@/app/provider/QueryProvider";
import router from "@/app/router/routes";

function AppProviders() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default AppProviders;
