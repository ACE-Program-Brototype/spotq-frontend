import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import QueryProvider from "@/app/provider/QueryProvider";
import router from "@/app/router/routes";

function AppProviders() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}

export default AppProviders;
