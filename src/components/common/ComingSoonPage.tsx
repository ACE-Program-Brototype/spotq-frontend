/**
 * ComingSoonPage Component
 * Clean, lightweight placeholder view for upcoming features.
 */

import { ArrowLeft, Clock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/router/routes.constants";

export interface ComingSoonPageProps {
  title?: string;
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  const location = useLocation();

  const pageTitle =
    title ??
    (location.pathname.includes("campaign")
      ? "Campaigns"
      : location.pathname.includes("coupon")
        ? "Coupons"
        : "Coming Soon");

  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-[#e8631b] border border-orange-100 shadow-2xs">
        <Clock className="size-7" aria-hidden="true" />
      </div>

      <span className="mt-4 inline-flex items-center rounded-full bg-orange-100/70 px-3 py-1 text-xs font-semibold text-[#9a3412]">
        Coming Soon
      </span>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {pageTitle}
      </h1>

      <p className="mt-2 max-w-sm text-sm text-slate-500">
        This feature is under development and will be available soon.
      </p>

      <Link
        to={ADMIN_ROUTES.DASHBOARD}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#e8631b] hover:bg-[#9a3412] active:bg-[#7c2d12] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors whitespace-nowrap min-h-[44px] cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#e8631b] focus-visible:ring-offset-2"
      >
        <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
        <span>Back to Dashboard</span>
      </Link>
    </div>
  );
}

export default ComingSoonPage;
