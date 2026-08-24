import { fireEvent, render, screen } from "@testing-library/react";
import { Input } from "./input";

describe("Input UI Component", () => {
  it("renders with given placeholder and type", () => {
    render(<Input type="email" placeholder="Enter your email" />);
    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("data-slot", "input");
  });

  it("handles value change events", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} placeholder="Type here" />);
    const input = screen.getByPlaceholderText("Type here");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText("Disabled input");
    expect(input).toBeDisabled();
  });
});
