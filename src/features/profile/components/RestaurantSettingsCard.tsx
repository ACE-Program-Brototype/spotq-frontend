import { Armchair, Check, Loader2, QrCode, Sliders, Users, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils/cn";
import {
  PROFILE_MESSAGES,
  RESTAURANT_SETTINGS_FIELDS,
} from "@/features/profile/constants/profile.constants";
import { useUpdateRestaurantProfile } from "@/features/profile/hooks/use-update-restaurant-profile";
import type {
  RestaurantProfileData,
  RestaurantSettingsDetails,
  UpdateRestaurantProfilePayload,
} from "@/features/profile/types/restaurant-profile.types";

interface RestaurantSettingsCardProps {
  settings: RestaurantSettingsDetails;
  fullData: RestaurantProfileData;
}

export function RestaurantSettingsCard({ settings, fullData }: RestaurantSettingsCardProps) {
  const [acceptsQueue, setAcceptsQueue] = useState(settings.acceptsQueue);
  const [acceptsQrOrders, setAcceptsQrOrders] = useState(settings.acceptsQrOrders);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(settings.loyaltyEnabled);
  const [autoAcceptQueue, setAutoAcceptQueue] = useState(settings.autoAcceptQueue);
  const [seatingCapacity, setSeatingCapacity] = useState<number | "">(
    settings.seatingCapacity ?? 0,
  );

  useEffect(() => {
    setAcceptsQueue(settings.acceptsQueue);
    setAcceptsQrOrders(settings.acceptsQrOrders);
    setLoyaltyEnabled(settings.loyaltyEnabled);
    setAutoAcceptQueue(settings.autoAcceptQueue);
    setSeatingCapacity(settings.seatingCapacity ?? 0);
  }, [settings]);

  const updateMutation = useUpdateRestaurantProfile();

  const handleCancel = () => {
    setAcceptsQueue(settings.acceptsQueue);
    setAcceptsQrOrders(settings.acceptsQrOrders);
    setLoyaltyEnabled(settings.loyaltyEnabled);
    setAutoAcceptQueue(settings.autoAcceptQueue);
    setSeatingCapacity(settings.seatingCapacity ?? 0);
  };

  const capacityNum = Number(seatingCapacity);
  const isCapacityValid =
    seatingCapacity !== "" &&
    !Number.isNaN(capacityNum) &&
    Number.isInteger(capacityNum) &&
    capacityNum >= 0;

  const capacityError =
    !isCapacityValid && seatingCapacity !== ""
      ? PROFILE_MESSAGES.VALIDATION.SEATING_CAPACITY_NEGATIVE
      : null;

  const isDirty =
    (acceptsQueue !== settings.acceptsQueue ||
      acceptsQrOrders !== settings.acceptsQrOrders ||
      loyaltyEnabled !== settings.loyaltyEnabled ||
      autoAcceptQueue !== settings.autoAcceptQueue ||
      Number(seatingCapacity) !== (settings.seatingCapacity ?? 0)) &&
    isCapacityValid;

  const handleSave = () => {
    if (!isDirty || !isCapacityValid) return;

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
      settings: {
        acceptsQueue,
        acceptsQrOrders,
        loyaltyEnabled,
        autoAcceptQueue,
        seatingCapacity: capacityNum,
      },
      businessHours: fullData.businessHours.map((bh) => ({
        dayOfWeek: bh.dayOfWeek,
        openTime: bh.openTime,
        closeTime: bh.closeTime,
        isClosed: bh.isClosed,
      })),
    };

    updateMutation.mutate(payload);
  };

  const isSaving = updateMutation.isPending;

  const settingItems = RESTAURANT_SETTINGS_FIELDS.map((field) => {
    switch (field.key) {
      case "acceptsQueue":
        return { ...field, enabled: acceptsQueue, setter: setAcceptsQueue, icon: Users };
      case "acceptsQrOrders":
        return { ...field, enabled: acceptsQrOrders, setter: setAcceptsQrOrders, icon: QrCode };
      case "loyaltyEnabled":
        return { ...field, enabled: loyaltyEnabled, setter: setLoyaltyEnabled, icon: Sliders };
      case "autoAcceptQueue":
        return { ...field, enabled: autoAcceptQueue, setter: setAutoAcceptQueue, icon: Zap };
    }
  });

  return (
    <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900">Restaurant Settings</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Core operational preferences, seating capacity, and queue settings
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              data-testid="cancel-settings-button"
              className="rounded-xl border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-semibold text-xs h-9 px-3.5"
            >
              <X className="size-3.5 mr-1" />
              <span>Cancel</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || !isCapacityValid || isSaving}
            data-testid="save-settings-button"
            className={cn(
              "rounded-xl font-semibold text-xs h-9 px-4 transition-all",
              isDirty && isCapacityValid && !isSaving
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
                <span>Update Settings</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Operational Toggle Cards */}
        {settingItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[#f3e6de] bg-[#fffcf9] p-4 transition-all"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#fef3ec] text-[#e8631b] shrink-0 mt-0.5">
                  <Icon className="size-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-neutral-900 leading-tight">{item.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-snug">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Switch
                  checked={item.enabled}
                  onChange={(e) => item.setter(e.target.checked)}
                  disabled={isSaving}
                  aria-label={item.title}
                  className="cursor-pointer"
                />
                <span className="text-xs font-bold text-neutral-600 min-w-8 text-right">
                  {item.enabled ? "ON" : "OFF"}
                </span>
              </div>
            </div>
          );
        })}

        {/* Seating Capacity Input Card */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#f3e6de] bg-[#fffcf9] p-4 transition-all">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#fef3ec] text-[#e8631b] shrink-0 mt-0.5">
              <Armchair className="size-4.5" />
            </div>
            <div className="min-w-0">
              <label
                htmlFor="seatingCapacity"
                className="text-sm font-bold text-neutral-900 leading-tight block"
              >
                Seating Capacity
              </label>
              <p className="text-xs text-neutral-500 mt-0.5 leading-snug">
                Total guest seating capacity
              </p>
              {capacityError && (
                <p className="text-[11px] font-medium text-red-500 mt-1">{capacityError}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-28 flex items-center gap-1.5">
              <Input
                id="seatingCapacity"
                type="number"
                min={0}
                value={seatingCapacity}
                onChange={(e) => {
                  const val = e.target.value;
                  setSeatingCapacity(val === "" ? "" : Number(val));
                }}
                disabled={isSaving}
                aria-label="Seating Capacity"
                placeholder="0"
                className={`h-9 text-xs text-right font-bold rounded-xl ${
                  capacityError ? "border-red-400 focus-visible:ring-red-400" : "border-[#eddcd4]"
                }`}
              />
              <span className="text-xs font-semibold text-neutral-600 shrink-0">seats</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
