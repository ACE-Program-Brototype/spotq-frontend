import { Bell, BellOff, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NOTIFICATION_PERMISSIONS } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils/cn";

export interface NotificationBannerProps {
  permission: NotificationPermission | typeof NOTIFICATION_PERMISSIONS.UNSUPPORTED;
  enableNotifications: () => Promise<boolean>;
  isSupported: boolean;
  isLoading: boolean;
  className?: string;
}

export function NotificationBanner({
  permission,
  enableNotifications,
  isSupported,
  isLoading,
  className,
}: NotificationBannerProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [dismissed, setDismissed] = useState(false);
  const [prevPermission, setPrevPermission] = useState(permission);

  // Reset dismissal if permission changes (e.g. user toggles in browser settings)
  if (prevPermission !== permission) {
    setPrevPermission(permission);
    setDismissed(false);
  }

  if (!isAuthenticated || !isSupported || dismissed) {
    return null;
  }

  // Permission already granted or unsupported: no banner needed
  if (
    permission === NOTIFICATION_PERMISSIONS.GRANTED ||
    permission === NOTIFICATION_PERMISSIONS.UNSUPPORTED
  ) {
    return null;
  }

  const isBlocked = permission === NOTIFICATION_PERMISSIONS.DENIED;

  return (
    <aside
      role="status"
      aria-live="polite"
      className={cn(
        "relative w-full border-b transition-all duration-200 select-none",
        isBlocked
          ? "border-amber-200/80 bg-amber-50/90 text-amber-950"
          : "border-orange-200/80 bg-orange-50/90 text-neutral-900",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full",
              isBlocked ? "bg-amber-200/70 text-amber-800" : "bg-[#ff6b00]/15 text-[#ff6b00]",
            )}
          >
            {isBlocked ? <BellOff className="size-4" /> : <Bell className="size-4" />}
          </div>

          <div className="min-w-0 flex-1">
            {isBlocked ? (
              <p className="leading-snug">
                <span className="font-semibold text-amber-900">Notifications are blocked.</span>{" "}
                <span className="hidden sm:inline">
                  To receive live queue and table alerts, enable notifications in your
                  browser&apos;s site settings (lock icon in URL bar).
                </span>
                <span className="inline sm:hidden">
                  Enable notifications in site settings for live queue alerts.
                </span>
              </p>
            ) : (
              <p className="leading-snug">
                <span className="font-semibold text-neutral-900">Get real-time updates!</span>{" "}
                <span className="hidden sm:inline">
                  Enable notifications to receive live alerts about your table reservations and
                  queue status.
                </span>
                <span className="inline sm:hidden">
                  Stay updated on your table & queue status in real time.
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isBlocked && (
            <Button
              type="button"
              size="sm"
              onClick={() => enableNotifications()}
              disabled={isLoading}
              className="h-7.5 px-3 rounded-full bg-[#ff6b00] hover:bg-[#e05f00] text-white text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Enabling...
                </>
              ) : (
                "Enable"
              )}
            </Button>
          )}

          <button
            type="button"
            aria-label="Dismiss banner"
            onClick={() => setDismissed(true)}
            className="flex size-7 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-800 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
