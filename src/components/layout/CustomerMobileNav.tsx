import { Home, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils/cn";
import type { CustomerMobileNavProps } from "./types";

export function CustomerMobileNav({
  cartItemCount = 0,
  className,
}: CustomerMobileNavProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const navTabs = [
    {
      label: "Home",
      href: CUSTOMER_ROUTES.HOME,
      icon: Home,
    },
    {
      label: "Cart",
      href: "/cart",
      icon: ShoppingCart,
      badge: cartItemCount,
    },
    {
      label: "Profile",
      href: user ? CUSTOMER_ROUTES.PROFILE.ROOT : CUSTOMER_ROUTES.AUTH.LOGIN,
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Customer Mobile Navigation"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 flex h-16 w-full max-w-full items-center justify-around border-t border-neutral-200/80 bg-white px-2 shadow-lg md:hidden box-border select-none",
        className,
      )}
    >
      {navTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          location.pathname === tab.href ||
          (tab.href === "/" && (location.pathname === "" || location.pathname === "/restaurants"));

        return (
          <Link
            key={tab.label}
            to={tab.href}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 py-1 px-3 text-center transition-colors",
              isActive
                ? "text-[#ff6b00] font-bold"
                : "text-neutral-500 hover:text-neutral-800 font-medium",
            )}
          >
            <div className="relative flex size-6 items-center justify-center">
              <Icon className={cn("size-5 transition-transform", isActive && "scale-105")} />
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="absolute -top-1 -right-1.5 flex size-4 items-center justify-center rounded-full bg-[#ff6b00] text-[9px] font-bold text-white shadow-xs">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-tight">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

