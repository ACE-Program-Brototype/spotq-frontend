import { render, screen } from "@testing-library/react";
import { MOCK_ORDER_RECEIPT } from "../mocks/order-receipt.mock";
import { OrderReceiptCard } from "./OrderReceiptCard";

describe("OrderReceiptCard", () => {
  it("renders header, item list, and bill breakdown", () => {
    render(<OrderReceiptCard receipt={MOCK_ORDER_RECEIPT} />);

    expect(screen.getByTestId("receipt-header")).toBeInTheDocument();
    expect(screen.getByTestId("receipt-items-container")).toBeInTheDocument();
    expect(screen.getByTestId("receipt-bill-breakdown")).toBeInTheDocument();
  });
});
