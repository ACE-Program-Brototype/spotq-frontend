import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "@/features/auth/hooks/use-debounce";
import { staffInvitationService } from "@/features/auth/services/staff-invitation.service";
import type {
  StaffInvitation,
  StaffInvitationSortBy,
  StaffInvitationSortOrder,
  StaffInvitationStatus,
} from "@/features/auth/types/staff-invitation.types";

export function useStaffInvitations() {
  const [invitations, setInvitations] = useState<StaffInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResending, setIsResending] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<StaffInvitationSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<StaffInvitationSortOrder>("desc");

  const fetchInvitations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await staffInvitationService.getInvitations({
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        search: debouncedSearch.trim() || undefined,
        sortBy,
        sortOrder,
      });

      if (res.success && res.data?.invitations) {
        setInvitations(res.data.invitations);
      }
    } catch {
      // Keep existing items if network error
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const sendInvitation = async (email: string) => {
    setIsSending(true);
    try {
      const res = await staffInvitationService.sendInvitation({ email });
      const newInv: StaffInvitation = res.data || {
        id: `inv-${Date.now()}`,
        email,
        restaurantId: "rest-001",
        status: "PENDING",
        expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      };

      setInvitations((prev) => [
        newInv,
        ...prev.filter((i) => i.email.toLowerCase() !== email.toLowerCase()),
      ]);

      toast.success(res.message || `Invitation link sent to ${email}`);
      return true;
    } catch (err: unknown) {
      const message =
        (err as { response?: { message?: string } })?.response?.message ||
        (err as Error)?.message ||
        "Failed to send invitation. Please try again.";
      toast.error(message);
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const resendInvitation = async (email: string) => {
    setIsResending(email);
    try {
      const res = await staffInvitationService.resendInvitation({ email });
      toast.success(res.message || `Invitation resent to ${email}`);

      setInvitations((prev) =>
        prev.map((item) =>
          item.email.toLowerCase() === email.toLowerCase()
            ? {
                ...item,
                status: "PENDING" as StaffInvitationStatus,
                expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
              }
            : item,
        ),
      );
      return true;
    } catch (err: unknown) {
      const message =
        (err as { response?: { message?: string } })?.response?.message ||
        (err as Error)?.message ||
        "Failed to resend invitation.";
      toast.error(message);
      return false;
    } finally {
      setIsResending(null);
    }
  };

  const revokeInvitation = async (invitationId: string, email?: string) => {
    setIsRevoking(invitationId);
    try {
      const res = await staffInvitationService.revokeInvitation({
        invitationId,
        email,
      });
      toast.success(res.message || "Invitation revoked successfully");

      setInvitations((prev) =>
        prev.map((item) =>
          item.id === invitationId || (email && item.email.toLowerCase() === email.toLowerCase())
            ? { ...item, status: "REVOKED" as StaffInvitationStatus }
            : item,
        ),
      );
      return true;
    } catch (err: unknown) {
      const message =
        (err as { response?: { message?: string } })?.response?.message ||
        (err as Error)?.message ||
        "Failed to revoke invitation.";
      toast.error(message);
      return false;
    } finally {
      setIsRevoking(null);
    }
  };

  const filteredInvitations = invitations.filter((inv) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || inv.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invitations.length,
    pending: invitations.filter((i) => i.status === "PENDING").length,
    accepted: invitations.filter((i) => i.status === "ACCEPTED").length,
    expired: invitations.filter((i) => i.status === "EXPIRED").length,
    revoked: invitations.filter((i) => i.status === "REVOKED").length,
  };

  return {
    invitations: filteredInvitations,
    allInvitations: invitations,
    stats,
    isLoading,
    isSending,
    isResending,
    isRevoking,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    sendInvitation,
    resendInvitation,
    revokeInvitation,
    refreshInvitations: fetchInvitations,
  };
}
