import { X } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import { RestaurantAdminNavbar } from "@/components/layout/RestaurantAdminNavbar";
import { RestaurantAdminSidebar } from "@/components/layout/RestaurantAdminSidebar";
import { Button } from "@/components/ui/button";

export function RestaurantAdminLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-svh w-full max-w-full overflow-x-hidden bg-[#fffdfb] text-neutral-900">
      <div className="hidden lg:block lg:shrink-0 sticky top-0 h-svh">
        <RestaurantAdminSidebar />
      </div>

      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMobileDrawerOpen(false)}
            aria-label="Close menu overlay"
          />
          <div className="relative z-10 flex w-72 max-w-[85vw] flex-1 flex-col bg-[#fffcf9] shadow-2xl">
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
            <RestaurantAdminSidebar
              onNavigate={() => setMobileDrawerOpen(false)}
              className="w-full"
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        <RestaurantAdminNavbar
          restaurantName="Basil Mandi"
          onToggleSidebar={() => setMobileDrawerOpen(true)}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 box-border">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default RestaurantAdminLayout;
