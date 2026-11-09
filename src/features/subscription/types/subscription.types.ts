export interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
}

export type BillingCycle = "MONTHLY" | "YEARLY";

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  pricePaise: number;
  priceInRupees: number;
  currency: string;
  billingCycle: BillingCycle;
  features: string[];
  isPopular?: boolean;
}

export interface CreateSubscriptionOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  plan: {
    id: string;
    name: string;
    code: string;
  };
  restaurant: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface RenewSubscriptionRequest {
  planId?: string;
}

export interface RenewSubscriptionOrderDetails {
  id: string;
  currentStatus: string;
  currentPeriodEnd: string;
  renewalWindowDays: number;
  isRenewal: boolean;
}

export interface RenewSubscriptionOrderResponse extends CreateSubscriptionOrderResponse {
  subscription: RenewSubscriptionOrderDetails;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  restaurantId?: string;
}

export interface VerifyPaymentResponse {
  subscriptionId: string;
  restaurantId: string;
  planCode: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export interface ActiveSubscriptionSummary {
  id: string;
  status: string;
  planCode: string | null;
  planName: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  renewalWindowDays?: number;
  isEligibleForRenewal?: boolean;
}

export interface RestaurantStatusData {
  restaurantId: string;
  restaurantName: string;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "INACTIVE";
  isSubscriptionActive: boolean;
  subscriptionPlanCode: string | null;
  subscriptionEndsAt: string | null;
  navigationTarget: string;
  subscription?: ActiveSubscriptionSummary | null;
}

export interface RenewalEligibilityResult {
  isEligible: boolean;
  isOutsideWindow: boolean;
  showExpiryBanner: boolean;
  daysRemaining: number | null;
  tooltipMessage: string | null;
}

export interface RenewalPlansByCycle {
  MONTHLY?: SubscriptionPlan;
  YEARLY?: SubscriptionPlan;
  initialCycle: BillingCycle;
}

export interface RenewalTermPreview {
  termStartIso: string;
  proposedEndIso: string;
  formattedCurrentExpiry: string;
  formattedTermStart: string;
  formattedProposedExpiry: string;
  previewText: string;
  isExpired: boolean;
}

export interface SubscriptionExpiryBannerProps {
  statusData?: RestaurantStatusData | null;
  isLoading?: boolean;
  isError?: boolean;
  onRenewClick: () => void;
  now?: Date;
}

export interface SubscriptionOverviewCardProps {
  statusData?: RestaurantStatusData | null;
  plans?: SubscriptionPlan[];
  isLoading?: boolean;
  isError?: boolean;
  onRenewClick: () => void;
  onSubscribeClick: () => void;
  now?: Date;
}

export interface RenewalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statusData?: RestaurantStatusData | null;
  plans?: SubscriptionPlan[];
  isLoadingPlans?: boolean;
  isPlansError?: boolean;
  onRetryPlans?: () => void;
  now?: Date;
}

export interface PlanCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onSelect: (planId: string) => void;
}

export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayPaymentSuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayPaymentFailedResponse {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  };
}

export interface RazorpayInstance {
  open: () => void;
  close?: () => void;
  on?: (event: string, callback: (response: RazorpayPaymentFailedResponse) => void) => void;
}

export interface UseRazorpayCheckoutOptions {
  onSuccess?: (result: VerifyPaymentResponse) => void;
  onError?: (error: Error) => void;
  onAlreadyActive?: () => void;
}

export interface UseSubscriptionRenewalOptions {
  onSuccess?: (result: VerifyPaymentResponse) => void;
  onError?: (error: Error) => void;
}
