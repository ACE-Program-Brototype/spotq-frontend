import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { RestaurantAdminNavbar } from "@/components/layout/RestaurantAdminNavbar";
import { RestaurantAdminSidebar } from "@/components/layout/RestaurantAdminSidebar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { subscriptionService } from "@/features/subscription/services/subscription.service";

export function RestaurantAdminLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, clearAuth } = useAuthStore();

  const { data: statusData, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["restaurant-status"],
    queryFn: () => subscriptionService.fetchRestaurantStatus(),
    staleTime: 30 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (!isLoadingStatus && statusData && !statusData.isSubscriptionActive) {
      navigate("/restaurant/subscription", { replace: true });
    }
  }, [isLoadingStatus, statusData, navigate]);

  const handleLogout = () => {
    clearAuth();
    queryClient.clear();
    navigate("/restaurant/email/verification", { replace: true });
  };

  if (isLoadingStatus) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#fffdfb]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e8631b] border-t-transparent" />
          <p className="text-sm font-medium text-neutral-600">Verifying subscription...</p>
        </div>
      </div>
    );
  }

  if (statusData && !statusData.isSubscriptionActive) {
    return null;
  }

  const restaurantName = statusData?.restaurantName || user?.fullName || user?.name || "Restaurant";

  return (
    <div className="flex h-svh w-full max-w-full overflow-hidden bg-[#fffdfb] text-neutral-900">
      <div className="hidden lg:block lg:shrink-0 h-full">
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
              onLogout={handleLogout}
              className="w-full"
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0 w-full h-full max-w-full overflow-hidden">
        <RestaurantAdminNavbar
          restaurantName={restaurantName}
          onToggleSidebar={() => setMobileDrawerOpen(true)}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 box-border overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default RestaurantAdminLayout;
