/**
 * Transaction Response Data Mappers
 * Maps raw backend API models to frontend domain models.
 */

import { formatCurrency } from "@/lib/utils/currency";
import type {
  PaymentMethod,
  SettlementStatus,
  TransactionDetail,
  TransactionRefundDetails,
  TransactionStatus,
} from "../types/transaction.types";

export interface ApiCustomerDetail {
  name?: string | null;
  phoneMasked?: string | null;
  tableNumber?: string | null;
  tokenNumber?: string | null;
}

export interface ApiBillingBreakdown {
  subtotalPaise?: number;
  gstPaise?: number;
  discountPaise?: number;
  grandTotalPaise?: number;
}

export interface ApiSettlementInfo {
  status?: string;
  settlementId?: string | null;
  scheduledPayout?: string | null;
}

export interface ApiRefundInfo {
  id: string;
  razorpayRefundId?: string;
  amountPaise: number;
  amountFormatted?: string;
  currency?: string;
  status: string;
  reason?: string | null;
  processedAt?: string | null;
  createdAt: string;
}

export interface ApiCardMetadata {
  network?: string;
  last4?: string;
  issuer?: string;
  type?: string;
}

export interface ApiTransactionDetailItem {
  id: string;
  restaurantId?: string;
  orderId?: string | null;
  orderNumber?: string | null;
  customer?: ApiCustomerDetail | null;
  amountPaise: number;
  amountFormatted?: string;
  currency?: string;
  status: string;
  paymentMethod?: string;
  upiVpa?: string | null;
  card?: ApiCardMetadata | null;
  razorpayPaymentId?: string | null;
  razorpayOrderId?: string;
  bankReference?: string | null;
  billingBreakdown?: ApiBillingBreakdown | null;
  settlement?: ApiSettlementInfo | null;
  refund?: ApiRefundInfo | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiTransactionDetailResponse {
  transaction?: ApiTransactionDetailItem;
}

export function formatPaiseToRupees(paise: number): string {
  const safePaise = typeof paise === "number" && !Number.isNaN(paise) ? paise : 0;
  return formatCurrency(safePaise / 100);
}

export function mapApiTransactionDetailToDetail(
  raw: ApiTransactionDetailItem | ApiTransactionDetailResponse,
): TransactionDetail {
  const tx: ApiTransactionDetailItem =
    raw && "transaction" in raw && raw.transaction
      ? raw.transaction
      : (raw as ApiTransactionDetailItem);

  const subtotalPaise = tx.billingBreakdown?.subtotalPaise ?? 0;
  const gstPaise = tx.billingBreakdown?.gstPaise ?? 0;
  const discountPaise = tx.billingBreakdown?.discountPaise ?? 0;
  const totalPaise = tx.billingBreakdown?.grandTotalPaise ?? tx.amountPaise ?? 0;

  let vpaOrCard = "N/A";
  if (tx.upiVpa) {
    vpaOrCard = tx.upiVpa;
  } else if (tx.card) {
    const network = tx.card.network || "Card";
    const last4 = tx.card.last4 ? `•••• ${tx.card.last4}` : "";
    vpaOrCard = `${network} ${last4}`.trim();
  }

  let mappedRefund: TransactionRefundDetails | null = null;
  if (tx.refund) {
    mappedRefund = {
      id: tx.refund.id,
      amountPaise: tx.refund.amountPaise,
      amountFormatted: tx.refund.amountFormatted || formatPaiseToRupees(tx.refund.amountPaise),
      status: tx.refund.status,
      reason: tx.refund.reason || "Processed Refund",
      createdAt: tx.refund.createdAt,
    };
  }

  return {
    id: tx.id,
    status: (tx.status || "UNKNOWN") as TransactionStatus,
    createdAt: tx.createdAt,
    customer: {
      id: tx.id,
      name: tx.customer?.name || "Guest Customer",
      contact: tx.customer?.phoneMasked || "N/A",
      tableNumber: tx.customer?.tableNumber || "N/A",
      tokenNumber: tx.customer?.tokenNumber || "N/A",
    },
    order: {
      id: tx.orderId || tx.id,
      orderNumber: tx.orderNumber || "N/A",
      status: tx.status,
    },
    financialBreakdown: {
      subtotalPaise,
      subtotalFormatted: formatPaiseToRupees(subtotalPaise),
      gstPaise,
      gstPercentage: subtotalPaise > 0 ? Math.round((gstPaise / subtotalPaise) * 100) : 5,
      gstFormatted: formatPaiseToRupees(gstPaise),
      discountPaise,
      discountFormatted: formatPaiseToRupees(discountPaise),
      totalPaise,
      totalFormatted: tx.amountFormatted || formatPaiseToRupees(totalPaise),
    },
    gateway: {
      name: "Razorpay",
      paymentId: tx.razorpayPaymentId || "N/A",
      orderId: tx.razorpayOrderId || "N/A",
      method: (tx.paymentMethod || "UPI") as PaymentMethod,
      vpaOrCard,
      bankRrn: tx.bankReference || "N/A",
      settlementStatus: (tx.settlement?.status || "PENDING_EOD") as SettlementStatus,
      expectedSettlementDate: tx.settlement?.scheduledPayout || "Next Business Day",
    },
    refund: mappedRefund,
  };
}
