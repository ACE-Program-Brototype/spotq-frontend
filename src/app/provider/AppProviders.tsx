import { RouterProvider } from "react-router-dom";
import router from "@/app/router/routes";
import QueryProvider from "@/app/provider/QueryProvider";

function AppProviders() {
  return (
    <QueryProvider>
        <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default AppProviders;
