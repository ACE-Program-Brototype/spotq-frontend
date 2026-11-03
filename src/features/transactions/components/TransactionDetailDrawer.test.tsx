import { fireEvent, render, screen } from "@testing-library/react";
import { useTransactionDetail } from "../hooks/useTransactionDetail";
import { TransactionDetailDrawer } from "./TransactionDetailDrawer";

jest.mock("../hooks/useTransactionDetail");

describe("TransactionDetailDrawer", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when transactionId is null", () => {
    (useTransactionDetail as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });

    render(<TransactionDetailDrawer transactionId={null} onClose={mockOnClose} />);
    expect(screen.queryByTestId("transaction-detail-drawer")).not.toBeInTheDocument();
  });

  it("renders loading skeleton when fetching transaction details", () => {
    (useTransactionDetail as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<TransactionDetailDrawer transactionId="tx-123" onClose={mockOnClose} />);
    expect(screen.getByTestId("transaction-drawer-skeleton")).toBeInTheDocument();
  });

  it("renders deep transaction details, customer context, and financial breakdown", () => {
    const mockDetail = {
      id: "tx-123",
      status: "SUCCESS",
      createdAt: "2026-10-27T14:15:00.000Z",
      customer: {
        id: "cust-1",
        name: "Rahul Sharma",
        contact: "•••••• 4821",
        tableNumber: "T-04",
        tokenNumber: "TK-28",
      },
      order: {
        id: "order-1",
        orderNumber: "SQ-98214",
        status: "COMPLETED",
      },
      financialBreakdown: {
        subtotalPaise: 82000,
        subtotalFormatted: "₹820.00",
        gstPaise: 4800,
        gstPercentage: 5,
        gstFormatted: "₹48.00",
        discountPaise: 0,
        discountFormatted: "₹0.00",
        totalPaise: 86800,
        totalFormatted: "₹868.00",
      },
      gateway: {
        name: "Razorpay",
        paymentId: "pay_OEd1m8F05s9jKa",
        orderId: "order_ODZ1k8F05s9jKz",
        method: "UPI",
        vpaOrCard: "rahul@okaxis",
        bankRrn: "429182910291",
        settlementStatus: "PENDING_EOD",
        expectedSettlementDate: "2026-10-28",
      },
      refund: null,
    };

    (useTransactionDetail as jest.Mock).mockReturnValue({
      data: mockDetail,
      isLoading: false,
      isError: false,
    });

    render(<TransactionDetailDrawer transactionId="tx-123" onClose={mockOnClose} />);

    expect(screen.getByText("#SQ-98214")).toBeInTheDocument();
    expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    expect(screen.getByText("•••••• 4821")).toBeInTheDocument();
    expect(screen.getByText("Table T-04 (Token TK-28)")).toBeInTheDocument();
    expect(screen.getByText("₹820.00")).toBeInTheDocument();
    expect(screen.getByText("₹48.00")).toBeInTheDocument();
    expect(screen.getByText("₹868.00")).toBeInTheDocument();
    expect(screen.getByText("pay_OEd1m8F05s9jKa")).toBeInTheDocument();
    expect(screen.getByText("429182910291")).toBeInTheDocument();
  });

  it("closes when close button is clicked", () => {
    (useTransactionDetail as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });

    render(<TransactionDetailDrawer transactionId="tx-123" onClose={mockOnClose} />);

    const closeButton = screen.getByTestId("transaction-drawer-close-button");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("closes when backdrop overlay is clicked", () => {
    (useTransactionDetail as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });

    render(<TransactionDetailDrawer transactionId="tx-123" onClose={mockOnClose} />);

    const backdrop = screen.getByTestId("transaction-drawer-backdrop");
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("closes when Escape key is pressed", () => {
    (useTransactionDetail as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });

    render(<TransactionDetailDrawer transactionId="tx-123" onClose={mockOnClose} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
