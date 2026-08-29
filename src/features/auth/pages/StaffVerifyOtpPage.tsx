import { MailCheck } from "lucide-react";
import StaffAuthCard from "@/features/auth/components/StaffAuthCard";
import StaffVerifyOtpForm from "@/features/auth/components/StaffVerifyOtpForm";

export default function StaffVerifyOtpPage() {
  return (
    <StaffAuthCard
      icon={<MailCheck className="size-6 text-[#9E460E]" aria-hidden="true" />}
      title="Verify reset code"
      description="We've sent a 6-digit code to your email. Please enter it below to verify your identity."
    >
      <StaffVerifyOtpForm />
    </StaffAuthCard>
  );
}
