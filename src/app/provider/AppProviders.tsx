import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import QueryProvider from "@/app/provider/QueryProvider";
import router from "@/app/router/routes";

function AppProviders() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster
        richColors
        closeButton
        position="top-right"
        offset={{ top: "72px", right: "16px" }}
        mobileOffset={{ top: "72px", left: "16px", right: "16px" }}
        duration={3500}
      />
    </QueryProvider>
  );
}

export default AppProviders;
