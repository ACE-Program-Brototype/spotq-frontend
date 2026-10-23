import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MOCK_CART_DATA } from "../constants/checkout.constants";
import { checkoutService } from "../services/checkout.service";
import { CheckoutPage } from "./CheckoutPage";

jest.mock("../services/checkout.service", () => ({
  checkoutService: {
    getCart: jest.fn(),
    placeOrder: jest.fn(),
  },
}));

describe("CheckoutPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (checkoutService.getCart as jest.Mock).mockResolvedValue(MOCK_CART_DATA);
    (checkoutService.placeOrder as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        orderId: "ord-test-1",
        orderNumber: "ORD-9999",
        restaurantId: MOCK_CART_DATA.restaurantId,
        restaurantName: MOCK_CART_DATA.restaurantName,
        totalAmount: 1911,
        paymentMode: "ONLINE",
        orderType: "SELF_SERVICE_TABLE",
        tableNumber: 4,
        createdAt: new Date().toISOString(),
      },
    });
  });

  const renderComponent = (
    initialEntries = ["/checkout?cartId=48982fbb-d4fb-4275-81a2-bc404bb9c3a8"],
  ) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </MemoryRouter>,
    );

  it("renders page header, order details, customer details, and payment options", async () => {
    renderComponent();

    expect(screen.getByRole("heading", { name: /Secure Checkout/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Order Details")).toBeInTheDocument();
      expect(screen.getByText("Wok-Tossed Hakka Noodles")).toBeInTheDocument();
      expect(screen.getByText(/Review your order from Spice Garden Cafe/i)).toBeInTheDocument();
    });

    expect(screen.getByText("Customer Details")).toBeInTheDocument();
    expect(screen.getByText("Payment Method")).toBeInTheDocument();
    expect(screen.getByText("Order Summary")).toBeInTheDocument();
  });

  it("submits order and renders in-memory success view on successful checkout", async () => {
    renderComponent(["/checkout?cartId=48982fbb-d4fb-4275-81a2-bc404bb9c3a8"]);

    await waitFor(() => {
      expect(screen.getByText("Order Details")).toBeInTheDocument();
    });

    // Enter valid name and phone
    const nameInput = screen.getByLabelText(/Customer Name/i);
    fireEvent.change(nameInput, { target: { value: "Alex Tester" } });

    const phoneInput = screen.getByLabelText(/Mobile Number/i);
    fireEvent.change(phoneInput, { target: { value: "9876543210" } });

    const submitBtn = screen.getByRole("button", { name: /Pay Now/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(checkoutService.placeOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          userName: "Alex Tester",
          userPhone: "9876543210",
          paymentMode: "ONLINE",
        }),
      );
    });

    // Verify in-memory transition to success view
    await waitFor(() => {
      expect(screen.getByText(/Order #ORD-9999/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Track Live Orders/i })).toBeInTheDocument();
    });
  });

  it("renders in-memory failure view when order placement fails", async () => {
    (checkoutService.placeOrder as jest.Mock).mockRejectedValueOnce(
      new Error("Gateway connection timeout"),
    );

    renderComponent(["/checkout?cartId=48982fbb-d4fb-4275-81a2-bc404bb9c3a8"]);

    await waitFor(() => {
      expect(screen.getByText("Order Details")).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole("button", { name: /Pay Now/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Checkout Was Not Completed/i)).toBeInTheDocument();
      expect(screen.getByText(/Gateway connection timeout/i)).toBeInTheDocument();
    });

    // Click Retry Checkout to return to checkout form
    const retryBtn = screen.getByRole("button", { name: /Retry Checkout/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText("Secure Checkout")).toBeInTheDocument();
    });
  });

  it("displays error banner when cart fails to load", async () => {
    (checkoutService.getCart as jest.Mock).mockRejectedValueOnce(
      new Error("Cart not found or expired"),
    );

    renderComponent(["/checkout?cartId=expired-cart"]);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load cart/i)).toBeInTheDocument();
      expect(screen.getByText(/Cart not found or expired/i)).toBeInTheDocument();
    });
  });
});
