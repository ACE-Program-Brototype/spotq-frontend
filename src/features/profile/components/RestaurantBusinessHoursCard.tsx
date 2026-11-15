import { Check, Clock, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils/cn";
import {
  DAYS_OF_WEEK,
  DEFAULT_BUSINESS_HOURS,
  PROFILE_MESSAGES,
} from "@/features/profile/constants/profile.constants";
import { useUpdateRestaurantProfile } from "@/features/profile/hooks/use-update-restaurant-profile";
import type {
  BusinessHoursItem,
  RestaurantProfileData,
  UpdateRestaurantProfilePayload,
} from "@/features/profile/types/restaurant-profile.types";

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
  const hoursMap = new Map<number, BusinessHoursItem>(
    businessHours.map((item) => [item.dayOfWeek, item]),
  );

  const getInitialHours = (hours: BusinessHoursItem[]): LocalDayHours[] => {
    const map = new Map<number, BusinessHoursItem>(
      hours.map((item) => [item.dayOfWeek, item]),
    );
    return DAYS_OF_WEEK.map((day) => {
      const existing = map.get(day.id);
      return {
        dayOfWeek: day.id,
        openTime: existing?.openTime || DEFAULT_BUSINESS_HOURS.OPEN_TIME,
        closeTime: existing?.closeTime || DEFAULT_BUSINESS_HOURS.CLOSE_TIME,
        isClosed: existing?.isClosed ?? (!existing?.openTime && !existing?.closeTime),
      };
    });
  };

  const [localHours, setLocalHours] = useState<LocalDayHours[]>(() =>
    getInitialHours(businessHours),
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setLocalHours(getInitialHours(businessHours));
  }, [businessHours]);

  const updateMutation = useUpdateRestaurantProfile();

  const handleCancel = () => {
    setLocalHours(getInitialHours(businessHours));
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

  const isDirty = localHours.some((local) => {
    const orig = hoursMap.get(local.dayOfWeek);
    const origOpen = orig?.openTime || DEFAULT_BUSINESS_HOURS.OPEN_TIME;
    const origClose = orig?.closeTime || DEFAULT_BUSINESS_HOURS.CLOSE_TIME;
    const origClosed = orig?.isClosed ?? (!orig?.openTime && !orig?.closeTime);

    return (
      local.isClosed !== origClosed ||
      (!local.isClosed && (local.openTime !== origOpen || local.closeTime !== origClose))
    );
  });

  const handleSave = () => {
    if (!isDirty) return;

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

    updateMutation.mutate(payload);
  };

  const isSaving = updateMutation.isPending;

  return (
    <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900">Business Hours</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Weekly operating hours and closing schedules
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              data-testid="cancel-hours-button"
              className="rounded-xl border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-semibold text-xs h-9 px-3.5"
            >
              <X className="size-3.5 mr-1" />
              <span>Cancel</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            data-testid="save-hours-button"
            className={cn(
              "rounded-xl font-semibold text-xs h-9 px-4 transition-all",
              isDirty && !isSaving
                ? "bg-[#e8631b] hover:bg-[#d55513] text-white cursor-pointer shadow-xs"
                : "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed",
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Check className="size-3.5 mr-1.5" />
                <span>Update Hours</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {validationError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {validationError}
        </div>
      )}

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

                {!currentDayState.isClosed ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={currentDayState.openTime}
                      onChange={(e) => handleDayChange(day.id, "openTime", e.target.value)}
                      disabled={isSaving}
                      aria-label={`${day.label} open time`}
                      className="w-28 rounded-xl border-[#eddcd4] text-xs h-8 focus-visible:ring-[#e8631b]"
                    />
                    <span className="text-xs text-neutral-400 font-bold">-</span>
                    <Input
                      type="time"
                      value={currentDayState.closeTime}
                      onChange={(e) => handleDayChange(day.id, "closeTime", e.target.value)}
                      disabled={isSaving}
                      aria-label={`${day.label} close time`}
                      className="w-28 rounded-xl border-[#eddcd4] text-xs h-8 focus-visible:ring-[#e8631b]"
                    />
                  </div>
                ) : (
                  <span className="inline-flex items-center rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-500">
                    Closed all day
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
