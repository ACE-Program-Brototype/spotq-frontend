import {
  LayoutDashboard,
  Receipt,
  Sparkles,
  Table as TableIcon,
  UsersRound,
  Utensils,
} from "lucide-react";
import type { StaffNavItem } from "@/components/layout/types";

export const STAFF_NAV_ITEMS: StaffNavItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    mobileLabel: "Dashboard",
  },
  {
    title: "Menu Items",
    path: "/menu",
    icon: Utensils,
    mobileLabel: "Menu",
  },
  {
    title: "Modifiers & Add-ons",
    path: "/menu/addons",
    icon: Sparkles,
    mobileLabel: "Add-ons",
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

export function isStaffNavItemActive(
  pathname: string,
  itemPath: string,
  basePath: string,
): boolean {
  const fullHref = `${basePath}${itemPath}`;

  if (itemPath === "/menu") {
    return (
      pathname === `${basePath}/menu` ||
      pathname === `${basePath}/menu/items` ||
      pathname.startsWith(`${basePath}/menu/items/`)
    );
  }

  return (
    pathname === fullHref ||
    pathname.startsWith(`${fullHref}/`) ||
    (itemPath === "/dashboard" && (pathname === basePath || pathname === `${basePath}/`))
  );
}

