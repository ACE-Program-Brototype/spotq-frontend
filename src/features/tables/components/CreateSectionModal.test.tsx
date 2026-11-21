import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateSectionModal } from "./CreateSectionModal";

describe("CreateSectionModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(<CreateSectionModal isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.queryByText("Create Table Section")).not.toBeInTheDocument();
  });

  it("renders modal inputs when isOpen is true", () => {
    render(<CreateSectionModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.getByText("Create Table Section")).toBeInTheDocument();
    expect(screen.getByLabelText(/Section Name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Section" })).toBeDisabled();
  });

  it("enables submit button only when valid input is entered", async () => {
    const user = userEvent.setup();
    render(<CreateSectionModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText(/Section Name/i);
    await user.type(input, "Patio Area");

    const submitBtn = screen.getByRole("button", { name: "Create Section" });
    expect(submitBtn).toBeEnabled();
  });

  it("calls onSubmit with trimmed name and closes on success", async () => {
    mockOnSubmit.mockResolvedValue(true);
    const user = userEvent.setup();

    render(<CreateSectionModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText(/Section Name/i);
    await user.type(input, "  Rooftop Dining  ");

    const submitBtn = screen.getByRole("button", { name: "Create Section" });
    await user.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalledWith("Rooftop Dining");
    expect(mockOnClose).toHaveBeenCalled();
  });
});
