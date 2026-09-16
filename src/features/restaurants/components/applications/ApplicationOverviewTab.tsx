import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Store,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import env from "@/config/env";
import { formatDate } from "@/lib/utils/date";
import type { RestaurantApplicationItem } from "../../types/restaurant-application.types";

export interface ApplicationOverviewTabProps {
  application: RestaurantApplicationItem;
}

export function ApplicationOverviewTab({ application }: ApplicationOverviewTabProps) {
  const address = application.address;

  return (
    <div className="space-y-6" data-testid="application-overview-tab">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: RESTAURANT IDENTIFICATION & CONTACT */}
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Store className="size-4.5 text-amber-600" />
              <CardTitle className="text-base font-bold text-slate-900">
                Restaurant Information
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Entity registration, contact details, and submission timeline
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 divide-y divide-slate-100 text-sm">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-2">
                <Store className="size-4 text-slate-400" /> Name
              </span>
              <span className="font-semibold text-slate-900">{application.restaurant_name}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-2">
                <Mail className="size-4 text-slate-400" /> Official Email
              </span>
              <a
                href={`mailto:${application.email}`}
                className="font-medium text-amber-600 hover:text-amber-700 hover:underline"
              >
                {application.email}
              </a>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-2">
                <Phone className="size-4 text-slate-400" /> Primary Phone
              </span>
              <span className="font-mono font-medium text-slate-800">
                {application.phone || "—"}
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-2">
                <Calendar className="size-4 text-slate-400" /> Submitted Date
              </span>
              <span className="text-slate-700 font-medium">
                {formatDate(application.created_at)}
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-2">
                <Clock className="size-4 text-slate-400" /> Last Updated
              </span>
              <span className="text-slate-700 font-medium">
                {formatDate(application.updated_at)}
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
              Primary applicant credentials and verification state
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 divide-y divide-slate-100 text-sm">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500">Owner Full Name</span>
              <span className="font-semibold text-slate-900">{application.owner_name}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500">Owner Email</span>
              <a
                href={`mailto:${application.owner_email}`}
                className="font-medium text-amber-600 hover:text-amber-700 hover:underline"
              >
                {application.owner_email}
              </a>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500">Email Verification</span>
              {application.email_verified_at || application.emailVerifiedAt ? (
                <Badge
                  variant="outline"
                  className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold"
                >
                  <CheckCircle2 className="size-3 text-emerald-600" />
                  Verified (
                  {formatDate(application.email_verified_at || application.emailVerifiedAt)})
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="gap-1 bg-amber-50 text-amber-700 border-amber-200 text-xs font-semibold"
                >
                  <Clock className="size-3 text-amber-600" />
                  Unverified
                </Badge>
              )}
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500">Contact Phone</span>
              <span className="font-mono font-medium text-slate-800">
                {application.phone || "—"}
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500">Onboarding Status</span>
              <Badge
                variant="outline"
                className="gap-1 bg-slate-50 text-slate-700 border-slate-200 text-xs font-semibold"
              >
                <CheckCircle2 className="size-3 text-slate-600" />
                {application.onboarding_status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* CARD 3: LOCATION & ADDRESS */}
        <Card className="border-slate-200/80 shadow-xs bg-white lg:col-span-2">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="size-4.5 text-amber-600" />
              <CardTitle className="text-base font-bold text-slate-900">
                Location & Address
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Physical branch address and GPS coordinate navigation
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 divide-y divide-slate-100 text-sm">
            {address ? (
              <>
                <div className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-slate-500">Street Address</span>
                  <span className="font-semibold text-slate-900">
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
                      <span>
                        Open in Maps ({address.latitude}, {address.longitude})
                      </span>
                      <ExternalLink className="size-3 text-amber-500" />
                    </a>
                  ) : (
                    <span className="text-slate-400 text-xs italic">Coordinates not provided</span>
                  )}
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs">
                No physical location details recorded for this application.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
