/**
 * Layout Types
 * Centralized TypeScript type and interface definitions for application layout components
 * including sidebars, navbars, and footers across Admin, Restaurant, Staff, and Customer portals.
 */

import type { ElementType, HTMLAttributes } from "react";

export interface NavSubItem {
  title: string;
  href: string;
}

export interface NavItem {
  title: string;
  href?: string;
  icon: ElementType;
  children?: NavSubItem[];
}

export interface StaffNavItem {
  title: string;
  path: string;
  icon: ElementType;
  mobileLabel: string;
}

export interface AdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export interface RestaurantAdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
  basePath?: string;
  onLogout?: () => void;
}

export interface StaffSidebarProps {
  className?: string;
  onNavigate?: () => void;
  basePath?: string;
}

export interface RestaurantAdminNavbarProps extends HTMLAttributes<HTMLElement> {
  restaurantName?: string;
  onToggleSidebar?: () => void;
  onSearch?: (query: string) => void;
  unreadNotifications?: number;
}

export interface StaffNavbarProps extends HTMLAttributes<HTMLElement> {
  unreadNotifications?: number;
  onToggleSidebar?: () => void;
}

export interface CustomerNavbarProps extends HTMLAttributes<HTMLElement> {
  cartItemCount?: number;
  unreadNotifications?: number;
  onSearch?: (query: string) => void;
}

export interface CustomerMobileNavProps {
  cartItemCount?: number;
  unreadNotifications?: number;
  className?: string;
}

export interface CustomerFooterProps {
  className?: string;
}
