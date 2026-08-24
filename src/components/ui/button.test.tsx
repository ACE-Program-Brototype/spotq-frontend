import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button UI Component", () => {
  it("renders with default properties and text", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Action</Button>);
    fireEvent.click(screen.getByRole("button", { name: /action/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant and size classes", () => {
    const { container } = render(
      <Button variant="destructive" size="sm">
        Delete
      </Button>,
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-destructive/10");
    expect(button).toHaveClass("text-destructive");
  });

  it("is disabled when disabled prop is provided", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button", { name: /disabled button/i });
    expect(button).toBeDisabled();
  });
});
