/**
 * Customer Navigation Bar & Mobile Bottom Navigation Components
 * Provides branding, global search, shopping cart access, notifications, and customer authentication links.
 */

import { LogOut, Search, ShoppingCart, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import spotqLogo from "@/assets/logos/spotq-logo.png";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils/cn";
import type { CustomerMobileNavProps, CustomerNavbarProps } from "./types";

export type { CustomerMobileNavProps, CustomerNavbarProps };

export function CustomerNavbar({
  cartItemCount = 0,
  onSearch,
  className,
  ...props
}: CustomerNavbarProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isHomePage = location.pathname === CUSTOMER_ROUTES.HOME;

  const [searchQuery, setSearchQuery] = useState(
    location.pathname === CUSTOMER_ROUTES.HOME ? (searchParams.get("search") ?? "") : "",
  );
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Automatically close mobile search drawer if navigated to home
  useEffect(() => {
    if (location.pathname === CUSTOMER_ROUTES.HOME) {
      setSearchQuery(searchParams.get("search") ?? "");
      setMobileSearchOpen(false);
    }
  }, [searchParams, location.pathname]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch?.(val);

    if (location.pathname === CUSTOMER_ROUTES.HOME) {
      const nextParams = new URLSearchParams(searchParams);
      if (val.trim()) {
        nextParams.set("search", val.trim());
        nextParams.delete("page");
      } else {
        nextParams.delete("search");
      }
      setSearchParams(nextParams, { replace: true });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const val = searchQuery.trim();
    navigate(
      val ? `${CUSTOMER_ROUTES.HOME}?search=${encodeURIComponent(val)}` : CUSTOMER_ROUTES.HOME,
    );
    setMobileSearchOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && location.pathname !== CUSTOMER_ROUTES.HOME) {
      e.preventDefault();
      const val = searchQuery.trim();
      navigate(
        val ? `${CUSTOMER_ROUTES.HOME}?search=${encodeURIComponent(val)}` : CUSTOMER_ROUTES.HOME,
      );
      setMobileSearchOpen(false);
    }
  };

  const displayName = user?.fullName || user?.name || user?.email?.split("@")[0] || "";
  const nameParts = displayName.trim().split(/\s+/).filter(Boolean);
  const initials =
    nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nameParts.length === 1 && nameParts[0].length >= 2
        ? nameParts[0].slice(0, 2).toUpperCase()
        : nameParts[0]?.[0]?.toUpperCase() || "AJ";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full max-w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur shadow-2xs box-border transition-colors",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={CUSTOMER_ROUTES.HOME} className="flex items-center gap-2.5 shrink-0 select-none">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white shadow-xs border border-neutral-100">
            <img src={spotqLogo} alt="spotQ" className="size-5.5 object-contain" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#ff6b00]">spotQ</span>
        </Link>

        {!isHomePage && (
          <form onSubmit={handleSearchSubmit} className="mx-6 hidden max-w-lg flex-1 md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search for your favorite food or restaurant..."
                className="h-10 w-full rounded-full border border-neutral-200 bg-neutral-100/70 pl-11 pr-4 text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 transition-colors focus:border-[#ff6b00] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff6b00]/30"
              />
            </div>
          </form>
        )}

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {!isHomePage && (
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
          )}

          <Link
            to={CUSTOMER_ROUTES.CART}
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

          {user ? (
            <CustomerAccountMenu initials={initials} />
          ) : (
            <Link
              to={CUSTOMER_ROUTES.AUTH.LOGIN}
              state={{ from: location }}
              className="flex size-9 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Sign In"
            >
              <User className="size-5" />
            </Link>
          )}
        </div>
      </div>

      {!isHomePage && mobileSearchOpen && (
        <form
          onSubmit={handleSearchSubmit}
          className="border-t border-neutral-100 bg-neutral-50 px-4 py-2.5 md:hidden"
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search food or restaurant..."
              className="h-9 w-full rounded-full border border-neutral-200 bg-white pl-9 pr-4 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-[#ff6b00] focus:outline-none focus:ring-1 focus:ring-[#ff6b00]/30"
            />
          </div>
        </form>
      )}
    </header>
  );
}

function CustomerAccountMenu({ initials }: { initials: string }) {
  const { handleLogout, isLoading: isLoggingOut } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close account menu dropdown on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative pl-1">
      <button
        type="button"
        aria-label="Open account menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b00] cursor-pointer"
      >
        <Avatar className="size-8.5 bg-[#1c1714] text-white font-bold border border-neutral-200">
          <AvatarFallback className="bg-[#1c1714] text-white text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg">
          <Link
            to={CUSTOMER_ROUTES.PROFILE.ROOT}
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            My profile
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setShowLogoutConfirm(true);
            }}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60 cursor-pointer"
          >
            <LogOut className="size-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}

      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Log Out"
        description="Are you sure you want to end your session?"
        confirmText="Log Out"
        confirmVariant="destructive"
        isLoading={isLoggingOut}
        loadingText="Logging out..."
        onConfirm={handleLogout}
      />
    </div>
  );
}

export { CustomerMobileNav } from "./CustomerMobileNav";

export default CustomerNavbar;
