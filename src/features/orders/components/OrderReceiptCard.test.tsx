import { fireEvent, render, screen } from "@testing-library/react";
import { MOCK_ORDER_RECEIPT } from "../mocks/order-receipt.mock";
import { OrderReceiptCard } from "./OrderReceiptCard";

describe("OrderReceiptCard", () => {
  it("renders header, item list, breakdown, and download trigger", () => {
    const handleDownload = jest.fn();
    render(<OrderReceiptCard receipt={MOCK_ORDER_RECEIPT} onDownload={handleDownload} />);

    expect(screen.getByTestId("receipt-header")).toBeInTheDocument();
    expect(screen.getByTestId("receipt-items-container")).toBeInTheDocument();
    expect(screen.getByTestId("receipt-bill-breakdown")).toBeInTheDocument();

    const downloadButton = screen.getByTestId("download-receipt-button");
    expect(downloadButton).toBeInTheDocument();

    fireEvent.click(downloadButton);
    expect(handleDownload).toHaveBeenCalledTimes(1);
  });
});
