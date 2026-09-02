import {
  Briefcase,
  ChevronDown,
  CreditCard,
  DollarSign,
  Grid,
  type LayoutDashboard,
  LogOut,
  Megaphone,
  Receipt,
  Settings,
  Store,
  Users,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils/cn";

export interface RestaurantAdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
  basePath?: string;
  onLogout?: () => void;
}

interface NavSubItem {
  title: string;
  href: string;
}

interface NavItem {
  title: string;
  href?: string;
  icon: typeof LayoutDashboard;
  children?: NavSubItem[];
}

export function RestaurantAdminSidebar({
  className,
  onNavigate,
  basePath = "/restaurant",
  onLogout,
}: RestaurantAdminSidebarProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const adminNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: `${basePath}/dashboard`,
      icon: Grid,
    },
    {
      title: "Restaurant",
      href: `${basePath}/profile`,
      icon: Store,
      children: [
        { title: "Profile", href: `${basePath}/profile` },
        { title: "Overview", href: `${basePath}/overview` },
        { title: "QR Management", href: `${basePath}/qr-management` },
        { title: "Tables", href: `${basePath}/tables` },
      ],
    },
    {
      title: "Menu",
      href: `${basePath}/menu`,
      icon: Utensils,
      children: [
        { title: "Overview", href: `${basePath}/menu/overview` },
        { title: "Categories", href: `${basePath}/menu/categories` },
        { title: "Items", href: `${basePath}/menu/items` },
        { title: "Modifiers", href: `${basePath}/menu/modifiers` },
        { title: "Availability", href: `${basePath}/menu/availability` },
      ],
    },
    {
      title: "Customers",
      href: `${basePath}/customers`,
      icon: Users,
      children: [
        { title: "Directory", href: `${basePath}/customers/directory` },
        { title: "Intelligence", href: `${basePath}/customers/intelligence` },
        { title: "Analytics", href: `${basePath}/customers/analytics` },
      ],
    },
    {
      title: "Staff",
      href: `${basePath}/staff`,
      icon: Briefcase,
    },
    {
      title: "Payments",
      href: `${basePath}/payments`,
      icon: Receipt,
      children: [
        { title: "Overview", href: `${basePath}/payments/overview` },
        { title: "History", href: `${basePath}/payments/history` },
        { title: "Gateway", href: `${basePath}/payments/gateway` },
        { title: "Refunds", href: `${basePath}/payments/refunds` },
      ],
    },
    {
      title: "Finance",
      href: `${basePath}/finance`,
      icon: DollarSign,
      children: [
        { title: "Overview", href: `${basePath}/finance/overview` },
        { title: "Transactions", href: `${basePath}/finance/transactions` },
        { title: "Revenue", href: `${basePath}/finance/revenue` },
        { title: "Settlements", href: `${basePath}/finance/settlements` },
      ],
    },
    {
      title: "Marketing",
      href: `${basePath}/marketing`,
      icon: Megaphone,
      children: [
        { title: "Dashboard", href: `${basePath}/marketing/dashboard` },
        { title: "Campaigns", href: `${basePath}/marketing/campaigns` },
        { title: "Coupons", href: `${basePath}/marketing/coupons` },
        { title: "Analytics", href: `${basePath}/marketing/analytics` },
      ],
    },
    {
      title: "Subscription",
      href: `${basePath}/subscription`,
      icon: CreditCard,
      children: [
        { title: "Overview", href: `${basePath}/subscription/overview` },
        { title: "Billing", href: `${basePath}/subscription/billing` },
        { title: "Invoices", href: `${basePath}/subscription/invoices` },
      ],
    },
    {
      title: "Settings",
      href: `${basePath}/settings`,
      icon: Settings,
      children: [
        { title: "Account", href: `${basePath}/settings/account` },
        { title: "Security", href: `${basePath}/settings/security` },
      ],
    },
  ];

  // Open default section or section with active route
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Restaurant: true,
  });

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "JD";

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col justify-between bg-[#fffcf9] border-r border-[#f3e6de] px-3.5 py-6 select-none overflow-y-auto",
        className,
      )}
    >
      {/* Top Section: Brand & Nav Links */}
      <div className="flex flex-col gap-6">
        <div className="px-3 pt-1">
          <h1 className="text-xl font-bold tracking-tight text-[#8a3b14]">SpotQ</h1>
          <p className="text-xs font-medium text-neutral-400">Admin Portal</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1" aria-label="Restaurant Admin Navigation">
          {adminNavItems.map((item) => {
            const Icon = item.icon;

            if (item.children) {
              const isChildActive = item.children.some(
                (child) =>
                  location.pathname === child.href ||
                  location.pathname.startsWith(`${child.href}/`),
              );
              const isParentActive =
                isChildActive || (item.href && location.pathname === item.href);
              const isOpen = openSections[item.title] ?? isParentActive;

              return (
                <div key={item.title} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => toggleSection(item.title)}
                    className={cn(
                      "relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all",
                      isParentActive
                        ? "bg-[#fef3ec] text-[#9a3412]"
                        : "text-neutral-700 hover:bg-[#faf0e8]/60 hover:text-neutral-900",
                    )}
                  >
                    {/* Active Left Vertical Accent Bar */}
                    {isParentActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#9a3412]" />
                    )}

                    <div className="flex items-center gap-2.5 pl-1.5">
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          isParentActive ? "text-[#9a3412]" : "text-neutral-600",
                        )}
                      />
                      <span>{item.title}</span>
                    </div>

                    <ChevronDown
                      className={cn(
                        "size-3.5 text-neutral-400 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {/* Submenu links */}
                  {isOpen && (
                    <div className="ml-7 mt-1 flex flex-col gap-1 border-l border-[#eddcd4] pl-3 py-1">
                      {item.children.map((sub) => {
                        const isSubActive =
                          location.pathname === sub.href ||
                          location.pathname.startsWith(`${sub.href}/`);

                        return (
                          <Link
                            key={sub.title}
                            to={sub.href}
                            onClick={onNavigate}
                            className={cn(
                              "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
                              isSubActive
                                ? "text-[#9a3412] font-bold"
                                : "text-neutral-500 hover:text-neutral-800",
                            )}
                          >
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive =
              location.pathname === item.href ||
              (item.href?.endsWith("/dashboard") &&
                (location.pathname === basePath || location.pathname === `${basePath}/`));

            return (
              <Link
                key={item.title}
                to={item.href ?? "#"}
                onClick={onNavigate}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all",
                  isActive
                    ? "bg-[#fef3ec] text-[#9a3412]"
                    : "text-neutral-700 hover:bg-[#faf0e8]/60 hover:text-neutral-900",
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#9a3412]" />
                )}
                <Icon
                  className={cn(
                    "size-4 shrink-0 pl-0.5",
                    isActive ? "text-[#9a3412]" : "text-neutral-600",
                  )}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Pill */}
      <div className="pt-4 mt-6 border-t border-[#f3e6de]">
        <div className="flex items-center justify-between rounded-2xl bg-[#fef3ec] p-2.5 shadow-2xs border border-[#fae2d3]">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-8.5 rounded-xl bg-[#e8631b] text-white font-bold shrink-0">
              <AvatarFallback className="bg-[#e8631b] text-white text-xs font-bold rounded-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-neutral-900 leading-tight">
                {user?.name ?? "Jane Doe"}
              </p>
              <p className="text-[10px] font-medium text-neutral-500">Global Admin</p>
            </div>
          </div>

          <ConfirmDialog
            trigger={
              <button
                type="button"
                aria-label="Logout"
                className="size-7 rounded-lg flex items-center justify-center text-neutral-600 hover:text-destructive hover:bg-white/80 transition-colors shrink-0"
              >
                <LogOut className="size-3.5" />
              </button>
            }
            title="Sign Out"
            description="Are you sure you want to end your session?"
            confirmText="Sign Out"
            confirmVariant="destructive"
            onConfirm={() => onLogout?.()}
          />
        </div>
      </div>
    </aside>
  );
}

export default RestaurantAdminSidebar;
