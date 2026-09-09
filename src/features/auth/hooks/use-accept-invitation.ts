/**
 * Hook for managing the restaurant staff invitation acceptance flow.
 * Leverages TanStack Query for token validation and invitation acceptance mutations,
 * synchronizing auth credentials with Zustand upon successful registration.
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import env from "@/config/env";
import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import type { AcceptInvitationFormValues } from "@/features/auth/schemas/accept-invitation.schema";
import {
  acceptStaffInvitation,
  validateStaffInvitation,
} from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useAcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const setAuth = useAuthStore((state) => state.setAuth);

  const validationQuery = useQuery({
    queryKey: ["staff-invitation-validation", token],
    queryFn: () => validateStaffInvitation(token),
    enabled: Boolean(token),
    retry: false,
    staleTime: env.staffInvitationStaleTimeMs,
  });

  const acceptMutation = useMutation({
    mutationFn: (payload: { token: string; fullname: string; phone: string; password: string }) =>
      acceptStaffInvitation(payload),
    onSuccess: (res) => {
      if (res.data?.staff && res.data?.accessToken) {
        setAuth(res.data.staff, res.data.accessToken);
        toast.success(res.message || AUTH_MESSAGES.STAFF_REGISTRATION_SUCCESS);
        navigate("/staff/dashboard", { replace: true });
      } else {
        toast.success(res.message || AUTH_MESSAGES.STAFF_REGISTRATION_LOGIN_PROMPT);
        navigate("/staff/login", { replace: true });
      }
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { message?: string } })?.response?.message ||
        (err as Error)?.message ||
        AUTH_MESSAGES.STAFF_REGISTRATION_FAILED;
      toast.error(msg);
    },
  });

  const isValidating = Boolean(token) && (validationQuery.isLoading || validationQuery.isFetching);
  const isValid = Boolean(token && validationQuery.data?.valid);
  const email = validationQuery.data?.email || "";
  const restaurantName = validationQuery.data?.restaurantName || "Restaurant";

  const errorMessage = !token
    ? AUTH_MESSAGES.STAFF_INVITATION_MISSING_TOKEN
    : validationQuery.data && !validationQuery.data.valid
      ? validationQuery.data.message || AUTH_MESSAGES.STAFF_INVITATION_INVALID
      : validationQuery.error
        ? (validationQuery.error as Error)?.message || AUTH_MESSAGES.STAFF_INVITATION_VALIDATE_ERROR
        : "";

  const handleAccept = async (values: AcceptInvitationFormValues) => {
    if (!token) {
      toast.error(AUTH_MESSAGES.STAFF_INVITATION_MISSING_TOKEN);
      return;
    }

    const cleanPhone = values.phone.replace(/\D/g, "");
    const formattedPhone = `+91${cleanPhone.slice(-10)}`;

    await acceptMutation.mutateAsync({
      token,
      fullname: values.fullname,
      phone: formattedPhone,
      password: values.password,
    });
  };

  return {
    token,
    isValidating,
    isValid,
    email,
    restaurantName,
    errorMessage,
    isSubmitting: acceptMutation.isPending,
    handleAccept,
    retryValidation: () => validationQuery.refetch(),
  };
}
