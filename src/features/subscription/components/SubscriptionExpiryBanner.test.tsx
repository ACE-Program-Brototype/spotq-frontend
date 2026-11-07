import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { RestaurantStatusData } from "@/features/subscription/types/subscription.types";
import { SubscriptionExpiryBanner } from "./SubscriptionExpiryBanner";

const FIXED_NOW = new Date("2026-11-01T10:00:00.000Z");

function createStatus(endIso: string | null, active = true): RestaurantStatusData {
  return {
    restaurantId: "rest-1",
    restaurantName: "SpotQ Bistro",
    verificationStatus: "APPROVED",
    isSubscriptionActive: active,
    subscriptionPlanCode: "QUEUE_PRO",
    subscriptionEndsAt: endIso,
    navigationTarget: "/restaurant/dashboard",
    subscription: endIso
      ? {
          id: "sub-1",
          status: active ? "ACTIVE" : "EXPIRED",
          planCode: "QUEUE_PRO",
          planName: "Queue Pro",
          currentPeriodStart: "2026-10-05T10:00:00.000Z",
          currentPeriodEnd: endIso,
        }
      : null,
  };
}

describe("SubscriptionExpiryBanner", () => {
  it("renders expired banner and badge when subscription is expired", async () => {
    const user = userEvent.setup();
    const onRenewClick = jest.fn();

    render(
      <SubscriptionExpiryBanner
        statusData={createStatus("2026-10-25T10:00:00.000Z", false)}
        onRenewClick={onRenewClick}
        now={FIXED_NOW}
      />,
    );

    expect(screen.getByTestId("subscription-expiry-banner")).toBeInTheDocument();
    expect(screen.getByText("Subscription Expired")).toBeInTheDocument();
    expect(screen.getByText("Expired")).toBeInTheDocument();
    expect(screen.getByText(/Your Queue Pro subscription has expired/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Renew Now" }));
    expect(onRenewClick).toHaveBeenCalledTimes(1);
  });

  it("renders remaining days and calls onRenewClick when 7 or fewer days remain", async () => {
    const user = userEvent.setup();
    const onRenewClick = jest.fn();

    render(
      <SubscriptionExpiryBanner
        statusData={createStatus("2026-11-04T10:00:00.000Z")}
        onRenewClick={onRenewClick}
        now={FIXED_NOW}
      />,
    );

    expect(screen.getByTestId("subscription-expiry-banner")).toBeInTheDocument();
    expect(screen.getByText("Subscription Expiring Soon")).toBeInTheDocument();
    expect(screen.getByText("3 days remaining")).toBeInTheDocument();
    expect(screen.getByText(/Your Queue Pro subscription expires in 3 days/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Renew Now" }));
    expect(onRenewClick).toHaveBeenCalledTimes(1);
  });

  it("renders expires today copy when 0 days remain", () => {
    render(
      <SubscriptionExpiryBanner
        statusData={createStatus("2026-11-01T10:00:00.000Z")}
        onRenewClick={jest.fn()}
        now={FIXED_NOW}
      />,
    );

    expect(screen.getByText("Expires today")).toBeInTheDocument();
    expect(screen.getByText(/Your Queue Pro subscription expires today/i)).toBeInTheDocument();
  });

  it("does not render when more than 7 days remain", () => {
    const { container } = render(
      <SubscriptionExpiryBanner
        statusData={createStatus("2026-11-12T10:00:00.000Z")}
        onRenewClick={jest.fn()}
        now={FIXED_NOW}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("does not render during loading, API error, or missing subscription data", () => {
    const validSoon = createStatus("2026-11-03T10:00:00.000Z");

    const { rerender, container } = render(
      <SubscriptionExpiryBanner
        statusData={validSoon}
        isLoading
        onRenewClick={jest.fn()}
        now={FIXED_NOW}
      />,
    );
    expect(container).toBeEmptyDOMElement();

    rerender(
      <SubscriptionExpiryBanner
        statusData={validSoon}
        isError
        onRenewClick={jest.fn()}
        now={FIXED_NOW}
      />,
    );
    expect(container).toBeEmptyDOMElement();

    rerender(
      <SubscriptionExpiryBanner statusData={null} onRenewClick={jest.fn()} now={FIXED_NOW} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
