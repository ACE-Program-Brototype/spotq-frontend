import { Bell, Menu, Search, Utensils } from "lucide-react";
import type { HTMLAttributes } from "react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils/cn";

export interface RestaurantAdminNavbarProps extends HTMLAttributes<HTMLElement> {
  restaurantName?: string;
  onToggleSidebar?: () => void;
  onSearch?: (query: string) => void;
  unreadNotifications?: number;
}

export function RestaurantAdminNavbar({
  restaurantName = "Basil Mandi",
  onToggleSidebar,
  onSearch,
  unreadNotifications = 1,
  className,
  ...props
}: RestaurantAdminNavbarProps) {
  const user = useAuthStore((state) => state.user);
  const [searchValue, setSearchValue] = useState("");

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "JD";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 w-full max-w-full items-center justify-between border-b border-[#f3e6de] bg-[#fffcf9] px-4 sm:px-6 lg:px-8 shadow-2xs box-border transition-all",
        className,
      )}
      {...props}
    >
      {/* Left: Mobile Toggle / Brand / Restaurant Name & Search */}
      <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0 pr-2">
        {onToggleSidebar && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="lg:hidden text-neutral-600 hover:bg-[#fae2d3]/50 hover:text-neutral-900 shrink-0"
          >
            <Menu className="size-5" />
          </Button>
        )}

        {/* Brand info (visible when sidebar is closed or on mobile) */}
        <div className="flex items-center gap-2.5 lg:hidden shrink-0">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#e8631b] text-white shadow-xs">
            <Utensils className="size-4.5" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#8a3b14]">SpotQ</span>
            <p className="text-[10px] text-neutral-400">Admin Portal</p>
          </div>
        </div>

        {/* Restaurant Name */}
        <div className="hidden sm:block shrink-0">
          <h2 className="text-sm sm:text-base font-bold tracking-tight text-[#8a3b14]">
            {restaurantName}
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md flex-1 hidden md:block">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search orders, menu, customers..."
            className="h-9 w-full rounded-full border border-[#f0ded4] bg-[#fcf5f0]/80 pl-9 pr-4 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-[#e8631b] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#e8631b]/30 transition-all"
          />
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification Bell */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
          className="relative size-8 text-neutral-600 hover:bg-[#fae2d3]/50 hover:text-neutral-900 rounded-full shrink-0"
        >
          <Bell className="size-4" />
          {unreadNotifications > 0 && (
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#e8631b]" />
          )}
        </Button>

        <span className="h-4 w-px bg-[#eddcd4] hidden sm:block" />

        {/* Profile */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-800 hidden sm:inline">Profile</span>
          <Avatar className="size-8 rounded-full bg-[#3d271d] text-white shadow-xs border border-[#eddcd4]">
            <AvatarFallback className="bg-[#3d271d] text-white text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

export default RestaurantAdminNavbar;
