import { RotateCcw } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import StaffAuthCard from "@/features/auth/components/StaffAuthCard";
import StaffResetPasswordForm from "@/features/auth/components/StaffResetPasswordForm";

export default function StaffResetPasswordPage() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  if (!email) {
    return <Navigate to="/staff/forgot-password" replace />;
  }

  return (
    <StaffAuthCard
      icon={<RotateCcw className="size-6 text-[#9E460E]" aria-hidden="true" />}
      title="Set New Password"
      description="Set your new password. Choose a strong password to keep your account secure."
    >
      <StaffResetPasswordForm />
    </StaffAuthCard>
  );
}
