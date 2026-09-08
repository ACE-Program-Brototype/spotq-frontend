import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useCustomerProfile } from "../hooks/use-customer-profile";
import type { CustomerProfile } from "../types/profile.types";
import { ViewProfilePage } from "./ViewProfilePage";

jest.mock("../hooks/use-customer-profile");

const mockUseCustomerProfile = useCustomerProfile as jest.MockedFunction<typeof useCustomerProfile>;

const mockProfile: CustomerProfile = {
  id: "cust-123",
  first_name: "Jane",
  last_name: "Doe",
  full_name: "Jane Doe",
  email: "jane@example.com",
  phone: "+919876543210",
  status: "ACTIVE",
  gender: "FEMALE",
  dob: "1995-04-12",
  location: "Kochi, IN",
  default_address: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("ViewProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeleton state when query is loading", () => {
    mockUseCustomerProfile.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof useCustomerProfile>);

    renderWithProviders(<ViewProfilePage />);

    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(screen.getByLabelText("Loading profile...")).toBeInTheDocument();
  });

  it("renders error state with retry button when query fails", () => {
    const mockRefetch = jest.fn();
    mockUseCustomerProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Network connection lost"),
      refetch: mockRefetch,
      isFetching: false,
    } as unknown as ReturnType<typeof useCustomerProfile>);

    renderWithProviders(<ViewProfilePage />);

    expect(screen.getByText("Failed to load profile")).toBeInTheDocument();
    expect(screen.getByText("Network connection lost")).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryButton);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("renders complete profile information on successful load", () => {
    mockUseCustomerProfile.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof useCustomerProfile>);

    renderWithProviders(<ViewProfilePage />);

    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your personal information and account settings"),
    ).toBeInTheDocument();

    // Verify Hero card
    expect(screen.getAllByText("Jane Doe")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Verified Customer")[0]).toBeInTheDocument();
    expect(screen.getAllByText("April 12, 1995").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Kochi, IN").length).toBeGreaterThan(0);

    // Verify 4 Info Cards
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("+91 98765 43210")).toBeInTheDocument();
    expect(screen.getByText("Female")).toBeInTheDocument();

    // Verify Delivery card
    expect(screen.getByText("Current Location: Kochi, IN")).toBeInTheDocument();
    expect(screen.getByText("Set as default delivery address")).toBeInTheDocument();

    // Verify Edit button link
    const editLink = screen.getByLabelText("Edit Profile");
    expect(editLink).toHaveAttribute("href", "/profile/edit");
  });

  it("handles null optional fields gracefully", () => {
    const minimalProfile: CustomerProfile = {
      id: "cust-456",
      first_name: "Alex",
      last_name: null,
      full_name: "Alex",
      email: "alex@example.com",
      phone: null,
      status: "ACTIVE",
      gender: null,
      dob: null,
      location: null,
      default_address: null,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };

    mockUseCustomerProfile.mockReturnValue({
      data: minimalProfile,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof useCustomerProfile>);

    renderWithProviders(<ViewProfilePage />);

    expect(screen.getAllByText("Alex")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Location not set").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Not specified")).toHaveLength(2); // Gender & DOB
    expect(screen.getByText("Not provided")).toBeInTheDocument(); // Phone
  });
});
