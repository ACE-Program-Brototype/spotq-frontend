import { Outlet } from "react-router-dom";

import { STAFF_ROUTES } from "@/app/router/routes.constants";
import { StaffNavbar } from "@/components/layout/StaffNavbar";
import { StaffMobileNav, StaffSidebar } from "@/components/layout/StaffSidebar";

export function StaffLayout() {
  return (
    <div className="flex h-svh w-full max-w-full overflow-hidden bg-[#fdfcfb] text-neutral-900 pb-16 lg:pb-0">
      <aside aria-label="Staff Navigation" className="hidden lg:block lg:w-64 lg:shrink-0 h-full">
        <StaffSidebar basePath={STAFF_ROUTES.ROOT} />
      </aside>

      <div className="flex flex-1 flex-col min-w-0 w-full h-full max-w-full overflow-hidden">
        <StaffNavbar />

        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 box-border overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <StaffMobileNav basePath={STAFF_ROUTES.ROOT} />
    </div>
  );
}

export default StaffLayout;
