import { render, screen } from "@testing-library/react";
import { MOCK_ORDER_RECEIPT } from "../mocks/order-receipt.mock";
import { ReceiptBillBreakdown } from "./ReceiptBillBreakdown";

describe("ReceiptBillBreakdown", () => {
  it("renders subtotal, tax, platform fee, and total amount accurately", () => {
    render(<ReceiptBillBreakdown receipt={MOCK_ORDER_RECEIPT} />);

    expect(screen.getByTestId("receipt-subtotal")).toHaveTextContent("820");
    expect(screen.getByTestId("receipt-tax")).toHaveTextContent("41");
    expect(screen.getByTestId("receipt-platform-fee")).toHaveTextContent("2");
    expect(screen.getByTestId("receipt-total")).toHaveTextContent("863");
  });
});
