import { fireEvent, render, screen } from "@testing-library/react";
import { SkippedBanner } from "./SkippedBanner";

describe("SkippedBanner", () => {
  it("renders reason, updated position, and dismisses when close button is clicked", () => {
    render(<SkippedBanner reason="Guests stepped away" position={4} />);

    expect(screen.getByText("Party Skipped")).toBeInTheDocument();
    expect(screen.getByText(/Guests stepped away/i)).toBeInTheDocument();
    expect(screen.getByText(/You have been moved to position #4 in line/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /dismiss banner/i }));
    expect(screen.queryByText("Party Skipped")).not.toBeInTheDocument();
  });

  it("renders default copy when reason and position are omitted", () => {
    render(<SkippedBanner />);

    expect(
      screen.getByText(/Your turn was temporarily passed by restaurant staff/i),
    ).toBeInTheDocument();
  });
});
