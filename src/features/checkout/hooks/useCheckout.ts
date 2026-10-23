import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CHECKOUT_DEFAULTS, CHECKOUT_PRICING } from "../constants/checkout.constants";
import { checkoutService } from "../services/checkout.service";
import type {
  CartData,
  DiningContext,
  OrderFlowType,
  OrderPlacementResponse,
  PaymentModeType,
  PlaceOrderPayload,
  PriceBreakdown,
} from "../types/checkout.types";

export type CheckoutViewStatus = "CHECKOUT" | "SUCCESS" | "FAILURE";

export function useCheckout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const authUser = useAuthStore((state) => state.user);

  // 1. Ensure cartId exists in query params; if missing, initialize it
  const cartId = searchParams.get("cartId");
  useEffect(() => {
    if (!cartId) {
      const targetCartId = localStorage.getItem("spotq_cart_id") || CHECKOUT_DEFAULTS.CART_ID;
      const next = new URLSearchParams(searchParams);
      next.set("cartId", targetCartId);
      setSearchParams(next, { replace: true });
    }
  }, [cartId, searchParams, setSearchParams]);

  // 2. Context parameters from query (without dummy fallbacks)
  const rawFlow = searchParams.get("flow") || searchParams.get("orderType");
  const flow: OrderFlowType | undefined = useMemo(() => {
    if (rawFlow === "QUEUE_PRE_ORDER" || rawFlow === "queue") return "QUEUE_PRE_ORDER";
    if (rawFlow === "RUNNING_ADDON" || rawFlow === "addon") return "RUNNING_ADDON";
    if (rawFlow === "SELF_SERVICE_TABLE" || rawFlow === "table") return "SELF_SERVICE_TABLE";
    return undefined;
  }, [rawFlow]);

  const tableParam = searchParams.get("table");
  const tableNumber = tableParam ? Number(tableParam) || null : null;
  const queueToken = searchParams.get("queueToken") || null;
  const estimatedWaitMinutes = Number(searchParams.get("eta")) || undefined;

  const setFlow = useCallback(
    (newFlow: OrderFlowType) => {
      const next = new URLSearchParams(searchParams);
      next.set("flow", newFlow);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // 3. Cart data state loaded from API
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoadingCart, setIsLoadingCart] = useState<boolean>(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const fetchCart = useCallback(async (id: string) => {
    setIsLoadingCart(true);
    setCartError(null);
    try {
      const data = await checkoutService.getCart(id);
      setCart(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load cart";
      setCartError(msg);
      setCart(null);
    } finally {
      setIsLoadingCart(false);
    }
  }, []);

  useEffect(() => {
    if (cartId) {
      fetchCart(cartId);
    }
  }, [cartId, fetchCart]);

  // 4. Customer fields & Payment mode
  const [userName, setUserName] = useState<string>(
    authUser?.fullName || authUser?.name || "Alex Morgan",
  );
  const [userPhone, setUserPhone] = useState<string>(authUser?.phone || "9876543210");
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<PaymentModeType>("ONLINE");

  // 5. In-memory lifecycle status (no route paths needed)
  const [viewStatus, setViewStatus] = useState<CheckoutViewStatus>("CHECKOUT");
  const [placedOrder, setPlacedOrder] = useState<OrderPlacementResponse["data"] | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 6. Price breakdown calculation
  const priceBreakdown: PriceBreakdown = useMemo(() => {
    const itemsSubtotal = cart?.subtotal || 0;
    const gstAmount = Math.round(itemsSubtotal * CHECKOUT_PRICING.GST_RATE * 100) / 100;
    const platformFee = itemsSubtotal > 0 ? CHECKOUT_PRICING.PLATFORM_FEE : 0;
    const grandTotal = itemsSubtotal + gstAmount + platformFee;

    return {
      itemsSubtotal,
      gstAmount,
      gstRate: CHECKOUT_PRICING.GST_RATE,
      platformFee,
      grandTotal,
    };
  }, [cart?.subtotal]);

  // 7. Order placement with proper payload & in-memory view transitions
  const handleCheckout = useCallback(async () => {
    if (isSubmitting || !cart) return;

    const newErrors: Record<string, string> = {};
    if (!userName.trim()) newErrors.userName = "Customer name is required";
    if (!userPhone.trim()) newErrors.userPhone = "Mobile number is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const payload: PlaceOrderPayload = {
      restaurantId: cart.restaurantId,
      cartId: cart.cartId,
      paymentMode,
      userName: userName.trim(),
      userPhone: userPhone.trim(),
      specialInstructions: specialInstructions.trim() || null,
      order_type: flow,
      orderType: flow,
      tableNumber,
      queueToken,
    };

    try {
      const res = await checkoutService.placeOrder(payload);
      setPlacedOrder(res.data);
      setViewStatus("SUCCESS");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Unable to place order. Please try again.";
      setOrderError(errorMsg);
      setViewStatus("FAILURE");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    cart,
    userName,
    userPhone,
    specialInstructions,
    flow,
    tableNumber,
    queueToken,
    paymentMode,
  ]);

  const resetToCheckout = useCallback(() => {
    setViewStatus("CHECKOUT");
    setOrderError(null);
  }, []);

  const diningContext: DiningContext = useMemo(
    () => ({
      flow: flow || "SELF_SERVICE_TABLE",
      tableNumber: tableNumber ? String(tableNumber) : "",
      restaurantName: cart?.restaurantName || "",
      restaurantId: cart?.restaurantId || "",
      queueToken: queueToken || undefined,
      estimatedWaitMinutes,
    }),
    [flow, tableNumber, cart?.restaurantName, cart?.restaurantId, queueToken, estimatedWaitMinutes],
  );

  return {
    cartId,
    flow,
    setFlow,
    tableNumber,
    queueToken,
    estimatedWaitMinutes,
    diningContext,
    cart,
    isLoadingCart,
    cartError,
    refetchCart: () => (cartId ? fetchCart(cartId) : undefined),
    priceBreakdown,
    userName,
    setUserName,
    userPhone,
    setUserPhone,
    specialInstructions,
    setSpecialInstructions,
    paymentMode,
    setPaymentMode,
    isSubmitting,
    handleCheckout,
    errors,
    viewStatus,
    placedOrder,
    orderError,
    resetToCheckout,
  };
}
