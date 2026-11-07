import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import env from "@/config/env";
import type { RestaurantDetails } from "../../types/restaurant.types";

export function RestaurantLocationCard({ address }: { address?: RestaurantDetails["address"] }) {
  return (
    <Card className="border-slate-200/80 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <MapPin className="size-4.5 text-amber-600" />
          <CardTitle className="text-base font-bold text-slate-900">Location & Address</CardTitle>
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
                {address.country} - <span className="font-mono font-bold">{address.pincode}</span>
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
  );
}
