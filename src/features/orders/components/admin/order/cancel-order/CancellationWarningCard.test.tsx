import { render, screen } from "@testing-library/react";
import { CANCEL_ORDER_MESSAGES } from "@/features/orders/constants/cancel-order.constants";
import { CancellationWarningCard } from "./CancellationWarningCard";

describe("CancellationWarningCard", () => {
  it("renders warning title, body, and refund notice correctly", () => {
    render(<CancellationWarningCard />);

    expect(
      screen.getByRole("region", { name: CANCEL_ORDER_MESSAGES.WARNING_TITLE }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("cancellation-warning-title")).toHaveTextContent(
      CANCEL_ORDER_MESSAGES.WARNING_TITLE,
    );
    expect(screen.getByTestId("cancellation-warning-body")).toHaveTextContent(
      CANCEL_ORDER_MESSAGES.WARNING_BODY,
    );
    expect(screen.getByTestId("cancellation-refund-info")).toHaveTextContent(
      CANCEL_ORDER_MESSAGES.WARNING_REFUND_INFO,
    );
  });
});
