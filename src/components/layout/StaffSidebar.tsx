import {
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  Table as TableIcon,
  UsersRound,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import spotqLogo from "@/assets/logos/spotq-logo.png";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useStaffLogout } from "@/features/auth/hooks/useStaffLogout";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils/cn";

export interface StaffSidebarProps {
  className?: string;
  onNavigate?: () => void;
  basePath?: string;
}

const staffNavItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    mobileLabel: "Dashboard",
  },
  {
    title: "Queue Management",
    path: "/queue",
    icon: UsersRound,
    mobileLabel: "Queue",
  },
  {
    title: "Table Management",
    path: "/tables",
    icon: TableIcon,
    mobileLabel: "Tables",
  },
  {
    title: "Order Management",
    path: "/orders",
    icon: Receipt,
    mobileLabel: "Orders",
  },
];

export function StaffSidebar({ className, onNavigate, basePath = "/staff" }: StaffSidebarProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { handleStaffLogout, isLoading } = useStaffLogout();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col justify-between bg-[#faf7f5] border-r border-[#eddcd4] px-4 py-6 select-none",
        className,
      )}
    >
      {/* Top Section: Brand & Navigation */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white shadow-xs border border-[#eddcd4]">
            <img src={spotqLogo} alt="SpotQ Logo" className="size-6 object-contain" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-[#9a3412]">SpotQ</span>
            <p className="text-[11px] font-medium text-neutral-500">Hospitality Management</p>
          </div>
        </div>

        {/* Primary nav links */}
        <nav className="flex flex-col gap-1.5" aria-label="Restaurant Staff Navigation">
          {staffNavItems.map((item) => {
            const Icon = item.icon;
            const fullHref = `${basePath}${item.path}`;
            const isActive =
              location.pathname === fullHref ||
              (item.path === "/dashboard" &&
                (location.pathname === basePath || location.pathname === `${basePath}/`));

            return (
              <Link
                key={item.title}
                to={fullHref}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all shadow-2xs",
                  isActive
                    ? "bg-[#fed7aa]/80 text-[#9a3412] font-bold shadow-xs"
                    : "bg-transparent text-neutral-600 hover:bg-[#eddcd4]/50 hover:text-neutral-900",
                )}
              >
                <Icon
                  className={cn("size-4.5", isActive ? "text-[#9a3412]" : "text-neutral-500")}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Settings, Support & Clock Out */}
      <div className="flex flex-col gap-3 pt-4 border-t border-[#eddcd4]">
        <Link
          to={`${basePath}/settings`}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-600 hover:bg-[#eddcd4]/50 hover:text-neutral-900 transition-colors",
            location.pathname.startsWith(`${basePath}/settings`) && "font-bold text-neutral-900",
          )}
        >
          <Settings className="size-4 text-neutral-500" />
          <span>Settings</span>
        </Link>

        <Link
          to={`${basePath}/support`}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-600 hover:bg-[#eddcd4]/50 hover:text-neutral-900 transition-colors",
            location.pathname.startsWith(`${basePath}/support`) && "font-bold text-neutral-900",
          )}
        >
          <HelpCircle className="size-4 text-neutral-500" />
          <span>Support</span>
        </Link>

        <ConfirmDialog
          trigger={
            <Button
              variant="default"
              disabled={isLoading}
              className="mt-2 w-full bg-[#9a3412] hover:bg-[#7c2d12] text-white font-bold shadow-sm transition-all rounded-xl h-10"
            >
              <LogOut className="size-4 mr-2" />
              Clock Out
            </Button>
          }
          title="Clock Out"
          description={`Are you sure you want to clock out, ${user?.name || "Staff"}? Your shift will end.`}
          confirmText="Clock Out"
          confirmVariant="destructive"
          isLoading={isLoading}
          onConfirm={handleStaffLogout}
        />
      </div>
    </aside>
  );
}

/**
 * Mobile Bottom Navigation (Without floating '+' button)
 */
export function StaffMobileNav({
  basePath = "/staff",
  className,
}: {
  basePath?: string;
  className?: string;
}) {
  const location = useLocation();

  return (
    <nav
      aria-label="Mobile Navigation"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 flex h-16 w-full max-w-full items-center justify-around border-t border-[#eddcd4] bg-white px-2 shadow-lg lg:hidden box-border",
        className,
      )}
    >
      {staffNavItems.map((item) => {
        const Icon = item.icon;
        const fullHref = `${basePath}${item.path}`;
        const isActive =
          location.pathname === fullHref ||
          (item.path === "/dashboard" &&
            (location.pathname === basePath || location.pathname === `${basePath}/`));

        return (
          <Link
            key={item.mobileLabel}
            to={fullHref}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-1 px-3 text-center transition-all",
              isActive ? "text-[#9a3412] font-bold" : "text-neutral-500 hover:text-neutral-800",
            )}
          >
            <div
              className={cn(
                "flex size-7 items-center justify-center rounded-xl transition-colors",
                isActive ? "bg-[#fed7aa]/60" : "bg-transparent",
              )}
            >
              <Icon className="size-4.5" />
            </div>
            <span className="text-[10px] leading-none">{item.mobileLabel}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default StaffSidebar;
