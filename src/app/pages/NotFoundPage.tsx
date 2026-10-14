import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Building2,
  Compass,
  Home,
  LayoutDashboard,
  Sparkles,
  UserCheck,
  UtensilsCrossed,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ADMIN_ROUTES,
  CUSTOMER_ROUTES,
  RESTAURANT_ROUTES,
  STAFF_ROUTES,
} from "@/app/router/routes.constants";
import spotqLogo from "@/assets/logos/spotq-logo.png";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { User } from "@/features/auth/types/auth.types";

interface DestinationConfig {
  path: string;
  label: string;
  portalName: string;
  quickLinks: Array<{ label: string; path: string; icon: LucideIcon }>;
}

function getNavigationConfig(user: User | null, pathname: string): DestinationConfig {
  const role = user?.role;

  if (role === "ADMIN") {
    return {
      path: ADMIN_ROUTES.DASHBOARD,
      label: "Go to Admin Dashboard",
      portalName: "Admin Console",
      quickLinks: [
        { label: "Restaurants", path: ADMIN_ROUTES.RESTAURANTS, icon: Building2 },
        { label: "Customers", path: ADMIN_ROUTES.CUSTOMERS, icon: UserCheck },
      ],
    };
  }

  if (role === "RESTAURANT_ADMIN") {
    return {
      path: RESTAURANT_ROUTES.DASHBOARD,
      label: "Go to Partner Dashboard",
      portalName: "Restaurant Partner Portal",
      quickLinks: [
        { label: "Menu Items", path: RESTAURANT_ROUTES.MENU.ITEMS, icon: UtensilsCrossed },
        { label: "Staff Team", path: RESTAURANT_ROUTES.STAFF.ROOT, icon: UserCheck },
      ],
    };
  }

  if (role === "STAFF") {
    return {
      path: STAFF_ROUTES.DASHBOARD,
      label: "Go to Staff Dashboard",
      portalName: "Staff Portal",
      quickLinks: [
        { label: "Dashboard", path: STAFF_ROUTES.DASHBOARD, icon: LayoutDashboard },
        { label: "My Profile", path: STAFF_ROUTES.PROFILE.ROOT, icon: UserCheck },
      ],
    };
  }

  if (role === "CUSTOMER") {
    return {
      path: CUSTOMER_ROUTES.HOME,
      label: "Return to Home",
      portalName: "SpotQ Dining",
      quickLinks: [
        { label: "Explore Restaurants", path: CUSTOMER_ROUTES.HOME, icon: Compass },
        { label: "My Orders", path: CUSTOMER_ROUTES.ORDERS, icon: UtensilsCrossed },
      ],
    };
  }

  // Unauthenticated visitors - determine destination by route context
  if (pathname.startsWith(ADMIN_ROUTES.ROOT)) {
    return {
      path: ADMIN_ROUTES.LOGIN,
      label: "Go to Admin Sign In",
      portalName: "Admin Console",
      quickLinks: [
        { label: "Admin Sign In", path: ADMIN_ROUTES.LOGIN, icon: LayoutDashboard },
        { label: "Explore SpotQ", path: CUSTOMER_ROUTES.HOME, icon: Home },
      ],
    };
  }

  if (pathname.startsWith(RESTAURANT_ROUTES.ROOT)) {
    return {
      path: RESTAURANT_ROUTES.LOGIN,
      label: "Go to Partner Portal",
      portalName: "Restaurant Partner Portal",
      quickLinks: [
        { label: "Partner Login", path: RESTAURANT_ROUTES.LOGIN, icon: Building2 },
        { label: "Explore SpotQ", path: CUSTOMER_ROUTES.HOME, icon: Home },
      ],
    };
  }

  if (pathname.startsWith(STAFF_ROUTES.ROOT)) {
    return {
      path: STAFF_ROUTES.LOGIN,
      label: "Go to Staff Sign In",
      portalName: "Staff Portal",
      quickLinks: [
        { label: "Staff Login", path: STAFF_ROUTES.LOGIN, icon: UserCheck },
        { label: "Explore SpotQ", path: CUSTOMER_ROUTES.HOME, icon: Home },
      ],
    };
  }

  // Default guest visitor
  return {
    path: CUSTOMER_ROUTES.HOME,
    label: "Return to Home",
    portalName: "SpotQ Dining",
    quickLinks: [
      { label: "Explore Restaurants", path: CUSTOMER_ROUTES.HOME, icon: Compass },
      { label: "About SpotQ", path: CUSTOMER_ROUTES.ABOUT, icon: Sparkles },
    ],
  };
}

