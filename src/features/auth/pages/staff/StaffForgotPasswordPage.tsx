import { RotateCcw } from "lucide-react";
import StaffAuthCard from "@/features/auth/components/StaffAuthCard";
import StaffForgotPasswordForm from "@/features/auth/components/StaffForgotPasswordForm";

export default function StaffForgotPasswordPage() {
  return (
    <StaffAuthCard
      icon={<RotateCcw className="size-6 text-[#9E460E]" aria-hidden="true" />}
      title="Forgot your password?"
      description="Enter the email address associated with your account and we'll send you a temporary code to reset your password."
    >
      <StaffForgotPasswordForm />
    </StaffAuthCard>
  );
}
