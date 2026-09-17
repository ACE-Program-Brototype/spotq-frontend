import { Armchair, Check, Edit3, Loader2, QrCode, Sliders, Users, X, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useUpdateRestaurantProfile } from "../hooks/use-update-restaurant-profile";
import type {
  RestaurantProfileData,
  RestaurantSettingsDetails,
  UpdateRestaurantProfilePayload,
} from "../types/restaurant-profile.types";

interface RestaurantSettingsCardProps {
  settings: RestaurantSettingsDetails;
  fullData: RestaurantProfileData;
}

export function RestaurantSettingsCard({ settings, fullData }: RestaurantSettingsCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [acceptsQueue, setAcceptsQueue] = useState(settings.acceptsQueue);
  const [acceptsQrOrders, setAcceptsQrOrders] = useState(settings.acceptsQrOrders);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(settings.loyaltyEnabled);
  const [autoAcceptQueue, setAutoAcceptQueue] = useState(settings.autoAcceptQueue);
  const [seatingCapacity, setSeatingCapacity] = useState<number | "">(
    settings.seatingCapacity ?? 0,
  );

  const updateMutation = useUpdateRestaurantProfile();

  const handleStartEdit = () => {
    setAcceptsQueue(settings.acceptsQueue);
    setAcceptsQrOrders(settings.acceptsQrOrders);
    setLoyaltyEnabled(settings.loyaltyEnabled);
    setAutoAcceptQueue(settings.autoAcceptQueue);
    setSeatingCapacity(settings.seatingCapacity ?? 0);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const capacityNum = Number(seatingCapacity);
  const isCapacityValid =
    seatingCapacity !== "" &&
    !Number.isNaN(capacityNum) &&
    Number.isInteger(capacityNum) &&
    capacityNum >= 0;

  const capacityError =
    isEditing && !isCapacityValid ? "Seating capacity cannot be negative" : null;

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

    updateMutation.mutate(payload, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const isSaving = updateMutation.isPending;

  const currentSettingsMap = {
    acceptsQueue: isEditing ? acceptsQueue : settings.acceptsQueue,
    acceptsQrOrders: isEditing ? acceptsQrOrders : settings.acceptsQrOrders,
    loyaltyEnabled: isEditing ? loyaltyEnabled : settings.loyaltyEnabled,
    autoAcceptQueue: isEditing ? autoAcceptQueue : settings.autoAcceptQueue,
  };

  const settingItems = [
    {
      key: "acceptsQueue",
      title: "Accepts Queue",
      description: "Allow customers to join virtual queue remotely or at door",
      enabled: currentSettingsMap.acceptsQueue,
      setter: setAcceptsQueue,
      icon: Users,
    },
    {
      key: "acceptsQrOrders",
      title: "Accepts QR Orders",
      description: "Enable table-side QR scanning and direct menu ordering",
      enabled: currentSettingsMap.acceptsQrOrders,
      setter: setAcceptsQrOrders,
      icon: QrCode,
    },
    {
      key: "loyaltyEnabled",
      title: "Loyalty Enabled",
      description: "Allow customers to earn and redeem SpotQ rewards points",
      enabled: currentSettingsMap.loyaltyEnabled,
      setter: setLoyaltyEnabled,
      icon: Sliders,
    },
    {
      key: "autoAcceptQueue",
      title: "Auto Accept Queue",
      description: "Automatically accept newly placed queue entries",
      enabled: currentSettingsMap.autoAcceptQueue,
      setter: setAutoAcceptQueue,
      icon: Zap,
    },
  ];

  return (
    <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900">Restaurant Settings</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Core operational preferences, seating capacity, and queue settings
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
            <span>Edit Settings</span>
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
              disabled={isSaving || !isDirty || !isCapacityValid}
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
                  <span>Save Settings</span>
                </>
              )}
            </Button>
          </div>
        )}
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
                  onChange={(e) => isEditing && item.setter(e.target.checked)}
                  disabled={!isEditing || isSaving}
                  aria-label={item.title}
                  className={!isEditing ? "cursor-not-allowed opacity-80" : "cursor-pointer"}
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
            {!isEditing ? (
              <span className="text-xs font-bold text-neutral-800 px-3 py-1.5 rounded-xl bg-[#fef3ec] border border-[#f3e6de]">
                {settings.seatingCapacity ?? 0} seats
              </span>
            ) : (
              <div className="w-24">
                <Input
                  id="seatingCapacity"
                  type="number"
                  min={1}
                  value={seatingCapacity}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSeatingCapacity(val === "" ? "" : Number(val));
                  }}
                  disabled={isSaving}
                  aria-label="Seating Capacity"
                  placeholder="50"
                  className={`h-9 text-xs text-right font-bold rounded-xl ${
                    capacityError ? "border-red-400 focus-visible:ring-red-400" : "border-[#eddcd4]"
                  }`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
