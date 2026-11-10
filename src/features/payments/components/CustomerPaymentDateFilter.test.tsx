import { fireEvent, render, screen } from "@testing-library/react";
import { CustomerPaymentDateFilter } from "./CustomerPaymentDateFilter";

describe("CustomerPaymentDateFilter", () => {
  it("renders from and to date inputs", () => {
    render(
      <CustomerPaymentDateFilter
        startDate=""
        endDate=""
        onStartDateChange={jest.fn()}
        onEndDateChange={jest.fn()}
        onClear={jest.fn()}
      />,
    );

    expect(screen.getByTestId("payment-start-date-input")).toBeInTheDocument();
    expect(screen.getByTestId("payment-end-date-input")).toBeInTheDocument();
    expect(screen.queryByTestId("clear-date-filter-button")).not.toBeInTheDocument();
  });

  it("calls onStartDateChange when user inputs a start date", () => {
    const handleStartChange = jest.fn();
    render(
      <CustomerPaymentDateFilter
        startDate=""
        endDate=""
        onStartDateChange={handleStartChange}
        onEndDateChange={jest.fn()}
        onClear={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByTestId("payment-start-date-input"), {
      target: { value: "2026-11-01" },
    });

    expect(handleStartChange).toHaveBeenCalledWith("2026-11-01");
  });

  it("calls onEndDateChange when user inputs an end date", () => {
    const handleEndChange = jest.fn();
    render(
      <CustomerPaymentDateFilter
        startDate="2026-11-01"
        endDate=""
        onStartDateChange={jest.fn()}
        onEndDateChange={handleEndChange}
        onClear={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByTestId("payment-end-date-input"), {
      target: { value: "2026-11-06" },
    });

    expect(handleEndChange).toHaveBeenCalledWith("2026-11-06");
  });

  it("shows Clear button when a date is selected and calls onClear on click", () => {
    const handleClear = jest.fn();
    render(
      <CustomerPaymentDateFilter
        startDate="2026-11-01"
        endDate="2026-11-06"
        onStartDateChange={jest.fn()}
        onEndDateChange={jest.fn()}
        onClear={handleClear}
      />,
    );

    const clearBtn = screen.getByTestId("clear-date-filter-button");
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
