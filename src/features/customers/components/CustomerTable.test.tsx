import { fireEvent, render, screen } from "@testing-library/react";
import type { Customer } from "../types/customer.types";
import { CustomerTable } from "./CustomerTable";

const mockCustomers: Customer[] = [
  {
    id: "user-1",
    fullName: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    status: "ACTIVE",
    isEmailVerified: true,
    avatarUrl: null,
    createdAt: "2023-01-15T10:00:00.000Z",
    updatedAt: "2023-01-15T10:00:00.000Z",
    location: "New Delhi, India",
  },
  {
    id: "user-2",
    fullName: "Sneha Reddy",
    email: "sneha.r@outlook.com",
    phone: "+91 77665 54433",
    status: "BLOCKED",
    isEmailVerified: true,
    avatarUrl: null,
    createdAt: "2023-05-20T10:00:00.000Z",
    updatedAt: "2023-05-20T10:00:00.000Z",
    location: "Hyderabad, India",
  },
];

describe("CustomerTable", () => {
  it("should render table headers and customer rows", () => {
    render(<CustomerTable customers={mockCustomers} />);

    expect(screen.getByText("USER PROFILE")).toBeInTheDocument();
    expect(screen.getByText("CONTACT INFO")).toBeInTheDocument();
    expect(screen.queryByText("LOCATION")).not.toBeInTheDocument();
    expect(screen.getByText("STATUS")).toBeInTheDocument();
    expect(screen.getByText("ACTIONS")).toBeInTheDocument();

    expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    expect(screen.getByText("rahul.sharma@example.com")).toBeInTheDocument();
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();

    expect(screen.getByText("Sneha Reddy")).toBeInTheDocument();
    expect(screen.getByText("sneha.r@outlook.com")).toBeInTheDocument();
    expect(screen.getByText("BLOCKED")).toBeInTheDocument();
  });

  it("should call onStatusAction when action button is clicked", () => {
    const handleStatusAction = jest.fn();
    render(<CustomerTable customers={mockCustomers} onStatusAction={handleStatusAction} />);

    const blockButton = screen.getByRole("button", {
      name: "Block Customer for Rahul Sharma",
    });
    fireEvent.click(blockButton);
    expect(handleStatusAction).toHaveBeenCalledWith(mockCustomers[0], "BLOCKED");

    const unblockButton = screen.getByRole("button", {
      name: "Unblock Customer for Sneha Reddy",
    });
    fireEvent.click(unblockButton);
    expect(handleStatusAction).toHaveBeenCalledWith(mockCustomers[1], "ACTIVE");
  });
});
