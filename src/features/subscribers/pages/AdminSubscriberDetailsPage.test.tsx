import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "@/lib/api/client";
import { AdminSubscriberDetailsPage } from "./AdminSubscriberDetailsPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockDetailData = {
  id: "sub-101",
  restaurantId: "rest-501",
  restaurantName: "Biryani Blues",
  subscriberName: "Karan",
  subscriberEmail: "karan@example.com",
  status: "ACTIVE",
  currentPeriodStart: "2026-11-01T00:00:00.000Z",
  currentPeriodEnd: "2027-11-01T00:00:00.000Z",
  cancelledAt: null,
  canceledAt: null,
  createdAt: "2026-11-01T00:00:00.000Z",
  updatedAt: "2026-11-01T00:00:00.000Z",
  plan: {
    id: "plan-1",
    name: "Enterprise Annual",
    code: "ENT_YEARLY",
    billingCycle: "YEARLY",
    price: 2499900,
    currency: "INR",
    description: "Full enterprise access",
    features: ["Advanced Analytics", "Dedicated Queue"],
  },
  transactions: [
    {
      id: "txn-1",
      amount: 2499900,
      currency: "INR",
      status: "SUCCESS",
      razorpayOrderId: "order_123",
      razorpayPaymentId: "pay_123",
      createdAt: "2026-11-01T00:00:00.000Z",
    },
  ],
  invoices: [
    {
      id: "inv-1",
      invoiceNumber: "INV-2026-001",
      amount: 2499900,
      currency: "INR",
      status: "PAID",
      paidAt: "2026-11-01T00:00:00.000Z",
      createdAt: "2026-11-01T00:00:00.000Z",
    },
  ],
};

describe("AdminSubscriberDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: "sub-101" });
  });

  it("should render subscriber details, plan, invoices, and transactions", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        message: "Subscriber details retrieved successfully",
        data: mockDetailData,
      }),
    });

    render(<AdminSubscriberDetailsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId("admin-subscriber-details-page")).toBeInTheDocument();
      expect(screen.getByTestId("subscriber-restaurant-name")).toHaveTextContent("Biryani Blues");
      expect(screen.getByText("karan@example.com")).toBeInTheDocument();
      expect(screen.getByText("Enterprise Annual")).toBeInTheDocument();
      expect(screen.getByText("Advanced Analytics")).toBeInTheDocument();
      expect(screen.getByText("INV-2026-001")).toBeInTheDocument();
      expect(screen.getByText("txn-1")).toBeInTheDocument();
    });
  });

  it("should navigate back when Back button is clicked", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        message: "Subscriber details retrieved successfully",
        data: mockDetailData,
      }),
    });

    render(<AdminSubscriberDetailsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId("subscriber-restaurant-name")).toHaveTextContent("Biryani Blues");
    });

    const backBtn = screen.getByTestId("subscriber-details-back-btn");
    fireEvent.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/admin/subscribers");
  });

  it("should render not found state when 404 is returned", async () => {
    const error404 = new Error("Not Found") as Error & { status: number };
    error404.status = 404;

    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockRejectedValue(error404),
    });

    render(<AdminSubscriberDetailsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId("subscriber-details-error-state")).toBeInTheDocument();
      expect(screen.getByText("Subscriber Not Found")).toBeInTheDocument();
    });
  });
});
