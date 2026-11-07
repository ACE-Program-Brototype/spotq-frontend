import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type AcceptInvitationFormValues,
  acceptInvitationSchema,
} from "@/features/auth/schemas/accept-invitation.schema";

interface StaffAcceptInvitationFormProps {
  restaurantName: string;
  email: string;
  isSubmitting: boolean;
  onAccept: (data: AcceptInvitationFormValues) => void;
}

export function StaffAcceptInvitationForm({
  restaurantName,
  email,
  isSubmitting,
  onAccept,
}: StaffAcceptInvitationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AcceptInvitationFormValues>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: {
      fullname: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") || "";
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordValue);

  return (
    <div className="rounded-3xl border border-[#eddcd4] bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-gradient-to-r from-[#fef3ec] via-[#fffaf6] to-[#fef3ec] p-6 sm:p-7 border-b border-[#fae2d3] text-center space-y-2 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#9a3412] border border-[#fae2d3] shadow-2xs">
          <Building2 className="size-3.5 text-[#e8631b]" />
          <span>{restaurantName}</span>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Staff Registration</h2>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
          Complete your details below to activate your staff account and join the team.
        </p>
      </div>

      <form onSubmit={handleSubmit(onAccept)} className="p-6 sm:p-8 space-y-5">
        <div className="space-y-1.5">
          <label
            htmlFor="staff-reg-email"
            className="flex items-center justify-between text-xs font-semibold text-neutral-700"
          >
            <span>Email Address</span>
            <span className="text-[11px] font-normal text-neutral-400 flex items-center gap-1">
              <Lock className="size-3" />
              Locked to invitation
            </span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              id="staff-reg-email"
              type="email"
              value={email}
              readOnly
              disabled
              className="pl-10 h-10.5 rounded-xl border-[#eddcd4] bg-neutral-50/80 text-neutral-600 font-medium cursor-not-allowed select-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="staff-reg-fullname"
            className="block text-xs font-semibold text-neutral-700"
          >
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              id="staff-reg-fullname"
              type="text"
              placeholder="e.g. John Doe"
              disabled={isSubmitting}
              className="pl-10 h-10.5 rounded-xl border-[#eddcd4] bg-[#faf7f5]/40 text-xs focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b]"
              {...register("fullname")}
            />
          </div>
          {errors.fullname && (
            <p className="text-xs font-medium text-rose-500">{errors.fullname.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="staff-reg-phone" className="block text-xs font-semibold text-neutral-700">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="flex rounded-xl border border-[#eddcd4] bg-[#faf7f5]/40 overflow-hidden focus-within:border-[#e8631b] focus-within:ring-1 focus-within:ring-[#e8631b] transition-all">
            <div className="flex items-center gap-1.5 px-3 bg-[#fef3ec] border-r border-[#fae2d3] text-xs font-bold text-[#9a3412] select-none">
              <Phone className="size-3.5 text-[#e8631b]" />
              <span>+91</span>
            </div>
            <Input
              id="staff-reg-phone"
              type="tel"
              maxLength={10}
              placeholder="98765 43210"
              disabled={isSubmitting}
              className="border-0 bg-transparent h-10.5 text-xs focus-visible:ring-0 focus-visible:outline-none"
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="text-xs font-medium text-rose-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="staff-reg-pass" className="block text-xs font-semibold text-neutral-700">
            Create Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              id="staff-reg-pass"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isSubmitting}
              className="pl-10 pr-10 h-10.5 rounded-xl border-[#eddcd4] bg-[#faf7f5]/40 text-xs focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b]"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-rose-500">{errors.password.message}</p>
          )}

          {passwordValue.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-neutral-500">
              <div
                className={`flex items-center gap-1 ${hasMinLength ? "text-emerald-600 font-semibold" : ""}`}
              >
                <CheckCircle className="size-3" /> 8+ Characters
              </div>
              <div
                className={`flex items-center gap-1 ${hasUppercase ? "text-emerald-600 font-semibold" : ""}`}
              >
                <CheckCircle className="size-3" /> Uppercase letter
              </div>
              <div
                className={`flex items-center gap-1 ${hasLowercase ? "text-emerald-600 font-semibold" : ""}`}
              >
                <CheckCircle className="size-3" /> Lowercase letter
              </div>
              <div
                className={`flex items-center gap-1 ${hasNumber && hasSpecial ? "text-emerald-600 font-semibold" : ""}`}
              >
                <CheckCircle className="size-3" /> Number & symbol
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="staff-reg-confpass"
            className="block text-xs font-semibold text-neutral-700"
          >
            Confirm Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              id="staff-reg-confpass"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isSubmitting}
              className="pl-10 pr-10 h-10.5 rounded-xl border-[#eddcd4] bg-[#faf7f5]/40 text-xs focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b]"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-rose-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#e8631b] to-[#ff6b00] hover:from-[#d45614] hover:to-[#ea580c] text-white font-bold text-xs shadow-md mt-4 transition-all"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner size="sm" theme="white" />
              <span>Activating Account...</span>
            </div>
          ) : (
            <>
              <Sparkles className="size-4 mr-2" />
              Complete Registration &amp; Join Team
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
