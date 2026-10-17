import { AlertCircle, RefreshCw, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { AddonCard } from "@/features/menu/components/addon/AddonCard";
import { AddonListSkeleton } from "@/features/menu/components/addon/AddonListSkeleton";
import { EmptyState, ErrorState } from "@/features/menu/components/MenuPageStateUI";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import { useRestaurantAddons } from "@/features/menu/hooks/use-restaurant-addons";

type AvailabilityFilter = "ALL" | "AVAILABLE" | "UNAVAILABLE";

export default function StaffMenuAddonsPage() {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";

  const { addons, isLoading, isError, refetch, toggleAvailability, pendingAddonIds } =
    useRestaurantAddons(restaurantId);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<AvailabilityFilter>("ALL");

  // Summary counts
  const totalCount = addons.length;

  //memoize the counts to prevent re-renders
  const inStockCount = useMemo(() => addons.filter((a) => a.isAvailable).length, [addons]);
  const outOfStockCount = totalCount - inStockCount;

  // Filtered addons list
  const filteredAddons = useMemo(() => {
    return addons.filter((addon) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = addon.name.toLowerCase().includes(query);
        const matchesDesc = addon.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      // Stock filter
      if (filter === "AVAILABLE" && !addon.isAvailable) return false;
      if (filter === "UNAVAILABLE" && addon.isAvailable) return false;

      return true;
    });
  }, [addons, searchQuery, filter]);

  const renderContent = () => {
    if (isLoading) return <AddonListSkeleton />;

    if (isError) {
      return (
        <ErrorState
          title="Failed to load add-ons"
          description="We encountered a problem loading modifiers. Please check your connection and try again."
          onRetry={refetch}
        />
      );
    }

    if (addons.length === 0) {
      return (
        <EmptyState
          icon={<Sparkles className="size-6 text-[#e8631b]" />}
          title="No modifiers found"
          description="No add-ons or modifiers are currently registered for this restaurant."
        />
      );
    }

    //  no result found message after applying the filters
    if (filteredAddons.length === 0) {
      return (
        <EmptyState
          icon={<AlertCircle className="size-6 text-[#e8631b]" />}
          title="No results found"
          description="No modifiers match your search or filter. Try adjusting your search keywords or switching filters to see other modifiers."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAddons.map((addon) => (
          <AddonCard
            key={addon.id}
            addon={addon}
            isStaffView={true}
            onToggleAvailability={toggleAvailability}
            isToggling={pendingAddonIds.has(addon.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1 sm:px-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f3e6de] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
              Kitchen & Service Operations
            </span>
          </div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight mt-0.5">
            {MENU_MESSAGES.STAFF_ADDONS_TITLE}
          </h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl">
            {MENU_MESSAGES.STAFF_ADDONS_SUBTITLE}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="rounded-xl border-[#eddcd4] bg-white text-neutral-700 hover:bg-[#faf7f5] text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Operational Stock Summary Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-[#eddcd4] bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-neutral-500">Total Add-ons</span>
          <p className="text-xl sm:text-2xl font-black text-neutral-900 mt-0.5">{totalCount}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
          <span className="text-xs font-semibold text-emerald-800">In Stock</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">{inStockCount}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
          <span className="text-xs font-semibold text-amber-800">86'd / Unavailable</span>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-0.5">{outOfStockCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#eddcd4] shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search add-on name..."
            className="pl-9.5 h-9.5 text-xs bg-neutral-50/60 focus:bg-white border-[#eddcd4] rounded-xl"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="inline-flex items-center gap-1.5 p-1 bg-[#faf7f5] rounded-xl border border-[#eddcd4]">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-white text-[#9a3412] shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("AVAILABLE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === "AVAILABLE"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            In Stock ({inStockCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("UNAVAILABLE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === "UNAVAILABLE"
                ? "bg-white text-amber-700 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            86'd ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Main Grid */}
      {renderContent()}
    </div>
  );
}
