import {
  AlertCircle,
  ArrowLeft,
  Ban,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  RefreshCw,
  ShoppingBag,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerDetailsSkeleton } from "../components/CustomerDetailsSkeleton";
import {
  CUSTOMER_MESSAGES,
  CUSTOMER_STATUS,
  type CustomerStatusType,
} from "../constants/customer.constants";
import { useCustomerDetails, useUpdateCustomerStatus } from "../hooks/use-customers";
import { formatMemberSince, getCustomerInitials } from "../utils/customer.utils";

// Dummy order static placeholder data
const DUMMY_CUSTOMER_ORDERS = [
  {
    id: "ORD-98241",
    date: "2026-09-12",
    items: "2x Gourmet Burger Combo, 1x Iced Tea",
    total: "$34.50",
    status: "COMPLETED",
  },
  {
    id: "ORD-97104",
    date: "2026-09-08",
    items: "1x Margherita Pizza, 2x Garlic Bread",
    total: "$22.00",
    status: "COMPLETED",
  },
];

export function AdminCustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: customer, isLoading, isError, error, refetch } = useCustomerDetails(id);

  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useUpdateCustomerStatus();

  // Confirmation Modal state for Block / Unblock actions
  const [statusTarget, setStatusTarget] = useState<CustomerStatusType | null>(null);

  const handleBack = () => {
    navigate("/admin/customers");
  };

  const handleOpenStatusModal = (nextStatus: CustomerStatusType) => {
    setStatusTarget(nextStatus);
  };

  const handleConfirmStatusChange = async () => {
    if (!customer || !statusTarget) return;

    try {
      await updateStatus({
        userId: customer.id,
        status: statusTarget,
      });

      toast.success(
        statusTarget === CUSTOMER_STATUS.BLOCKED
          ? CUSTOMER_MESSAGES.BLOCK_SUCCESS
          : CUSTOMER_MESSAGES.UNBLOCK_SUCCESS,
      );
      setStatusTarget(null);
      refetch();
    } catch {
      toast.error(CUSTOMER_MESSAGES.STATUS_UPDATE_ERROR);
    }
  };

  // Loading Skeleton State
  if (isLoading) {
    return <CustomerDetailsSkeleton />;
  }

  // Check for 404 or missing customer record
  const isNotFound = isError && (error as { status?: number })?.status === 404;

  if (isNotFound || (!isLoading && !customer && !isError)) {
    return (
      <div className="space-y-6" data-testid="admin-customer-details-not-found">
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 mb-2"
            data-testid="customer-details-back-btn"
          >
            <ArrowLeft className="size-4" />
            {CUSTOMER_MESSAGES.DETAILS_PAGE_BACK_BUTTON}
          </Button>
        </div>

        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 shadow-xs">
              <User className="size-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {CUSTOMER_MESSAGES.DETAILS_NOT_FOUND_TITLE}
            </h2>
            <p className="mt-1.5 max-w-md text-xs text-slate-500">
              {CUSTOMER_MESSAGES.DETAILS_NOT_FOUND_DESC}
            </p>
            {id && (
              <p className="mt-2 text-xs font-mono text-slate-400">
                {CUSTOMER_MESSAGES.DETAILS_PAGE_CUSTOMER_ID_LABEL}: {id}
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="mt-6 gap-2 text-xs font-semibold"
            >
              <ArrowLeft className="size-3.5" />
              {CUSTOMER_MESSAGES.DETAILS_PAGE_BACK_BUTTON}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // General Error State
  if (isError) {
    return (
      <div className="space-y-6" data-testid="admin-customer-details-error">
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 mb-2"
            data-testid="customer-details-back-btn"
          >
            <ArrowLeft className="size-4" />
            {CUSTOMER_MESSAGES.DETAILS_PAGE_BACK_BUTTON}
          </Button>
        </div>

        <Card className="border-rose-200/80 bg-rose-50/30 shadow-xs">
          <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertCircle className="size-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {CUSTOMER_MESSAGES.DETAILS_FETCH_ERROR_TITLE}
            </h2>
            <p className="mt-1 max-w-md text-xs text-slate-500">
              {CUSTOMER_MESSAGES.DETAILS_FETCH_ERROR_DESC}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="gap-2 text-xs font-semibold bg-white"
              >
                <RefreshCw className="size-3.5" />
                {CUSTOMER_MESSAGES.RETRY_BUTTON}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-xs font-semibold text-slate-600"
              >
                {CUSTOMER_MESSAGES.DETAILS_PAGE_BACK_BUTTON}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!customer) return null;

  const isBlocked = customer.status === CUSTOMER_STATUS.BLOCKED;
  const isActionModalBlocked = statusTarget === CUSTOMER_STATUS.BLOCKED;

  return (
    <div className="space-y-6" data-testid="admin-customer-details-page">
      {/* Back Button Navigation */}
      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 mb-2"
          data-testid="customer-details-back-btn"
        >
          <ArrowLeft className="size-4" />
          {CUSTOMER_MESSAGES.DETAILS_PAGE_BACK_BUTTON}
        </Button>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl font-bold tracking-tight text-slate-900"
              data-testid="customer-name"
            >
              {customer.fullName}
            </h1>
            {customer.status === CUSTOMER_STATUS.ACTIVE ? (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100/70 text-emerald-800"
                data-testid="customer-status-badge"
              >
                <span className="size-1.5 rounded-full bg-emerald-600" />
                ACTIVE
              </span>
            ) : customer.status === CUSTOMER_STATUS.BLOCKED ? (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100/70 text-rose-800"
                data-testid="customer-status-badge"
              >
                <span className="size-1.5 rounded-full bg-rose-600" />
                BLOCKED
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700"
                data-testid="customer-status-badge"
              >
                <span className="size-1.5 rounded-full bg-slate-500" />
                INACTIVE
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">{CUSTOMER_MESSAGES.DETAILS_PAGE_SUBTITLE}</p>
        </div>

        {/* Action Button: Block or Unblock */}
        <div>
          {isBlocked ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenStatusModal(CUSTOMER_STATUS.ACTIVE)}
              disabled={isUpdatingStatus}
              className="gap-2 border-emerald-300 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/70 font-semibold"
              data-testid="customer-unblock-btn"
            >
              {isUpdatingStatus ? (
                <Loader2 className="size-4 animate-spin text-emerald-600" />
              ) : (
                <CheckCircle2 className="size-4 text-emerald-600" />
              )}
              {CUSTOMER_MESSAGES.UNBLOCK_ACTION_TOOLTIP}
            </Button>
          ) : (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => handleOpenStatusModal(CUSTOMER_STATUS.BLOCKED)}
              disabled={isUpdatingStatus}
              className="gap-2 bg-rose-600 hover:bg-rose-700 font-semibold shadow-2xs"
              data-testid="customer-block-btn"
            >
              {isUpdatingStatus ? (
                <Loader2 className="size-4 animate-spin text-white" />
              ) : (
                <Ban className="size-4" />
              )}
              {CUSTOMER_MESSAGES.BLOCK_ACTION_TOOLTIP}
            </Button>
          )}
        </div>
      </div>

      {/* Customer Profile Details Card */}
      <Card className="border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base font-bold text-slate-800">
            {CUSTOMER_MESSAGES.DETAILS_PAGE_TITLE}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {CUSTOMER_MESSAGES.DETAILS_PAGE_SUBTITLE}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 shrink-0 bg-slate-100 border border-slate-200/60 shadow-2xs">
                {customer.avatarUrl && (
                  <AvatarImage src={customer.avatarUrl} alt={customer.fullName} />
                )}
                <AvatarFallback className="bg-slate-200 text-slate-700 font-bold text-base">
                  {getCustomerInitials(customer.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{customer.fullName}</h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="size-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700" data-testid="customer-email">
                    {customer.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-slate-100/80 px-3 py-2 text-xs text-slate-700 border border-slate-200/50 self-start sm:self-center">
              <span className="font-semibold text-slate-500">
                {CUSTOMER_MESSAGES.DETAILS_PAGE_CUSTOMER_ID_LABEL}:
              </span>
              <span
                className="font-mono font-medium text-slate-800"
                data-testid="customer-details-id"
              >
                {customer.id}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Member Since
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <Calendar className="size-3.5 text-slate-400" />
                <span>{formatMemberSince(customer.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Account Status
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Clock className="size-3.5 text-slate-400" />
                <span>{customer.status}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Contact Email
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium truncate">
                <Mail className="size-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{customer.email}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 
        ========================================================================
        ORDERS SECTION (Static UI-Only Placeholder)
        TODO: Replace dummy order listing data with Order Service API integration 
              when Order Management is implemented.
        ========================================================================
      */}
      <Card className="border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-4 text-slate-600" />
            <CardTitle className="text-base font-bold text-slate-800">
              {CUSTOMER_MESSAGES.ORDERS_SECTION_TITLE}
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            {CUSTOMER_MESSAGES.ORDERS_SECTION_SUBTITLE}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f0edf1]/60 text-slate-500 font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4">ORDER ID</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">ITEMS</th>
                  <th className="py-3 px-4">TOTAL</th>
                  <th className="py-3 px-4 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {DUMMY_CUSTOMER_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">{order.id}</td>
                    <td className="py-3 px-4 text-slate-500">{order.date}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium truncate max-w-xs">
                      {order.items}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{order.total}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold"
                      >
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog Modal for Block / Unblock actions */}
      <ConfirmDialog
        open={statusTarget !== null}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
        title={
          isActionModalBlocked
            ? CUSTOMER_MESSAGES.BLOCK_CONFIRM_TITLE
            : CUSTOMER_MESSAGES.UNBLOCK_CONFIRM_TITLE
        }
        description={
          isActionModalBlocked
            ? CUSTOMER_MESSAGES.BLOCK_CONFIRM_DESCRIPTION(customer.fullName)
            : CUSTOMER_MESSAGES.UNBLOCK_CONFIRM_DESCRIPTION(customer.fullName)
        }
        confirmText={
          isActionModalBlocked
            ? CUSTOMER_MESSAGES.CONFIRM_BLOCK_BUTTON
            : CUSTOMER_MESSAGES.CONFIRM_UNBLOCK_BUTTON
        }
        confirmVariant={isActionModalBlocked ? "destructive" : "default"}
        isLoading={isUpdatingStatus}
        loadingText="Updating..."
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
}

export default AdminCustomerDetailsPage;
