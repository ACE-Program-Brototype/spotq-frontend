import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useCustomerPaymentHistory } from "../hooks/use-customer-payment-history";
import { useRetryPayment } from "../hooks/use-retry-payment";
import { CustomerPaymentHistoryPage } from "./CustomerPaymentHistoryPage";

jest.mock("@/features/profile/hooks/use-customer-profile", () => ({
  useCustomerProfile: () => ({
    data: { id: "cust-1", full_name: "John Doe" },
    isLoading: false,
  }),
}));

jest.mock("@/features/profile/components/CustomerSidebar", () => ({
  CustomerSidebar: () => <aside data-testid="customer-sidebar-mock">Sidebar</aside>,
}));

jest.mock("../hooks/use-customer-payment-history");
jest.mock("../hooks/use-retry-payment");

describe("CustomerPaymentHistoryPage", () => {
  const mockSetPage = jest.fn();
  const mockSetStatus = jest.fn();
  const mockSetStartDate = jest.fn();
  const mockSetEndDate = jest.fn();
  const mockClearDateRange = jest.fn();
  const mockSetSort = jest.fn();
  const mockHandleToggleSort = jest.fn();
  const mockRefetch = jest.fn();
  const mockHandleRetry = jest.fn();
  const mockHandleDownload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRetryPayment as jest.Mock).mockReturnValue({
      handleRetry: mockHandleRetry,
      handleDownloadInvoice: mockHandleDownload,
      isRetrying: () => false,
      isDownloading: () => false,
    });
  });

  it("renders loading skeleton when fetching history", () => {
    (useCustomerPaymentHistory as jest.Mock).mockReturnValue({
      transactions: [],
      pagination: { currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
      setPage: mockSetPage,
      status: "ALL",
      setStatus: mockSetStatus,
      startDate: "",
      endDate: "",
      setStartDate: mockSetStartDate,
      setEndDate: mockSetEndDate,
      clearDateRange: mockClearDateRange,
      isDateFiltered: false,
      sortBy: "createdAt",
      sortOrder: "desc",
      setSort: mockSetSort,
      handleToggleSort: mockHandleToggleSort,
      isLoading: true,
      isFetching: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(
      <MemoryRouter>
        <CustomerPaymentHistoryPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("customer-payment-history-skeleton")).toBeInTheDocument();
  });

  it("renders error state with retry button when fetch fails", () => {
    (useCustomerPaymentHistory as jest.Mock).mockReturnValue({
      transactions: [],
      pagination: { currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
      setPage: mockSetPage,
      status: "ALL",
      setStatus: mockSetStatus,
      startDate: "",
      endDate: "",
      setStartDate: mockSetStartDate,
      setEndDate: mockSetEndDate,
      clearDateRange: mockClearDateRange,
      isDateFiltered: false,
      sortBy: "createdAt",
      sortOrder: "desc",
      setSort: mockSetSort,
      handleToggleSort: mockHandleToggleSort,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error("Network Error"),
      refetch: mockRefetch,
    });

    render(
      <MemoryRouter>
        <CustomerPaymentHistoryPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("customer-payment-history-error-state")).toBeInTheDocument();
    expect(screen.getByText("Network Error")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("renders empty state when no transactions exist", () => {
    (useCustomerPaymentHistory as jest.Mock).mockReturnValue({
      transactions: [],
      pagination: { currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
      setPage: mockSetPage,
      status: "FAILED",
      setStatus: mockSetStatus,
      startDate: "",
      endDate: "",
      setStartDate: mockSetStartDate,
      setEndDate: mockSetEndDate,
      clearDateRange: mockClearDateRange,
      isDateFiltered: false,
      sortBy: "createdAt",
      sortOrder: "desc",
      setSort: mockSetSort,
      handleToggleSort: mockHandleToggleSort,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(
      <MemoryRouter>
        <CustomerPaymentHistoryPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("customer-payment-history-empty-state")).toBeInTheDocument();
    expect(screen.getByText(/No transactions found/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("clear-payment-filter-button"));
    expect(mockSetStatus).toHaveBeenCalledWith("ALL");
  });

  it("renders transactions with table, mobile cards, sort selector, and pagination controls", () => {
    (useCustomerPaymentHistory as jest.Mock).mockReturnValue({
      transactions: [
        {
          transactionId: "tx-101",
          orderId: "ord-101",
          orderNumber: "SQ-98214",
          amountPaise: 125000,
          amountInRupees: 1250,
          currency: "INR",
          paymentMethod: "UPI",
          status: "SUCCESS",
          createdAt: "2024-10-14T19:42:00.000Z",
          hasInvoice: true,
          retryEligible: false,
        },
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: false,
      },
      setPage: mockSetPage,
      status: "ALL",
      setStatus: mockSetStatus,
      startDate: "",
      endDate: "",
      setStartDate: mockSetStartDate,
      setEndDate: mockSetEndDate,
      clearDateRange: mockClearDateRange,
      isDateFiltered: false,
      sortBy: "createdAt",
      sortOrder: "desc",
      setSort: mockSetSort,
      handleToggleSort: mockHandleToggleSort,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(
      <MemoryRouter>
        <CustomerPaymentHistoryPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Payment History")).toBeInTheDocument();
    expect(screen.getByTestId("payment-count-badge")).toHaveTextContent("25");
    expect(screen.getByTestId("customer-payment-history-table-container")).toBeInTheDocument();
    expect(screen.getByTestId("customer-payment-history-mobile-cards")).toBeInTheDocument();
    expect(screen.getByTestId("customer-payment-sort-select")).toBeInTheDocument();
    expect(screen.getByTestId("customer-payment-date-filter")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("customer-payment-sort-select"), {
      target: { value: "amountPaise:desc" },
    });
    expect(mockSetSort).toHaveBeenCalledWith("amountPaise", "desc");
  });
});
