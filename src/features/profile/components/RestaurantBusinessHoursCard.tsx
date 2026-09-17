import { Check, Clock, Edit3, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DAYS_OF_WEEK, PROFILE_MESSAGES } from "../constants/profile.constants";
import { useUpdateRestaurantProfile } from "../hooks/use-update-restaurant-profile";
import type {
  BusinessHoursItem,
  RestaurantProfileData,
  UpdateRestaurantProfilePayload,
} from "../types/restaurant-profile.types";

interface RestaurantBusinessHoursCardProps {
  businessHours: BusinessHoursItem[];
  fullData: RestaurantProfileData;
}

interface LocalDayHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export function RestaurantBusinessHoursCard({
  businessHours,
  fullData,
}: RestaurantBusinessHoursCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localHours, setLocalHours] = useState<LocalDayHours[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateMutation = useUpdateRestaurantProfile();

  const hoursMap = new Map<number, BusinessHoursItem>(
    businessHours.map((item) => [item.dayOfWeek, item]),
  );

  const handleStartEdit = () => {
    const initial: LocalDayHours[] = DAYS_OF_WEEK.map((day) => {
      const existing = hoursMap.get(day.id);
      return {
        dayOfWeek: day.id,
        openTime: existing?.openTime || "09:00",
        closeTime: existing?.closeTime || "22:00",
        isClosed: existing?.isClosed ?? (!existing?.openTime && !existing?.closeTime),
      };
    });
    setLocalHours(initial);
    setValidationError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValidationError(null);
  };

  const handleDayChange = (
    dayOfWeek: number,
    field: keyof LocalDayHours,
    value: string | boolean,
  ) => {
    setLocalHours((prev) =>
      prev.map((item) => (item.dayOfWeek === dayOfWeek ? { ...item, [field]: value } : item)),
    );
  };

  const handleSave = () => {
    for (const h of localHours) {
      if (!h.isClosed) {
        const dayName =
          DAYS_OF_WEEK.find((d) => d.id === h.dayOfWeek)?.label || `Day ${h.dayOfWeek}`;
        if (!h.openTime || !h.closeTime) {
          setValidationError(PROFILE_MESSAGES.VALIDATION.HOURS_REQUIRED(dayName));
          return;
        }
        if (h.closeTime <= h.openTime) {
          setValidationError(PROFILE_MESSAGES.VALIDATION.HOURS_CHRONOLOGICAL(dayName));
          return;
        }
      }
    }

    setValidationError(null);

    const payload: UpdateRestaurantProfilePayload = {
      restaurant: {
        name: fullData.restaurant.name,
        phone: fullData.restaurant.phone,
        ownerName: fullData.restaurant.ownerName,
      },
      profile: {
        description: fullData.profile.description,
        cuisineType: fullData.profile.cuisineType,
        averageCost: fullData.profile.averageCost,
      },
      settings: fullData.settings
        ? {
            acceptsQueue: fullData.settings.acceptsQueue,
            acceptsQrOrders: fullData.settings.acceptsQrOrders,
            loyaltyEnabled: fullData.settings.loyaltyEnabled,
            autoAcceptQueue: fullData.settings.autoAcceptQueue,
            seatingCapacity: fullData.settings.seatingCapacity ?? 0,
          }
        : undefined,
      businessHours: localHours.map((h) => ({
        dayOfWeek: h.dayOfWeek,
        openTime: h.isClosed ? null : h.openTime,
        closeTime: h.isClosed ? null : h.closeTime,
        isClosed: h.isClosed,
      })),
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const isSaving = updateMutation.isPending;

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

        {!isEditing ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleStartEdit}
            className="rounded-xl border-[#eddcd4] bg-[#faf7f5] text-neutral-800 hover:bg-[#f3e6de] font-semibold text-xs h-9 px-4 shrink-0 cursor-pointer"
          >
            <Edit3 className="size-3.5 mr-1.5 text-[#e8631b]" />
            <span>Edit Hours</span>
          </Button>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-xl border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-semibold text-xs h-9 px-3.5"
            >
              <X className="size-3.5 mr-1" />
              <span>Cancel</span>
            </Button>

            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-[#e8631b] hover:bg-[#d55513] text-white font-semibold text-xs h-9 px-4"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="size-3.5 mr-1.5" />
                  <span>Save Hours</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {validationError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {validationError}
        </div>
      )}

      {!isEditing ? (
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
                      {openFormatted} - {closeFormatted}
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
      ) : (
        <div className="divide-y divide-[#f3e6de] rounded-2xl border border-[#f3e6de] bg-[#fffcf9] overflow-hidden">
          {DAYS_OF_WEEK.map((day) => {
            const currentDayState = localHours.find((h) => h.dayOfWeek === day.id) || {
              dayOfWeek: day.id,
              openTime: "09:00",
              closeTime: "22:00",
              isClosed: false,
            };

            return (
              <div
                key={day.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-white"
              >
                <div className="flex items-center gap-3 min-w-32">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-[#fef3ec] text-[#e8631b]">
                    <Clock className="size-3.5" />
                  </div>
                  <span className="text-sm font-bold text-neutral-900">{day.label}</span>
                </div>

                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 font-semibold">Closed:</span>
                    <Switch
                      checked={currentDayState.isClosed}
                      onChange={(e) => handleDayChange(day.id, "isClosed", e.target.checked)}
                      disabled={isSaving}
                      aria-label={`Toggle closed status for ${day.label}`}
                    />
                  </div>

                  {!currentDayState.isClosed && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={currentDayState.openTime}
                        onChange={(e) => handleDayChange(day.id, "openTime", e.target.value)}
                        disabled={isSaving}
                        className="w-28 rounded-xl border-[#eddcd4] text-xs h-8 focus-visible:ring-[#e8631b]"
                      />
                      <span className="text-xs text-neutral-400 font-bold">-</span>
                      <Input
                        type="time"
                        value={currentDayState.closeTime}
                        onChange={(e) => handleDayChange(day.id, "closeTime", e.target.value)}
                        disabled={isSaving}
                        className="w-28 rounded-xl border-[#eddcd4] text-xs h-8 focus-visible:ring-[#e8631b]"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
