/**
 * Unit tests for EditProfilePage
 * Tests loading, error, pre-population, form validation, full-name splitting,
 * successful mutation with navigation/toast, and cancel/back navigation.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { toast } from "sonner";
import { PROFILE_MESSAGES } from "../constants/profile.constants";
import { useCustomerProfile } from "../hooks/use-customer-profile";
import { useUpdateCustomerProfile } from "../hooks/use-update-customer-profile";
import type { CustomerProfile } from "../types/profile.types";
import { EditProfilePage } from "./EditProfilePage";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../hooks/use-customer-profile");
jest.mock("../hooks/use-update-customer-profile");

const mockUseCustomerProfile = useCustomerProfile as jest.MockedFunction<typeof useCustomerProfile>;
const mockUseUpdateCustomerProfile = useUpdateCustomerProfile as jest.MockedFunction<
  typeof useUpdateCustomerProfile
>;

const mockProfile: CustomerProfile = {
  id: "cust-123",
  full_name: "Jane Doe",
  email: "jane@example.com",
  phone: "+919876543210",
  status: "ACTIVE",
  gender: "FEMALE",
  dob: "1995-04-12",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const renderWithProviders = (ui: React.ReactElement, initialPath = "/profile/edit") => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/profile/edit" element={ui} />
          <Route path="/profile" element={<div>Profile View Page Target</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("EditProfilePage", () => {
  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseUpdateCustomerProfile.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateCustomerProfile>);
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

    renderWithProviders(<EditProfilePage />);

    expect(screen.getByText(PROFILE_MESSAGES.EDIT_PROFILE)).toBeInTheDocument();
    expect(screen.getByLabelText(PROFILE_MESSAGES.LOADING_PROFILE)).toBeInTheDocument();
  });

  it("renders error state with retry button when profile query fails", () => {
    const mockRefetch = jest.fn();
    mockUseCustomerProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Network connection lost"),
      refetch: mockRefetch,
      isFetching: false,
    } as unknown as ReturnType<typeof useCustomerProfile>);

    renderWithProviders(<EditProfilePage />);

    expect(screen.getByText(PROFILE_MESSAGES.FETCH_FAILED)).toBeInTheDocument();
    expect(screen.getByText("Network connection lost")).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryButton);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("pre-populates form with existing profile data", () => {
    mockUseCustomerProfile.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof useCustomerProfile>);

    renderWithProviders(<EditProfilePage />);

    expect(
      screen.getByRole("heading", { name: PROFILE_MESSAGES.EDIT_PROFILE }),
    ).toBeInTheDocument();
    expect(screen.getByText(PROFILE_MESSAGES.BACK_TO_PROFILE)).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText("e.g. John Doe") as HTMLInputElement;
    expect(nameInput.value).toBe("Jane Doe");

    const emailInput = screen.getByDisplayValue("jane@example.com") as HTMLInputElement;
    expect(emailInput).toBeDisabled();

    const phoneInput = screen.getByDisplayValue("+919876543210") as HTMLInputElement;
    expect(phoneInput).toBeDisabled();

    const dobInput = screen.getByDisplayValue("1995-04-12") as HTMLInputElement;
    expect(dobInput.value).toBe("1995-04-12");

    const genderSelect = screen.getByRole("combobox") as HTMLSelectElement;
    expect(genderSelect.value).toBe("FEMALE");
  });

  it("shows validation errors when invalid input is provided", async () => {
    mockUseCustomerProfile.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof useCustomerProfile>);

    renderWithProviders(<EditProfilePage />);

    const nameInput = screen.getByPlaceholderText("e.g. John Doe");
    fireEvent.change(nameInput, { target: { value: "A" } });

    const saveButton = screen.getByRole("button", { name: PROFILE_MESSAGES.SAVE_CHANGES });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(PROFILE_MESSAGES.VALIDATION.NAME_MIN_LENGTH)).toBeInTheDocument();
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("submits full_name on valid form submission", async () => {
    mockMutateAsync.mockResolvedValueOnce({
      ...mockProfile,
      full_name: "Ajex Joshy",
      gender: "MALE",
    });

    mockUseCustomerProfile.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof useCustomerProfile>);

    renderWithProviders(<EditProfilePage />);

    const nameInput = screen.getByPlaceholderText("e.g. John Doe");
    fireEvent.change(nameInput, { target: { value: "Ajex Joshy" } });

    const genderSelect = screen.getByRole("combobox");
    fireEvent.change(genderSelect, { target: { value: "MALE" } });

    const saveButton = screen.getByRole("button", { name: PROFILE_MESSAGES.SAVE_CHANGES });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        full_name: "Ajex Joshy",
        gender: "MALE",
        dob: "1995-04-12",
      });
    });

    expect(toast.success).toHaveBeenCalledWith(PROFILE_MESSAGES.UPDATE_SUCCESS);
    expect(await screen.findByText("Profile View Page Target")).toBeInTheDocument();
  });

  it("handles single-word full name properly without splitting", async () => {
    mockMutateAsync.mockResolvedValueOnce({
      ...mockProfile,
      full_name: "Cheran",
    });

    mockUseCustomerProfile.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof useCustomerProfile>);

    renderWithProviders(<EditProfilePage />);

    const nameInput = screen.getByPlaceholderText("e.g. John Doe");
    fireEvent.change(nameInput, { target: { value: "Cheran" } });

    const saveButton = screen.getByRole("button", { name: PROFILE_MESSAGES.SAVE_CHANGES });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        full_name: "Cheran",
        gender: "FEMALE",
        dob: "1995-04-12",
      });
    });
  });

  it("handles mutation failure and shows toast error", async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error("Update service unavailable"));

    mockUseCustomerProfile.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof useCustomerProfile>);

    renderWithProviders(<EditProfilePage />);

    const saveButton = screen.getByRole("button", { name: PROFILE_MESSAGES.SAVE_CHANGES });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Update service unavailable");
    });
  });

  it("navigates back to profile on cancel button click", async () => {
    mockUseCustomerProfile.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof useCustomerProfile>);

    renderWithProviders(<EditProfilePage />);

    const cancelButton = screen.getByRole("button", { name: PROFILE_MESSAGES.CANCEL });
    fireEvent.click(cancelButton);

    expect(await screen.findByText("Profile View Page Target")).toBeInTheDocument();
  });
});
