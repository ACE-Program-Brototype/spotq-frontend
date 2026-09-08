import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type { AcceptInvitationFormValues } from "@/features/auth/schemas/staff-invitation.schema";
import { staffInvitationService } from "@/features/auth/services/staff-invitation.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useAcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState("");
  const [restaurantName, setRestaurantName] = useState("SpotQ Restaurant");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateToken = useCallback(async () => {
    if (!token) {
      setIsValidating(false);
      setIsValid(false);
      setErrorMessage("No invitation token was provided in the URL.");
      return;
    }

    setIsValidating(true);
    setErrorMessage("");

    try {
      const res = await staffInvitationService.validateInvitation(token);
      if (res.valid) {
        setIsValid(true);
        setEmail(res.email || "");
        setRestaurantName(res.restaurantName || "Restaurant");
      } else {
        setIsValid(false);
        setErrorMessage(res.message || "This invitation link has expired or is invalid.");
      }
    } catch (err: unknown) {
      setIsValid(false);
      const msg =
        (err as { response?: { message?: string } })?.response?.message ||
        (err as Error)?.message ||
        "Could not validate the invitation link.";
      setErrorMessage(msg);
    } finally {
      setIsValidating(false);
    }
  }, [token]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const handleAccept = async (values: AcceptInvitationFormValues) => {
    if (!token) {
      toast.error("Missing invitation token.");
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanPhone = values.phone.replace(/\D/g, "");
      const formattedPhone = `+91${cleanPhone.slice(-10)}`;

      const res = await staffInvitationService.acceptInvitation({
        token,
        fullname: values.fullname,
        phone: formattedPhone,
        password: values.password,
      });

      if (res.success) {
        if (res.data?.staff && res.data?.accessToken) {
          useAuthStore.getState().setAuth(res.data.staff, res.data.accessToken);
          toast.success(res.message || "Registration successful! Welcome to SpotQ.");
          navigate("/staff/dashboard", { replace: true });
        } else {
          toast.success(
            res.message || "Registration completed successfully! Please sign in to your account.",
          );
          navigate("/staff/login", { replace: true });
        }
      } else {
        toast.error(res.message || "Failed to complete registration.");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { message?: string } })?.response?.message ||
        (err as Error)?.message ||
        "Failed to accept invitation. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    token,
    isValidating,
    isValid,
    email,
    restaurantName,
    errorMessage,
    isSubmitting,
    handleAccept,
    retryValidation: validateToken,
  };
}
