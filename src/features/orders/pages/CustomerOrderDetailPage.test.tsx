import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { customerPaymentService } from "@/features/payments/services/customer-payment.service";
import { orderService } from "../services/order.service";
import type { CustomerOrderDetails } from "../types/customer-order-details.types";
import CustomerOrderDetailPage from "./CustomerOrderDetailPage";

jest.mock("../services/order.service");
jest.mock("@/features/payments/services/customer-payment.service", () => ({
  customerPaymentService: {
    getInvoiceDownloadUrl: jest.fn(),
  },
}));

const mockOrderDetails: CustomerOrderDetails = {
  order_id: "220e777c-69b4-4c56-a0fe-b9e276678322",
  order_number: "ORD-MWAOYWC4-D83312",
  restaurant: {
    restaurant_id: "3dc35af0-3ff5-4ee9-a60a-fbb47124731b",
    name: "Al-Reem",
  },
  order_type: "QUEUE_ORDER",
  status: "CONFIRMED",
  created_at: "2026-11-10T12:54:05.621Z",
  updated_at: "2026-11-10T12:54:34.497Z",
  table_number: null,
  queue_entry_id: "1f662c4a-d484-4e35-ad79-da6c3642df71",
  special_instructions: "Extra crispy please",
  items: [
    {
      menu_item_id: "2f04e02b-7194-47cb-91f0-fa336cb3498e",
      name: "Chicken Biriyani",
      quantity: 2,
      unit_price: 180,
      variant: {
        variant_id: "deaf7aa6-fa00-43ac-afff-e277c7a8c19c",
        name: "Regular (1 Person)",
      },
      addons: [
        {
          addon_id: "addon-1",
          name: "Extra Raita",
          price: 20,
        },
      ],
      line_total: 400,
    },
  ],
  pricing: {
    subtotal: 360,
    discounts: 0,
    taxes: 18,
    platform_fee: 0,
    grand_total: 378,
    currency: "INR",
  },
  payment: {
    status: "PAID",
    method: "ONLINE",
    payment_id: "pay_982319238",
    amount_paid: 378,
  },
  status_history: [
    {
      previous_status: null,
      current_status: "PLACED",
      notes: "Order placed by customer",
      created_at: "2026-11-10T12:54:05.620Z",
    },
    {
      previous_status: "PLACED",
      current_status: "CONFIRMED",
      notes: "Payment captured via gateway",
      created_at: "2026-11-10T12:54:34.545Z",
    },
  ],
};

