import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { StaffLiveQueueEntry } from "../types/queue.types";
import { SkipQueueEntryModal } from "./SkipQueueEntryModal";

describe("SkipQueueEntryModal", () => {
  const mockEntry: StaffLiveQueueEntry = {
    queueEntryId: "entry-skip-1",
    queueNumber: "Q-010",
    position: 2,
    guestName: "Emma Stone",
    guestPhone: "+919876543210",
    partySize: 3,
    registrationType: "WALK_IN",
    status: "WAITING",
    joinedAt: new Date().toISOString(),
    ringCount: 0,
    lastRingAt: null,
    responseDeadline: null,
    waitDurationMinutes: 12,
  };

  it("does not render when closed or queueEntry is null", () => {
    const { container } = render(
      <SkipQueueEntryModal
        isOpen={false}
        onClose={jest.fn()}
        queueEntry={mockEntry}
        onConfirm={jest.fn()}
        isSubmitting={false}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders entry details and submits selected skip positions and reason", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    render(
      <SkipQueueEntryModal
        isOpen={true}
        onClose={onClose}
        queueEntry={mockEntry}
        onConfirm={onConfirm}
        isSubmitting={false}
      />,
    );

    expect(screen.getByText("Skip Party in Queue")).toBeInTheDocument();
    expect(screen.getByText("Emma Stone")).toBeInTheDocument();

    // Select 3 spots
    await user.click(screen.getByRole("button", { name: "+3 Spots" }));

    // Select preset reason
    await user.click(screen.getByText("Party incomplete / waiting for members"));

    // Submit
    await user.click(screen.getByTestId("confirm-skip-button"));

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith(3, "Party incomplete / waiting for members");
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("validates that reason is required before submission", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <SkipQueueEntryModal
        isOpen={true}
        onClose={jest.fn()}
        queueEntry={mockEntry}
        onConfirm={onConfirm}
        isSubmitting={false}
      />,
    );

    await user.click(screen.getByTestId("confirm-skip-button"));

    expect(
      screen.getByText("Please select or enter a reason for skipping this party."),
    ).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
