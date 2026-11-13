import { Store } from "lucide-react";
import type React from "react";

interface ContextBannerProps {
  restaurantName?: string;
  tableNumber?: string | number | null;
}

export const ContextBanner: React.FC<ContextBannerProps> = ({ restaurantName }) => {
  if (!restaurantName) return null;

  return (
    <div className="mb-2 sm:mb-2.5 flex items-center justify-between rounded-lg border border-[#eddcd4] bg-[#faf7f5] px-2.5 py-1.5 text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <Store className="size-3.5 text-[#e8631b] shrink-0" />
        <span className="truncate text-neutral-700">
          Takeaway from <strong className="font-semibold text-neutral-900">{restaurantName}</strong>
        </span>
      </div>
      <span className="shrink-0 text-[10px] font-semibold text-[#e8631b] bg-orange-50 border border-orange-200/60 px-1.5 py-0.2 rounded">
        Takeaway
      </span>
    </div>
  );
};

export default ContextBanner;

