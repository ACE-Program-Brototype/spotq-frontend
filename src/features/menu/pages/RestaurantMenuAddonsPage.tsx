/**
 * Restaurant Menu Modifiers / Add-ons Page
 * Displays existing menu add-ons with a creation action to open the Create Add-on Modal.
 */

import { AlertCircle, Plus, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { AddonCard } from "@/features/menu/components/AddonCard";
import { AddonListSkeleton } from "@/features/menu/components/AddonListSkeleton";
import { CreateAddonModal } from "@/features/menu/components/CreateAddonModal";
import { useRestaurantAddons } from "@/features/menu/hooks/use-restaurant-addons";
import { cn } from "@/lib/utils/cn";

export default function RestaurantMenuAddonsPage() {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";

  const { addons, isLoading, isError, refetch } = useRestaurantAddons(restaurantId);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8 bg-[#faf7f5]/40 min-h-full">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#f3e6de] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Modifiers & Add-ons
            </h1>
            <span className="rounded-full bg-[#fef3ec] px-2.5 py-0.5 text-xs font-semibold text-[#9a3412] border border-[#fae2d3]">
              {addons.length} total
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Manage complementary items, toppings, and extras available for your menu items.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="rounded-xl border-[#eddcd4] bg-white text-neutral-700 hover:bg-[#faf7f5] text-xs font-medium"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs gap-1.5 font-semibold text-xs",
            )}
          >
            <Plus className="size-4" />
            <span>Create Add-on</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <AddonListSkeleton />
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center space-y-3">
          <AlertCircle className="size-8 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-neutral-900">Failed to load add-ons</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            We encountered a problem loading your modifiers and add-ons. Please check your
            connection and try again.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            className="rounded-xl border-rose-300 text-rose-700 hover:bg-rose-100/50 text-xs"
          >
            Try Again
          </Button>
        </div>
      ) : addons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#eddcd4] bg-white p-12 text-center space-y-3">
          <div className="size-12 rounded-2xl bg-[#fef3ec] text-[#e8631b] flex items-center justify-center mx-auto border border-[#fae2d3]">
            <Sparkles className="size-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">No add-ons found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            No modifiers or complementary add-ons are currently available for this restaurant.
          </p>
          <Button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white text-xs font-semibold px-4 py-2"
          >
            <Plus className="size-4 mr-1.5" />
            Create Your First Add-on
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {addons.map((addon) => (
            <AddonCard key={addon.id} addon={addon} />
          ))}
        </div>
      )}

      {/* Create Add-on Modal */}
      <CreateAddonModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        restaurantId={restaurantId}
      />
    </div>
  );
}
