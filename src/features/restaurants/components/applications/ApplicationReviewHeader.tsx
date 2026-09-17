import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  CheckCircle2,
  Clock,
  Copy,
  ShieldAlert,
  Store,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  APPLICATION_MESSAGES,
  APPLICATION_STATUS,
} from "../../constants/restaurant-application.constants";
import {
  useApproveApplication,
  useRejectApplication,
} from "../../hooks/useApplicationDecisionMutation";
import type { RestaurantApplicationItem } from "../../types/restaurant-application.types";
import { RejectApplicationModal } from "./RejectApplicationModal";

export interface ApplicationReviewHeaderProps {
  application: RestaurantApplicationItem;
}

export function ApplicationReviewHeader({ application }: ApplicationReviewHeaderProps) {
  const navigate = useNavigate();
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const approveMutation = useApproveApplication();
  const rejectMutation = useRejectApplication();

  const isPendingDecision = approveMutation.isPending || rejectMutation.isPending;
  const isPending = application.status === APPLICATION_STATUS.PENDING;
  const isRejected = application.status === APPLICATION_STATUS.REJECTED;
  const isBlocked = Boolean(application.is_blocked || application.isBlocked);
  const blockReason = application.block_reason || application.blockReason;
  const rejectionReason = application.rejection_reason || application.rejectionReason;
  const canTakeAction = isPending && !isBlocked;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(application.id);
      toast.success("Application ID copied to clipboard");
    } catch {
      toast.error("Failed to copy ID");
    }
  };

  const handleApproveConfirm = async () => {
    await approveMutation.mutateAsync(application.id);
    setIsApproveConfirmOpen(false);
  };

  const handleRejectConfirm = async (reason: string) => {
    await rejectMutation.mutateAsync({
      restaurantId: application.id,
      reason,
    });
    setIsRejectModalOpen(false);
  };

  const renderStatusBadge = () => {
    switch (application.status) {
      case APPLICATION_STATUS.PENDING:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
            <Clock className="size-3.5 text-amber-600 shrink-0" />
            Pending Verification
          </span>
        );
      case APPLICATION_STATUS.REJECTED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
            <ShieldAlert className="size-3.5 text-rose-600 shrink-0" />
            Rejected
          </span>
        );
      case APPLICATION_STATUS.APPROVED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
            Approved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {application.status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4" data-testid="application-review-header">
      {/* Top Bar Navigation & Application ID */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/restaurants/onboarding")}
          className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 text-xs font-semibold w-fit cursor-pointer"
          data-testid="application-back-btn"
        >
          <ArrowLeft className="size-4" />
          {APPLICATION_MESSAGES.REVIEW_BACK_BUTTON}
        </Button>

        <button
          type="button"
          onClick={handleCopyId}
          title="Click to copy application ID"
          className="group inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 px-3 py-1.5 text-xs text-slate-700 font-mono transition-all cursor-pointer shadow-2xs w-fit"
          data-testid="application-id-copy-btn"
        >
          <span className="text-slate-500 group-hover:text-slate-700 text-[11px] font-sans font-semibold">
            Application ID:
          </span>
          <span className="font-semibold text-slate-800">{application.id}</span>
          <Copy className="size-3.5 text-slate-400 group-hover:text-slate-600 transition-colors ml-0.5" />
        </button>
      </div>

      {/* Main Header Container */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="size-14 shrink-0 flex items-center justify-center rounded-2xl text-white shadow-sm ring-4 bg-gradient-to-br from-amber-500 to-orange-600 ring-amber-50">
            <Store className="size-7" />
          </div>

          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1
                className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 truncate"
                data-testid="application-restaurant-name"
              >
                {application.restaurant_name}
              </h1>
              {renderStatusBadge()}

              {isBlocked && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-2xs">
                  <Ban className="size-3" />
                  BLOCKED
                </span>
              )}

              {application.onboarding_status === "COMPLETED" ? (
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold"
                >
                  Onboarding Completed
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-semibold"
                >
                  Onboarding {application.onboarding_status || "Pending"}
                </Badge>
              )}
            </div>

            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                Owner: <strong className="text-slate-700">{application.owner_name}</strong>
              </span>
              <span>•</span>
              <span>
                Contact:{" "}
                <span className="font-mono text-slate-600">{application.phone || "—"}</span>
              </span>
              <span>•</span>
              <span>
                Email:{" "}
                <span className="text-slate-600">
                  {application.email || application.owner_email}
                </span>
              </span>
            </p>
          </div>
        </div>

        {/* Decision Action Buttons - only shown for pending and unblocked applications */}
        {canTakeAction && (
          <div
            className="flex items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100"
            data-testid="application-action-buttons"
          >
            {/* Reject Button */}
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setIsRejectModalOpen(true)}
              disabled={isPendingDecision}
              className="h-10 px-4 gap-2 text-xs font-bold text-rose-700 border-rose-300 bg-rose-50/70 hover:bg-rose-100 hover:text-rose-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs rounded-xl cursor-pointer transition-all"
              data-testid="reject-application-btn"
            >
              <XCircle className="size-4 text-rose-600" />
              <span>{APPLICATION_MESSAGES.REJECT_BUTTON}</span>
            </Button>

            {/* Approve Button */}
            <Button
              type="button"
              size="default"
              onClick={() => setIsApproveConfirmOpen(true)}
              disabled={isPendingDecision}
              className="h-10 px-4 gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs rounded-xl cursor-pointer transition-all"
              data-testid="approve-application-btn"
            >
              <CheckCircle2 className="size-4 text-white" />
              <span>{APPLICATION_MESSAGES.APPROVE_BUTTON}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Block Reason Alert if Restaurant is Blocked */}
      {isBlocked && blockReason && (
        <div
          className="rounded-2xl border border-red-200 bg-red-50/80 p-4 shadow-2xs flex items-start gap-3 text-xs text-red-900"
          data-testid="block-reason-alert"
        >
          <Ban className="size-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-red-950">Restaurant is Currently Blocked:</p>
            <p className="leading-relaxed text-red-800">{blockReason}</p>
          </div>
        </div>
      )}

      {/* Rejection Reason Alert if Application was rejected */}
      {(isRejected || Boolean(rejectionReason)) && (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 shadow-2xs flex items-start gap-3 text-xs text-rose-900"
          data-testid="rejection-reason-banner"
        >
          <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-rose-950">Administrative Rejection Reason:</p>
            <p className="leading-relaxed text-rose-800" data-testid="rejection-reason-text">
              {rejectionReason ||
                "This application has been rejected during administrative verification."}
            </p>
            {application.reviewed_at && (
              <p className="text-[11px] text-rose-600 font-medium">
                Reviewed on: {new Date(application.reviewed_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Approve Confirmation Dialog */}
      <ConfirmDialog
        open={isApproveConfirmOpen}
        onOpenChange={setIsApproveConfirmOpen}
        title={APPLICATION_MESSAGES.APPROVE_CONFIRM_TITLE}
        description={APPLICATION_MESSAGES.APPROVE_CONFIRM_DESCRIPTION(application.restaurant_name)}
        confirmText={APPLICATION_MESSAGES.APPROVE_CONFIRM_BUTTON}
        cancelText={APPLICATION_MESSAGES.APPROVE_CANCEL_BUTTON}
        confirmVariant="default"
        isLoading={approveMutation.isPending}
        loadingText="Approving..."
        onConfirm={handleApproveConfirm}
        onCancel={() => setIsApproveConfirmOpen(false)}
      />

      {/* Reject Application Modal */}
      <RejectApplicationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        restaurantName={application.restaurant_name}
        isLoading={rejectMutation.isPending}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}
