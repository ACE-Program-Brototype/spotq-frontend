import { isHTTPError } from "ky";
import {
  SUBSCRIPTION_BILLING_CYCLES,
  SUBSCRIPTION_RENEWAL_TEXTS,
  SUBSCRIPTION_STATUSES,
  SUBSCRIPTION_THRESHOLDS,
} from "@/features/subscription/constants/subscription.constants";
import type {
  BillingCycle,
  RenewalEligibilityResult,
  RenewalPlansByCycle,
  RenewalTermPreview,
  RestaurantStatusData,
  SubscriptionPlan,
} from "@/features/subscription/types/subscription.types";
import type { NormalizedApiErrorData } from "@/lib/api/hooks/beforeError";

export function generateIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `renew-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function resolveErrorMessage(err: unknown, fallback: string): Promise<string> {
  if (isHTTPError<NormalizedApiErrorData>(err)) {
    if (err.data && typeof err.data === "object") {
      if (err.data.message) {
        return err.data.message;
      }
      if (typeof err.data.error === "string") {
        return err.data.error;
      }
      if (typeof err.data.error === "object" && err.data.error?.message) {
        return err.data.error.message;
      }
    }
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
}

const CYCLE_SUFFIX_PATTERN = /(?:[_-\s]+)(?:monthly|yearly|annual)$/i;

export function parseValidDate(isoString?: string | null): Date | null {
  if (!isoString) {
    return null;
  }

  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

export function formatSubscriptionCalendarDate(isoString?: string | null): string {
  const parsed = parseValidDate(isoString);
  if (!parsed) {
    return SUBSCRIPTION_RENEWAL_TEXTS.NOT_AVAILABLE_FALLBACK;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export function formatPlanDisplayName(planName?: string | null, planCode?: string | null): string {
  if (planName?.trim()) {
    return planName.trim();
  }

  if (planCode?.trim()) {
    return planCode.trim().replace(/_/g, " ");
  }

  return SUBSCRIPTION_RENEWAL_TEXTS.DEFAULT_CURRENT_PLAN_NAME;
}

export function calculateRemainingDays(
  endsAtIso?: string | null,
  now: Date = new Date(),
): number | null {
  const endDate = parseValidDate(endsAtIso);
  if (!endDate) {
    return null;
  }

  const diffMs = endDate.getTime() - now.getTime();
  if (diffMs === 0) {
    return 0;
  }

  if (diffMs < 0) {
    return Math.floor(diffMs / SUBSCRIPTION_THRESHOLDS.MILLISECONDS_PER_DAY);
  }

  const days = Math.ceil(diffMs / SUBSCRIPTION_THRESHOLDS.MILLISECONDS_PER_DAY);
  return days === 0 ? 0 : days;
}

export function formatExpiryBannerMessage(planDisplayName: string, daysRemaining: number): string {
  if (daysRemaining < 0) {
    return SUBSCRIPTION_RENEWAL_TEXTS.BANNER_EXPIRED(planDisplayName);
  }

  if (daysRemaining === 0) {
    return SUBSCRIPTION_RENEWAL_TEXTS.BANNER_EXPIRES_TODAY(planDisplayName);
  }

  if (daysRemaining === 1) {
    return SUBSCRIPTION_RENEWAL_TEXTS.BANNER_EXPIRES_IN_ONE_DAY(planDisplayName);
  }

  return SUBSCRIPTION_RENEWAL_TEXTS.BANNER_EXPIRES_IN_DAYS(planDisplayName, daysRemaining);
}

export function formatRemainingDaysBadge(daysRemaining: number): string {
  if (daysRemaining < 0) {
    return SUBSCRIPTION_RENEWAL_TEXTS.REMAINING_DAYS_BADGE_EXPIRED;
  }

  if (daysRemaining === 0) {
    return SUBSCRIPTION_RENEWAL_TEXTS.REMAINING_DAYS_BADGE_TODAY;
  }

  if (daysRemaining === 1) {
    return SUBSCRIPTION_RENEWAL_TEXTS.REMAINING_DAYS_BADGE_ONE;
  }

  return SUBSCRIPTION_RENEWAL_TEXTS.REMAINING_DAYS_BADGE_MANY(daysRemaining);
}

export function evaluateRenewalEligibility(
  statusData?: RestaurantStatusData | null,
  now: Date = new Date(),
): RenewalEligibilityResult {
  if (!statusData) {
    return {
      isEligible: false,
      isOutsideWindow: false,
      showExpiryBanner: false,
      daysRemaining: null,
      tooltipMessage: null,
    };
  }

  const endsAtIso =
    statusData.subscription?.currentPeriodEnd ?? statusData.subscriptionEndsAt ?? null;
  const endDate = parseValidDate(endsAtIso);

  if (!endDate) {
    return {
      isEligible: false,
      isOutsideWindow: false,
      showExpiryBanner: false,
      daysRemaining: null,
      tooltipMessage: null,
    };
  }

  const normalizedStatus = (
    statusData.subscription?.status ??
    (statusData.isSubscriptionActive ? SUBSCRIPTION_STATUSES.ACTIVE : "")
  )
    .toUpperCase()
    .trim();

  if (
    normalizedStatus === SUBSCRIPTION_STATUSES.CANCELLED ||
    normalizedStatus === SUBSCRIPTION_STATUSES.PENDING
  ) {
    return {
      isEligible: false,
      isOutsideWindow: false,
      showExpiryBanner: false,
      daysRemaining: calculateRemainingDays(endsAtIso, now),
      tooltipMessage: null,
    };
  }

  const windowDays =
    statusData.subscription?.renewalWindowDays ??
    SUBSCRIPTION_THRESHOLDS.RENEWAL_ELIGIBILITY_WINDOW_DAYS;
  const windowMs = windowDays * SUBSCRIPTION_THRESHOLDS.MILLISECONDS_PER_DAY;
  const timeRemainingMs = endDate.getTime() - now.getTime();
  const daysRemaining = calculateRemainingDays(endsAtIso, now);

  if (
    statusData.subscription?.isEligibleForRenewal === false ||
    (normalizedStatus === SUBSCRIPTION_STATUSES.ACTIVE && timeRemainingMs > windowMs)
  ) {
    return {
      isEligible: false,
      isOutsideWindow: timeRemainingMs > windowMs,
      showExpiryBanner: false,
      daysRemaining,
      tooltipMessage:
        timeRemainingMs > windowMs ? SUBSCRIPTION_RENEWAL_TEXTS.ELIGIBILITY_TOOLTIP : null,
    };
  }

  const isExpiredStatus =
    normalizedStatus === SUBSCRIPTION_STATUSES.EXPIRED ||
    normalizedStatus === SUBSCRIPTION_STATUSES.PAST_DUE ||
    timeRemainingMs < 0;

  const isEligible = Boolean(statusData.isSubscriptionActive || isExpiredStatus);
  const showExpiryBanner =
    isEligible &&
    (isExpiredStatus ||
      (Boolean(statusData.isSubscriptionActive) &&
        daysRemaining !== null &&
        daysRemaining >= 0 &&
        daysRemaining <= SUBSCRIPTION_THRESHOLDS.EXPIRY_BANNER_WARNING_DAYS));

  return {
    isEligible,
    isOutsideWindow: false,
    showExpiryBanner,
    daysRemaining,
    tooltipMessage: null,
  };
}

function normalizePlanTierKey(value?: string | null): string {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .replace(CYCLE_SUFFIX_PATTERN, "")
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

export function resolveRenewalPlansByCycle(
  plans: SubscriptionPlan[],
  currentPlanCode?: string | null,
  _currentPlanName?: string | null,
): RenewalPlansByCycle {
  if (!plans.length) {
    return {
      initialCycle: SUBSCRIPTION_BILLING_CYCLES.MONTHLY,
    };
  }

  const normalizedCurrentCode = currentPlanCode?.trim().toUpperCase() ?? "";

  const exactPlan = normalizedCurrentCode
    ? plans.find((plan) => plan.code.trim().toUpperCase() === normalizedCurrentCode)
    : undefined;

  const targetCodeFamily = normalizePlanTierKey(exactPlan?.code ?? currentPlanCode);

  const familyPlans = targetCodeFamily
    ? plans.filter((plan) => normalizePlanTierKey(plan.code) === targetCodeFamily)
    : [];

  const candidatePlans = familyPlans.length > 0 ? familyPlans : exactPlan ? [exactPlan] : [];

  const monthlyPlan = candidatePlans.find(
    (plan) => plan.billingCycle === SUBSCRIPTION_BILLING_CYCLES.MONTHLY,
  );
  const yearlyPlan = candidatePlans.find(
    (plan) => plan.billingCycle === SUBSCRIPTION_BILLING_CYCLES.YEARLY,
  );

  const initialCycle: BillingCycle =
    exactPlan?.billingCycle ??
    (monthlyPlan
      ? SUBSCRIPTION_BILLING_CYCLES.MONTHLY
      : yearlyPlan
        ? SUBSCRIPTION_BILLING_CYCLES.YEARLY
        : SUBSCRIPTION_BILLING_CYCLES.MONTHLY);

  return {
    MONTHLY: monthlyPlan,
    YEARLY: yearlyPlan,
    initialCycle,
  };
}

export function calculateProposedRenewalTerm(
  currentPeriodEndIso: string | null | undefined,
  billingCycle: BillingCycle,
  now: Date = new Date(),
): RenewalTermPreview | null {
  const currentEndDate = parseValidDate(currentPeriodEndIso);
  if (!currentEndDate) {
    return null;
  }

  const isExpired = now.getTime() > currentEndDate.getTime();
  const termStart = isExpired ? new Date(now.getTime()) : new Date(currentEndDate.getTime());
  const proposedEnd = new Date(termStart.getTime());

  if (billingCycle === SUBSCRIPTION_BILLING_CYCLES.YEARLY) {
    const targetYear = termStart.getFullYear() + 1;
    const targetMonth = termStart.getMonth();
    const targetDay = termStart.getDate();
    proposedEnd.setFullYear(targetYear, targetMonth, targetDay);
    if (proposedEnd.getMonth() !== targetMonth) {
      proposedEnd.setDate(0);
    }
  } else {
    const originalDay = termStart.getDate();
    const targetYear =
      termStart.getMonth() === 11 ? termStart.getFullYear() + 1 : termStart.getFullYear();
    const targetMonth = (termStart.getMonth() + 1) % 12;
    const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const clampedDay = Math.min(originalDay, daysInTargetMonth);
    proposedEnd.setFullYear(targetYear, targetMonth, clampedDay);
  }

  const termStartIso = termStart.toISOString();
  const proposedEndIso = proposedEnd.toISOString();
  const formattedCurrentExpiry = formatSubscriptionCalendarDate(currentEndDate.toISOString());
  const formattedTermStart = formatSubscriptionCalendarDate(termStartIso);
  const formattedProposedExpiry = formatSubscriptionCalendarDate(proposedEndIso);

  return {
    termStartIso,
    proposedEndIso,
    formattedCurrentExpiry,
    formattedTermStart,
    formattedProposedExpiry,
    previewText: SUBSCRIPTION_RENEWAL_TEXTS.TERM_PREVIEW_TEXT(
      formattedTermStart,
      formattedProposedExpiry,
    ),
    isExpired,
  };
}
