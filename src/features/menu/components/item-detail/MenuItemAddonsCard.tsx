import { PlusCircle, Sparkles, Utensils } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { MenuItemDetailAddon } from "@/features/menu/types/menu-item.types";
import { usePresignedUrl } from "@/hooks/usePresignedUrl";

export interface MenuItemAddonsCardProps {
  addons?: MenuItemDetailAddon[];
}

function AddonImageThumbnail({ imageKey, name }: { imageKey?: string | null; name: string }) {
  const { data: presignedUrl, isLoading } = usePresignedUrl(imageKey);
  const [hasError, setHasError] = useState(false);

  const displayUrl = presignedUrl || imageKey;

  if (isLoading) {
    return (
      <div className="size-10 shrink-0 rounded-xl overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (displayUrl && !hasError) {
    return (
      <div className="size-10 shrink-0 rounded-xl overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center">
        <img
          src={displayUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className="size-10 shrink-0 rounded-xl overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center text-[#e8631b]">
      <Utensils className="size-4 opacity-50" />
    </div>
  );
}

export function MenuItemAddonsCard({ addons = [] }: MenuItemAddonsCardProps) {
  return (
    <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-xs space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-[#f3e6de]">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#fef3ec] text-[#e8631b] border border-[#fae2d3]">
            <PlusCircle className="size-4.5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
              Complementary Add-ons
            </h3>
            <p className="text-xs text-neutral-500">
              Customization choices and toppings available with this dish.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-[#faf7f5] px-3 py-1 text-xs font-bold text-neutral-600 border border-[#eddcd4]">
          {addons.length} {addons.length === 1 ? "Add-on" : "Add-ons"}
        </span>
      </div>

      {addons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#eddcd4] p-8 text-center bg-[#faf7f5]">
          <p className="text-xs text-neutral-500 font-medium">
            No complementary add-ons linked to this menu item.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {addons.map((addon) => {
            const price = addon.priceOverride != null ? addon.priceOverride : (addon.price ?? 0);

            return (
              <div
                key={addon.id || addon.addonId}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#eddcd4] bg-white p-4 shadow-2xs hover:border-[#e8631b]/50 hover:shadow-xs transition-all"
              >
                <div className="flex items-start gap-3">
                  <AddonImageThumbnail imageKey={addon.imageKey} name={addon.name || "Add-on"} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-neutral-900 text-sm truncate">
                        {addon.name || "Add-on"}
                      </h4>
                      {addon.priceOverride != null && (
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-200 shrink-0">
                          <Sparkles className="size-2 text-amber-500" />
                          Custom
                        </span>
                      )}
                    </div>
                    {addon.description && (
                      <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5">
                        {addon.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#f3e6de]">
                  <span className="text-xs font-semibold text-neutral-500">Price</span>
                  <span className="text-sm font-extrabold text-[#9a3412]">
                    +₹{typeof price === "number" ? price.toFixed(2) : price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
