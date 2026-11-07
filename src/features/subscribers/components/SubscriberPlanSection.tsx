import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/date";
import { DATE_ONLY_FORMAT_OPTIONS, SUBSCRIBER_MESSAGES } from "../constants/subscriber.constants";
import type { SubscriberDetail } from "../types/subscriber.types";
import { formatBillingCycle, formatPrice } from "../utils/subscriber.utils";

export interface SubscriberPlanSectionProps {
  subscriber: SubscriberDetail;
}

export function SubscriberPlanSection({ subscriber }: SubscriberPlanSectionProps) {
  const plan = subscriber.plan;

  return (
    <Card className="border-slate-200 shadow-xs" data-testid="subscriber-plan-section">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-[#1e3a5f]" />
          <CardTitle className="text-base font-semibold text-slate-900">
            {SUBSCRIBER_MESSAGES.DETAILS_SECTION_PLAN}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        {/* Main Plan Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">
              {SUBSCRIBER_MESSAGES.TABLE_HEADER_PLAN}
            </span>
            <span className="mt-1 text-sm font-bold text-slate-900 block">
              {plan?.name || subscriber.plan?.name || SUBSCRIBER_MESSAGES.NOT_APPLICABLE}
            </span>
            {plan?.code && (
              <span className="text-[11px] font-mono text-slate-400">{plan.code}</span>
            )}
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 block">
              {SUBSCRIBER_MESSAGES.LABEL_BILLING_CYCLE}
            </span>
            <span className="mt-1 text-sm font-medium text-slate-800 block">
              {formatBillingCycle(plan?.billingCycle)}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 block">
              {SUBSCRIBER_MESSAGES.LABEL_PRICE}
            </span>
            <span className="mt-1 text-sm font-bold text-slate-900 block">
              {plan ? formatPrice(plan.price, plan.currency) : SUBSCRIBER_MESSAGES.NOT_APPLICABLE}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 block">
              {SUBSCRIBER_MESSAGES.LABEL_PERIOD_END}
            </span>
            <span className="mt-1 text-sm font-medium text-slate-800 block">
              {formatDate(subscriber.currentPeriodEnd, DATE_ONLY_FORMAT_OPTIONS)}
            </span>
          </div>
        </div>

        {/* Coverage dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">
              {SUBSCRIBER_MESSAGES.LABEL_PERIOD_START}
            </span>
            <span className="mt-1 text-sm text-slate-700 block">
              {formatDate(subscriber.currentPeriodStart, DATE_ONLY_FORMAT_OPTIONS)}
            </span>
          </div>

          {subscriber.cancelledAt && (
            <div>
              <span className="text-xs font-semibold text-rose-500 block">
                {SUBSCRIBER_MESSAGES.LABEL_CANCELLED_AT}
              </span>
              <span className="mt-1 text-sm text-rose-700 block">
                {formatDate(subscriber.cancelledAt, DATE_ONLY_FORMAT_OPTIONS)}
              </span>
            </div>
          )}
        </div>

        {/* Features breakdown */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 block mb-2">
            {SUBSCRIBER_MESSAGES.LABEL_FEATURES}
          </span>
          {plan?.features && plan.features.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {plan.features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800"
                >
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  {feature}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">{SUBSCRIBER_MESSAGES.LABEL_NO_FEATURES}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
