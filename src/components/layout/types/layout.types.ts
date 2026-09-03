import type { ElementType, HTMLAttributes } from "react";

/**
 * Navigation item structure for sidebars
 */
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

/**
 * Staff navigation item structure
 */
export interface StaffNavItem {
  title: string;
  path: string;
  icon: ElementType;
  mobileLabel: string;
}

/**
 * Admin Sidebar Props
 */
export interface AdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

/**
 * Restaurant Admin Sidebar Props
 */
export interface RestaurantAdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
  basePath?: string;
  onLogout?: () => void;
}

/**
 * Staff Sidebar Props
 */
export interface StaffSidebarProps {
  className?: string;
  onNavigate?: () => void;
  basePath?: string;
}

/**
 * Restaurant Admin Navbar Props
 */
export interface RestaurantAdminNavbarProps extends HTMLAttributes<HTMLElement> {
  restaurantName?: string;
  onToggleSidebar?: () => void;
  onSearch?: (query: string) => void;
  unreadNotifications?: number;
}

/**
 * Staff Navbar Props
 */
export interface StaffNavbarProps extends HTMLAttributes<HTMLElement> {
  unreadNotifications?: number;
  onToggleSidebar?: () => void;
}

/**
 * Customer Navbar Props
 */
export interface CustomerNavbarProps extends HTMLAttributes<HTMLElement> {
  cartItemCount?: number;
  unreadNotifications?: number;
  onSearch?: (query: string) => void;
}

/**
 * Customer Mobile Navbar Props
 */
export interface CustomerMobileNavProps {
  cartItemCount?: number;
  unreadNotifications?: number;
  className?: string;
}

/**
 * Customer Footer Props
 */
export interface CustomerFooterProps {
  className?: string;
}
