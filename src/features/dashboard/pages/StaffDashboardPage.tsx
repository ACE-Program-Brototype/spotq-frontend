import {
  CheckCircle2,
  Clock,
  ShoppingBag,
  Ticket,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { Link } from "react-router-dom";
import { STAFF_ROUTES } from "@/app/router/routes.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { PROFILE_MESSAGES } from "@/features/profile/constants/profile.constants";
import { useStaffProfile } from "@/features/profile/hooks/useStaffProfile";
import { QUEUE_STATUS } from "@/features/queue/constants/queue.constants";
import { useStaffLiveQueue } from "@/features/queue/hooks/use-staff-live-queue";

const SHIFT_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

function getShiftGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function StaffDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";
  const { allEntries, statistics, isLoading } = useStaffLiveQueue({ restaurantId });
  const { profile } = useStaffProfile();

  const profileName =
    profile?.fullName && profile.fullName !== PROFILE_MESSAGES.DEFAULT_NAME
      ? profile.fullName
      : null;

  const displayName =
    profileName ||
    user?.fullName?.trim() ||
    user?.name?.trim() ||
    (user?.email ? user.email.split("@")[0] : "Staff Member");
  const firstName = displayName.split(" ")[0];

  const totalToday = allEntries.length;
  const waitingCount = statistics.waitingParties;
  const completedCount = allEntries.filter(
    (e) => e.status === QUEUE_STATUS.SEATED,
  ).length;

  const todayFormatted = SHIFT_DATE_FORMATTER.format(new Date());

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* 1. Shift Operational Header */}
      <div className="rounded-2xl border border-[#eadfd8] bg-white p-3.5 sm:p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-[#1c1714] tracking-tight">
              {getShiftGreeting()}, {firstName}
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-[#756c66]">
              Live shift overview • {todayFormatted}
            </p>
          </div>
        </div>

        {/* 2. Live Shift KPI Cards - strictly 1 line on mobile */}
        <div className="mt-3.5 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4">
          <div className="rounded-xl border border-[#eadfd8] bg-[#faf7f5]/60 p-2 sm:p-4 min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5 text-[#756c66] mb-1">
              <Ticket className="size-3 sm:size-3.5 text-[#e8631b] shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                Today&apos;s Queue
              </span>
            </div>
            <p className="text-base sm:text-2xl font-extrabold text-[#9a3412]">
              {isLoading ? "..." : totalToday}
            </p>
          </div>

          <div className="rounded-xl border border-[#eadfd8] bg-[#faf7f5]/60 p-2 sm:p-4 min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5 text-[#756c66] mb-1">
              <Clock className="size-3 sm:size-3.5 text-amber-700 shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                Waiting
              </span>
            </div>
            <p className="text-base sm:text-2xl font-extrabold text-[#9a3412]">
              {isLoading ? "..." : waitingCount}
            </p>
          </div>

          <div className="rounded-xl border border-[#eadfd8] bg-[#faf7f5]/60 p-2 sm:p-4 min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5 text-[#756c66] mb-1">
              <CheckCircle2 className="size-3 sm:size-3.5 text-emerald-700 shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                Completed
              </span>
            </div>
            <p className="text-base sm:text-2xl font-extrabold text-[#9a3412]">
              {isLoading ? "..." : completedCount}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Quick Navigation Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
        <Link
          to={STAFF_ROUTES.QUEUE}
          className="flex items-center gap-2.5 p-3 sm:p-4 rounded-xl border border-[#eadfd8] bg-white hover:border-[#eddcd4] hover:bg-[#faf7f5]/60 transition-all shadow-2xs"
        >
          <div className="flex size-8 sm:size-9 items-center justify-center rounded-lg bg-[#fef3ec] text-[#e8631b] shrink-0">
            <Users className="size-4 sm:size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
              Queue Management
            </p>
            <p className="text-[11px] text-neutral-500 truncate hidden sm:block">
              Manage live line &amp; call party
            </p>
          </div>
        </Link>

        <Link
          to={STAFF_ROUTES.ORDERS}
          className="flex items-center gap-2.5 p-3 sm:p-4 rounded-xl border border-[#eadfd8] bg-white hover:border-[#eddcd4] hover:bg-[#faf7f5]/60 transition-all shadow-2xs"
        >
          <div className="flex size-8 sm:size-9 items-center justify-center rounded-lg bg-[#fef3ec] text-[#e8631b] shrink-0">
            <ShoppingBag className="size-4 sm:size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
              Order Management
            </p>
            <p className="text-[11px] text-neutral-500 truncate hidden sm:block">
              Takeaway orders &amp; fulfillment
            </p>
          </div>
        </Link>

        <Link
          to={STAFF_ROUTES.MENU.ROOT}
          className="flex items-center gap-2.5 p-3 sm:p-4 rounded-xl border border-[#eadfd8] bg-white hover:border-[#eddcd4] hover:bg-[#faf7f5]/60 transition-all shadow-2xs"
        >
          <div className="flex size-8 sm:size-9 items-center justify-center rounded-lg bg-[#fef3ec] text-[#e8631b] shrink-0">
            <UtensilsCrossed className="size-4 sm:size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
              Menu Items
            </p>
            <p className="text-[11px] text-neutral-500 truncate hidden sm:block">
              Availability &amp; item catalog
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
