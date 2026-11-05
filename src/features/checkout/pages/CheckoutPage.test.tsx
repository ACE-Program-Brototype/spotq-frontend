import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { checkoutService } from "../services/checkout.service";
import type { CheckoutDetailsData } from "../types/checkout.types";
import { CheckoutPage } from "./CheckoutPage";

jest.mock("../services/checkout.service", () => ({
  checkoutService: {
    getCheckoutDetails: jest.fn(),
    placeOrder: jest.fn(),
    verifyOrderPayment: jest.fn(),
  },
}));

describe("CheckoutPage", () => {
  const mockCheckoutData: CheckoutDetailsData = {
    cartId: "test-cart-id",
    restaurantId: "test-rest-id",
    restaurantName: "Spice Garden Cafe",
    payment: {
      mode: "ONLINE",
      paymentRequired: true,
    },
    itemCount: 2,
    subtotal: 400,
    taxPercent: 5,
    taxAmount: 20,
    totalAmount: 420,
    items: [
      {
        cartItemId: "item-1",
        menuItemId: "menu-1",
        name: "Wok-Tossed Hakka Noodles",
        variantId: null,
        variantName: null,
        quantity: 2,
        unitPrice: 200,
        totalPrice: 400,
        specialInstructions: null,
        addons: [],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (checkoutService.getCheckoutDetails as jest.Mock).mockResolvedValue(mockCheckoutData);
    (checkoutService.placeOrder as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: "ord-test-1",
        orderId: "ord-test-1",
        orderNumber: "ORD-9999",
        restaurantId: mockCheckoutData.restaurantId,
        restaurantName: mockCheckoutData.restaurantName,
        grandTotal: 420,
        totalAmount: 420,
        paymentMode: "ONLINE",
        paymentStatus: "PENDING",
        orderStatus: "PLACED",
        orderingMode: "SELF_ORDER",
        paymentDraft: null,
        items: [],
        createdAt: new Date().toISOString(),
      },
    });
  });

  const renderComponent = (initialEntries = ["/checkout"]) =>
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
      expect(screen.getByText(/Ordering from Spice Garden Cafe/i)).toBeInTheDocument();
    });

    expect(screen.getByText("Customer Details")).toBeInTheDocument();
    expect(screen.getByText("Payment Method")).toBeInTheDocument();
    expect(screen.getByText("Order Summary")).toBeInTheDocument();
  });

  it("submits order and renders in-memory success view on successful checkout", async () => {
    renderComponent(["/checkout"]);

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

    renderComponent(["/checkout"]);

    await waitFor(() => {
      expect(screen.getByText("Order Details")).toBeInTheDocument();
    });

    // Enter valid name and phone to pass validation
    const nameInput = screen.getByLabelText(/Customer Name/i);
    fireEvent.change(nameInput, { target: { value: "Alex Tester" } });

    const phoneInput = screen.getByLabelText(/Mobile Number/i);
    fireEvent.change(phoneInput, { target: { value: "9876543210" } });

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
    (checkoutService.getCheckoutDetails as jest.Mock).mockRejectedValueOnce(
      new Error("Cart not found or expired"),
    );

    renderComponent(["/checkout"]);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load cart/i)).toBeInTheDocument();
      expect(screen.getByText(/Cart not found or expired/i)).toBeInTheDocument();
    });
  });
});
