import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { customerService } from "../services/customer.service";
import { AdminCustomersPage } from "./AdminCustomersPage";

jest.mock("../services/customer.service", () => ({
  customerService: {
    getCustomers: jest.fn(),
    updateCustomerStatus: jest.fn(),
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

const mockCustomersResponse = {
  users: [
    {
      id: "user-1",
      fullName: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      status: "ACTIVE" as const,
      isEmailVerified: true,
      avatarUrl: null,
      createdAt: "2023-01-15T10:00:00.000Z",
      updatedAt: "2023-01-15T10:00:00.000Z",
      location: "New Delhi, India",
    },
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

describe("AdminCustomersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render page header, filters, and customer list", async () => {
    (customerService.getCustomers as jest.Mock).mockResolvedValue(mockCustomersResponse);

    render(<AdminCustomersPage />, { wrapper: createWrapper() });

    expect(screen.getByText("Customer Directory")).toBeInTheDocument();
    expect(
      screen.getByText("Manage platform users, monitor status, and handle administrative actions."),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    });

    expect(screen.getByText("rahul.sharma@example.com")).toBeInTheDocument();
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
  });

  it("should display empty state when API returns no customers", async () => {
    (customerService.getCustomers as jest.Mock).mockResolvedValue({
      users: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });

    render(<AdminCustomersPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId("customer-empty-state")).toBeInTheDocument();
    });
    expect(screen.getByText("No customers found")).toBeInTheDocument();
  });

  it("should display error state when API request fails", async () => {
    (customerService.getCustomers as jest.Mock).mockRejectedValue(new Error("Network Error"));

    render(<AdminCustomersPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId("customer-error-state")).toBeInTheDocument();
    });
    expect(screen.getByText("Failed to load customers")).toBeInTheDocument();
  });

  it("should open confirm dialog and allow blocking customer", async () => {
    (customerService.getCustomers as jest.Mock).mockResolvedValue(mockCustomersResponse);
    (customerService.updateCustomerStatus as jest.Mock).mockResolvedValue({
      id: "user-1",
      status: "BLOCKED",
      updatedAt: "2026-09-10T12:00:00.000Z",
    });

    render(<AdminCustomersPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    });

    const blockBtn = screen.getByRole("button", {
      name: "Block Customer for Rahul Sharma",
    });
    fireEvent.click(blockBtn);

    expect(screen.getByText("Block Customer?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to block Rahul Sharma? They will not be able to log in or use customer services until unblocked.",
      ),
    ).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", {
      name: "Yes, Block Customer",
    });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(customerService.updateCustomerStatus).toHaveBeenCalledWith({
        userId: "user-1",
        status: "BLOCKED",
      });
    });
  });
});
