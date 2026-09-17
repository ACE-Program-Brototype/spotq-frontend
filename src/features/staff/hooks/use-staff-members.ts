import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { STAFF_DESIGNATIONS, STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
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

export type UseStaffMembersOptions = {
  initialPage?: number;
  initialLimit?: number;
  initialStatusFilter?: string;
  initialSortBy?: StaffSortBy;
  initialSortOrder?: StaffSortOrder;
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
  const [sortBy, setSortBy] = useState<StaffSortBy>(options?.initialSortBy || "createdAt");
  const [sortOrder, setSortOrder] = useState<StaffSortOrder>(options?.initialSortOrder || "DESC");
  const [serverStats, setServerStats] = useState<StaffDirectoryStats | null>(null);

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
        if (response.stats) {
          setServerStats(response.stats);
        }
      } else {
        setError(response.message || STAFF_MESSAGES.FETCH_STAFF_ERROR);
      }
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : STAFF_MESSAGES.FETCH_STAFF_ERROR;
      setError(errMessage);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, page, limit, statusFilter, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    fetchStaffMembers();
  }, [fetchStaffMembers]);

  // Reset page to 1 when filters change
  const isInitialMount = useRef(true);
  const prevFiltersRef = useRef({
    search: debouncedSearch,
    status: statusFilter,
    designation: designationFilter,
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const prev = prevFiltersRef.current;
    if (
      prev.search !== debouncedSearch ||
      prev.status !== statusFilter ||
      prev.designation !== designationFilter
    ) {
      prevFiltersRef.current = {
        search: debouncedSearch,
        status: statusFilter,
        designation: designationFilter,
      };
      setPage(1);
    }
  }, [debouncedSearch, statusFilter, designationFilter]);

  // Client-side designation filtering on current page slice until backend query support is available
  const filteredStaff = useMemo(() => {
    if (designationFilter === "ALL") return staffList;
    return staffList.filter((s) => s.designation === designationFilter);
  }, [staffList, designationFilter]);

  // Reuse centralized STAFF_DESIGNATIONS and include any custom roles from staffList
  const availableDesignations = useMemo(() => {
    const dynamicRoles = staffList.map((s) => s.designation).filter(Boolean);
    return Array.from(new Set<string>([...STAFF_DESIGNATIONS, ...dynamicRoles]));
  }, [staffList]);

  // Directory statistics: prioritize aggregate backend totals when provided, else compute from loaded staff
  const stats = useMemo(() => {
    if (serverStats) {
      return serverStats;
    }
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
  }, [staffList, pagination.total, serverStats]);

  const toggleSort = useCallback(
    (column: StaffSortBy) => {
      if (sortBy === column) {
        setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
      } else {
        setSortBy(column);
        setSortOrder("ASC");
      }
      setPage(1);
    },
    [sortBy],
  );

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
    toggleSort,
    pagination,
    stats,
    resetFilters,
    refreshStaffMembers: fetchStaffMembers,
  };
}
