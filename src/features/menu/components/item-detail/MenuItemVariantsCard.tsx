/**
 * Menu Item Variants Card Component
 * Displays the portion sizes and variants table with SKU, price, default badge, and availability status.
 */

import { CheckCircle2, Layers, Tag } from "lucide-react";
import type { MenuItemDetailVariant } from "@/features/menu/types/menu-item.types";
import { cn } from "@/lib/utils/cn";

export interface MenuItemVariantsCardProps {
  variants: MenuItemDetailVariant[];
  basePrice: number;
}

export function MenuItemVariantsCard({ variants, basePrice }: MenuItemVariantsCardProps) {
  return (
    <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-xs space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-[#f3e6de]">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#fef3ec] text-[#e8631b] border border-[#fae2d3]">
            <Layers className="size-4.5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
              Portion Sizes & Pricing
            </h3>
            <p className="text-xs text-neutral-500">
              Configured portion sizes and pricing variants for this dish.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-[#faf7f5] px-3 py-1 text-xs font-bold text-neutral-600 border border-[#eddcd4]">
          {variants.length} {variants.length === 1 ? "Variant" : "Variants"}
        </span>
      </div>

      {variants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#eddcd4] p-8 text-center bg-[#faf7f5]">
          <p className="text-xs text-neutral-500 font-medium">No portion variants configured.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#eddcd4]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#faf7f5] border-b border-[#eddcd4] text-neutral-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Variant Name</th>
                <th className="py-3.5 px-4">Portion / Description</th>
                <th className="py-3.5 px-4">SKU / Code</th>
                <th className="py-3.5 px-4">Price (INR)</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3e6de]">
              {variants.map((variant) => {
                const variantPrice = Number(variant.price) || 0;
                const parsedBasePrice = Number(basePrice) || 0;
                const priceDelta = variantPrice - parsedBasePrice;

                return (
                  <tr key={variant.id} className="hover:bg-[#fef9f6] transition-colors">
                    {/* Variant Name & Default Badge */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-neutral-900 text-sm">{variant.name}</span>
                        {variant.isDefault && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3ec] px-2 py-0.5 text-[10px] font-bold text-[#9a3412] border border-[#fae2d3]">
                            <CheckCircle2 className="size-2.5 text-[#e8631b]" />
                            Default
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Portion */}
                    <td className="py-3.5 px-4 text-neutral-600">
                      {variant.portion || "Standard Portion"}
                    </td>

                    {/* SKU */}
                    <td className="py-3.5 px-4 font-mono text-neutral-500">
                      {variant.sku ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                          <Tag className="size-2.5 text-neutral-400" />
                          {variant.sku}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Price & Delta */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold text-neutral-900 text-sm">
                          ₹{variantPrice.toFixed(2)}
                        </span>
                        {!variant.isDefault && priceDelta !== 0 && (
                          <span
                            className={cn(
                              "text-[10px] font-bold",
                              priceDelta > 0 ? "text-emerald-600" : "text-neutral-400",
                            )}
                          >
                            (
                            {priceDelta > 0
                              ? `+₹${priceDelta.toFixed(2)}`
                              : `-₹${Math.abs(priceDelta).toFixed(2)}`}
                            )
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Availability Status Badge */}
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border",
                          variant.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-neutral-100 text-neutral-600 border-neutral-200",
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            variant.isAvailable ? "bg-emerald-500" : "bg-neutral-400",
                          )}
                        />
                        {variant.isAvailable ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
