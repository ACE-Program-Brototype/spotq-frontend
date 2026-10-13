/**
 * Restaurant Menu Modifiers / Add-ons Page
 * Displays existing menu add-ons with a creation action to open the Create Add-on Modal.
 */

import { Plus, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { AddonCard } from "@/features/menu/components/AddonCard";
import { AddonListSkeleton } from "@/features/menu/components/AddonListSkeleton";
import { CreateAddonModal } from "@/features/menu/components/CreateAddonModal";
import { EditAddonModal } from "@/features/menu/components/EditAddonModal";
import { useRestaurantAddons } from "@/features/menu/hooks/use-restaurant-addons";
import type { MenuAddon } from "@/features/menu/types/menu.types";
import { cn } from "@/lib/utils/cn";
import { EmptyState, ErrorState } from "../components/MenuPageStateUI";

export default function RestaurantMenuAddonsPage() {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";

  const { addons, isLoading, isError, refetch, toggleAvailability, pendingAddonIds } =
    useRestaurantAddons(restaurantId);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState<MenuAddon | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (addon: MenuAddon) => {
    setSelectedAddon(addon);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAddon(null);
  };

  const renderContent = () => {
    if (isLoading) return <AddonListSkeleton />;

    if (isError) {
      return (
        <ErrorState
          title="Failed to load add-ons"
          description="We encountered a problem loading your modifiers and add-ons. Please check your connection and try again."
          onRetry={refetch}
        />
      );
    }

    if (addons.length === 0) {
      return (
        <EmptyState
          icon={<Sparkles className="size-6" />}
          title="No add-ons found"
          description="No modifiers or complementary add-ons are currently available for this restaurant."
          createLabel="Create Your First Add-on"
          onCreateClick={() => setIsCreateModalOpen(true)}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {addons.map((addon) => (
          <AddonCard
            key={addon.id}
            addon={addon}
            onEdit={handleEditClick}
            onToggleAvailability={toggleAvailability}
            isToggling={pendingAddonIds.has(addon.id)}
          />
        ))}
      </div>
    );
  };

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
            className="rounded-xl border-[#eddcd4] bg-white text-neutral-700 hover:bg-[#faf7f5] text-xs font-medium cursor-pointer"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs gap-1.5 font-semibold text-xs cursor-pointer",
            )}
          >
            <Plus className="size-4" />
            <span>Create Add-on</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {renderContent()}

      {/* Edit Add-on Modal */}
      <EditAddonModal
        isOpen={isEditModalOpen}
        addon={selectedAddon}
        restaurantId={restaurantId}
        onClose={handleCloseEditModal}
      />

      {/* Create Add-on Modal */}
      <CreateAddonModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        restaurantId={restaurantId}
      />
    </div>
  );
}
