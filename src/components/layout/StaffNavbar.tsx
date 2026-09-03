import { Bell, LogOut } from "lucide-react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useStaffLogout } from "@/features/auth/hooks/useStaffLogout";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils/cn";
import type { StaffNavbarProps } from "./types";

export type { StaffNavbarProps };

export function StaffNavbar({ unreadNotifications = 1, className, ...props }: StaffNavbarProps) {
  const user = useAuthStore((state) => state.user);
  const { handleStaffLogout, isLoading } = useStaffLogout();

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "JD";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 w-full max-w-full items-center justify-between border-b border-[#eddcd4] bg-white/95 px-3 sm:px-6 lg:px-8 backdrop-blur shadow-2xs box-border",
        className,
      )}
      {...props}
    >
      {/* Left: Staff Profile */}
      <div className="flex items-center gap-2.5 min-w-0 overflow-hidden pr-2">
        <Avatar className="size-8.5 sm:size-9 bg-[#9a3412] text-white font-bold shrink-0 shadow-xs border border-[#eddcd4]">
          <AvatarFallback className="bg-[#9a3412] text-white text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 overflow-hidden">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
              {user?.name ?? "John Doe"}
            </span>
            <span className="inline-flex shrink-0 items-center rounded-md bg-[#9a3412]/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#9a3412] uppercase tracking-wider">
              {user?.role?.replace("RESTAURANT_", "") ?? "STAFF"}
            </span>
          </div>
          <p className="truncate text-[10px] sm:text-[11px] text-neutral-500 hidden sm:block">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Right: Notifications & Clock Out / Logout Action */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Notification Bell */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
          className="relative size-8 sm:size-9 text-neutral-600 hover:bg-[#eddcd4]/40 hover:text-neutral-900 rounded-full shrink-0"
        >
          <Bell className="size-4 sm:size-4.5" />
          {unreadNotifications > 0 && (
            <span className="absolute right-1 top-1 flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#9a3412] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#9a3412]" />
            </span>
          )}
        </Button>

        {/* Clock Out / Logout */}
        <ConfirmDialog
          trigger={
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isLoading}
              aria-label="Clock out / Log out"
              className="size-8 sm:size-9 text-neutral-500 hover:text-destructive hover:bg-destructive/10 rounded-full shrink-0"
            >
              <LogOut className="size-4 sm:size-4.5" />
            </Button>
          }
          title="Clock Out & Logout"
          description={`Are you sure you want to clock out and end your shift, ${user?.name || "Staff"}?`}
          confirmText="Clock Out"
          confirmVariant="destructive"
          isLoading={isLoading}
          onConfirm={handleStaffLogout}
        />
      </div>
    </header>
  );
}

export default StaffNavbar;
