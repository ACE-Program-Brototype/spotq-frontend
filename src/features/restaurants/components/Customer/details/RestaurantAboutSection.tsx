import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import type { CustomerRestaurantDetails } from "@/features/restaurants/types/customer-restaurant-details.types";
import { formatOperatingTime } from "@/features/restaurants/utils/restaurant.utils";

export interface RestaurantAboutSectionProps {
  restaurant: CustomerRestaurantDetails;
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function RestaurantAboutSection({ restaurant }: RestaurantAboutSectionProps) {
  const currentDayIndex = new Date().getDay();

  const formattedAddress = [
    restaurant.address?.addressLine1,
    restaurant.address?.addressLine2,
    restaurant.address?.city,
    restaurant.address?.state,
    restaurant.address?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const directionsUrl =
    restaurant.address?.latitude && restaurant.address?.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${restaurant.address.latitude},${restaurant.address.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${restaurant.restaurantName} ${restaurant.address?.city ?? ""}`,
        )}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
      {/* 1. Left 2 Columns: Description & Schedule */}
      <div className="md:col-span-2 space-y-6">
        {/* About Narrative */}
        {restaurant.description && (
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-2">
            <h3 className="font-extrabold text-neutral-900 text-base">About the Restaurant</h3>
            <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
              {restaurant.description}
            </p>
          </div>
        )}

        {/* Operating Hours Table */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="size-4.5 text-[#ff6b00]" />
            <h3 className="font-extrabold text-neutral-900 text-base">Operating Hours</h3>
          </div>

          <div className="divide-y divide-neutral-100 border-t border-neutral-100 text-xs sm:text-sm">
            {DAYS_OF_WEEK.map((dayName, idx) => {
              const schedule = restaurant.operatingHours?.find((h) => h.dayOfWeek === idx);
              const isToday = currentDayIndex === idx;

              return (
                <div
                  key={dayName}
                  className={`flex items-center justify-between py-2.5 px-2 rounded-lg transition-colors ${
                    isToday ? "bg-[#ff6b00]/10 font-bold text-neutral-900" : "text-neutral-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{dayName}</span>
                    {isToday && (
                      <span className="rounded-full bg-[#ff6b00] px-1.5 py-0.2 text-[9px] font-bold text-white uppercase">
                        Today
                      </span>
                    )}
                  </span>

                  <span>
                    {!schedule?.isOpen
                      ? "Closed"
                      : `${formatOperatingTime(schedule.openTime) || "10:00 AM"} – ${formatOperatingTime(schedule.closeTime) || "11:00 PM"}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Right Column: Contact & Address Card */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
          <h3 className="font-extrabold text-neutral-900 text-base">Location & Contact</h3>

          {/* Address */}
          {formattedAddress && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Address
              </span>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {formattedAddress}
              </p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#ff6b00] hover:underline pt-1"
              >
                <MapPin className="size-3.5" />
                <span>Open in Google Maps</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          )}

          {/* Phone */}
          {restaurant.phone && (
            <div className="space-y-1 border-t border-neutral-100 pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Phone Number
              </span>
              <p>
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:text-[#ff6b00]"
                >
                  <Phone className="size-3.5 text-neutral-400" />
                  <span>{restaurant.phone}</span>
                </a>
              </p>
            </div>
          )}

          {/* Email */}
          {restaurant.email && (
            <div className="space-y-1 border-t border-neutral-100 pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Email
              </span>
              <p>
                <a
                  href={`mailto:${restaurant.email}`}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:text-[#ff6b00]"
                >
                  <Mail className="size-3.5 text-neutral-400" />
                  <span>{restaurant.email}</span>
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
