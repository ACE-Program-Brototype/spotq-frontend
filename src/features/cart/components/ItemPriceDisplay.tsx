import { formatCurrency } from "@/lib/utils/currency";

interface ItemPriceDisplayProps {
  totalPrice: number;
  unitPrice?: number;
  quantity?: number;
  className?: string;
}

export function ItemPriceDisplay({
  totalPrice,
  unitPrice,
  quantity,
  className = "",
}: ItemPriceDisplayProps) {
  return (
    <div className={`flex flex-col items-end ${className}`} data-testid="item-price-display">
      <span
        data-testid="item-total-price"
        className="text-sm font-bold text-neutral-900 tracking-tight tabular-nums transition-all duration-150"
      >
        {formatCurrency(totalPrice)}
      </span>

      {unitPrice !== undefined && quantity !== undefined && quantity > 1 && (
        <span
          data-testid="item-unit-breakdown"
          className="text-[11px] text-neutral-400 tabular-nums"
        >
          {quantity} &times; {formatCurrency(unitPrice)}
        </span>
      )}
    </div>
  );
}

export default ItemPriceDisplay;
