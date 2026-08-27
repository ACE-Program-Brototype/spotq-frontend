import { fireEvent, render, screen } from "@testing-library/react";
import ConfirmDialog from "./ConfirmDialog";

describe("ConfirmDialog Reusable Component", () => {
  it("renders trigger and opens dialog upon clicking trigger", () => {
    render(
      <ConfirmDialog
        trigger={<button type="button">Open Confirmation</button>}
        title="Delete Item"
        description="Are you sure you want to delete this item?"
        onConfirm={jest.fn()}
      />,
    );

    const triggerBtn = screen.getByRole("button", { name: "Open Confirmation" });
    expect(triggerBtn).toBeInTheDocument();

    fireEvent.click(triggerBtn);

    expect(screen.getByRole("heading", { name: "Delete Item" })).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to delete this item?")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const handleConfirm = jest.fn();

    render(
      <ConfirmDialog
        open
        title="Confirm Action"
        description="Proceed with action?"
        confirmText="Yes, proceed"
        onConfirm={handleConfirm}
      />,
    );

    const confirmBtn = screen.getByRole("button", { name: "Yes, proceed" });
    fireEvent.click(confirmBtn);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is clicked", () => {
    const handleCancel = jest.fn();

    render(
      <ConfirmDialog
        open
        title="Confirm Action"
        description="Proceed with action?"
        cancelText="No, go back"
        onConfirm={jest.fn()}
        onCancel={handleCancel}
      />,
    );

    const cancelBtn = screen.getByRole("button", { name: "No, go back" });
    fireEvent.click(cancelBtn);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("disables buttons and displays loadingText when isLoading is true", () => {
    render(
      <ConfirmDialog
        open
        title="Processing"
        description="Please wait..."
        confirmText="Confirm"
        loadingText="Deleting item…"
        isLoading
        onConfirm={jest.fn()}
      />,
    );

    const confirmBtn = screen.getByRole("button", { name: "Deleting item…" });
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });

    expect(confirmBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();
  });
});
