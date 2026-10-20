import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { CustomerFooter } from "@/components/layout/CustomerFooter";
import { CustomerMobileNav, CustomerNavbar } from "@/components/layout/CustomerNavbar";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getRoleHome } from "@/features/auth/utils/auth.helpers";

export function CustomerLayout() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.role && user.role !== "CUSTOMER") {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return (
    <div className="flex min-h-svh w-full max-w-full flex-col overflow-x-hidden bg-white text-neutral-900 pb-16 md:pb-0">
      <CustomerNavbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 box-border">
        <Suspense
          fallback={
            <div className="flex min-h-[40vh] w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff6b00] border-t-transparent" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      <CustomerFooter />

      <CustomerMobileNav />
    </div>
  );
}

export default CustomerLayout;
