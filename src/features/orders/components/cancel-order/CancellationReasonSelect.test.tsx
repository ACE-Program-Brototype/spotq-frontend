import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CANCEL_ORDER_REASON_OPTIONS,
  CANCEL_ORDER_REASONS,
  MAX_CANCELLATION_NOTE_LENGTH,
} from "@/features/orders/constants/cancel-order.constants";
import { CancellationReasonSelect } from "./CancellationReasonSelect";

describe("CancellationReasonSelect", () => {
  it("renders all predefined reason options", () => {
    render(
      <CancellationReasonSelect
        selectedReason={null}
        onReasonChange={jest.fn()}
        note=""
        onNoteChange={jest.fn()}
      />,
    );

    for (const option of CANCEL_ORDER_REASON_OPTIONS) {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    }
    expect(screen.queryByTestId("cancellation-note-input")).not.toBeInTheDocument();
  });

  it("calls onReasonChange when a reason is selected", async () => {
    const user = userEvent.setup();
    const onReasonChange = jest.fn();

    render(
      <CancellationReasonSelect
        selectedReason={null}
        onReasonChange={onReasonChange}
        note=""
        onNoteChange={jest.fn()}
      />,
    );

    const firstOption = screen.getByLabelText(CANCEL_ORDER_REASON_OPTIONS[0].label);
    await user.click(firstOption);

    expect(onReasonChange).toHaveBeenCalledWith(CANCEL_ORDER_REASON_OPTIONS[0].value);
  });

  it("reveals freeform note textarea with character counter when 'OTHER' is selected", async () => {
    const onNoteChange = jest.fn();

    render(
      <CancellationReasonSelect
        selectedReason={CANCEL_ORDER_REASONS.OTHER}
        onReasonChange={jest.fn()}
        note="Initial note"
        onNoteChange={onNoteChange}
      />,
    );

    const textarea = screen.getByTestId("cancellation-note-input");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("Initial note");
    expect(screen.getByTestId("note-character-counter")).toHaveTextContent(
      `12 / ${MAX_CANCELLATION_NOTE_LENGTH}`,
    );

    fireEvent.change(textarea, { target: { value: "Updated note message" } });
    expect(onNoteChange).toHaveBeenCalledWith("Updated note message");
  });

  it("disables all inputs when disabled prop is true", () => {
    render(
      <CancellationReasonSelect
        selectedReason={CANCEL_ORDER_REASONS.OTHER}
        onReasonChange={jest.fn()}
        note=""
        onNoteChange={jest.fn()}
        disabled={true}
      />,
    );

    for (const option of CANCEL_ORDER_REASON_OPTIONS) {
      expect(screen.getByLabelText(option.label)).toBeDisabled();
    }
    expect(screen.getByTestId("cancellation-note-input")).toBeDisabled();
  });
});
