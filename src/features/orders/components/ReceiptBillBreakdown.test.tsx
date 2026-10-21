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
    expect(screen.getByText("Taxes & GST")).toBeInTheDocument();
  });

  it("renders dynamic tax percentage when tax_rate is present", () => {
    render(
      <ReceiptBillBreakdown
        receipt={{
          ...MOCK_ORDER_RECEIPT,
          tax_rate: 5,
        }}
      />,
    );

    expect(screen.getByText("Taxes & GST (5%)")).toBeInTheDocument();
  });

  it("triggers window.print when download button is clicked", () => {
    const printSpy = jest.spyOn(window, "print").mockImplementation(() => {});

    render(<ReceiptBillBreakdown receipt={MOCK_ORDER_RECEIPT} />);

    const downloadButton = screen.getByTestId("receipt-download-button");
    expect(downloadButton).toBeInTheDocument();
    downloadButton.click();

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });
});
