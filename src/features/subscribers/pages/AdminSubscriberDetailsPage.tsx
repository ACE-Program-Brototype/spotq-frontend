import { ArrowLeft, Building2, Calendar, Mail, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/date";
import { SubscriberDetailsErrorState } from "../components/SubscriberDetailsErrorState";
import { SubscriberDetailsSkeleton } from "../components/SubscriberDetailsSkeleton";
import { SubscriberInvoicesTable } from "../components/SubscriberInvoicesTable";
import { SubscriberPlanSection } from "../components/SubscriberPlanSection";
import { SubscriberStatusBadge } from "../components/SubscriberStatusBadge";
import { SubscriberTransactionsTable } from "../components/SubscriberTransactionsTable";
import { DATE_ONLY_FORMAT_OPTIONS, SUBSCRIBER_MESSAGES } from "../constants/subscriber.constants";
import { useSubscriberDetails } from "../hooks/use-subscriber-details";

export function AdminSubscriberDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: subscriber, isLoading, isError, error, refetch } = useSubscriberDetails(id);

  const handleBack = () => {
    navigate(ADMIN_ROUTES.SUBSCRIBERS);
  };

  if (isLoading) {
    return <SubscriberDetailsSkeleton />;
  }

  const isNotFound =
    isError &&
    ((error as { response?: { status?: number } })?.response?.status === 404 ||
      (error as { status?: number })?.status === 404);

  if (isError || !subscriber) {
    return (
      <SubscriberDetailsErrorState
        isNotFound={Boolean(isNotFound || !isError)}
        onBack={handleBack}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-subscriber-details-page">
      {/* Back Button Navigation */}
      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 mb-2"
          data-testid="subscriber-details-back-btn"
        >
          <ArrowLeft className="size-4" />
          {SUBSCRIBER_MESSAGES.DETAILS_PAGE_BACK_BUTTON}
        </Button>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1
            className="text-2xl font-bold tracking-tight text-slate-900"
            data-testid="subscriber-restaurant-name"
          >
            {subscriber.restaurantName || SUBSCRIBER_MESSAGES.NOT_APPLICABLE}
          </h1>
          <SubscriberStatusBadge status={subscriber.status} />
        </div>
      </div>

      {/* Restaurant and Subscriber Information Card */}
      <Card className="border-slate-200 shadow-xs" data-testid="subscriber-info-card">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-[#1e3a5f]" />
            <CardTitle className="text-base font-semibold text-slate-900">
              {SUBSCRIBER_MESSAGES.DETAILS_SECTION_RESTAURANT}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                {SUBSCRIBER_MESSAGES.TABLE_HEADER_RESTAURANT}
              </span>
              <span className="mt-1 text-sm font-semibold text-slate-900 block">
                {subscriber.restaurantName || SUBSCRIBER_MESSAGES.NOT_APPLICABLE}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                {SUBSCRIBER_MESSAGES.LABEL_SUBSCRIBER_NAME}
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <User className="size-3.5 text-slate-400" />
                <span className="text-sm font-medium text-slate-900">
                  {subscriber.subscriberName || SUBSCRIBER_MESSAGES.NOT_APPLICABLE}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                {SUBSCRIBER_MESSAGES.LABEL_EMAIL}
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <Mail className="size-3.5 text-slate-400" />
                <span className="text-sm text-slate-700">{subscriber.subscriberEmail}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                {SUBSCRIBER_MESSAGES.LABEL_CREATED_AT}
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-slate-400" />
                <span className="text-sm text-slate-700">
                  {formatDate(subscriber.createdAt, DATE_ONLY_FORMAT_OPTIONS)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plan Card */}
      <SubscriberPlanSection subscriber={subscriber} />

      {/* Invoices Table */}
      <SubscriberInvoicesTable invoices={subscriber.invoices || []} />

      {/* Transactions Table */}
      <SubscriberTransactionsTable transactions={subscriber.transactions || []} />
    </div>
  );
}

export default AdminSubscriberDetailsPage;
