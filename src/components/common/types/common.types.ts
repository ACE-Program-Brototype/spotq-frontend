/**
 * Common Component Types
 * Centralized TypeScript type definitions and interfaces for common shared UI components.
 */

import type { VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import type { buttonVariants } from "@/components/ui/button";

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  siblingCount?: number;
  showFirstLast?: boolean;
  theme?: "admin" | "restaurant" | "customer" | "brand" | "dark";
  disabled?: boolean;
}

export interface LoadingIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "spinner" | "dots" | "skeleton" | "card-skeleton" | "table-skeleton";
  theme?: "brand" | "admin" | "primary" | "muted" | "white";
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  fullPage?: boolean;
  center?: boolean;
}

export interface ConfirmDialogProps {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: VariantProps<typeof buttonVariants>["variant"];
  isLoading?: boolean;
  loadingText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}
