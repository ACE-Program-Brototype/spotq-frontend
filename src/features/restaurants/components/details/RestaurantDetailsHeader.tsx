import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Clock,
  Copy,
  ShieldAlert,
  Sparkles,
  Store,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RESTAURANT_MESSAGES, RESTAURANT_STATUS } from "../../constants/restaurant.constants";
import type { RestaurantDetails } from "../../types/restaurant.types";

interface RestaurantDetailsHeaderProps {
  restaurant: RestaurantDetails;
}

export function RestaurantDetailsHeader({ restaurant }: RestaurantDetailsHeaderProps) {
  const navigate = useNavigate();

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(restaurant.id);
      toast.success(RESTAURANT_MESSAGES.TOAST_COPY_ID_SUCCESS);
    } catch {
      toast.error(RESTAURANT_MESSAGES.TOAST_COPY_ID_ERROR);
    }
  };

  const renderStatusBadge = () => {
    switch (restaurant.status) {
      case RESTAURANT_STATUS.ACTIVE:
      case RESTAURANT_STATUS.APPROVED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            {restaurant.status}
          </span>
        );
      case RESTAURANT_STATUS.PENDING:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="size-3.5 text-amber-600" />
            PENDING APPROVAL
          </span>
        );
      case RESTAURANT_STATUS.REJECTED:
      case RESTAURANT_STATUS.SUSPENDED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <ShieldAlert className="size-3.5 text-rose-600" />
            {restaurant.status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {restaurant.status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4" data-testid="restaurant-details-header">
      {/* Back button */}
      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/restaurants")}
          className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 text-xs font-semibold"
          data-testid="restaurant-details-back-btn"
        >
          <ArrowLeft className="size-4" />
          {RESTAURANT_MESSAGES.DETAILS_BACK_BUTTON}
        </Button>
      </div>

      {/* Main Header Container */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="size-14 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm ring-4 ring-amber-50">
            <Store className="size-7" />
          </div>

          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1
                className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 truncate"
                data-testid="restaurant-name"
              >
                {restaurant.restaurant_name}
              </h1>
              {renderStatusBadge()}

              {restaurant.is_blocked && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-2xs">
                  <Ban className="size-3" />
                  BLOCKED
                </span>
              )}

              {restaurant.onboarding_status === "COMPLETED" ? (
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold"
                >
                  Onboarding Complete
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-semibold"
                >
                  Onboarding {restaurant.onboarding_status || "Pending"}
                </Badge>
              )}
            </div>

            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                Owner: <strong className="text-slate-700">{restaurant.owner_name}</strong>
              </span>
              <span>•</span>
              <span>
                Contact: <span className="font-mono text-slate-600">{restaurant.phone || "-"}</span>
              </span>
              <span>•</span>
              <span>
                Email: <span className="text-slate-600">{restaurant.email}</span>
              </span>
            </p>
          </div>
        </div>

        {/* Action / ID pill */}
        <div className="flex flex-wrap items-center gap-2.5 lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <button
            type="button"
            onClick={handleCopyId}
            title="Click to copy ID"
            className="group flex items-center gap-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3 py-1.5 text-xs text-slate-700 font-mono transition-all cursor-pointer shadow-2xs"
            data-testid="restaurant-id-copy-btn"
          >
            <span className="text-slate-400 group-hover:text-slate-600 text-[11px]">ID:</span>
            <span className="font-semibold text-slate-800">{restaurant.id}</span>
            <Copy className="size-3.5 text-slate-400 group-hover:text-slate-600 transition-colors ml-0.5" />
          </button>

          {restaurant.is_subscription_active && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-2xs">
              <Sparkles className="size-3.5" />
              {restaurant.subscription_plan_code || "Pro Active"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
