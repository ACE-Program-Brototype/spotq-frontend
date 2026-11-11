import { Building2, CreditCard, IndianRupee, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  CustomerGrowthSection,
  PlatformOverview,
  RevenueSection,
} from "../../types/platform-analytics.types";
import { formatNumber, formatRupees } from "../../utils/platform-analytics.utils";

export interface PlatformKpisSectionProps {
  overview?: PlatformOverview;
  customerGrowth?: CustomerGrowthSection;
  revenue?: RevenueSection;
  isLoading?: boolean;
}

export function PlatformKpisSection({
  overview,
  customerGrowth,
  revenue,
  isLoading = false,
}: PlatformKpisSectionProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
          <Card key={i} className="border-slate-200/80 shadow-2xs">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="size-6 rounded-full" />
              </div>
              <Skeleton className="my-3 h-8 w-24" />
              <Skeleton className="h-3.5 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalRestaurants = overview?.totalRestaurants ?? 0;
  const activeSubscribed = overview?.activeSubscribedRestaurants;
  const conversionRate =
    totalRestaurants > 0 && typeof activeSubscribed === "number"
      ? Math.round((activeSubscribed / totalRestaurants) * 100)
      : null;

  const isPaymentAvailable = revenue?.status === "AVAILABLE";
  const isUserAvailable = customerGrowth?.status === "AVAILABLE";

  const cards = [
    {
      title: "Total Restaurants",
      value: formatNumber(totalRestaurants),
      subtitle: "Onboarded & active restaurants",
      icon: Building2,
      iconColor: "text-blue-600 bg-blue-50 border-blue-200/60",
    },
    {
      title: "Subscribed Restaurants",
      value: isPaymentAvailable ? formatNumber(activeSubscribed) : "—",
      subtitle:
        conversionRate !== null
          ? `${conversionRate}% conversion rate of total`
          : "Subscription conversion unavailable",
      icon: CreditCard,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200/60",
    },
    {
      title: "Registered Customers",
      value: isUserAvailable ? formatNumber(customerGrowth?.totalRegisteredCustomers) : "—",
      subtitle: isUserAvailable
        ? `+${formatNumber(customerGrowth?.newCustomersInPeriod ?? 0)} new in period`
        : "Customer metrics unavailable",
      icon: Users,
      iconColor: "text-purple-600 bg-purple-50 border-purple-200/60",
    },
    {
      title: "Monthly Revenue",
      value: isPaymentAvailable ? formatRupees(revenue?.currentMrrRupees) : "—",
      subtitle:
        isPaymentAvailable && revenue?.currentArrRupees
          ? `Annual Revenue: ${formatRupees(revenue.currentArrRupees, true)}`
          : "Revenue metrics unavailable",
      icon: IndianRupee,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200/60",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card
            key={c.title}
            className="border-slate-200/80 bg-white shadow-2xs transition-all hover:shadow-xs"
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {c.title}
                </span>
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${c.iconColor}`}
                >
                  <Icon className="size-4" />
                </div>
              </div>

              <div className="mt-2.5 flex items-baseline">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {c.value}
                </span>
              </div>

              <p className="mt-2 text-xs font-medium text-slate-500">{c.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
