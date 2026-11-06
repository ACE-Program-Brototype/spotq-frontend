import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { CustomerPaymentTransaction } from "../types/customer-payment.types";
import { CustomerPaymentHistoryTable } from "./CustomerPaymentHistoryTable";

const mockTransactions: CustomerPaymentTransaction[] = [
  {
    transactionId: "tx-success",
    orderId: "ord-1",
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
    transactionId: "tx-failed-eligible",
    orderId: "ord-2",
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
    transactionId: "tx-failed-expired",
    orderId: "ord-3",
    orderNumber: "SQ-98216",
    amountPaise: 30000,
    amountInRupees: 300,
    currency: "INR",
    paymentMethod: "UPI",
    status: "FAILED",
    createdAt: "2026-10-27T03:00:00.000Z",
    hasInvoice: false,
    retryEligible: false,
  },
  {
    transactionId: "tx-refunded",
    orderId: "ord-4",
    orderNumber: "SQ-98217",
    amountPaise: 80000,
    amountInRupees: 800,
    currency: "INR",
    paymentMethod: "NETBANKING",
    status: "REFUNDED",
    createdAt: "2026-10-25T12:00:00.000Z",
    hasInvoice: false,
    retryEligible: false,
  },
  {
    transactionId: "tx-uuid-only",
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

describe("CustomerPaymentHistoryTable", () => {
  it("renders structured table columns with transactions data", () => {
    render(
      <MemoryRouter>
        <CustomerPaymentHistoryTable
          transactions={mockTransactions}
          onRetry={jest.fn()}
          onDownloadInvoice={jest.fn()}
          isRetrying={() => false}
          isDownloading={() => false}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("#SQ-98214")).toBeInTheDocument();
    expect(screen.getByText("ce559b09...")).toBeInTheDocument();
    expect(screen.getByText("₹1,250.00")).toBeInTheDocument();
    expect(screen.getByText("₹540.00")).toBeInTheDocument();
    expect(screen.getAllByText("Download Receipt")[0]).toBeInTheDocument();
    expect(screen.getByText("Retry Payment")).toBeInTheDocument();
    expect(screen.getByText("Expired")).toBeInTheDocument();
    expect(screen.getByText("Refund Details")).toBeInTheDocument();
  });

  it("triggers onDownloadInvoice when clicking Download Receipt", () => {
    const handleDownload = jest.fn();
    render(
      <MemoryRouter>
        <CustomerPaymentHistoryTable
          transactions={mockTransactions}
          onRetry={jest.fn()}
          onDownloadInvoice={handleDownload}
          isRetrying={() => false}
          isDownloading={() => false}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("download-receipt-button-tx-success"));
    expect(handleDownload).toHaveBeenCalledWith(mockTransactions[0]);
  });

  it("triggers onRetry when clicking Retry Payment", () => {
    const handleRetry = jest.fn();
    render(
      <MemoryRouter>
        <CustomerPaymentHistoryTable
          transactions={mockTransactions}
          onRetry={handleRetry}
          onDownloadInvoice={jest.fn()}
          isRetrying={() => false}
          isDownloading={() => false}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("retry-payment-button-tx-failed-eligible"));
    expect(handleRetry).toHaveBeenCalledWith(mockTransactions[1]);
  });

  it("triggers onSort when clicking sortable column headers", () => {
    const handleSort = jest.fn();
    render(
      <MemoryRouter>
        <CustomerPaymentHistoryTable
          transactions={mockTransactions}
          onRetry={jest.fn()}
          onDownloadInvoice={jest.fn()}
          isRetrying={() => false}
          isDownloading={() => false}
          sortBy="createdAt"
          sortOrder="desc"
          onSort={handleSort}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("sort-date-button"));
    expect(handleSort).toHaveBeenCalledWith("createdAt");

    fireEvent.click(screen.getByTestId("sort-amount-button"));
    expect(handleSort).toHaveBeenCalledWith("amountPaise");
  });
});
