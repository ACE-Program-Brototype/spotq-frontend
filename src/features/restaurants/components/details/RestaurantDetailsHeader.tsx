import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Clock,
  Copy,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RESTAURANT_MESSAGES, RESTAURANT_STATUS } from "../../constants/restaurant.constants";
import { useBlockRestaurant, useUnblockRestaurant } from "../../hooks/useRestaurantStatusMutation";
import type { RestaurantDetails } from "../../types/restaurant.types";
import { BlockRestaurantModal } from "./BlockRestaurantModal";

interface RestaurantDetailsHeaderProps {
  restaurant: RestaurantDetails;
}

export function RestaurantDetailsHeader({ restaurant }: RestaurantDetailsHeaderProps) {
  const navigate = useNavigate();
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isUnblockConfirmOpen, setIsUnblockConfirmOpen] = useState(false);

  const blockMutation = useBlockRestaurant();
  const unblockMutation = useUnblockRestaurant();

  const isBlocked =
    restaurant.is_blocked ||
    restaurant.status === RESTAURANT_STATUS.SUSPENDED ||
    restaurant.status === RESTAURANT_STATUS.BLOCKED;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(restaurant.id);
      toast.success("Restaurant ID copied to clipboard");
    } catch {
      toast.error("Failed to copy ID");
    }
  };

  const handleBlockConfirm = async (reason: string) => {
    await blockMutation.mutateAsync({
      restaurantId: restaurant.id,
      reason,
    });
    setIsBlockModalOpen(false);
  };

  const handleUnblockConfirm = async () => {
    await unblockMutation.mutateAsync({
      restaurantId: restaurant.id,
    });
    setIsUnblockConfirmOpen(false);
  };

  const renderStatusBadge = () => {
    if (isBlocked) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
          <ShieldAlert className="size-3.5 text-rose-600" />
          SUSPENDED (BLOCKED)
        </span>
      );
    }

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
      {/* Top Bar Navigation & Restaurant ID */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/restaurants")}
          className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 text-xs font-semibold w-fit cursor-pointer"
          data-testid="restaurant-details-back-btn"
        >
          <ArrowLeft className="size-4" />
          {RESTAURANT_MESSAGES.DETAILS_BACK_BUTTON}
        </Button>

        <button
          type="button"
          onClick={handleCopyId}
          title="Click to copy restaurant ID"
          className="group inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 px-3 py-1.5 text-xs text-slate-700 font-mono transition-all cursor-pointer shadow-2xs w-fit"
          data-testid="restaurant-id-copy-btn"
        >
          <span className="text-slate-500 group-hover:text-slate-700 text-[11px] font-sans font-semibold">
            Restaurant ID:
          </span>
          <span className="font-semibold text-slate-800">{restaurant.id}</span>
          <Copy className="size-3.5 text-slate-400 group-hover:text-slate-600 transition-colors ml-0.5" />
        </button>
      </div>

      {/* Main Header Container */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div
            className={`size-14 shrink-0 flex items-center justify-center rounded-2xl text-white shadow-sm ring-4 ${
              isBlocked
                ? "bg-gradient-to-br from-rose-500 to-red-600 ring-rose-50"
                : "bg-gradient-to-br from-amber-500 to-orange-600 ring-amber-50"
            }`}
          >
            {isBlocked ? <Ban className="size-7" /> : <Store className="size-7" />}
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

              {restaurant.is_subscription_active && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
                  <Sparkles className="size-3 text-amber-600" />
                  {restaurant.subscription_plan_code || "Pro Active"}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                Owner: <strong className="text-slate-700">{restaurant.owner_name}</strong>
              </span>
              <span>•</span>
              <span>
                Contact: <span className="font-mono text-slate-600">{restaurant.phone || "—"}</span>
              </span>
              <span>•</span>
              <span>
                Email: <span className="text-slate-600">{restaurant.email}</span>
              </span>
            </p>
          </div>
        </div>

        {/* Action Button Container */}
        <div className="flex items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          {/* Block / Unblock Action Button */}
          {isBlocked ? (
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setIsUnblockConfirmOpen(true)}
              disabled={unblockMutation.isPending}
              className="h-10 px-4 gap-2 text-xs font-bold text-emerald-700 border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 hover:text-emerald-800 shadow-2xs rounded-xl cursor-pointer transition-all"
              data-testid="unblock-restaurant-btn"
            >
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>{RESTAURANT_MESSAGES.UNBLOCK_BUTTON}</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="destructive"
              size="default"
              onClick={() => setIsBlockModalOpen(true)}
              disabled={blockMutation.isPending}
              className="h-10 px-4 gap-2 text-xs font-bold shadow-2xs rounded-xl cursor-pointer transition-all"
              data-testid="block-restaurant-btn"
            >
              <Ban className="size-4" />
              <span>{RESTAURANT_MESSAGES.BLOCK_BUTTON}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Block Restaurant Modal with Reason */}
      <BlockRestaurantModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        restaurantName={restaurant.restaurant_name}
        isLoading={blockMutation.isPending}
        onConfirm={handleBlockConfirm}
      />

      {/* Unblock Restaurant Confirmation Dialog */}
      <ConfirmDialog
        open={isUnblockConfirmOpen}
        onOpenChange={setIsUnblockConfirmOpen}
        title={RESTAURANT_MESSAGES.UNBLOCK_CONFIRM_TITLE}
        description={RESTAURANT_MESSAGES.UNBLOCK_CONFIRM_DESCRIPTION(restaurant.restaurant_name)}
        confirmText={RESTAURANT_MESSAGES.UNBLOCK_CONFIRM_BUTTON}
        cancelText={RESTAURANT_MESSAGES.UNBLOCK_CANCEL_BUTTON}
        confirmVariant="default"
        isLoading={unblockMutation.isPending}
        loadingText="Unblocking..."
        onConfirm={handleUnblockConfirm}
        onCancel={() => setIsUnblockConfirmOpen(false)}
      />
    </div>
  );
}
