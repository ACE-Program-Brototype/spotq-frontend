import { fireEvent, render, screen } from "@testing-library/react";
import { DownloadInvoiceButton } from "@/features/subscription/components/DownloadInvoiceButton";

describe("DownloadInvoiceButton", () => {
  const originalOpen = window.open;

  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  it("renders active download button when invoiceUrl is provided", () => {
    render(
      <DownloadInvoiceButton
        invoiceUrl="https://s3.amazonaws.com/test-invoice.pdf"
        invoiceNumber="INV-2026-0001"
      />,
    );

    const button = screen.getByTestId("download-invoice-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Download");
    expect(button).toHaveAttribute("aria-label", "Download tax invoice INV-2026-0001");
  });

  it("opens invoice in a new tab when clicked", () => {
    render(
      <DownloadInvoiceButton
        invoiceUrl="https://s3.amazonaws.com/test-invoice.pdf"
        invoiceNumber="INV-2026-0001"
      />,
    );

    const button = screen.getByTestId("download-invoice-button");
    fireEvent.click(button);

    expect(window.open).toHaveBeenCalledWith(
      "https://s3.amazonaws.com/test-invoice.pdf",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("renders disabled button when invoiceUrl is null", () => {
    render(<DownloadInvoiceButton invoiceUrl={null} invoiceNumber={null} />);

    const button = screen.getByTestId("download-invoice-button-disabled");
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Unavailable");
  });
});
