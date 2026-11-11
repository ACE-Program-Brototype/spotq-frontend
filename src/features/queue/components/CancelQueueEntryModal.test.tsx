import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { StaffLiveQueueEntry } from "../types/queue.types";
import { CancelQueueEntryModal } from "./CancelQueueEntryModal";

describe("CancelQueueEntryModal", () => {
  const mockEntry: StaffLiveQueueEntry = {
    queueEntryId: "entry-cancel-1",
    queueNumber: "Q-011",
    position: 3,
    guestName: "Robert Downey",
    guestPhone: "+919876543210",
    partySize: 2,
    registrationType: "ONLINE",
    status: "WAITING",
    joinedAt: new Date().toISOString(),
    ringCount: 2,
    lastRingAt: new Date().toISOString(),
    responseDeadline: null,
    waitDurationMinutes: 25,
  };

  it("does not render when closed or queueEntry is null", () => {
    const { container } = render(
      <CancelQueueEntryModal
        isOpen={false}
        onClose={jest.fn()}
        queueEntry={mockEntry}
        onConfirm={jest.fn()}
        isSubmitting={false}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders with default NO_SHOW reason and submits reason with optional notes", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    render(
      <CancelQueueEntryModal
        isOpen={true}
        onClose={onClose}
        queueEntry={mockEntry}
        onConfirm={onConfirm}
        isSubmitting={false}
        initialReason="NO_SHOW"
      />,
    );

    expect(screen.getByText("Mark as No-Show")).toBeInTheDocument();
    expect(screen.getByText(/Robert Downey/i)).toBeInTheDocument();

    // Type notes
    await user.type(screen.getByTestId("cancel-notes-input"), "Customer didn't respond to 2 rings");

    // Click confirm
    await user.click(screen.getByTestId("confirm-cancel-button"));

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith("NO_SHOW", "Customer didn't respond to 2 rings");
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("allows selecting a different cancellation reason like GUEST_CANCELLED", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    render(
      <CancelQueueEntryModal
        isOpen={true}
        onClose={onClose}
        queueEntry={mockEntry}
        onConfirm={onConfirm}
        isSubmitting={false}
        initialReason="NO_SHOW"
      />,
    );

    await user.click(screen.getByLabelText("Guest Cancelled"));
    expect(screen.getByText("Cancel Queue Entry")).toBeInTheDocument();

    await user.click(screen.getByTestId("confirm-cancel-button"));

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith("GUEST_CANCELLED", undefined);
      expect(onClose).toHaveBeenCalled();
    });
  });
});
