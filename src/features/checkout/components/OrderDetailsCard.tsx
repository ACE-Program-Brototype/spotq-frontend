import { UtensilsCrossed } from "lucide-react";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CartData } from "../types/checkout.types";

interface OrderDetailsCardProps {
  cart: CartData | null;
  isLoading?: boolean;
}

export const OrderDetailsCard: React.FC<OrderDetailsCardProps> = ({ cart, isLoading = false }) => {
  const items = cart?.items || [];

  return (
    <Card className="rounded-2xl border-neutral-200/80 bg-white shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 pb-4 pt-5 px-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-[#ff6b00]">
            <UtensilsCrossed className="h-4.5 w-4.5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-neutral-900">Order Details</CardTitle>
            <p className="text-xs text-neutral-500">
              {cart?.itemCount || 0} {cart?.itemCount === 1 ? "item" : "items"} selected
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="divide-y divide-neutral-100 p-5 sm:p-6">
        {isLoading ? (
          <div className="space-y-4 py-2">
            {[1, 2].map((k) => (
              <div key={k} className="flex animate-pulse items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-neutral-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-neutral-200" />
                  <div className="h-3 w-1/2 rounded bg-neutral-100" />
                </div>
                <div className="h-6 w-16 rounded bg-neutral-200" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-neutral-500">
            <p className="text-sm font-medium">Your order list is empty.</p>
            <p className="text-xs text-neutral-400 mt-1">Add dishes to proceed with checkout.</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.cartItemId}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              {/* Item Info */}
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
                  <img
                    src={
                      item.imageUrl ||
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80"
                    }
                    alt={item.menuItemName}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-neutral-900 text-sm sm:text-base truncate">
                      {item.menuItemName}
                    </h4>
                  </div>

                  {item.description && (
                    <p className="text-xs text-neutral-500 line-clamp-1">{item.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {item.variantName && (
                      <span className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                        {item.variantName}
                      </span>
                    )}

                    {item.addons?.map((addon) => (
                      <span
                        key={addon.addonId}
                        className="inline-block rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 border border-amber-200/60"
                      >
                        + {addon.addonName} (₹{addon.price})
                      </span>
                    ))}

                    {item.specialInstructions && (
                      <span className="inline-block text-[11px] italic text-neutral-500">
                        Note: &ldquo;{item.specialInstructions}&rdquo;
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Quantity Review Tag matching Figma reference */}
              <div className="text-right shrink-0">
                <span className="text-sm sm:text-base font-bold text-neutral-900 block">
                  ₹{item.totalPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-neutral-500 font-medium">Qty: {item.quantity}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default OrderDetailsCard;
