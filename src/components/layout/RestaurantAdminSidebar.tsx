/**
 * Restaurant Admin Sidebar Navigation Component
 * Provides collapsible navigation sections, restaurant branding, and admin profile overview.
 */

import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils/cn";
import { RestaurantAdminUserProfile } from "./RestaurantAdminUserProfile";
import { getAdminNavItems } from "./restaurantAdminNav.constants";
import type { RestaurantAdminSidebarProps } from "./types";

export type { RestaurantAdminSidebarProps };

export function RestaurantAdminSidebar({
  className,
  onNavigate,
  basePath = RESTAURANT_ROUTES.ROOT,
  onLogout,
}: RestaurantAdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      clearAuth();
      queryClient.clear();
      navigate(RESTAURANT_ROUTES.LOGIN, { replace: true });
    }
  };

  const adminNavItems = getAdminNavItems(basePath);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Restaurant: true,
    Settings: true,
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
      <div className="flex flex-col gap-6">
        <div className="px-3 pt-1">
          <h1 className="text-xl font-bold tracking-tight text-[#8a3b14]">SpotQ</h1>
          <p className="text-xs font-medium text-neutral-400">Admin Portal</p>
        </div>

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

      <RestaurantAdminUserProfile
        userName={user?.name}
        initials={initials}
        onLogout={handleLogout}
      />
    </aside>
  );
}

export default RestaurantAdminSidebar;
