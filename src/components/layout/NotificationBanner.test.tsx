import { fireEvent, render, screen } from "@testing-library/react";
import { NotificationBanner } from "./NotificationBanner";

let mockIsAuthenticated = true;
jest.mock("@/features/auth/store/auth.store", () => ({
  useAuthStore: (selector: (state: { isAuthenticated: boolean }) => boolean) =>
    selector({ isAuthenticated: mockIsAuthenticated }),
}));

describe("NotificationBanner", () => {
  const defaultProps = {
    permission: "default" as const,
    enableNotifications: jest.fn().mockResolvedValue(true),
    isSupported: true,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated = true;
  });

  it("does not render when user is not authenticated", () => {
    mockIsAuthenticated = false;
    const { container } = render(<NotificationBanner {...defaultProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("does not render when notifications are unsupported", () => {
    const { container } = render(<NotificationBanner {...defaultProps} isSupported={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("does not render when permission is already granted", () => {
    const { container } = render(<NotificationBanner {...defaultProps} permission="granted" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders opt-in banner when permission is default", () => {
    render(<NotificationBanner {...defaultProps} />);

    expect(screen.getByText("Get real-time updates!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enable" })).toBeInTheDocument();
  });

  it("triggers enableNotifications when Enable button is clicked", () => {
    render(<NotificationBanner {...defaultProps} />);

    const enableButton = screen.getByRole("button", { name: "Enable" });
    fireEvent.click(enableButton);

    expect(defaultProps.enableNotifications).toHaveBeenCalledTimes(1);
  });

  it("renders warning banner when notifications are blocked (denied)", () => {
    render(<NotificationBanner {...defaultProps} permission="denied" />);

    expect(screen.getByText("Notifications are blocked.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Enable" })).not.toBeInTheDocument();
  });

  it("dismisses banner when close button is clicked", () => {
    const { container } = render(<NotificationBanner {...defaultProps} />);

    const dismissButton = screen.getByRole("button", { name: "Dismiss banner" });
    fireEvent.click(dismissButton);

    expect(container).toBeEmptyDOMElement();
  });
});
