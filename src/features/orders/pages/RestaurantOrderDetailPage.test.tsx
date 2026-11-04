import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RestaurantOrderDetailPage from "./RestaurantOrderDetailPage";

const mockDetail = {
  orderId: "326a800d-494d-4e8c-a51d-23580c7ed725",
  orderNumber: "ORD-3DC35-008",
  orderStatus: "PLACED" as const,
  orderType: "DINE_IN" as const,
  paymentMode: "ONLINE" as const,
  paymentStatus: "PAID" as const,
  customer: {
    userId: "usr-401",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul.sharma@example.com",
  },
  tableNumber: 4,
  estimatedReadyAt: "2026-11-02T20:45:00.000Z",
  createdAt: "2026-11-02T20:22:02.440Z",
  items: [
    {
      itemId: "item-1",
      menuItemId: "menu-chicken-biryani",
      itemName: "Hyderabadi Chicken Biryani",
      variantName: "Special Dum (Serves 1-2)",
      quantity: 2,
      unitPrice: 380,
      totalPrice: 760,
      specialInstructions: "Make it medium spicy, include extra raita and salan.",
      addons: [
        { addonId: "add-1", addonName: "Extra Boiled Egg", price: 25 },
        { addonId: "add-2", addonName: "Double Raita Bowl", price: 35 },
      ],
    },
    {
      itemId: "item-2",
      menuItemId: "menu-garlic-naan",
      itemName: "Butter Garlic Naan",
      variantName: "Crisp Tandoori",
      quantity: 3,
      unitPrice: 60,
      totalPrice: 180,
      specialInstructions: null,
    },
  ],
  pricing: {
    subtotal: 1360,
    discountAmount: 150,
    couponCode: "WELCOME50",
    taxAmount: 60.5,
    platformFee: 10,
    grandTotal: 1280.5,
  },
  statusHistory: [
    {
      previousStatus: null,
      currentStatus: "PLACED" as const,
      changedBy: "Customer (Rahul Sharma)",
      notes: "Order placed via digital QR table menu",
      createdAt: "2026-11-02T20:22:02.440Z",
    },
  ],
  specialInstructions: "Guest is celebrating an anniversary. Please provide cutlery sets for 4.",
};

jest.mock("../hooks/use-restaurant-order-detail", () => ({
  useRestaurantOrderDetail: () => ({
    data: mockDetail,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  }),
}));

describe("RestaurantOrderDetailPage UI Presentation", () => {
  const renderDetailPage = (orderId = "326a800d-494d-4e8c-a51d-23580c7ed725") => {
    return render(
      <MemoryRouter initialEntries={[`/restaurant/orders/${orderId}`]}>
        <Routes>
          <Route path="/restaurant/orders/:orderId" element={<RestaurantOrderDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it("renders order header with order number, status, and back button", () => {
    renderDetailPage();

    // Back to orders link
    const backLink = screen.getByRole("link", { name: /Back to Orders/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/restaurant/orders");

    // Order number and status badge
    expect(screen.getByRole("heading", { name: "#ORD-3DC35-008", level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText("Placed")[0]).toBeInTheDocument();
    expect(screen.getByText(/Dine-In • Table 4/i)).toBeInTheDocument();
  });

  it("renders ordered items with variants, add-ons, and pricing", () => {
    renderDetailPage();

    expect(screen.getByText(/Ordered Items/i)).toBeInTheDocument();
    expect(screen.getByText("Hyderabadi Chicken Biryani")).toBeInTheDocument();
    expect(screen.getByText("Special Dum (Serves 1-2)")).toBeInTheDocument();
    expect(screen.getByText("Extra Boiled Egg")).toBeInTheDocument();
    expect(screen.getByText("Butter Garlic Naan")).toBeInTheDocument();
  });

  it("renders customer details and dining service info", () => {
    renderDetailPage();

    expect(screen.getByText("Customer Information")).toBeInTheDocument();
    expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    expect(screen.getByText("+91 98765 43210")).toBeInTheDocument();

    expect(screen.getByText("Service Details")).toBeInTheDocument();
    expect(screen.getByText("Table 4")).toBeInTheDocument();
  });

  it("renders payment & billing summary breakdown", () => {
    renderDetailPage();

    expect(screen.getByText("Payment & Billing")).toBeInTheDocument();
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getByText(/Taxes \(GST 5%\)/i)).toBeInTheDocument();
    expect(screen.getByText("Grand Total")).toBeInTheDocument();
  });

  it("renders print receipt action button and triggers print on click", () => {
    const printSpy = jest.spyOn(window, "print").mockImplementation(() => {});
    renderDetailPage();

    const printBtn = screen.getByRole("button", { name: /Print/i });
    expect(printBtn).toBeInTheDocument();

    fireEvent.click(printBtn);
    expect(printSpy).toHaveBeenCalledTimes(1);

    printSpy.mockRestore();
  });

  it("renders status history timeline", () => {
    renderDetailPage();

    expect(screen.getByText("Order Status History")).toBeInTheDocument();
    expect(screen.getByText(/by Customer/i)).toBeInTheDocument();
    expect(screen.getByText("Order placed via digital QR table menu")).toBeInTheDocument();
  });
});
