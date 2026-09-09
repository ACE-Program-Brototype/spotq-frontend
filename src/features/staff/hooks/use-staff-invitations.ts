/**
 * Hook for managing restaurant staff invitations using TanStack Query.
 * Provides synchronized querying, pagination, filtering, searching,
 * statistics calculation, and mutations (send, resend, revoke) with automatic cache invalidation.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
import { staffInvitationService } from "@/features/staff/services/staff-invitation.service";
import type {
  StaffInvitation,
  StaffInvitationPagination,
  StaffInvitationSortBy,
  StaffInvitationSortOrder,
  StaffInvitationStats,
} from "@/features/staff/types/staff-invitation.types";
import { useDebounce } from "@/lib/hooks/use-debounce";

export const STAFF_INVITATIONS_QUERY_KEY = "staff-invitations" as const;

export function useStaffInvitations() {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<StaffInvitationSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<StaffInvitationSortOrder>("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isResendingEmail, setIsResendingEmail] = useState<string | null>(null);
  const [isRevokingId, setIsRevokingId] = useState<string | null>(null);

  const queryKey = [
    STAFF_INVITATIONS_QUERY_KEY,
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
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await staffInvitationService.getInvitations({
        page,
        limit,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        search: debouncedSearch.trim() || undefined,
        sortBy,
        sortOrder,
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const invitations: StaffInvitation[] = useMemo(
    () => queryResult?.invitations || [],
    [queryResult?.invitations],
  );

  const pagination: StaffInvitationPagination = useMemo(() => {
    if (queryResult?.pagination) {
      return queryResult.pagination;
    }
    const total = invitations.length;
    return {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasNextPage: false,
      hasPrevPage: false,
    };
  }, [queryResult?.pagination, invitations.length, page, limit]);

  const stats: StaffInvitationStats = useMemo(() => {
    return {
      total: pagination.total || invitations.length,
      pending: invitations.filter((i) => i.status === "PENDING").length,
      accepted: invitations.filter((i) => i.status === "ACCEPTED").length,
      expired: invitations.filter((i) => i.status === "EXPIRED").length,
      revoked: invitations.filter((i) => i.status === "REVOKED").length,
    };
  }, [pagination.total, invitations]);

  const sendMutation = useMutation({
    mutationFn: (email: string) => staffInvitationService.sendInvitation({ email }),
    onSuccess: (res, email) => {
      queryClient.invalidateQueries({ queryKey: [STAFF_INVITATIONS_QUERY_KEY] });
      toast.success(res.message || `Invitation link sent to ${email}`);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { message?: string } })?.response?.message ||
        (err as Error)?.message ||
        STAFF_MESSAGES.SEND_INVITATION_ERROR;
      toast.error(message);
    },
  });

  const resendMutation = useMutation({
    mutationFn: (email: string) => staffInvitationService.resendInvitation({ email }),
    onSuccess: (res, email) => {
      queryClient.invalidateQueries({ queryKey: [STAFF_INVITATIONS_QUERY_KEY] });
      toast.success(res.message || `Invitation resent to ${email}`);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { message?: string } })?.response?.message ||
        (err as Error)?.message ||
        STAFF_MESSAGES.RESEND_INVITATION_ERROR;
      toast.error(message);
    },
    onSettled: () => {
      setIsResendingEmail(null);
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (payload: { invitationId: string; email?: string }) =>
      staffInvitationService.revokeInvitation(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [STAFF_INVITATIONS_QUERY_KEY] });
      toast.success(res.message || STAFF_MESSAGES.INVITE_REVOKED_SUCCESS);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { message?: string } })?.response?.message ||
        (err as Error)?.message ||
        STAFF_MESSAGES.REVOKE_INVITATION_ERROR;
      toast.error(message);
    },
    onSettled: () => {
      setIsRevokingId(null);
    },
  });

  const handleSetSearchQuery = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleSetStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleSetSortBy = (newSortBy: StaffInvitationSortBy) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const handleSetSortOrder = (newSortOrder: StaffInvitationSortOrder) => {
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const sendInvitation = async (email: string): Promise<boolean> => {
    try {
      await sendMutation.mutateAsync(email);
      return true;
    } catch {
      return false;
    }
  };

  const resendInvitation = async (email: string): Promise<boolean> => {
    setIsResendingEmail(email);
    try {
      await resendMutation.mutateAsync(email);
      return true;
    } catch {
      return false;
    }
  };

  const revokeInvitation = async (invitationId: string, email?: string): Promise<boolean> => {
    setIsRevokingId(invitationId);
    try {
      await revokeMutation.mutateAsync({ invitationId, email });
      return true;
    } catch {
      return false;
    }
  };

  return {
    invitations,
    allInvitations: invitations,
    stats,
    isLoading,
    isSending: sendMutation.isPending,
    isResending: isResendingEmail,
    isRevoking: isRevokingId,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    statusFilter,
    setStatusFilter: handleSetStatusFilter,
    sortBy,
    setSortBy: handleSetSortBy,
    sortOrder,
    setSortOrder: handleSetSortOrder,
    page,
    setPage,
    limit,
    setLimit,
    pagination,
    sendInvitation,
    resendInvitation,
    revokeInvitation,
    refreshInvitations: () => refetch(),
  };
}
