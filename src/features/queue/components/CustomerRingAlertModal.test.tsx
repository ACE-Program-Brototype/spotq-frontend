import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ringMedia } from "../utils/ring-sound.utils";
import { CustomerRingAlertModal } from "./CustomerRingAlertModal";

jest.mock("../utils/ring-sound.utils", () => ({
  ringMedia: {
    playChime: jest.fn(),
    playAlarmSound: jest.fn(),
    triggerVibration: jest.fn(),
    stopVibration: jest.fn(),
    stopSound: jest.fn(),
    stopAll: jest.fn(),
  },
}));

describe("CustomerRingAlertModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(<CustomerRingAlertModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("renders modal with header and default message when open", () => {
    render(<CustomerRingAlertModal {...defaultProps} />);

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Your Table is Ready!")).toBeInTheDocument();
    expect(
      screen.getByText("Your table is ready! Please proceed to the host desk now to be seated."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /I'm Heading Over/i })).toBeInTheDocument();
  });

  it("displays custom message and ticket display number", () => {
    render(
      <CustomerRingAlertModal
        {...defaultProps}
        message="Host John is waiting for your party at the front entrance."
        queueNumber="Q-042"
      />,
    );

    expect(
      screen.getByText("Host John is waiting for your party at the front entrance."),
    ).toBeInTheDocument();
    expect(screen.getByText(/Ticket Q-042/i)).toBeInTheDocument();
  });

  it("displays multiple assigned table tags", () => {
    render(<CustomerRingAlertModal {...defaultProps} assignedTableIds={["Table 4", "Table 5"]} />);

    expect(screen.getByText(/Assigned Tables/i)).toBeInTheDocument();
    expect(screen.getByText("Table 4")).toBeInTheDocument();
    expect(screen.getByText("Table 5")).toBeInTheDocument();
  });

  it("displays ring count badge when ringCount > 1", () => {
    render(<CustomerRingAlertModal {...defaultProps} ringCount={3} />);

    expect(screen.getByText("Call #3 from Host")).toBeInTheDocument();
  });

  it("calls onClose and stops vibration when clicking I'm Heading Over", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(<CustomerRingAlertModal {...defaultProps} onClose={onClose} />);

    const confirmButton = screen.getByRole("button", { name: /I'm Heading Over/i });
    await user.click(confirmButton);

    expect(ringMedia.stopAll).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("dismisses on Escape key press", () => {
    const onClose = jest.fn();

    render(<CustomerRingAlertModal {...defaultProps} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(ringMedia.stopAll).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
