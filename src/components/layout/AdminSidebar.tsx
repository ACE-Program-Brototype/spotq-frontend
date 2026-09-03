import {
  Bell,
  ChevronDown,
  CreditCard,
  Grid,
  LogOut,
  Megaphone,
  Store,
  Tag,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import spotqLogo from "@/assets/logos/spotq-logo.png";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAdminLogout } from "@/features/auth/hooks/useAdminLogout";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils/cn";
import type { AdminSidebarProps, NavItem } from "./types";

export type { AdminSidebarProps };

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Grid,
  },
  {
    title: "Restaurants",
    icon: Store,
    children: [
      { title: "Onboarding", href: "/admin/restaurants/onboarding" },
      { title: "Restaurant Management", href: "/admin/restaurants/management" },
    ],
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Subscription",
    href: "/admin/subscription",
    icon: CreditCard,
  },
  {
    title: "Payments",
    icon: CreditCard,
    children: [
      { title: "Order Payments", href: "/admin/payments/orders" },
      { title: "Subscription Payments", href: "/admin/payments/subscriptions" },
    ],
  },
  {
    title: "Campaigns",
    href: "/admin/campaigns",
    icon: Megaphone,
  },
  {
    title: "Coupons",
    href: "/admin/coupons",
    icon: Tag,
  },
];

export function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending: isLoggingOut } = useAdminLogout();

  // Keep dropdowns expanded if a child route is active or default open for Restaurants & Payments
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Restaurants: true,
    Payments: false,
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
      .slice(0, 2) ?? "SN";

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col justify-between bg-[#f3f4f8] border-r border-slate-200/80 px-4 py-6 select-none",
        className,
      )}
    >
      {/* Top Header & Brand */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100">
            <img src={spotqLogo} alt="spotQ Logo" className="size-6 object-contain" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold tracking-tight text-[#1e3a5f]">spotQ</span>
              <span className="text-lg font-bold text-[#1e3a5f]">Console</span>
            </div>
            <p className="text-xs font-medium text-slate-500">Admin Portal</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-1.5" aria-label="Admin Navigation">
          {adminNavItems.map((item) => {
            const Icon = item.icon;

            if (item.children) {
              const isChildActive = item.children.some(
                (child) =>
                  location.pathname === child.href ||
                  location.pathname.startsWith(`${child.href}/`),
              );
              const isOpen = openSections[item.title] ?? isChildActive;

              return (
                <div key={item.title} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => toggleSection(item.title)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                      isChildActive
                        ? "text-[#1e3a5f] font-semibold"
                        : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="size-4.5 text-slate-500" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "size-4 text-slate-400 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="ml-8 mt-1 flex flex-col gap-1 border-l-2 border-slate-200/80 pl-3">
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
                              "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                              isSubActive
                                ? "text-[#1e3a5f] font-bold bg-white shadow-xs"
                                : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-800",
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
              (item.href === "/admin/dashboard" && location.pathname === "/admin");

            return (
              <Link
                key={item.title}
                to={item.href ?? "#"}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-all shadow-xs",
                  isActive
                    ? "bg-[#1e3a5f] text-white font-semibold shadow-md"
                    : "bg-transparent text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 shadow-none",
                )}
              >
                <Icon className={cn("size-4.5", isActive ? "text-white" : "text-slate-500")} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User info & Logout */}
      <div className="flex flex-col gap-3 pt-6 border-t border-slate-200/80">
        <div className="flex items-center justify-between rounded-2xl bg-white p-2.5 shadow-xs border border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-8 bg-[#0052cc] text-white font-semibold">
              <AvatarFallback className="bg-[#0052cc] text-white text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900 leading-tight">
                {user?.name ?? "Soorya Narayanan"}
              </p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {user?.role ?? "ADMINISTRATOR"}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Notifications"
            className="size-7 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 shrink-0"
          >
            <Bell className="size-3.5" />
          </Button>
        </div>

        <ConfirmDialog
          trigger={
            <Button
              variant="ghost"
              size="sm"
              disabled={isLoggingOut}
              aria-label="Log out"
              className="w-full justify-start gap-2.5 text-xs font-semibold text-slate-600 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </Button>
          }
          title="Sign Out"
          description="Are you sure you want to end your current session? You will need to sign in again to access the admin console."
          confirmText="Sign Out"
          loadingText="Signing out…"
          confirmVariant="destructive"
          isLoading={isLoggingOut}
          onConfirm={() => logout()}
        />
      </div>
    </aside>
  );
}

export default AdminSidebar;
