import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  RefreshCw,
  ShoppingBag,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { DataTable } from "@/components/common/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerDetailsSkeleton } from "../components/CustomerDetailsSkeleton";
import { CUSTOMER_MESSAGES, CUSTOMER_STATUS } from "../constants/customer.constants";
import { useCustomerDetails } from "../hooks/use-customers";
import { DUMMY_CUSTOMER_ORDERS } from "../mocks/customer-orders.mock";
import { formatMemberSince, getCustomerInitials } from "../utils/customer.utils";

interface DummyCustomerOrder {
  id: string;
  date: string;
  items: string;
  total: string;
  status: string;
}

export function AdminCustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: customer, isLoading, isError, error, refetch } = useCustomerDetails(id);

  const handleBack = () => {
    navigate("/admin/customers");
  };

  // Loading Skeleton State
  if (isLoading) {
    return <CustomerDetailsSkeleton />;
  }

  // Check for 404 or missing customer record
  const isNotFound =
    isError &&
    ((error as { response?: { status?: number } })?.response?.status === 404 ||
      (error as { status?: number })?.status === 404);

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

  const normalizedStatus = customer.status?.toUpperCase();

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
      <div>
        <div className="flex items-center gap-3">
          <h1
            className="text-2xl font-bold tracking-tight text-slate-900"
            data-testid="customer-name"
          >
            {customer.fullName}
          </h1>
          {normalizedStatus === CUSTOMER_STATUS.ACTIVE ? (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100/70 text-emerald-800"
              data-testid="customer-status-badge"
            >
              <span className="size-1.5 rounded-full bg-emerald-600" />
              ACTIVE
            </span>
          ) : normalizedStatus === CUSTOMER_STATUS.BLOCKED ? (
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
                {CUSTOMER_MESSAGES.CARD_LABEL_MEMBER_SINCE}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <Calendar className="size-3.5 text-slate-400" />
                <span>{formatMemberSince(customer.createdAt, { includePrefix: false })}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {CUSTOMER_MESSAGES.CARD_LABEL_ACCOUNT_STATUS}
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Clock className="size-3.5 text-slate-400" />
                <span>{customer.status}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {CUSTOMER_MESSAGES.CARD_LABEL_CONTACT_EMAIL}
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
        <CardContent className="p-0">
          <DataTable<DummyCustomerOrder>
            data={DUMMY_CUSTOMER_ORDERS}
            columns={[
              {
                key: "id",
                header: CUSTOMER_MESSAGES.COL_ORDER_ID,
                accessor: "id",
                className: "font-mono font-semibold text-slate-900",
              },
              {
                key: "date",
                header: CUSTOMER_MESSAGES.COL_ORDER_DATE,
                accessor: "date",
                className: "text-slate-500",
              },
              {
                key: "items",
                header: CUSTOMER_MESSAGES.COL_ORDER_ITEMS,
                accessor: "items",
                className: "text-slate-800 font-medium truncate max-w-xs",
              },
              {
                key: "total",
                header: CUSTOMER_MESSAGES.COL_ORDER_TOTAL,
                accessor: "total",
                className: "font-bold text-slate-900",
              },
              {
                key: "status",
                header: CUSTOMER_MESSAGES.COL_ORDER_STATUS,
                align: "right",
                cell: ({ row: order }) => (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold"
                  >
                    {order.status}
                  </Badge>
                ),
              },
            ]}
            theme="admin"
            className="border-0 rounded-none shadow-none"
            headerClassName="bg-[#f0edf1]/60 text-slate-500 font-semibold border-b border-slate-200/80"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminCustomerDetailsPage;
