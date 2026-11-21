import { fireEvent, render, screen } from "@testing-library/react";
import { CustomerPaymentSortSelect } from "./CustomerPaymentSortSelect";

describe("CustomerPaymentSortSelect", () => {
  it("renders with default selected sort option", () => {
    render(<CustomerPaymentSortSelect sortBy="createdAt" sortOrder="desc" onChange={jest.fn()} />);

    const select = screen.getByTestId("customer-payment-sort-select") as HTMLSelectElement;
    expect(select.value).toBe("createdAt:desc");
  });

  it("calls onChange with updated sortBy and sortOrder when user selects another option", () => {
    const handleChange = jest.fn();
    render(
      <CustomerPaymentSortSelect sortBy="createdAt" sortOrder="desc" onChange={handleChange} />,
    );

    const select = screen.getByTestId("customer-payment-sort-select");
    fireEvent.change(select, { target: { value: "amountPaise:desc" } });

    expect(handleChange).toHaveBeenCalledWith("amountPaise", "desc");
  });

  it("disables select when disabled prop is true", () => {
    render(
      <CustomerPaymentSortSelect
        sortBy="createdAt"
        sortOrder="desc"
        onChange={jest.fn()}
        disabled
      />,
    );

    const select = screen.getByTestId("customer-payment-sort-select");
    expect(select).toBeDisabled();
  });
});
