import { Outlet, useLocation } from "react-router-dom";

import { RestaurantNavbar } from "@/components/layout/RestaurantNavbar";
import { RestaurantMobileNav, RestaurantSidebar } from "@/components/layout/RestaurantSidebar";

export function RestaurantLayout() {
  const location = useLocation();
  const basePath = location.pathname.startsWith("/staff") ? "/staff" : "/restaurant";

  return (
    <div className="min-h-svh w-full max-w-full overflow-x-hidden bg-[#fdfcfb] text-neutral-900 pb-20 lg:pb-0 lg:flex">
      {/* Desktop Sidebar (only visible on lg screens) */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0 sticky top-0 h-svh">
        <RestaurantSidebar basePath={basePath} />
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        {/* Top Restaurant / Staff Navbar */}
        <RestaurantNavbar />

        {/* Content Outlet */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 box-border">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <RestaurantMobileNav basePath={basePath} />
    </div>
  );
}

export default RestaurantLayout;
