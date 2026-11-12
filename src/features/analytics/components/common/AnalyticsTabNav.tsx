import { IndianRupee, LayoutDashboard, Utensils } from "lucide-react";
import { NavLink } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { cn } from "@/lib/utils/cn";

export interface AnalyticsTabNavProps {
  className?: string;
}

export function AnalyticsTabNav({ className }: AnalyticsTabNavProps) {
  const tabs = [
    {
      to: RESTAURANT_ROUTES.ANALYTICS.ROOT,
      label: "Overview",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: RESTAURANT_ROUTES.ANALYTICS.REVENUE,
      label: "Revenue Analytics",
      icon: IndianRupee,
      end: false,
    },
    {
      to: RESTAURANT_ROUTES.ANALYTICS.MENU,
      label: "Menu Performance",
      icon: Utensils,
      end: false,
    },
  ];

  return (
    <nav
      aria-label="Analytics Navigation"
      className={cn(
        "flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 rounded-xl bg-[#faf7f5] border border-[#eddcd4] w-full",
        className,
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                "inline-flex items-center justify-center sm:justify-start gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all",
                isActive
                  ? "bg-white text-[#9a3412] shadow-2xs border border-[#eddcd4]"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-white/60",
              )
            }
          >
            <Icon className="size-3.5 sm:size-4 shrink-0 text-[#9a3412]" />
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
