export interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
}

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  pricePaise: number;
  priceInRupees: number;
  currency: string;
  billingCycle: "MONTHLY" | "YEARLY";
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

export interface RestaurantStatusData {
  restaurantId: string;
  restaurantName: string;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "INACTIVE";
  isSubscriptionActive: boolean;
  subscriptionPlanCode: string | null;
  subscriptionEndsAt: string | null;
  navigationTarget: string;
}

export interface PlanCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
  isLoading?: boolean;
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

export interface RazorpayInstance {
  open: () => void;
  close?: () => void;
}

export interface UseRazorpayCheckoutOptions {
  onSuccess?: (result: VerifyPaymentResponse) => void;
  onError?: (error: Error) => void;
}
