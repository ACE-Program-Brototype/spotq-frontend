import { act, fireEvent, render, screen } from "@testing-library/react";
import { useTransactions } from "../hooks/useTransactions";
import { transactionService } from "../services/transaction.service";
import { downloadTransactionsCsv } from "../utils/transaction-export.utils";
import { RestaurantTransactionsPage } from "./RestaurantTransactionsPage";

jest.mock("../hooks/useTransactions");
jest.mock("../services/transaction.service", () => ({
  transactionService: {
    getTransactions: jest.fn(),
  },
}));
jest.mock("../utils/transaction-export.utils", () => ({
  downloadTransactionsCsv: jest.fn(() => true),
}));

// Mock TransactionDetailDrawer to inspect open/closed states easily
jest.mock("../components/TransactionDetailDrawer", () => ({
  TransactionDetailDrawer: ({
    transactionId,
    onClose,
  }: {
    transactionId: string | null;
    onClose: () => void;
  }) =>
    transactionId ? (
      <div data-testid="mock-detail-drawer">
        <span>Drawer Open for {transactionId}</span>
        <button type="button" onClick={onClose}>
          Close Mock Drawer
        </button>
      </div>
    ) : null,
}));

describe("RestaurantTransactionsPage", () => {
  const mockTransactions = [
    {
      id: "tx-1",
      orderId: "order-1",
      orderNumber: "SQ-98214",
      customerName: "Rahul Sharma",
      razorpayPaymentId: "pay_OEd1m8F05s9jKa",
      paymentMethod: "UPI",
      amountPaise: 86800,
      amountFormatted: "₹868.00",
      status: "SUCCESS",
      settlementStatus: "PENDING_EOD",
      createdAt: "2026-10-27T14:15:00.000Z",
    },
    {
      id: "tx-2",
      orderId: "order-2",
      orderNumber: "SQ-98211",
      customerName: "Priya Menon",
      razorpayPaymentId: "pay_XYZ987",
      paymentMethod: "CARD",
      amountPaise: 142000,
      amountFormatted: "₹1,420.00",
      status: "SUCCESS",
      settlementStatus: "PENDING_EOD",
      createdAt: "2026-10-27T13:42:00.000Z",
    },
  ];

  const mockPagination = {
    currentPage: 1,
    totalPages: 2,
    totalItems: 30,
    limit: 20,
    hasNextPage: true,
    hasPrevPage: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders page title, subtitle, filters and table rows", () => {
    (useTransactions as jest.Mock).mockReturnValue({
      data: {
        transactions: mockTransactions,
        pagination: mockPagination,
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<RestaurantTransactionsPage />);

    expect(screen.getByText("Payment Transactions")).toBeInTheDocument();
    expect(screen.getByText("#SQ-98214")).toBeInTheDocument();
    expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    expect(screen.getByText("₹868.00")).toBeInTheDocument();
    expect(screen.getByText("#SQ-98211")).toBeInTheDocument();
    expect(screen.getByText("Priya Menon")).toBeInTheDocument();
    expect(screen.getByText("₹1,420.00")).toBeInTheDocument();
  });

  it("opens slide-over drawer when View Details is clicked", () => {
    (useTransactions as jest.Mock).mockReturnValue({
      data: {
        transactions: mockTransactions,
        pagination: mockPagination,
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<RestaurantTransactionsPage />);

    const viewButton = screen.getByTestId("view-details-tx-1");
    fireEvent.click(viewButton);

    expect(screen.getByTestId("mock-detail-drawer")).toBeInTheDocument();
    expect(screen.getByText("Drawer Open for tx-1")).toBeInTheDocument();

    const closeButton = screen.getByText("Close Mock Drawer");
    fireEvent.click(closeButton);

    expect(screen.queryByTestId("mock-detail-drawer")).not.toBeInTheDocument();
  });

  it("renders error state with retry button when query fails", () => {
    const mockRefetch = jest.fn();
    (useTransactions as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      refetch: mockRefetch,
    });

    render(<RestaurantTransactionsPage />);

    expect(screen.getByTestId("transactions-error-banner")).toBeInTheDocument();
    expect(screen.getByText("Failed to load transactions")).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("calls downloadTransactionsCsv when Export CSV button is clicked", async () => {
    (transactionService.getTransactions as jest.Mock).mockResolvedValue({
      transactions: mockTransactions,
      pagination: mockPagination,
    });

    (useTransactions as jest.Mock).mockReturnValue({
      data: {
        transactions: mockTransactions,
        pagination: mockPagination,
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<RestaurantTransactionsPage />);

    const exportButton = screen.getByTestId("export-csv-button");
    await act(async () => {
      fireEvent.click(exportButton);
    });

    expect(downloadTransactionsCsv).toHaveBeenCalledWith(
      mockTransactions,
      "restaurant-transactions",
    );
  });
});
