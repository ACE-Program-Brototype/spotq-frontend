/**
 * Unit tests for ViewProfilePage
 * Tests loading skeleton, error state with retry, success rendering, and fallback handling for missing fields.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PROFILE_MESSAGES } from "../constants/profile.constants";
import { useCustomerProfile } from "../hooks/use-customer-profile";
import type { CustomerProfile } from "../types/profile.types";
import { ViewProfilePage } from "./ViewProfilePage";

jest.mock("../hooks/use-customer-profile");

const mockUseCustomerProfile = useCustomerProfile as jest.MockedFunction<typeof useCustomerProfile>;

const mockProfile: CustomerProfile = {
  id: "cust-123",
  full_name: "Jane Doe",
  email: "jane@example.com",
  phone: "+919876543210",
  status: "ACTIVE",
  gender: "FEMALE",
  dob: "1995-04-12",
  created_at: "2026-09-02T00:00:00.000Z",
  updated_at: "2026-09-02T00:00:00.000Z",
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

    expect(screen.getByText(PROFILE_MESSAGES.MY_PROFILE)).toBeInTheDocument();
    expect(screen.getByLabelText(PROFILE_MESSAGES.LOADING_PROFILE)).toBeInTheDocument();
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

    expect(screen.getByText(PROFILE_MESSAGES.FETCH_FAILED)).toBeInTheDocument();
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

    expect(screen.getByText(PROFILE_MESSAGES.MY_PROFILE)).toBeInTheDocument();
    expect(screen.getByText(PROFILE_MESSAGES.PROFILE_HEADER_SUBTITLE)).toBeInTheDocument();

    expect(screen.getAllByText("Jane Doe")[0]).toBeInTheDocument();
    expect(screen.getByText("Member since : 2 Sep 2026")).toBeInTheDocument();
    expect(screen.getByText("April 12, 1995")).toBeInTheDocument();

    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("+91 98765 43210")).toBeInTheDocument();
    expect(screen.getByText("Female")).toBeInTheDocument();

    const editLink = screen.getByLabelText(PROFILE_MESSAGES.EDIT_PROFILE);
    expect(editLink).toHaveAttribute("href", "/profile/edit");
  });

  it("handles null optional fields gracefully", () => {
    const minimalProfile: CustomerProfile = {
      id: "cust-456",
      full_name: "Alex",
      email: "alex@example.com",
      phone: null,
      status: "ACTIVE",
      gender: null,
      dob: null,
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
    expect(screen.getByText("Member since : 1 Jan 2026")).toBeInTheDocument();
    expect(screen.getAllByText(PROFILE_MESSAGES.NOT_SPECIFIED)).toHaveLength(2);
    expect(screen.getByText(PROFILE_MESSAGES.NOT_PROVIDED)).toBeInTheDocument();
  });
});
