import { MapPin, Navigation } from "lucide-react";
import type { CustomerProfile } from "../types/profile.types";

interface ProfileDeliveryAddressCardProps {
  profile: CustomerProfile;
}

export function ProfileDeliveryAddressCard({ profile }: ProfileDeliveryAddressCardProps) {
  const currentLocation = profile.location || profile.default_address || null;

  return (
    <div className="overflow-hidden rounded-3xl bg-white border border-neutral-200/80 shadow-xs">
      {/* Map visual card */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-neutral-900">
        {/* Subtle Map SVG / Texture Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 filter grayscale contrast-125"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23222' width='800' height='400'/%3E%3Cpath d='M0 100 Q 200 150 400 80 T 800 120' stroke='%23444' stroke-width='6' fill='none'/%3E%3Cpath d='M0 250 Q 250 200 500 280 T 800 220' stroke='%23333' stroke-width='8' fill='none'/%3E%3Cpath d='M150 0 Q 180 200 120 400' stroke='%23333' stroke-width='4' fill='none'/%3E%3Cpath d='M450 0 Q 420 200 480 400' stroke='%23444' stroke-width='6' fill='none'/%3E%3Cpath d='M650 0 Q 700 200 660 400' stroke='%23333' stroke-width='4' fill='none'/%3E%3Ccircle cx='400' cy='180' r='120' fill='%232a2a2a' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        {/* Map Center Pin and City Badge */}
        {currentLocation ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-[#ff6b00] text-white shadow-lg ring-4 ring-white/30 animate-bounce">
              <MapPin className="size-5 fill-white text-[#ff6b00]" />
            </div>
            <span className="mt-2 text-sm font-extrabold uppercase tracking-widest text-white drop-shadow-md">
              {currentLocation}
            </span>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
              <Navigation className="size-5" />
            </div>
            <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              No delivery address added
            </span>
          </div>
        )}

        {/* Bottom-left Location Indicator Tag */}
        <div className="absolute bottom-3 left-4 sm:left-6 flex items-center gap-2 rounded-lg bg-black/60 backdrop-blur-xs px-3 py-1.5 text-xs font-medium text-neutral-200 border border-white/10">
          <MapPin className="size-3.5 text-[#ff6b00] shrink-0" />
          <span>
            {currentLocation ? `Current Location: ${currentLocation}` : "Location not set"}
          </span>
        </div>
      </div>

      {/* Bottom Bar matching Figma design */}
      <div className="flex items-center justify-center bg-[#fdf2e9] py-3 px-4 text-center border-t border-[#fae2ce]">
        <span className="text-xs font-bold text-[#78431f]">Set as default delivery address</span>
      </div>
    </div>
  );
}
