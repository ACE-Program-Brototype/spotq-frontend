import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  type StaffDirectoryStats,
  type StaffSortBy,
  type StaffSortOrder,
  staffMemberService,
} from "@/features/staff/services/staff-member.service";
import type {
  StaffInvitationPagination,
  StaffMember,
} from "@/features/staff/types/staff-invitation.types";
import { useDebounce } from "@/lib/hooks/use-debounce";

export const STAFF_MEMBERS_QUERY_KEY = "staff-members" as const;

export type UseStaffMembersOptions = {
  initialPage?: number;
  initialLimit?: number;
  initialStatusFilter?: string;
  initialSortBy?: StaffSortBy;
  initialSortOrder?: StaffSortOrder;
};

export function useStaffMembers(options?: UseStaffMembersOptions) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || user?.id || "";

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [statusFilter, setStatusFilter] = useState<string>(options?.initialStatusFilter || "ALL");
  const [page, setPage] = useState<number>(options?.initialPage || 1);
  const [limit, setLimit] = useState<number>(options?.initialLimit || 20);
  const [sortBy, setSortBy] = useState<StaffSortBy>(options?.initialSortBy || "createdAt");
  const [sortOrder, setSortOrder] = useState<StaffSortOrder>(options?.initialSortOrder || "DESC");

  const queryKey = [
    STAFF_MEMBERS_QUERY_KEY,
    restaurantId,
    page,
    limit,
    statusFilter,
    debouncedSearch,
    sortBy,
    sortOrder,
  ];

  const {
    data: queryResult,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!restaurantId) {
        return {
          success: false,
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
          stats: null,
          message: "Restaurant ID is required",
        };
      }

      return staffMemberService.getStaffMembers(restaurantId, {
        page,
        limit,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        search: debouncedSearch.trim() !== "" ? debouncedSearch.trim() : undefined,
        sortBy,
        sortOrder,
      });
    },
    enabled: !!restaurantId,
    placeholderData: (previousData) => previousData,
  });

  const staffList: StaffMember[] = useMemo(
    () => (queryResult?.success && Array.isArray(queryResult.data) ? queryResult.data : []),
    [queryResult?.data, queryResult?.success],
  );

  const pagination: StaffInvitationPagination = useMemo(() => {
    if (queryResult?.pagination) {
      return queryResult.pagination;
    }
    const total = staffList.length;
    return {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasNextPage: false,
      hasPrevPage: false,
    };
  }, [queryResult?.pagination, staffList.length, page, limit]);

  const serverStats: StaffDirectoryStats | null = queryResult?.stats || null;

  // Directory statistics: prioritize aggregate backend totals when provided, else compute from loaded staff
  const stats = useMemo(() => {
    if (serverStats) {
      return serverStats;
    }
    const total = pagination.total || staffList.length;
    const active = staffList.filter((s) => s.status?.toUpperCase() === "ACTIVE").length;
    const inactive = staffList.filter((s) => s.status?.toUpperCase() === "INACTIVE").length;
    const suspended = staffList.filter((s) => s.status?.toUpperCase() === "SUSPENDED").length;
    const invited = staffList.filter((s) => s.status?.toUpperCase() === "INVITED").length;
    const removed = staffList.filter((s) => s.status?.toUpperCase() === "REMOVED").length;

    return {
      total,
      active,
      inactive,
      suspended,
      invited,
      removed,
    };
  }, [staffList, pagination.total, serverStats]);

  const handleSetSearchQuery = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleSetStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const toggleSort = useCallback((_column?: StaffSortBy) => {
    setSortBy("createdAt");
    setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setPage(1);
  }, []);

  const error =
    queryResult && !queryResult.success
      ? queryResult.message || null
      : queryError
        ? (queryError as Error).message
        : null;

  return {
    staffList,
    rawStaffList: staffList,
    isLoading,
    isError,
    error,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    statusFilter,
    setStatusFilter: handleSetStatusFilter,
    page,
    setPage,
    limit,
    setLimit,
    sortBy,
    setSortBy: (newSortBy: StaffSortBy) => {
      setSortBy(newSortBy);
      setPage(1);
    },
    sortOrder,
    setSortOrder: (newSortOrder: StaffSortOrder) => {
      setSortOrder(newSortOrder);
      setPage(1);
    },
    toggleSort,
    pagination,
    stats,
    resetFilters,
    refreshStaffMembers: () => refetch(),
    invalidateStaffMembers: () =>
      queryClient.invalidateQueries({ queryKey: [STAFF_MEMBERS_QUERY_KEY] }),
  };
}