describe("CustomerOrderDetailPage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: Number.POSITIVE_INFINITY },
        mutations: { retry: false },
      },
    });
  });

  const renderWithRouter = (orderId = "220e777c-69b4-4c56-a0fe-b9e276678322") =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/orders/${orderId}`]}>
          <Routes>
            <Route path="/orders/:orderId" element={<CustomerOrderDetailPage />} />
            <Route path="/orders/:orderId/receipt" element={<div>Order Receipt Page</div>} />
            <Route path="/orders" element={<div>Orders List Page</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

  it("renders loading skeleton while fetching order details", () => {
    (orderService.getCustomerOrderDetails as jest.Mock).mockReturnValue(new Promise(() => {}));

    renderWithRouter();

    expect(screen.getByTestId("customer-order-detail-skeleton")).toBeInTheDocument();
  });

  it("renders error state when request fails and allows retry", async () => {
    (orderService.getCustomerOrderDetails as jest.Mock).mockRejectedValue(
      new Error("Order not found"),
    );

    renderWithRouter();

    expect(await screen.findByTestId("customer-order-error-state")).toBeInTheDocument();
    expect(screen.getByText("Unable to load order")).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /Try Again/i });
    expect(retryBtn).toBeInTheDocument();
  });

  it("renders full customer order details with items, tracker, payment, and pricing", async () => {
    (orderService.getCustomerOrderDetails as jest.Mock).mockResolvedValue(mockOrderDetails);

    renderWithRouter();

    expect(await screen.findByTestId("customer-order-detail-page")).toBeInTheDocument();
    expect(screen.getByTestId("customer-order-number")).toHaveTextContent("#ORD-MWAOYWC4-D83312");
    expect(screen.getAllByText("Al-Reem").length).toBeGreaterThanOrEqual(1);

    // Items check
    expect(screen.getByText("Chicken Biriyani")).toBeInTheDocument();
    expect(screen.getByText(/Regular \(1 Person\)/)).toBeInTheDocument();
    expect(screen.getByText("Extra Raita")).toBeInTheDocument();

    // Dining context
    expect(screen.getByTestId("order-type-badge")).toHaveTextContent("Queue Order");
    expect(screen.getByTestId("order-queue-id")).toHaveTextContent(
      "1f662c4a-d484-4e35-ad79-da6c3642df71",
    );
    expect(screen.getByText(/"Extra crispy please"/)).toBeInTheDocument();

    // Payment check
    expect(screen.getByTestId("payment-status-badge")).toHaveTextContent("PAID");
    expect(screen.getByTestId("payment-method")).toHaveTextContent("ONLINE");
    expect(screen.getByTestId("payment-amount-paid")).toHaveTextContent("₹378.00");
    expect(screen.getByTestId("payment-id")).toHaveTextContent("pay_982319238");

    // Pricing check
    expect(screen.getByTestId("pricing-subtotal")).toHaveTextContent("₹360.00");
    expect(screen.getByTestId("pricing-taxes")).toHaveTextContent("₹18.00");
    expect(screen.getByTestId("pricing-grand-total")).toHaveTextContent("₹378.00");

    // Tracker check
    expect(screen.getByTestId("order-status-tracker")).toBeInTheDocument();
    expect(screen.getByTestId("tracker-step-placed")).toBeInTheDocument();
    expect(screen.getByTestId("tracker-step-confirmed")).toBeInTheDocument();

    // Audit trail check
    expect(screen.getByTestId("order-status-history-card")).toBeInTheDocument();
    expect(screen.getByText("Payment captured via gateway")).toBeInTheDocument();
  });

  it("navigates back to orders list when back button is clicked", async () => {
    (orderService.getCustomerOrderDetails as jest.Mock).mockResolvedValue(mockOrderDetails);

    renderWithRouter();

    const backBtn = await screen.findByTestId("order-back-button");
    fireEvent.click(backBtn);

    expect(screen.getByText("Orders List Page")).toBeInTheDocument();
  });

  it("triggers invoice download and opens PDF in a new window", async () => {
    (orderService.getCustomerOrderDetails as jest.Mock).mockResolvedValue(mockOrderDetails);
    (customerPaymentService.getInvoiceDownloadUrl as jest.Mock).mockResolvedValue(
      "https://s3.amazonaws.com/test-invoice.pdf",
    );
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => ({}) as Window);

    renderWithRouter();

    const downloadInvoiceBtn = await screen.findByTestId("download-invoice-btn");
    expect(downloadInvoiceBtn).toBeEnabled();

    fireEvent.click(downloadInvoiceBtn);

    await waitFor(() => {
      expect(customerPaymentService.getInvoiceDownloadUrl).toHaveBeenCalledWith("pay_982319238");
      expect(openSpy).toHaveBeenCalledWith(
        "https://s3.amazonaws.com/test-invoice.pdf",
        "_blank",
        "noopener,noreferrer",
      );
    });

    openSpy.mockRestore();
  });

  it("disables download invoice button when order is unpaid or payment_id is missing", async () => {
    (orderService.getCustomerOrderDetails as jest.Mock).mockResolvedValue({
      ...mockOrderDetails,
      payment: {
        status: "PENDING",
        method: "ONLINE",
        payment_id: null,
        amount_paid: 0,
      },
    });

    renderWithRouter();

    const downloadInvoiceBtn = await screen.findByTestId("download-invoice-btn");
    expect(downloadInvoiceBtn).toBeDisabled();
  });
});
