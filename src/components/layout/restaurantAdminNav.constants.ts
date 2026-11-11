import {
  Briefcase,
  CreditCard,
  DollarSign,
  Grid,
  Megaphone,
  Receipt,
  Settings,
  ShoppingBag,
  Store,
  Users,
  Utensils,
} from "lucide-react";
import type { NavItem } from "./types";

export function getAdminNavItems(basePath: string): NavItem[] {
  return [
    {
      title: "Dashboard",
      href: `${basePath}/dashboard`,
      icon: Grid,
    },
    {
      title: "Restaurant",
      href: `${basePath}/overview`,
      icon: Store,
      children: [
        { title: "Overview", href: `${basePath}/overview` },
        { title: "QR Management", href: `${basePath}/qr-management` },
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
