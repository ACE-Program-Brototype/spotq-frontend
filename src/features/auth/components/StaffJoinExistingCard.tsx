import { Building2, CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { STAFF_ROUTES } from "@/app/router/routes.constants";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";

interface StaffJoinExistingCardProps {
  restaurantName: string;
  email: string;
  isSubmitting: boolean;
  onJoinExisting: () => void;
}

export function StaffJoinExistingCard({
  restaurantName,
  email,
  isSubmitting,
  onJoinExisting,
}: StaffJoinExistingCardProps) {
  return (
    <div className="rounded-3xl border border-[#eddcd4] bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-gradient-to-r from-[#fef3ec] via-[#fffaf6] to-[#fef3ec] p-6 sm:p-7 border-b border-[#fae2d3] text-center space-y-2 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#9a3412] border border-[#fae2d3] shadow-2xs">
          <Building2 className="size-3.5 text-[#e8631b]" />
          <span>{restaurantName}</span>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Join Restaurant Team</h2>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
          You already have an active SpotQ Staff profile. Join {restaurantName} with a single click.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <div className="rounded-2xl border border-[#fae2d3] bg-[#fffaf5] p-4 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-[#fef3ec] text-[#e8631b] flex items-center justify-center shrink-0">
            <CheckCircle className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-800">Existing Staff Account</p>
            <p className="text-xs text-neutral-500 truncate">{email}</p>
          </div>
        </div>

        <Button
          type="button"
          disabled={isSubmitting}
          onClick={onJoinExisting}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#e8631b] to-[#ff6b00] hover:from-[#d45614] hover:to-[#ea580c] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner size="sm" theme="white" />
              <span>Joining Restaurant...</span>
            </div>
          ) : (
            <>
              <Sparkles className="size-4 mr-2" />
              Accept &amp; Join {restaurantName}
            </>
          )}
        </Button>

        <div className="text-center">
          <Link
            to={STAFF_ROUTES.LOGIN}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            Not your account? Sign In &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
