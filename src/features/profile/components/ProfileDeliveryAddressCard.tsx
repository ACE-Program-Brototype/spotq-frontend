import { MapPin } from "lucide-react";
import type { CustomerProfile } from "../types/profile.types";

interface ProfileDeliveryAddressCardProps {
  profile: CustomerProfile;
}

export function ProfileDeliveryAddressCard({ profile }: ProfileDeliveryAddressCardProps) {
  const currentLocation = profile.location || profile.default_address || null;

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 sm:p-5 border border-neutral-200/80 shadow-xs hover:border-[#fae2ce] transition-colors">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fdf2e9] text-[#8c522f] border border-[#fae2ce]">
        <MapPin className="size-5" />
      </div>

      <div className="flex min-w-0 flex-col gap-0.5 flex-1">
        <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
          DELIVERY ADDRESS
        </span>
        <span
          className="truncate text-sm font-bold text-neutral-800"
          title={currentLocation || "Location not set"}
        >
          {currentLocation ? `Current Location: ${currentLocation}` : "Location not set"}
        </span>
      </div>
    </div>
  );
}
