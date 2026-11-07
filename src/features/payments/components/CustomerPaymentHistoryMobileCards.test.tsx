import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { CustomerPaymentTransaction } from "../types/customer-payment.types";
import { CustomerPaymentHistoryMobileCards } from "./CustomerPaymentHistoryMobileCards";

const mockTransactions: CustomerPaymentTransaction[] = [
  {
    transactionId: "tx-m-1",
    orderId: "ord-m-1",
    orderNumber: "SQ-98214",
    amountPaise: 125000,
    amountInRupees: 1250,
    currency: "INR",
    paymentMethod: "UPI",
    status: "SUCCESS",
    createdAt: "2024-10-14T19:42:00.000Z",
    hasInvoice: true,
    invoiceUrl: "https://example.com/receipt.pdf",
    retryEligible: false,
  },
  {
    transactionId: "tx-m-2",
    orderId: "ord-m-2",
    orderNumber: "SQ-98215",
    amountPaise: 54000,
    amountInRupees: 540,
    currency: "INR",
    paymentMethod: "CARD",
    status: "FAILED",
    createdAt: "2026-10-27T03:35:00.000Z",
    hasInvoice: false,
    retryEligible: true,
    retryExpiresAt: new Date(Date.now() + 600000).toISOString(),
  },
  {
    transactionId: "tx-m-3",
    orderId: "ce559b09-a501-4265-96d3-1f4e046014f5",
    amountPaise: 41450,
    amountInRupees: 414.5,
    currency: "INR",
    paymentMethod: "UPI",
    status: "CAPTURED",
    createdAt: "2026-11-06T11:15:45.381Z",
    hasInvoice: true,
    retryEligible: false,
  },
];

describe("CustomerPaymentHistoryMobileCards", () => {
  it("renders mobile cards feed with order links and actions", () => {
    render(
      <MemoryRouter>
        <CustomerPaymentHistoryMobileCards
          transactions={mockTransactions}
          onRetry={jest.fn()}
          onDownloadInvoice={jest.fn()}
          isRetrying={() => false}
          isDownloading={() => false}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("mobile-payment-card-tx-m-1")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-payment-card-tx-m-2")).toBeInTheDocument();
    expect(screen.getByText("#SQ-98214")).toBeInTheDocument();
    expect(screen.getByText("ce559b09...")).toBeInTheDocument();
    expect(screen.getByText("₹1,250.00")).toBeInTheDocument();
  });

  it("handles retry action from mobile card", () => {
    const handleRetry = jest.fn();
    render(
      <MemoryRouter>
        <CustomerPaymentHistoryMobileCards
          transactions={mockTransactions}
          onRetry={handleRetry}
          onDownloadInvoice={jest.fn()}
          isRetrying={() => false}
          isDownloading={() => false}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("mobile-retry-payment-tx-m-2"));
    expect(handleRetry).toHaveBeenCalledWith(mockTransactions[1]);
  });
});
