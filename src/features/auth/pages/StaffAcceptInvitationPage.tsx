import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Phone,
  RotateCcw,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAcceptInvitation } from "@/features/auth/hooks/use-accept-invitation";
import {
  type AcceptInvitationFormValues,
  acceptInvitationSchema,
} from "@/features/auth/schemas/staff-invitation.schema";

export default function StaffAcceptInvitationPage() {
  const {
    isValidating,
    isValid,
    email,
    restaurantName,
    errorMessage,
    isSubmitting,
    handleAccept,
    retryValidation,
  } = useAcceptInvitation();

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
    <div className="min-h-screen w-full bg-[#fffdfb] flex flex-col justify-between selection:bg-[#fef3ec] selection:text-[#9a3412]">
      {/* Top Header */}
      <header className="border-b border-[#f3e6de] bg-[#fffcf9]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8.5 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#e8631b] flex items-center justify-center text-white font-bold shadow-xs">
              Q
            </div>
            <div>
              <h1 className="text-base font-bold text-neutral-900 tracking-tight leading-none">
                SpotQ
              </h1>
              <p className="text-[11px] font-medium text-neutral-400">Staff Portal</p>
            </div>
          </div>

          <Link
            to="/staff/login"
            className="text-xs font-semibold text-[#9a3412] hover:text-[#e8631b] transition-colors"
          >
            Already registered? Sign In &rarr;
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          {/* State 1: Validating Token */}
          {isValidating && (
            <div className="rounded-3xl border border-[#eddcd4] bg-white p-8 sm:p-10 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="size-16 rounded-2xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center mx-auto text-[#e8631b]">
                <Loader2 className="size-8 animate-spin" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-neutral-900">Validating Invitation</h2>
                <p className="text-xs sm:text-sm text-neutral-500">
                  Please wait while we verify your invitation security token...
                </p>
              </div>
            </div>
          )}

          {/* State 2: Invalid / Expired Token */}
          {!isValidating && !isValid && (
            <div className="rounded-3xl border border-rose-200 bg-white p-8 sm:p-10 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="size-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
                <AlertCircle className="size-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-neutral-900">
                  Invitation Expired or Invalid
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  {errorMessage ||
                    "This invitation link has expired or has already been used. Please contact your restaurant administrator to request a new invitation."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={retryValidation}
                  className="w-full sm:w-auto rounded-xl border-[#eddcd4] text-xs font-semibold"
                >
                  <RotateCcw className="size-3.5 mr-1.5" />
                  Retry Verification
                </Button>
                <Link to="/staff/login" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white text-xs font-semibold">
                    Go to Staff Login
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* State 3: Valid Invitation & Registration Form */}
          {!isValidating && isValid && (
            <div className="rounded-3xl border border-[#eddcd4] bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Card Banner */}
              <div className="bg-gradient-to-r from-[#fef3ec] via-[#fffaf6] to-[#fef3ec] p-6 sm:p-7 border-b border-[#fae2d3] text-center space-y-2 relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#9a3412] border border-[#fae2d3] shadow-2xs">
                  <Building2 className="size-3.5 text-[#e8631b]" />
                  <span>{restaurantName}</span>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  Staff Registration
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
                  Complete your details below to activate your staff account and join the team.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(handleAccept)} className="p-6 sm:p-8 space-y-5">
                {/* Email (Readonly) */}
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

                {/* Full Name */}
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

                {/* Phone Number with +91 */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="staff-reg-phone"
                    className="block text-xs font-semibold text-neutral-700"
                  >
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

                {/* Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="staff-reg-pass"
                    className="block text-xs font-semibold text-neutral-700"
                  >
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

                  {/* Password requirements indicators */}
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

                {/* Confirm Password */}
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
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs font-medium text-rose-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#e8631b] to-[#ff6b00] hover:from-[#d45614] hover:to-[#ea580c] text-white font-bold text-xs shadow-md mt-4 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      Activating Account...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 mr-2" />
                      Complete Registration &amp; Join Team
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#f3e6de] bg-[#fffcf9]/60 px-6 py-4 text-center text-xs text-neutral-400">
        SpotQ Technologies &copy; {new Date().getFullYear()} &middot; All Rights Reserved
      </footer>
    </div>
  );
}
