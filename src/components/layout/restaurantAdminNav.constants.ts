import {
  BarChart3,
  Briefcase,
  CreditCard,
  DollarSign,
  Grid,
  Megaphone,
  Receipt,
  Settings,
  ShoppingBag,
  Store,
  Utensils,
  Wallet,
} from "lucide-react";
import type { NavItem } from "@/components/layout/types";

export const RESTAURANT_ADMIN_NAV_DEFAULTS = {
  FALLBACK_ROLE: "Restaurant Admin",
  FALLBACK_INITIALS: "RA",
} as const;

export function getAdminNavItems(basePath: string): NavItem[] {
  return [
    {
      title: "Dashboard",
      href: `${basePath}/dashboard`,
      icon: Grid,
    },
    {
      title: "Analytics",
      href: `${basePath}/analytics`,
      icon: BarChart3,
      children: [
        { title: "Overview", href: `${basePath}/analytics` },
        { title: "Revenue", href: `${basePath}/analytics/revenue` },
        { title: "Menu Performance", href: `${basePath}/analytics/menu` },
      ],
    },
    {
      title: "Restaurant",
      href: `${basePath}/tables`,
      icon: Store,
      children: [
        { title: "Table Sections", href: `${basePath}/tables/sections` },
        { title: "Tables", href: `${basePath}/tables` },
      ],
    },
    {
      title: "Orders",
      href: `${basePath}/orders`,
      icon: ShoppingBag,
      children: [{ title: "Overview", href: `${basePath}/orders` }],
    },
    {
      title: "Menu",
      href: `${basePath}/menu`,
      icon: Utensils,
      children: [
        { title: "Categories", href: `${basePath}/menu/categories` },
        { title: "Items", href: `${basePath}/menu/items` },
        { title: "Modifiers", href: `${basePath}/menu/modifiers` },
      ],
    },
    {
      title: "Staff",
      href: `${basePath}/staff`,
      icon: Briefcase,
      children: [
        { title: "Directory", href: `${basePath}/staff` },
        { title: "Invitations", href: `${basePath}/staff/invitations` },
      ],
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
      title: "Wallet",
      href: `${basePath}/wallet`,
      icon: Wallet,
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
        { title: "Overview", href: `${basePath}/subscription` },
        { title: "Billing History", href: `${basePath}/settings/billing/history` },
      ],
    },
    {
      title: "Settings",
      href: `${basePath}/profile`,
      icon: Settings,
      children: [
        { title: "Account", href: `${basePath}/profile` },
        { title: "Security", href: `${basePath}/settings/security` },
      ],
    },
  ];
}
