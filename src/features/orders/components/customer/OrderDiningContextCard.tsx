import { FileText, QrCode, Store, Users, Utensils } from "lucide-react";
import type {
  CustomerOrderRestaurant,
  OrderingMode,
} from "../../types/customer-order-details.types";

export interface OrderDiningContextCardProps {
  restaurant: CustomerOrderRestaurant;
  orderType: OrderingMode;
  tableNumber?: number | null;
  queueEntryId?: string | null;
  specialInstructions?: string | null;
  className?: string;
}

export function OrderDiningContextCard({
  restaurant,
  orderType,
  tableNumber,
  queueEntryId,
  specialInstructions,
  className = "",
}: OrderDiningContextCardProps) {
  const isQueueOrder = orderType?.toUpperCase() === "QUEUE_ORDER";

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Service Mode Card */}
      <div
        data-testid="order-service-card"
        className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs space-y-4"
      >
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
          <Utensils className="size-4 text-[#e8631b]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Dining & Service Details
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Order Type
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span
                data-testid="order-type-badge"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                  isQueueOrder
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {isQueueOrder ? (
                  <>
                    <Users className="size-3.5" />
                    <span>Queue Order</span>
                  </>
                ) : (
                  <>
                    <QrCode className="size-3.5" />
                    <span>Self-Service Table Order</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {tableNumber !== null && tableNumber !== undefined && (
            <div>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Table Number
              </span>
              <p
                data-testid="order-table-number"
                className="mt-0.5 text-sm font-bold text-neutral-900"
              >
                Table {tableNumber}
              </p>
            </div>
          )}

          {queueEntryId && (
            <div>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Queue Entry ID
              </span>
              <p
                data-testid="order-queue-id"
                className="mt-0.5 font-mono text-xs text-neutral-700 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-200/60 truncate"
              >
                {queueEntryId}
              </p>
            </div>
          )}

          <div>
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Restaurant
            </span>
            <p className="mt-0.5 text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <Store className="size-3.5 text-[#e8631b]" />
              <span>{restaurant.name ?? "Restaurant"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Special Cooking Instructions Card */}
      {specialInstructions && (
        <div
          data-testid="order-special-instructions"
          className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 shadow-2xs"
        >
          <div className="flex items-start gap-2.5 text-xs text-amber-950">
            <FileText className="size-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 text-xs">Special Instructions</h4>
              <p className="mt-1 text-xs text-amber-900/90 leading-relaxed italic">
                "{specialInstructions}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
