import { X } from "lucide-react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { RestaurantNavbar } from "@/components/layout/RestaurantNavbar";
import { RestaurantSidebar } from "@/components/layout/RestaurantSidebar";
import { Button } from "@/components/ui/button";

export function RestaurantLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();
  const basePath = location.pathname.startsWith("/staff") ? "/staff" : "/restaurant";

  return (
    <div className="flex min-h-svh bg-[#fdfcfb] text-neutral-900">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:block lg:shrink-0 sticky top-0 h-svh">
        <RestaurantSidebar basePath={basePath} />
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMobileDrawerOpen(false)}
            aria-label="Close menu overlay"
          />
          <div className="relative z-10 flex w-72 max-w-[85vw] flex-1 flex-col bg-white shadow-2xl">
            <div className="absolute right-3 top-3">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Close menu"
                onClick={() => setMobileDrawerOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            <RestaurantSidebar
              basePath={basePath}
              onNavigate={() => setMobileDrawerOpen(false)}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Restaurant / Staff Navbar */}
        <RestaurantNavbar onToggleSidebar={() => setMobileDrawerOpen(true)} />

        {/* Content Outlet */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default RestaurantLayout;
