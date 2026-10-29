import { CheckCircle2, CreditCard, ShieldAlert, ShieldCheck, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RestaurantDetails } from "../../types/restaurant.types";

interface RestaurantSubscriptionCardProps {
  restaurant: RestaurantDetails;
  formatDate: (dateString?: string | null) => string;
}

export function RestaurantSubscriptionCard({
  restaurant,
  formatDate,
}: RestaurantSubscriptionCardProps) {
  return (
    <Card className="border-slate-200/80 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CreditCard className="size-4.5 text-amber-600" />
          <CardTitle className="text-base font-bold text-slate-900">
            Subscription & Security
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Active tier, expiration, and platform security flags
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 divide-y divide-slate-100 text-sm">
        <div className="py-2.5 flex justify-between items-center">
          <span className="text-slate-500">Subscription Status</span>
          {restaurant.is_subscription_active ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="size-3 text-emerald-600" />
              Active Plan
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
              <XCircle className="size-3 text-slate-400" />
              No Active Subscription
            </span>
          )}
        </div>

        <div className="py-2.5 flex justify-between items-center">
          <span className="text-slate-500">Plan Code</span>
          <span className="font-semibold text-slate-900">
            {restaurant.subscription_plan_code || "N/A (Free/Trial)"}
          </span>
        </div>

        <div className="py-2.5 flex justify-between items-center">
          <span className="text-slate-500">Subscription Ends</span>
          <span className="text-slate-700 font-medium">
            {formatDate(restaurant.subscription_ends_at)}
          </span>
        </div>

        <div className="py-2.5 flex justify-between items-center">
          <span className="text-slate-500">Account Block Status</span>
          {restaurant.is_blocked || restaurant.status === "SUSPENDED" ? (
            <Badge
              variant="destructive"
              className="text-xs font-bold gap-1"
              data-testid="block-status-badge"
            >
              <ShieldAlert className="size-3" /> SUSPENDED (BLOCKED)
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold"
              data-testid="block-status-badge"
            >
              <ShieldCheck className="size-3 mr-1" /> Normal (Active)
            </Badge>
          )}
        </div>

        {restaurant.block_reason && (
          <div className="py-2.5 flex flex-col gap-1" data-testid="block-reason-display">
            <span className="text-xs font-semibold flex items-center gap-1 text-rose-700">
              <ShieldAlert className="size-3.5 text-rose-600" />
              Administrative Block Reason:
            </span>
            <p className="text-xs text-rose-800 bg-rose-50/80 p-2.5 rounded-xl border border-rose-200/90 font-medium">
              {restaurant.block_reason}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
