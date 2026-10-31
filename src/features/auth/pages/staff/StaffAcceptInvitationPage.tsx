import { AlertCircle, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { STAFF_ROUTES } from "@/app/router/routes.constants";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { StaffAcceptInvitationForm } from "@/features/auth/components/StaffAcceptInvitationForm";
import { StaffJoinExistingCard } from "@/features/auth/components/StaffJoinExistingCard";
import { useAcceptInvitation } from "@/features/auth/hooks/use-accept-invitation";

export default function StaffAcceptInvitationPage() {
  const {
    isValidating,
    isValid,
    isExistingStaff,
    email,
    restaurantName,
    errorMessage,
    isSubmitting,
    handleAccept,
    handleJoinExisting,
    retryValidation,
  } = useAcceptInvitation();

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
            to={STAFF_ROUTES.LOGIN}
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
              <div className="size-16 rounded-2xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center mx-auto">
                <LoadingIndicator size="lg" theme="brand" />
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
                <Link to={STAFF_ROUTES.LOGIN} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white text-xs font-semibold">
                    Go to Staff Login
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* State 3A: Existing Staff User */}
          {!isValidating && isValid && isExistingStaff && (
            <StaffJoinExistingCard
              restaurantName={restaurantName}
              email={email}
              isSubmitting={isSubmitting}
              onJoinExisting={handleJoinExisting}
            />
          )}

          {/* State 3B: New Staff Registration Form */}
          {!isValidating && isValid && !isExistingStaff && (
            <StaffAcceptInvitationForm
              restaurantName={restaurantName}
              email={email}
              isSubmitting={isSubmitting}
              onAccept={handleAccept}
            />
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
