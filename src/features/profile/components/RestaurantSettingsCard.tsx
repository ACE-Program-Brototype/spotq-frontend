import { useQuery } from "@tanstack/react-query";
import { Check, Loader2, Lock, Store, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RESTAURANT_SETTINGS_MESSAGES } from "@/features/profile/constants/profile.constants";
import { useUpdateRestaurantProfile } from "@/features/profile/hooks/use-update-restaurant-profile";
import type {
  RestaurantProfileData,
  RestaurantSettingsDetails,
  UpdateRestaurantProfilePayload,
} from "@/features/profile/types/restaurant-profile.types";
import { subscriptionService } from "@/features/subscription/services/subscription.service";
import { cn } from "@/lib/utils/cn";

interface RestaurantSettingsCardProps {
  settings: RestaurantSettingsDetails;
  fullData: RestaurantProfileData;
}

export function RestaurantSettingsCard({ settings, fullData }: RestaurantSettingsCardProps) {
  const [isOpened, setIsOpened] = useState(Boolean(settings.isOpened));
  const [acceptsQueue, setAcceptsQueue] = useState(Boolean(settings.acceptsQueue));

  // Query subscription status to evaluate QueuePro entitlement
  const { data: statusData } = useQuery({
    queryKey: ["restaurant-status"],
    queryFn: async () => {
      try {
        return await subscriptionService.fetchRestaurantStatus();
      } catch {
        return null;
      }
    },
    staleTime: 60 * 1000,
  });

  const planCode = (
    statusData?.subscription?.planCode ??
    statusData?.subscriptionPlanCode ??
    ""
  ).toUpperCase();
  const hasQueuePro = planCode.includes("QUEUE_PRO") || planCode.includes("QUEUE PRO");

  useEffect(() => {
    setIsOpened(Boolean(settings.isOpened));
    setAcceptsQueue(Boolean(settings.acceptsQueue));
  }, [settings]);

  const updateMutation = useUpdateRestaurantProfile();
  const isSaving = updateMutation.isPending;

  const handleCancel = () => {
    setIsOpened(Boolean(settings.isOpened));
    setAcceptsQueue(Boolean(settings.acceptsQueue));
  };

  const initialIsOpened = Boolean(settings.isOpened);
  const initialAcceptsQueue = Boolean(settings.acceptsQueue);

  const isDirty =
    isOpened !== initialIsOpened || (hasQueuePro && acceptsQueue !== initialAcceptsQueue);

  const handleSave = () => {
    if (!isDirty || isSaving) return;

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
        ...fullData.settings,
        isOpened,
        acceptsQueue: hasQueuePro ? acceptsQueue : false,
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

  return (
    <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
            {RESTAURANT_SETTINGS_MESSAGES.TITLE}
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            {RESTAURANT_SETTINGS_MESSAGES.SUBTITLE}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
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
              <span>{RESTAURANT_SETTINGS_MESSAGES.CANCEL}</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            data-testid="save-settings-button"
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
                <span>{RESTAURANT_SETTINGS_MESSAGES.UPDATING}</span>
              </>
            ) : (
              <>
                <Check className="size-3.5 mr-1.5" />
                <span>{RESTAURANT_SETTINGS_MESSAGES.UPDATE_SETTINGS}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Store Open / Closed Status Card */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#f3e6de] bg-[#fffcf9] p-5 transition-all">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#fef3ec] text-[#e8631b] shrink-0 mt-0.5">
              <Store className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-neutral-900 leading-tight">
                  Store Open Status
                </p>
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide border",
                    isOpened
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-neutral-100 text-neutral-600 border-neutral-200",
                  )}
                >
                  {isOpened
                    ? RESTAURANT_SETTINGS_MESSAGES.STATUS_OPEN
                    : RESTAURANT_SETTINGS_MESSAGES.STATUS_CLOSED}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 leading-snug">
                Open or close your restaurant for online takeaway ordering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Switch
              checked={isOpened}
              onChange={(e) => setIsOpened(e.target.checked)}
              disabled={isSaving}
              aria-label="Store Open Status"
              className="cursor-pointer"
            />
          </div>
        </div>

        {/* Virtual Queue Acceptance Card (QueuePro gated) */}
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-2xl border p-5 transition-all",
            hasQueuePro
              ? "border-[#f3e6de] bg-[#fffcf9]"
              : "border-neutral-200 bg-neutral-50/70",
          )}
        >
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-xl shrink-0 mt-0.5",
                hasQueuePro
                  ? "bg-[#fef3ec] text-[#e8631b]"
                  : "bg-neutral-200/70 text-neutral-500",
              )}
            >
              <Users className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-neutral-900 leading-tight">
                  Virtual Queue Acceptance
                </p>
                {hasQueuePro ? (
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide border",
                      acceptsQueue
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-neutral-100 text-neutral-600 border-neutral-200",
                    )}
                  >
                    {acceptsQueue
                      ? RESTAURANT_SETTINGS_MESSAGES.STATUS_ENABLED
                      : RESTAURANT_SETTINGS_MESSAGES.STATUS_DISABLED}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                    <Lock className="size-2.5" />
                    {RESTAURANT_SETTINGS_MESSAGES.QUEUE_PRO_REQUIRED_BADGE}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-1 leading-snug">
                Allow customers to join virtual takeaway queues
              </p>
              {!hasQueuePro && (
                <div className="mt-1.5">
                  <Link
                    to={RESTAURANT_ROUTES.SUBSCRIPTION}
                    className="inline-flex items-center text-[11px] font-semibold text-[#e8631b] hover:text-[#d55513] hover:underline"
                  >
                    {RESTAURANT_SETTINGS_MESSAGES.UPGRADE_LINK}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Switch
              checked={hasQueuePro && acceptsQueue}
              onChange={(e) => setAcceptsQueue(e.target.checked)}
              disabled={!hasQueuePro || isSaving}
              aria-label="Virtual Queue Acceptance"
              className={hasQueuePro ? "cursor-pointer" : "cursor-not-allowed opacity-60"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
