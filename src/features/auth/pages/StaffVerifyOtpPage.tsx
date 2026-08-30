import { MailCheck } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import StaffAuthCard from "@/features/auth/components/StaffAuthCard";
import StaffVerifyOtpForm from "@/features/auth/components/StaffVerifyOtpForm";

export default function StaffVerifyOtpPage() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  if (!email) {
    return <Navigate to="/staff/forgot-password" replace />;
  }

  return (
    <StaffAuthCard
      icon={<MailCheck className="size-6 text-[#9E460E]" aria-hidden="true" />}
      title="Verify reset code"
      description="We've sent a 6-digit code to your email. Please enter it below to verify your identity."
    >
      <StaffVerifyOtpForm initialEmail={email} />
    </StaffAuthCard>
  );
}
