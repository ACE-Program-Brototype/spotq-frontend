import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { staffMemberService } from "@/features/staff/services/staff-member.service";
import type {
  StaffInvitationPagination,
  StaffMember,
} from "@/features/staff/types/staff-invitation.types";
import { useDebounce } from "@/lib/hooks/use-debounce";

export type UseStaffMembersOptions = {
  initialPage?: number;
  initialLimit?: number;
  initialStatusFilter?: string;
  initialSortBy?: "createdAt";
  initialSortOrder?: "ASC" | "DESC";
};

export function useStaffMembers(options?: UseStaffMembersOptions) {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || user?.id || "";

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [statusFilter, setStatusFilter] = useState<string>(options?.initialStatusFilter || "ALL");
  const [designationFilter, setDesignationFilter] = useState<string>("ALL");
  const [page, setPage] = useState<number>(options?.initialPage || 1);
  const [limit, setLimit] = useState<number>(options?.initialLimit || 20);
  const [sortBy, setSortBy] = useState<"createdAt">(options?.initialSortBy || "createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">(options?.initialSortOrder || "DESC");

  const [pagination, setPagination] = useState<StaffInvitationPagination>({
    page: page,
    limit: limit,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchStaffMembers = useCallback(async () => {
    if (!restaurantId) {
      setIsLoading(false);
      setStaffList([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await staffMemberService.getStaffMembers(restaurantId, {
        page,
        limit,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        search: debouncedSearch.trim() !== "" ? debouncedSearch.trim() : undefined,
        sortBy,
        sortOrder,
      });

      if (response.success) {
        setStaffList(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.message || "Failed to fetch staff members");
      }
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "Failed to fetch staff directory";
      setError(errMessage);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, page, limit, statusFilter, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    fetchStaffMembers();
  }, [fetchStaffMembers]);

  // Reset page to 1 when filters change
  useEffect(() => {
    if (debouncedSearch || statusFilter || designationFilter) {
      setPage(1);
    }
  }, [debouncedSearch, statusFilter, designationFilter]);

  const filteredStaff = useMemo(() => {
    if (designationFilter === "ALL") return staffList;
    return staffList.filter((s) => s.designation === designationFilter);
  }, [staffList, designationFilter]);

  const availableDesignations = useMemo(() => {
    return Array.from(new Set(staffList.map((s) => s.designation).filter(Boolean)));
  }, [staffList]);

  const stats = useMemo(() => {
    const total = pagination.total || staffList.length;
    const active = staffList.filter((s) => s.status?.toUpperCase() === "ACTIVE").length;
    const inactive = staffList.filter((s) => s.status?.toUpperCase() === "INACTIVE").length;
    const pending = staffList.filter((s) => s.status?.toUpperCase() === "PENDING").length;

    return {
      total,
      active,
      inactive,
      pending,
    };
  }, [staffList, pagination.total]);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setDesignationFilter("ALL");
    setPage(1);
  }, []);

  return {
    staffList: filteredStaff,
    rawStaffList: staffList,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    designationFilter,
    setDesignationFilter,
    availableDesignations,
    page,
    setPage,
    limit,
    setLimit,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    pagination,
    stats,
    resetFilters,
    refreshStaffMembers: fetchStaffMembers,
  };
}
