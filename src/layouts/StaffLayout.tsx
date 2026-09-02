import { Outlet } from "react-router-dom";

import { StaffNavbar } from "@/components/layout/StaffNavbar";
import { StaffMobileNav, StaffSidebar } from "@/components/layout/StaffSidebar";

export function StaffLayout() {
  return (
    <div className="min-h-svh w-full max-w-full overflow-x-hidden bg-[#fdfcfb] text-neutral-900 pb-20 lg:pb-0 lg:flex">
      {/* Desktop Staff Sidebar (hidden on mobile) */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0 sticky top-0 h-svh">
        <StaffSidebar basePath="/staff" />
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        {/* Top Staff Navbar */}
        <StaffNavbar />

        {/* Content Outlet */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 box-border">
          <Outlet />
        </main>
      </div>

      {/* Clean Mobile Bottom Navigation (No floating + button) */}
      <StaffMobileNav basePath="/staff" />
    </div>
  );
}

export default StaffLayout;
