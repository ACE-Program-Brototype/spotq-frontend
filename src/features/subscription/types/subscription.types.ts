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