export function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const navConfig = getNavigationConfig(user, location.pathname);

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(navConfig.path);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-b from-[#fffbf8] via-[#fffdfb] to-[#faf5f0] text-neutral-900">
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-gradient-to-br from-[#ff6b00]/15 to-[#e8631b]/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-gradient-to-tl from-[#ff8c37]/15 to-[#fae2d3]/20 blur-3xl"
      />

      {/* Brand Header */}
      <header className="relative z-10 flex h-20 w-full items-center justify-between border-b border-[#eddcd4]/80 bg-white/70 px-6 sm:px-12 backdrop-blur-md">
        <Link
          to={navConfig.path}
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
          aria-label="SpotQ Home"
        >
          <div className="flex size-10 items-center justify-center rounded-2xl border border-[#fae2d3] bg-white shadow-2xs">
            <img src={spotqLogo} alt="SpotQ" className="size-6 object-contain" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black tracking-tight text-neutral-900">SpotQ</span>
            <span className="text-xs font-semibold text-[#e8631b]">&bull;</span>
            <span className="text-xs font-medium text-neutral-500">{navConfig.portalName}</span>
          </div>
        </Link>

        {user?.role && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#fae2d3] bg-[#fff6f0] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9a3412] shadow-2xs">
            <span className="size-1.5 rounded-full bg-[#e8631b]" />
            {user.role.replace("_", " ")}
          </span>
        )}
      </header>

      {/* Main 404 Hero Section */}
      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        {/* Visual 404 & Icon Cluster */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="select-none text-8xl sm:text-9xl font-black tracking-tighter text-neutral-200/80 drop-shadow-xs">
            404
          </div>
          <div className="absolute flex size-18 items-center justify-center rounded-3xl border border-[#fae2d3] bg-gradient-to-br from-white to-[#fff5ee] text-[#e8631b] shadow-lg shadow-orange-500/10 animate-bounce duration-1000">
            <UtensilsCrossed className="size-8" />
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-3.5 py-1 text-xs font-bold text-amber-800 shadow-2xs">
          <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Table or Resource Not Found</span>
        </div>

        {/* Heading & Context */}
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          We couldn&apos;t find this page
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-600">
          The requested page at{" "}
          <code className="inline-block rounded-md border border-[#eddcd4] bg-white px-2 py-0.5 font-mono text-xs font-semibold text-[#e8631b] shadow-2xs break-all">
            {location.pathname || "/unknown"}
          </code>{" "}
          might have been moved, removed, or does not exist.
        </p>

        {/* User-Tailored Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={navConfig.path}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e8631b] to-[#ff6b00] px-6 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:from-[#d45614] hover:to-[#ea580c] hover:shadow-lg active:scale-[0.98]"
          >
            <Home className="size-4" />
            <span>{navConfig.label}</span>
          </Link>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoBack}
            className="h-11 rounded-xl border-[#eddcd4] bg-white px-5 text-sm font-semibold text-neutral-700 shadow-2xs hover:border-[#dfc4b8] hover:bg-neutral-50 active:scale-[0.98]"
          >
            <ArrowLeft className="size-4 text-neutral-500" />
            <span>Go Back</span>
          </Button>
        </div>

        {/* Helpful Quick Links */}
        <div className="mt-12 w-full max-w-md rounded-2xl border border-[#eddcd4]/80 bg-white/80 p-5 backdrop-blur-xs shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Suggested Destinations
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {navConfig.quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50/70 p-2.5 text-left text-xs font-semibold text-neutral-700 transition-all hover:border-[#fae2d3] hover:bg-[#fff9f5] hover:text-[#e8631b]"
                >
                  <div className="flex size-7 items-center justify-center rounded-lg bg-white text-[#e8631b] shadow-2xs">
                    <Icon className="size-3.5" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#eddcd4]/70 bg-white/50 px-6 py-4 text-center text-xs text-neutral-400 backdrop-blur-xs">
        SpotQ Technologies &copy; {new Date().getFullYear()} &middot; Smart Dining &amp; Queue
        Management Platform
      </footer>
    </div>
  );
}

export default NotFoundPage;
