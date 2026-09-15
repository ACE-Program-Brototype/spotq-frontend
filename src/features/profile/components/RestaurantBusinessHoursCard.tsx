import { Clock, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DAYS_OF_WEEK } from "../constants/profile.constants";
import type { BusinessHoursItem } from "../types/restaurant-profile.types";

interface RestaurantBusinessHoursCardProps {
  businessHours: BusinessHoursItem[];
}

export function RestaurantBusinessHoursCard({ businessHours }: RestaurantBusinessHoursCardProps) {
  const hoursMap = new Map<number, BusinessHoursItem>(
    businessHours.map((item) => [item.dayOfWeek, item]),
  );

  const formatTimeString = (rawTime: string | null) => {
    if (!rawTime) return "";
    const [hStr, mStr] = rawTime.split(":");
    const h = parseInt(hStr, 10);
    if (Number.isNaN(h)) return rawTime;
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, "0")}:${mStr || "00"} ${ampm}`;
  };

  return (
    <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900">Business Hours</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Weekly operating hours and closing schedules
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled
          className="rounded-xl border-[#eddcd4] bg-[#faf7f5] text-neutral-400 font-semibold cursor-not-allowed text-xs h-9 px-4 shrink-0"
          title="Update functionality placeholder"
        >
          <Edit3 className="size-3.5 mr-1.5" />
          <span>Update Hours</span>
        </Button>
      </div>

      <div className="divide-y divide-[#f3e6de] rounded-2xl border border-[#f3e6de] bg-[#fffcf9] overflow-hidden">
        {DAYS_OF_WEEK.map((day) => {
          const item = hoursMap.get(day.id);
          const isClosed = item?.isClosed ?? (!item?.openTime && !item?.closeTime);
          const openFormatted = formatTimeString(item?.openTime ?? null);
          const closeFormatted = formatTimeString(item?.closeTime ?? null);

          return (
            <div
              key={day.id}
              className="flex items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-[#faf7f5]/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#fef3ec] text-[#e8631b]">
                  <Clock className="size-3.5" />
                </div>
                <span className="text-sm font-bold text-neutral-900">{day.label}</span>
              </div>

              <div>
                {isClosed ? (
                  <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
                    Closed
                  </span>
                ) : openFormatted && closeFormatted ? (
                  <span className="text-xs font-semibold text-neutral-700 bg-white border border-[#eddcd4] px-3 py-1 rounded-xl shadow-2xs">
                    {openFormatted} – {closeFormatted}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
                    Closed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
