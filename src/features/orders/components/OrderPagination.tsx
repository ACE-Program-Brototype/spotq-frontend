/**
 * OrderPagination Component
 * Domain adapter reusing the universal common Pagination component with customer theme.
 */

import { Pagination } from "@/components/common/Pagination";
import type { OrderPaginationData } from "../types/orders.types";

export interface OrderPaginationProps {
  pagination: OrderPaginationData;
  onPageChange: (page: number) => void;
  className?: string;
  disabled?: boolean;
}

export function OrderPagination({
  pagination,
  onPageChange,
  className,
  disabled = false,
}: OrderPaginationProps) {
  const currentPage = pagination.current_page || 1;
  const totalPages = Math.max(1, pagination.total_pages || 1);
  const totalOrders = pagination.total_orders || 0;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalOrders > 0 ? totalOrders : undefined}
      onPageChange={onPageChange}
      theme="customer"
      disabled={disabled}
      className={className}
    />
  );
}

export default OrderPagination;
