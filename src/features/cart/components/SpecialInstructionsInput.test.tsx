import { fireEvent, render, screen } from "@testing-library/react";
import { SpecialInstructionsInput } from "./SpecialInstructionsInput";

describe("SpecialInstructionsInput component", () => {
  it("renders textarea with label and placeholder", () => {
    render(<SpecialInstructionsInput value="" onChange={jest.fn()} />);

    expect(screen.getByText("Cooking Instructions")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("E.g. Less spicy, crispy, sauce on the side..."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("char-counter")).toHaveTextContent("250 characters remaining");
  });

  it("updates character counter as text changes", () => {
    render(<SpecialInstructionsInput value="No onions please" onChange={jest.fn()} />);

    expect(screen.getByTestId("char-counter")).toHaveTextContent("234 characters remaining");
  });

  it("calls onChange when typing", () => {
    const handleChange = jest.fn();
    render(<SpecialInstructionsInput value="" onChange={handleChange} />);

    const textarea = screen.getByPlaceholderText("E.g. Less spicy, crispy, sauce on the side...");
    fireEvent.change(textarea, { target: { value: "Extra spicy" } });

    expect(handleChange).toHaveBeenCalledWith("Extra spicy");
  });

  it("truncates input exceeding maxLength", () => {
    const handleChange = jest.fn();
    render(<SpecialInstructionsInput value="" onChange={handleChange} maxLength={10} />);

    const textarea = screen.getByPlaceholderText("E.g. Less spicy, crispy, sauce on the side...");
    fireEvent.change(textarea, { target: { value: "1234567890EXTRA" } });

    expect(handleChange).toHaveBeenCalledWith("1234567890");
  });
});
