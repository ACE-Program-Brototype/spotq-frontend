/**
 * Customer Navigation Bar & Mobile Bottom Navigation Components
 * Provides branding, global search, shopping cart access, notifications, and customer authentication links.
 */

import { Bell, Home, Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import spotqLogo from "@/assets/logos/spotq-logo.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils/cn";
import type { CustomerMobileNavProps, CustomerNavbarProps } from "./types";

export type { CustomerMobileNavProps, CustomerNavbarProps };

export function CustomerNavbar({
  cartItemCount = 0,
  unreadNotifications = 1,
  onSearch,
  className,
  ...props
}: CustomerNavbarProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full max-w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur shadow-2xs box-border transition-all",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 select-none">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white shadow-xs border border-neutral-100">
            <img src={spotqLogo} alt="spotQ" className="size-5.5 object-contain" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#ff6b00]">spotQ</span>
        </Link>

        <div className="mx-6 hidden max-w-lg flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for your favorite food or restaurant..."
              className="h-10 w-full rounded-full border border-neutral-200 bg-neutral-100/70 pl-11 pr-4 text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 transition-all focus:border-[#ff6b00] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff6b00]/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Search"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className="md:hidden text-neutral-700 hover:bg-neutral-100 rounded-full"
          >
            <Search className="size-5" />
          </Button>

          <Link
            to="/cart"
            aria-label="Shopping Cart"
            className="relative flex size-9 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <ShoppingCart className="size-5" />
            {cartItemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-[#ff6b00] text-[10px] font-bold text-white shadow-xs">
                {cartItemCount}
              </span>
            )}
          </Link>

          <Link
            to="/notifications"
            aria-label="Notifications"
            className="relative hidden sm:flex size-9 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <Bell className="size-5" />
            {unreadNotifications > 0 && (
              <span className="absolute right-2 top-2 size-2 rounded-full bg-[#ff6b00] ring-2 ring-white" />
            )}
          </Link>

          {user ? (
            <Link to="/profile" aria-label="My Profile" className="flex items-center gap-2 pl-1">
              <Avatar className="size-8.5 bg-[#1c1714] text-white font-bold border border-neutral-200">
                <AvatarFallback className="bg-[#1c1714] text-white text-xs font-bold">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link
              to="/login"
              state={{ from: location }}
              className="flex size-9 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Sign In"
            >
              <User className="size-5" />
            </Link>
          )}
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-2.5 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search food or restaurant..."
              className="h-9 w-full rounded-full border border-neutral-200 bg-white pl-9 pr-4 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-[#ff6b00] focus:outline-none focus:ring-1 focus:ring-[#ff6b00]/30"
            />
          </div>
        </div>
      )}
    </header>
  );
}

export function CustomerMobileNav({
  cartItemCount = 0,
  unreadNotifications = 0,
  className,
}: CustomerMobileNavProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const navTabs = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Cart",
      href: "/cart",
      icon: ShoppingCart,
      badge: cartItemCount,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
      badge: unreadNotifications,
    },
    {
      label: "Profile",
      href: user ? "/profile" : "/login",
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
              "relative flex flex-col items-center justify-center gap-1 py-1 px-3 text-center transition-all",
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

export default CustomerNavbar;
