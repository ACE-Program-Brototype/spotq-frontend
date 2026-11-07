import { Calendar, CheckCircle2, Clock, Mail, Phone, Store, Tag, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RestaurantDetails } from "../../types/restaurant.types";
import { RestaurantLocationCard } from "./RestaurantLocationCard";
import { RestaurantQuickMetrics } from "./RestaurantQuickMetrics";
import { RestaurantSubscriptionCard } from "./RestaurantSubscriptionCard";

interface RestaurantOverviewTabProps {
  restaurant: RestaurantDetails;
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "Not recorded";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function RestaurantOverviewTab({ restaurant }: RestaurantOverviewTabProps) {
  const address = restaurant.address;
  const settings = restaurant.settings;

  return (
    <div className="space-y-6" data-testid="restaurant-overview-tab">
      {/* Quick Metrics Bar */}
      <RestaurantQuickMetrics settings={settings} />

      {/* 2-Column Main Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: RESTAURANT PROFILE & CONTACT */}
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Store className="size-4.5 text-amber-600" />
              <CardTitle className="text-base font-bold text-slate-900">
                Restaurant Information
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Basic identification, contact info, and registration timeline
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 divide-y divide-slate-100 text-sm">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-2">
                <Store className="size-4 text-slate-400" /> Name
              </span>
              <span className="font-semibold text-slate-900">{restaurant.restaurant_name}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-2">
                <Tag className="size-4 text-slate-400" /> Category
              </span>
              <span className="font-medium text-slate-800">
                {restaurant.category || "Standard Restaurant"}
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-2">
                <Mail className="size-4 text-slate-400" /> Official Email
              </span>
              <a
                href={`mailto:${restaurant.email}`}
                className="font-medium text-amber-600 hover:text-amber-700 hover:underline"
              >
                {restaurant.email}
              </a>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-2">
                <Phone className="size-4 text-slate-400" /> Primary Phone
              </span>
              <span className="font-mono font-medium text-slate-800">
                {restaurant.phone || "-"}
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-2">
                <Calendar className="size-4 text-slate-400" /> Registration Date
              </span>
              <span className="text-slate-700 font-medium">
                {formatDate(restaurant.created_at)}
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-2">
                <Clock className="size-4 text-slate-400" /> Last Updated
              </span>
              <span className="text-slate-700 font-medium">
                {formatDate(restaurant.updated_at)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* CARD 2: OWNER INFORMATION */}
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UserCheck className="size-4.5 text-amber-600" />
              <CardTitle className="text-base font-bold text-slate-900">
                Owner Information
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Primary account holder credentials and registration details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 divide-y divide-slate-100 text-sm">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500">Owner Full Name</span>
              <span className="font-semibold text-slate-900">{restaurant.owner_name}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500">Owner Email</span>
              <a
                href={`mailto:${restaurant.owner_email}`}
                className="font-medium text-amber-600 hover:text-amber-700 hover:underline"
              >
                {restaurant.owner_email}
              </a>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500">Contact Phone</span>
              <span className="font-mono font-medium text-slate-800">
                {restaurant.phone || "-"}
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500">Onboarding Status</span>
              <Badge
                variant="outline"
                className="gap-1 bg-slate-50 text-slate-700 border-slate-200 text-xs font-semibold"
              >
                <CheckCircle2 className="size-3 text-slate-600" />
                {restaurant.onboarding_status}
              </Badge>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500">Last Login Activity</span>
              <span className="text-slate-700 font-medium">
                {formatDate(restaurant.last_login_at)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* CARD 3: LOCATION & ADDRESS */}
        <RestaurantLocationCard address={address} />

        {/* CARD 4: SUBSCRIPTION & OPERATIONS */}
        <RestaurantSubscriptionCard restaurant={restaurant} formatDate={formatDate} />
      </div>
    </div>
  );
}
