import { fireEvent, render, screen } from "@testing-library/react";
import { AdminCustomerDetailsPage } from "./AdminCustomerDetailsPage";

const mockNavigate = jest.fn();
let mockParams = { id: "cust-123" };

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

describe("AdminCustomerDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: "cust-123" };
  });

  it("should render dummy customer details page with customer id", () => {
    render(<AdminCustomerDetailsPage />);

    expect(screen.getAllByText("Customer Details")).toHaveLength(2);
    expect(screen.getByText("In Development")).toBeInTheDocument();
    expect(screen.getByTestId("customer-details-dummy-text")).toBeInTheDocument();
    expect(screen.getByText("This is a dummy customer details page.")).toBeInTheDocument();
    expect(screen.getByTestId("customer-details-id")).toHaveTextContent("cust-123");
  });

  it("should navigate back to /admin/customers when back button is clicked", () => {
    render(<AdminCustomerDetailsPage />);

    const backButton = screen.getByTestId("customer-details-back-btn");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/admin/customers");
  });
});
