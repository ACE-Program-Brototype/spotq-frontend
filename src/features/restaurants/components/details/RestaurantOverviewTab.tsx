import {
  Armchair,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  Gift,
  Mail,
  MapPin,
  Navigation,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Store,
  Tag,
  UserCheck,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import env from "@/config/env";
import type { RestaurantDetails } from "../../types/restaurant.types";

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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Seating Capacity */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="size-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
              <Armchair className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Capacity
              </p>
              <p className="text-lg font-bold text-slate-900">
                {settings?.seating_capacity
                  ? `${settings.seating_capacity} Seats`
                  : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Store Open/Close */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div
              className={`size-10 flex items-center justify-center rounded-xl border ${
                settings?.is_opened
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                  : "bg-slate-100 text-slate-600 border-slate-200/60"
              }`}
            >
              <Store className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Store Status
              </p>
              <p className="text-lg font-bold text-slate-900">
                {settings?.is_opened ? "Open Now" : "Closed"}
              </p>
            </div>
          </div>
        </div>

        {/* Pre-Order Support */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div
              className={`size-10 flex items-center justify-center rounded-xl border ${
                settings?.is_preorder
                  ? "bg-blue-50 text-blue-600 border-blue-200/60"
                  : "bg-slate-100 text-slate-500 border-slate-200/60"
              }`}
            >
              <UtensilsCrossed className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Pre-Orders
              </p>
              <p className="text-lg font-bold text-slate-900">
                {settings?.is_preorder ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
        </div>

        {/* Loyalty Program */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div
              className={`size-10 flex items-center justify-center rounded-xl border ${
                settings?.is_loyalty
                  ? "bg-purple-50 text-purple-600 border-purple-200/60"
                  : "bg-slate-100 text-slate-500 border-slate-200/60"
              }`}
            >
              <Gift className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Loyalty Rewards
              </p>
              <p className="text-lg font-bold text-slate-900">
                {settings?.is_loyalty ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
      </div>

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
                {restaurant.phone || "—"}
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
                {restaurant.phone || "—"}
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
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="size-4.5 text-amber-600" />
              <CardTitle className="text-base font-bold text-slate-900">
                Location & Address
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Physical branch location and postal address
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 divide-y divide-slate-100 text-sm">
            {address ? (
              <>
                <div className="py-2.5 flex justify-between items-start">
                  <span className="text-slate-500">Street Address</span>
                  <span className="font-medium text-slate-900 text-right max-w-xs">
                    {address.address_line1}
                    {address.address_line2 ? `, ${address.address_line2}` : ""}
                  </span>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-500">City & State</span>
                  <span className="font-medium text-slate-800">
                    {address.city}, {address.state}
                  </span>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-500">Country & Pincode</span>
                  <span className="font-medium text-slate-800">
                    {address.country} —{" "}
                    <span className="font-mono font-bold">{address.pincode}</span>
                  </span>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Navigation className="size-4 text-slate-400" /> Map Navigation
                  </span>
                  {address.latitude != null && address.longitude != null ? (
                    <a
                      href={`${env.googleMapsBaseUrl}?q=${address.latitude},${address.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 transition-colors border border-amber-200/80 shadow-2xs group"
                    >
                      <Navigation className="size-3.5 fill-amber-600/20 text-amber-600 transition-transform group-hover:scale-110" />
                      <span>Open in Maps</span>
                      <ExternalLink className="size-3 text-amber-500" />
                    </a>
                  ) : (
                    <span className="text-slate-400 text-xs italic">Coordinates not available</span>
                  )}
                </div>
              </>
            ) : (
              <div className="py-6 text-center text-slate-500 text-xs">
                No physical address information recorded for this restaurant.
              </div>
            )}
          </CardContent>
        </Card>

        {/* CARD 4: SUBSCRIPTION & OPERATIONS */}
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
                <span className="text-slate-500 text-xs font-semibold flex items-center gap-1 text-rose-700">
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
      </div>
    </div>
  );
}
