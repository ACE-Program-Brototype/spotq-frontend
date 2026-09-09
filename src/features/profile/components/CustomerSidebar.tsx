import { CreditCard, LogOut, ShoppingBag, Star, User as UserIcon, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils/cn";
import type { CustomerSidebarProps } from "../types/profile.types";
import { getProfileInitials } from "../utils/profile.utils";

export function CustomerSidebar({ profile, className }: CustomerSidebarProps) {
  const location = useLocation();
  const authUser = useAuthStore((state) => state.user);
  const { handleLogout, isLoading: isLoggingOut } = useLogout();

  const displayName = profile?.full_name?.trim() || authUser?.name?.trim() || "Customer";
  const initials = getProfileInitials(displayName);

  const navItems = [
    {
      label: "Profile",
      href: "/profile",
      icon: UserIcon,
      matchExact: true,
    },
    {
      label: "Orders",
      href: "/orders",
      icon: ShoppingBag,
    },
    {
      label: "Queues",
      href: "/queues",
      icon: Users,
    },
    {
      label: "Loyalties",
      href: "/loyalties",
      icon: Star,
    },
    {
      label: "Payments",
      href: "/payments",
      icon: CreditCard,
    },
  ];

  return (
    <aside
      className={cn(
        "hidden lg:flex w-64 shrink-0 flex-col justify-between rounded-3xl bg-neutral-50/70 p-4 border border-neutral-200/60 shadow-2xs box-border",
        className,
      )}
      style={{ minHeight: "calc(100vh - 8rem)" }}
    >
      {/* Navigation items */}
      <nav className="flex flex-col gap-1.5" aria-label="Customer Account Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.matchExact
            ? location.pathname === item.href || location.pathname.startsWith("/profile")
            : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all select-none",
                isActive
                  ? "bg-[#ff6b00] text-white shadow-sm font-semibold"
                  : "text-neutral-600 hover:bg-neutral-100/90 hover:text-neutral-900",
              )}
            >
              <Icon
                className={cn("size-4.5 shrink-0", isActive ? "text-white" : "text-neutral-500")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Info & Logout */}
      <div className="mt-8 flex flex-col gap-3 pt-4 border-t border-neutral-200/60">
        <div className="flex items-center gap-3 px-2">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fde1cb] text-[#4a2e18] text-xs font-bold ring-1 ring-[#f7cbb1]">
            {initials}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-bold text-neutral-900">{displayName}</span>
            <span className="truncate text-xs font-medium text-neutral-500">Customer Account</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center justify-start gap-2.5 w-full rounded-2xl bg-neutral-200/70 px-4 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-300/80 transition-colors disabled:opacity-60 cursor-pointer select-none"
        >
          <LogOut className="size-4 text-neutral-700" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}
