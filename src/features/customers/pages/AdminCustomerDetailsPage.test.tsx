import { fireEvent, render, screen } from "@testing-library/react";
import { CUSTOMER_STATUS } from "../constants/customer.constants";
import { useCustomerDetails, useUpdateCustomerStatus } from "../hooks/use-customers";
import { AdminCustomerDetailsPage } from "./AdminCustomerDetailsPage";

const mockNavigate = jest.fn();
let mockParams = { id: "cust-123" };

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

jest.mock("../hooks/use-customers", () => ({
  useCustomerDetails: jest.fn(),
  useUpdateCustomerStatus: jest.fn(),
}));

const mockCustomer = {
  id: "cust-123",
  fullName: "Alice Smith",
  email: "alice@example.com",
  status: CUSTOMER_STATUS.ACTIVE,
  phone: "+1234567890",
  isEmailVerified: true,
  avatarUrl: null,
  createdAt: "2026-01-15T10:00:00Z",
  updatedAt: "2026-01-15T10:00:00Z",
};

describe("AdminCustomerDetailsPage", () => {
  const mockMutateAsync = jest.fn();
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: "cust-123" };

    (useUpdateCustomerStatus as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  it("should render loading skeleton when isLoading is true", () => {
    (useCustomerDetails as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<AdminCustomerDetailsPage />);

    expect(screen.getByTestId("customer-details-skeleton")).toBeInTheDocument();
  });

  it("should render customer profile details when API call succeeds", () => {
    (useCustomerDetails as jest.Mock).mockReturnValue({
      data: mockCustomer,
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<AdminCustomerDetailsPage />);

    expect(screen.getByTestId("customer-name")).toHaveTextContent("Alice Smith");
    expect(screen.getByTestId("customer-email")).toHaveTextContent("alice@example.com");
    expect(screen.getByTestId("customer-details-id")).toHaveTextContent("cust-123");
    expect(screen.getByTestId("customer-status-badge")).toHaveTextContent("ACTIVE");
    expect(screen.queryByTestId("customer-block-btn")).not.toBeInTheDocument();
  });

  it("should navigate back to /admin/customers when back button is clicked", () => {
    (useCustomerDetails as jest.Mock).mockReturnValue({
      data: mockCustomer,
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<AdminCustomerDetailsPage />);

    const backButton = screen.getByTestId("customer-details-back-btn");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/admin/customers");
  });

  it("should render error state when API call fails with generic error", () => {
    (useCustomerDetails as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error("Network error"),
      refetch: mockRefetch,
    });

    render(<AdminCustomerDetailsPage />);

    expect(screen.getByTestId("admin-customer-details-error")).toBeInTheDocument();
    expect(screen.getByText("Failed to load customer details")).toBeInTheDocument();
  });

  it("should render 404 state when API returns 404 status error", () => {
    (useCustomerDetails as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { status: 404 },
      refetch: mockRefetch,
    });

    render(<AdminCustomerDetailsPage />);

    expect(screen.getByTestId("admin-customer-details-not-found")).toBeInTheDocument();
    expect(screen.getByText("Customer Not Found")).toBeInTheDocument();
  });
});
