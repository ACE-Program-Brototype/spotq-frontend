import { Outlet } from "react-router-dom";

import { CustomerFooter } from "@/components/layout/CustomerFooter";
import { CustomerMobileNav, CustomerNavbar } from "@/components/layout/CustomerNavbar";

export function CustomerLayout() {
  return (
    <div className="flex min-h-svh w-full max-w-full flex-col overflow-x-hidden bg-white text-neutral-900 pb-16 md:pb-0">
      <CustomerNavbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 box-border">
        <Outlet />
      </main>

      <CustomerFooter />

      <CustomerMobileNav />
    </div>
  );
}

export default CustomerLayout;
