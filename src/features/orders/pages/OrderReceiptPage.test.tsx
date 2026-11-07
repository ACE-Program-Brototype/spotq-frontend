import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useOrderReceipt } from "../hooks/use-order-receipt";
import { MOCK_ORDER_RECEIPT } from "../mocks/order-receipt.mock";
import OrderReceiptPage from "./OrderReceiptPage";

jest.mock("../hooks/use-order-receipt", () => ({
  useOrderReceipt: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderWithProviders = (orderId = "ord_992817203") => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/orders/${orderId}/receipt`]}>
        <Routes>
          <Route path="/orders/:orderId/receipt" element={<OrderReceiptPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("OrderReceiptPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeleton while fetching", () => {
    (useOrderReceipt as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderWithProviders();

    expect(screen.getByTestId("receipt-skeleton")).toBeInTheDocument();
  });

  it("renders error state when fetch fails and triggers refetch on retry", () => {
    const mockRefetch = jest.fn();
    (useOrderReceipt as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: mockRefetch,
    });

    renderWithProviders();

    expect(screen.getByTestId("receipt-error-state")).toBeInTheDocument();
    const retryButton = screen.getByText("Try Again");
    fireEvent.click(retryButton);
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("renders complete receipt card on successful fetch", () => {
    (useOrderReceipt as jest.Mock).mockReturnValue({
      data: MOCK_ORDER_RECEIPT,
      isLoading: false,
      isError: false,
    });

    renderWithProviders();

    expect(screen.getByTestId("order-receipt-page")).toBeInTheDocument();
    expect(screen.getByTestId("order-receipt-card")).toBeInTheDocument();
    expect(screen.getByText("Digital Receipt")).toBeInTheDocument();
  });

  it("navigates back when back button is clicked", () => {
    (useOrderReceipt as jest.Mock).mockReturnValue({
      data: MOCK_ORDER_RECEIPT,
      isLoading: false,
      isError: false,
    });

    renderWithProviders();

    const backButton = screen.getByTestId("receipt-back-button");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalled();
  });
});
