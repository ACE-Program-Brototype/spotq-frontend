import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { apiClient } from "@/lib/api/client";
import { AdminCustomersPage } from "./AdminCustomersPage";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
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

const mockRawArrayResponse = {
  success: true,
  message: "Customers retrieved successfully.",
  data: [
    {
      id: "user-1",
      fullname: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      status: "ACTIVE",
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

const mockRawNestedUsersResponse = {
  success: true,
  message: "Customers retrieved successfully.",
  data: {
    users: [
      {
        id: "user-2",
        fullName: "Priya Patel",
        email: "priya.patel@example.com",
        phone: "+91 91234 56789",
        status: "BLOCKED",
        isEmailVerified: true,
        avatarUrl: null,
        createdAt: "2023-02-20T10:00:00.000Z",
        updatedAt: "2023-02-20T10:00:00.000Z",
        location: "Mumbai, India",
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
  },
};

describe("AdminCustomersPage (Page-to-Service Integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should normalize raw array response and render customer directory", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue(mockRawArrayResponse),
    });

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
    expect(apiClient.get).toHaveBeenCalledWith(
      "users",
      expect.objectContaining({
        searchParams: expect.objectContaining({ page: 1, limit: 20 }),
      }),
    );
  });

  it("should normalize nested users object response and render customers properly", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue(mockRawNestedUsersResponse),
    });

    render(<AdminCustomersPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Priya Patel")).toBeInTheDocument();
    });

    expect(screen.getByText("priya.patel@example.com")).toBeInTheDocument();
    expect(screen.getByText("BLOCKED")).toBeInTheDocument();
  });

  it("should display empty state when API returns no customers", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }),
    });

    render(<AdminCustomersPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId("customer-empty-state")).toBeInTheDocument();
    });
    expect(screen.getByText("No customers found")).toBeInTheDocument();
  });

  it("should display error state when API request fails", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockRejectedValue(new Error("Network Error")),
    });

    render(<AdminCustomersPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId("customer-error-state")).toBeInTheDocument();
    });
    expect(screen.getByText("Failed to load customers")).toBeInTheDocument();
  });

  it("should open confirm dialog and allow blocking customer via apiClient.patch", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue(mockRawArrayResponse),
    });
    (apiClient.patch as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        message: "Customer status updated successfully",
        data: {
          id: "user-1",
          status: "BLOCKED",
          updatedAt: "2026-09-10T12:00:00.000Z",
        },
      }),
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
      expect(apiClient.patch).toHaveBeenCalledWith("users/user-1/status", {
        json: { status: "BLOCKED" },
      });
    });
  });
});
