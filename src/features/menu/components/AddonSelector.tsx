import { Plus, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import { useRestaurantAddons } from "@/features/menu/hooks/use-restaurant-addons";

interface AddonSelectorProps {
  restaurantId: string;
  selectedIds: string[];
  overrides: Record<string, number>;
  onSelectionChange: (ids: string[], overrides: Record<string, number>) => void;
  onOpenCreateModal: () => void;
}

export function AddonSelector({
  restaurantId,
  selectedIds,
  overrides,
  onSelectionChange,
  onOpenCreateModal,
}: AddonSelectorProps) {
  const { addons, isLoading } = useRestaurantAddons(restaurantId);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAddons = useMemo(() => {
    if (!searchQuery.trim()) return addons;
    const query = searchQuery.toLowerCase();
    return addons.filter(
      (a) => a.name.toLowerCase().includes(query) || a.description?.toLowerCase().includes(query),
    );
  }, [addons, searchQuery]);

  const handleToggle = (addonId: string) => {
    const isSelected = selectedIds.includes(addonId);
    let newSelected: string[];
    const newOverrides = { ...overrides };

    if (isSelected) {
      newSelected = selectedIds.filter((id) => id !== addonId);
      delete newOverrides[addonId];
    } else {
      newSelected = [...selectedIds, addonId];
    }

    onSelectionChange(newSelected, newOverrides);
  };

  const handleOverrideChange = (addonId: string, value: string) => {
    const newOverrides = { ...overrides };
    if (!value.trim()) {
      delete newOverrides[addonId];
    } else {
      const parsed = Number.parseFloat(value);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        newOverrides[addonId] = parsed;
      }
    }
    onSelectionChange(selectedIds, newOverrides);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Sparkles className="size-4 text-[#e8631b]" />
            {MENU_MESSAGES.ADDONS_SECTION_TITLE}
          </h4>
          <p className="text-xs text-neutral-500">{MENU_MESSAGES.ADDONS_SECTION_DESC}</p>
        </div>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center gap-1 text-xs font-bold text-[#e8631b] hover:text-[#9a3412] px-2.5 py-1 rounded-lg border border-[#fae2d3] bg-[#fffaf5] hover:bg-[#fef3ec] transition-colors"
        >
          <Plus className="size-3.5" />
          {MENU_MESSAGES.ADD_ADDON_BTN}
        </button>
      </div>

      {addons.length > 5 && (
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-3.5 text-neutral-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={MENU_MESSAGES.SEARCH_ADDONS_PLACEHOLDER}
            className="pl-8 h-8 text-xs bg-neutral-50/50"
          />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : addons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#ecd8cc] p-4 text-center bg-[#fffdfb]">
          <p className="text-xs text-neutral-500 mb-2">{MENU_MESSAGES.NO_ADDONS_FOUND}</p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#e8631b] hover:bg-[#cf5413] px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="size-3.5" />
            {MENU_MESSAGES.ADD_ADDON_BTN}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
          {filteredAddons.map((addon) => {
            const isSelected = selectedIds.includes(addon.id);
            const overridePrice = overrides[addon.id];
            const checkboxId = `addon-${addon.id}`;

            return (
              <div
                key={addon.id}
                className={`flex flex-col justify-between p-3 rounded-xl border transition-all ${
                  isSelected
                    ? "border-[#e8631b] bg-[#fffaf5] shadow-2xs"
                    : "border-[#eddcd4] bg-white hover:bg-neutral-50/50"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="pt-0.5">
                    <Checkbox
                      id={checkboxId}
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(addon.id)}
                    />
                  </div>
                  <label htmlFor={checkboxId} className="min-w-0 flex-1 cursor-pointer select-none">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-neutral-900 truncate">{addon.name}</p>
                      <span className="text-xs font-extrabold text-[#9a3412] shrink-0">
                        ₹{addon.price}
                      </span>
                    </div>
                    {addon.description && (
                      <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                        {addon.description}
                      </p>
                    )}
                  </label>
                </div>

                {isSelected && (
                  <div className="mt-2.5 pt-2 border-t border-[#f3e6de] flex items-center justify-between gap-2">
                    <label
                      htmlFor={`override-${addon.id}`}
                      className="text-[10px] text-neutral-500 font-medium cursor-pointer"
                    >
                      {MENU_MESSAGES.PRICE_OVERRIDE_LABEL}:
                    </label>
                    <div className="relative w-24">
                      <span className="absolute left-2 top-1.5 text-[10px] text-neutral-400 font-bold">
                        ₹
                      </span>
                      <Input
                        id={`override-${addon.id}`}
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder={String(addon.price)}
                        value={overridePrice !== undefined ? overridePrice : ""}
                        onChange={(e) => handleOverrideChange(addon.id, e.target.value)}
                        className="pl-5 h-6 text-[11px] bg-white border-[#ecd8cc]"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
