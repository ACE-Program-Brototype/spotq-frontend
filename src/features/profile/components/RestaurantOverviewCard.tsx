import { Building2, Edit3, Phone, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type {
  RestaurantOverviewDetails,
  RestaurantProfileDetails,
} from "../types/restaurant-profile.types";

interface RestaurantOverviewCardProps {
  restaurant: RestaurantOverviewDetails;
  profile: RestaurantProfileDetails;
}

// Inline fallback SVG data URLs for high-quality default images
const FALLBACK_COVER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='400' viewBox='0 0 1200 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231c1917'/%3E%3Cstop offset='50%25' stop-color='%2344403c'/%3E%3Cstop offset='100%25' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Ccircle cx='600' cy='200' r='120' fill='%23e8631b' opacity='0.15'/%3E%3Cpath d='M600 130 L640 250 L560 250 Z' fill='%23e8631b' opacity='0.2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23e7e5e4' font-family='sans-serif' font-size='28' font-weight='bold' opacity='0.4'%3ESpotQ Restaurant Cover%3C/text%3E%3C/svg%3E";

const FALLBACK_LOGO =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='100%25' height='100%25' rx='32' fill='%23fef3ec'/%3E%3Crect x='8' y='8' width='184' height='184' rx='28' fill='none' stroke='%23fae2d3' stroke-width='4'/%3E%3Cpath d='M60 140 L100 60 L140 140 Z' fill='%23e8631b'/%3E%3Ccircle cx='100' cy='115' r='18' fill='%23ffffff'/%3E%3C/svg%3E";

export function RestaurantOverviewCard({ restaurant, profile }: RestaurantOverviewCardProps) {
  const [coverSrc, setCoverSrc] = useState<string>(profile.coverImage || FALLBACK_COVER);
  const [logoSrc, setLogoSrc] = useState<string>(profile.logo || FALLBACK_LOGO);

  const name = restaurant.name || "Restaurant Name Not Specified";
  const phone = restaurant.phone || "Not provided";
  const ownerName = restaurant.ownerName || "Not provided";

  return (
    <div className="overflow-hidden rounded-3xl border border-[#eddcd4] bg-white shadow-2xs">
      {/* Cover Image Banner */}
      <div className="relative h-44 sm:h-56 w-full bg-neutral-900 overflow-hidden">
        <img
          src={coverSrc}
          alt={`${name} Cover`}
          onError={() => setCoverSrc(FALLBACK_COVER)}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Main Details Section */}
      <div className="relative px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-6">
          {/* Logo Avatar */}
          <div className="relative size-24 sm:size-28 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden shrink-0">
            <img
              src={logoSrc}
              alt={`${name} Logo`}
              onError={() => setLogoSrc(FALLBACK_LOGO)}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Dummy Update Button */}
          <Button
            type="button"
            variant="outline"
            disabled
            className="rounded-xl border-[#eddcd4] bg-[#faf7f5] text-neutral-400 font-semibold cursor-not-allowed text-xs h-9 px-4 self-start sm:self-auto"
            title="Update functionality placeholder"
          >
            <Edit3 className="size-3.5 mr-1.5" />
            <span>Update Overview</span>
          </Button>
        </div>

        {/* Info Grid */}
        <div className="space-y-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3ec] px-2.5 py-0.5 text-xs font-bold text-[#9a3412] border border-[#fae2d3]">
              <Building2 className="size-3" />
              Verified Restaurant
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight">
              {name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-3 rounded-2xl border border-[#f3e6de] bg-[#fffcf9] p-3.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#fef3ec] text-[#e8631b]">
                <Phone className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Contact Phone
                </p>
                <p className="text-sm font-bold text-neutral-900 truncate">{phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#f3e6de] bg-[#fffcf9] p-3.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#fef3ec] text-[#e8631b]">
                <User className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Owner Name
                </p>
                <p className="text-sm font-bold text-neutral-900 truncate">{ownerName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
