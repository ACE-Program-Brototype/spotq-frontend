import { RotateCcw } from "lucide-react";
import StaffAuthCard from "@/features/auth/components/StaffAuthCard";
import StaffResetPasswordForm from "@/features/auth/components/StaffResetPasswordForm";

export default function StaffResetPasswordPage() {
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
