export const ONBOARDING_VERIFICATION_STATUS = {
  PENDING: "PENDING",
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
} as const;

export type OnboardingVerificationStatus =
  (typeof ONBOARDING_VERIFICATION_STATUS)[keyof typeof ONBOARDING_VERIFICATION_STATUS];

export const ONBOARDING_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const;

export const ONBOARDING_TIMINGS = {
  REDIRECT_DELAY_MS: 1200,
} as const;

export const ONBOARDING_MESSAGES = {
  DEFAULT_EMAIL_PLACEHOLDER: "your email",
  APPROVED_REDIRECTING: "Application approved! Redirecting to subscription...",
  STATUS_REFRESHED: (status: string) =>
    `Status refreshed: Application is ${status.replace("_", " ").toLowerCase()}.`,
  FETCH_STATUS_FAILED: "Failed to fetch verification status.",
} as const;
