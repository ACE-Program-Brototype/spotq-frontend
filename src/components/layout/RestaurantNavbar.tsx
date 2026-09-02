import { Bell, Menu } from "lucide-react";
import type { HTMLAttributes } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils/cn";

export interface RestaurantNavbarProps extends HTMLAttributes<HTMLElement> {
  onToggleSidebar?: () => void;
  unreadNotifications?: number;
}

export function RestaurantNavbar({
  onToggleSidebar,
  unreadNotifications = 1,
  className,
  ...props
}: RestaurantNavbarProps) {
  const user = useAuthStore((state) => state.user);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "AJ";

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[#eddcd4] bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur shadow-2xs transition-all",
        className,
      )}
      {...props}
    >
      {/* Left: Mobile Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="lg:hidden text-neutral-600 hover:bg-[#eddcd4]/40 hover:text-neutral-900"
          >
            <Menu className="size-5" />
          </Button>
        )}
      </div>

      {/* Right: Notifications & Staff Profile */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        {/* Notification Bell */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
          className="relative text-neutral-600 hover:bg-[#eddcd4]/40 hover:text-neutral-900 rounded-full"
        >
          <Bell className="size-4.5" />
          {unreadNotifications > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#9a3412] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#9a3412]" />
            </span>
          )}
        </Button>

        {/* Staff Profile Capsule */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-neutral-900 leading-tight">
              {user?.name ?? "Alex Johnson"}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9a3412]">
              {user?.role ?? "MANAGER"}
            </p>
          </div>

          <Avatar className="size-8.5 bg-[#9a3412] text-white shadow-xs border border-[#eddcd4]">
            <AvatarFallback className="bg-[#9a3412] text-white text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

export default RestaurantNavbar;
