import { Clock3, ExternalLink, Phone } from "lucide-react";
import { useMemo } from "react";
import {
  CUSTOMER_OVERVIEW_LABELS,
  CUSTOMER_RESTAURANT_SECTIONS,
  DAYS_OF_WEEK,
} from "@/features/restaurants/constants/customer-restaurant.constants";
import type { CustomerRestaurantDetails } from "@/features/restaurants/types/customer-restaurant.types";
import { cn } from "@/lib/utils/cn";

function prettyTime(value?: string | null): string {
  if (!value) return "-";
  const [rawHour, rawMinute] = value.split(":");
  const hour = Number.parseInt(rawHour, 10);
  const minute = Number.parseInt(rawMinute, 10);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return "-";
  const period = hour < 12 ? "AM" : "PM";
  const formattedHour = hour % 12 || 12;
  const formattedMinute = String(minute).padStart(2, "0");
  return `${formattedHour}:${formattedMinute} ${period}`;
}

interface RestaurantOverviewProps {
  restaurant: CustomerRestaurantDetails;
}

export function RestaurantOverview({ restaurant }: RestaurantOverviewProps) {
  const address = restaurant.address;

  const mapUrl = useMemo(() => {
    if (address?.latitude != null && address.longitude != null) {
      return `https://www.google.com/maps?q=${address.latitude},${address.longitude}`;
    }
    const query = [address?.addressLine1, address?.city, address?.state]
      .filter(Boolean)
      .join(", ");
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }, [address]);

  const sortedHours = useMemo(() => {
    return [...(restaurant.operatingHours ?? [])].sort(
      (a, b) => (a.dayOfWeek % 7) - (b.dayOfWeek % 7),
    );
  }, [restaurant.operatingHours]);

  return (
    <section
      id={CUSTOMER_RESTAURANT_SECTIONS.OVERVIEW}
      className="scroll-mt-24 border-t border-stone-200 pt-7 min-w-0 max-w-full"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] min-w-0 max-w-full">
        <div className="space-y-4 min-w-0">
          <div className="rounded-2xl border border-stone-200 p-4 sm:p-5 min-w-0">
            <h2 className="font-extrabold text-stone-900">
              {CUSTOMER_OVERVIEW_LABELS.ABOUT_TITLE}
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600 break-words [overflow-wrap:anywhere]">
              {restaurant.description || CUSTOMER_OVERVIEW_LABELS.DEFAULT_DESCRIPTION}
            </p>
            <p className="mt-3 text-xs font-semibold text-stone-500">
              {restaurant.cuisineType} · Average cost ₹{restaurant.averageCost ?? "—"} per person
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 p-4 sm:p-5 min-w-0">
            <h2 className="mb-4 flex items-center gap-2 font-extrabold text-stone-900">
              <Clock3 className="size-4 text-[#ff6b00] shrink-0" />
              <span>{CUSTOMER_OVERVIEW_LABELS.HOURS_TITLE}</span>
            </h2>
            <div className="space-y-1">
              {sortedHours.length ? (
                sortedHours.map((hour) => (
                  <div
                    key={hour.id}
                    className="flex items-center justify-between gap-2 border-t border-stone-100 py-2.5 text-xs sm:text-sm min-w-0"
                  >
                    <span className="font-medium text-stone-600 shrink-0">
                      {DAYS_OF_WEEK[hour.dayOfWeek % 7]}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 text-right font-medium text-xs sm:text-sm",
                        hour.isOpen ? "text-stone-800" : "text-stone-400",
                      )}
                    >
                      {hour.isOpen
                        ? `${prettyTime(hour.openTime)} - ${prettyTime(hour.closeTime)}`
                        : CUSTOMER_OVERVIEW_LABELS.CLOSED}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-stone-500">{CUSTOMER_OVERVIEW_LABELS.HOURS_NOT_LISTED}</p>
              )}
            </div>
          </div>
        </div>
        <div className="h-fit rounded-2xl border border-stone-200 p-4 sm:p-5 min-w-0">
          <h2 className="font-extrabold text-stone-900">
            {CUSTOMER_OVERVIEW_LABELS.LOCATION_TITLE}
          </h2>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-stone-400">
            {CUSTOMER_OVERVIEW_LABELS.ADDRESS_HEADING}
          </p>
          <p className="mt-1 text-sm leading-6 text-stone-700 break-words [overflow-wrap:anywhere]">
            {[
              address?.addressLine1,
              address?.addressLine2,
              address?.city,
              address?.state,
              address?.pincode,
              address?.country,
            ]
              .filter(Boolean)
              .join(", ") || CUSTOMER_OVERVIEW_LABELS.ADDRESS_NOT_AVAILABLE}
          </p>
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#f26500]"
          >
            {CUSTOMER_OVERVIEW_LABELS.OPEN_MAPS} <ExternalLink className="size-3" />
          </a>
          <div className="my-4 border-t border-stone-100" />
          {restaurant.phone && (
            <>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                {CUSTOMER_OVERVIEW_LABELS.PHONE_HEADING}
              </p>
              <a
                href={`tel:${restaurant.phone}`}
                className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-stone-800"
              >
                <Phone className="size-4 text-[#f26500] shrink-0" />
                {restaurant.phone || CUSTOMER_OVERVIEW_LABELS.PHONE_NOT_AVAILABLE}
              </a>
            </>
          )}
          {restaurant.email && (
            <>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                {CUSTOMER_OVERVIEW_LABELS.EMAIL_HEADING}
              </p>
              <a
                href={`mailto:${restaurant.email}`}
                className="mt-1 block break-all text-sm text-stone-700"
              >
                {restaurant.email}
              </a>
            </>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {restaurant.settings?.isPreorder && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                {CUSTOMER_OVERVIEW_LABELS.PRE_ORDERS_BADGE}
              </span>
            )}
            {restaurant.settings?.acceptsQrOrders && (
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                {CUSTOMER_OVERVIEW_LABELS.QR_ORDERS_BADGE}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
