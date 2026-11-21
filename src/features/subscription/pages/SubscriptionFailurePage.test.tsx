import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { SUBSCRIPTION_FAILURE_TEXTS } from "@/features/subscription/constants/subscription.constants";
import SubscriptionFailurePage from "./SubscriptionFailurePage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SubscriptionFailurePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponentWithState = (initialState?: Record<string, unknown>) =>
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/restaurant/subscription/failure",
            state: initialState,
          },
        ]}
      >
        <Routes>
          <Route path="/restaurant/subscription/failure" element={<SubscriptionFailurePage />} />
        </Routes>
      </MemoryRouter>,
    );

  it("renders failure title, badge, and custom error message from location state", () => {
    renderComponentWithState({
      errorMessage: "Bank server timed out",
    });

    expect(screen.getByText(SUBSCRIPTION_FAILURE_TEXTS.TITLE)).toBeInTheDocument();
    expect(screen.getByText(SUBSCRIPTION_FAILURE_TEXTS.SUBTITLE)).toBeInTheDocument();
    expect(
      screen.getAllByText(SUBSCRIPTION_FAILURE_TEXTS.FAILED_BADGE).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Bank server timed out")).toBeInTheDocument();
    expect(screen.getByText(SUBSCRIPTION_FAILURE_TEXTS.SUPPORT_NOTE)).toBeInTheDocument();
  });

  it("falls back to default reason when no error message is provided in location state", () => {
    renderComponentWithState(undefined);

    expect(screen.getByText(SUBSCRIPTION_FAILURE_TEXTS.TITLE)).toBeInTheDocument();
    expect(screen.getByText(SUBSCRIPTION_FAILURE_TEXTS.DEFAULT_REASON)).toBeInTheDocument();
  });

  it("navigates to subscription plans when Try Again is clicked", () => {
    renderComponentWithState({
      errorMessage: "Signature verification failed",
    });

    const retryBtn = screen.getByRole("button", {
      name: new RegExp(SUBSCRIPTION_FAILURE_TEXTS.RETRY_BUTTON, "i"),
    });
    fireEvent.click(retryBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/subscription", { replace: true });
  });

  it("navigates back to subscription plans when Back to Plans is clicked", () => {
    renderComponentWithState();

    const backBtn = screen.getByRole("button", {
      name: new RegExp(SUBSCRIPTION_FAILURE_TEXTS.DASHBOARD_BUTTON, "i"),
    });
    fireEvent.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/subscription", { replace: true });
  });
});
