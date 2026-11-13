import { UtensilsCrossed } from "lucide-react";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { CartData } from "../types/checkout.types";
import { OrderDetailsSkeleton } from "./OrderDetailsSkeleton";

interface OrderDetailsCardProps {
  cart?: CartData | null;
  isLoading?: boolean;
}

export const OrderDetailsCard: React.FC<OrderDetailsCardProps> = ({ cart, isLoading = false }) => {
  const items = cart?.items || [];

  return (
    <Card className="rounded-lg sm:rounded-xl border border-[#eddcd4] bg-white shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between border-b border-[#eddcd4]/50 px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex size-6 sm:size-7 items-center justify-center rounded-md bg-orange-50 text-[#e8631b]">
            <UtensilsCrossed className="size-3 sm:size-3.5" />
          </div>
          <div>
            <CardTitle className="text-xs sm:text-sm font-bold text-neutral-900">Order Details</CardTitle>
            <p className="text-[10px] sm:text-[11px] text-neutral-500">
              {cart?.itemCount || 0} {cart?.itemCount === 1 ? "item" : "items"} selected
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="divide-y divide-[#eddcd4]/40 p-2.5 sm:p-3.5">
        {isLoading ? (
          <OrderDetailsSkeleton />
        ) : items.length === 0 ? (
          <div className="py-4 text-center text-neutral-500">
            <p className="text-xs font-medium">Your order list is empty.</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">Add dishes to proceed with checkout.</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.cartItemId}
              className="flex items-center justify-between gap-2.5 py-2 first:pt-0 last:pb-0"
            >
              {/* Item Info */}
              <div className="flex items-start gap-2 sm:gap-2.5 min-w-0">
                <div className="relative size-10 sm:size-11 shrink-0 overflow-hidden rounded-md border border-[#eddcd4]/50 bg-neutral-50">
                  <img
                    src={
                      item.imageUrl ||
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80"
                    }
                    alt={item.name || item.menuItemName || "Dish"}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-1">
                    <h4 className="font-bold text-neutral-900 text-xs sm:text-[13px] truncate">
                      {item.name || item.menuItemName}
                    </h4>
                  </div>

                  {item.description && (
                    <p className="text-[10px] text-neutral-500 line-clamp-1">{item.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    {item.variantName && (
                      <span className="inline-block rounded bg-neutral-100 px-1 py-0.2 text-[9px] font-medium text-neutral-700">
                        {item.variantName}
                      </span>
                    )}

                    {item.addons?.map((addon) => (
                      <span
                        key={addon.addonId}
                        className="inline-block rounded bg-amber-50 px-1 py-0.2 text-[9px] font-medium text-amber-800 border border-amber-200/50"
                      >
                        + {addon.name || addon.addonName} (₹{addon.price})
                      </span>
                    ))}

                    {item.specialInstructions && (
                      <span className="inline-block text-[9px] italic text-neutral-500">
                        Note: &ldquo;{item.specialInstructions}&rdquo;
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Quantity Review Tag */}
              <div className="text-right shrink-0">
                <span className="text-xs sm:text-[13px] font-bold text-neutral-900 block">
                  {formatCurrency(item.totalPrice)}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">Qty: {item.quantity}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default OrderDetailsCard;
