import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {
  RestaurantStatusData,
  SubscriptionPlan,
} from "@/features/subscription/types/subscription.types";
import { SubscriptionOverviewCard } from "./SubscriptionOverviewCard";

const FIXED_NOW = new Date("2026-11-01T10:00:00.000Z");

const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: "plan-1",
    code: "QUEUE_PRO",
    name: "Queue Pro",
    pricePaise: 149900,
    priceInRupees: 1499,
    currency: "INR",
    billingCycle: "MONTHLY",
    features: [],
  },
];

function buildStatus(endIso: string, active = true): RestaurantStatusData {
  return {
    restaurantId: "rest-1",
    restaurantName: "SpotQ Bistro",
    verificationStatus: "APPROVED",
    isSubscriptionActive: active,
    subscriptionPlanCode: "QUEUE_PRO",
    subscriptionEndsAt: endIso,
    navigationTarget: "/restaurant/dashboard",
    subscription: {
      id: "sub-1",
      status: active ? "ACTIVE" : "EXPIRED",
      planCode: "QUEUE_PRO",
      planName: "Queue Pro",
      currentPeriodStart: "2026-10-01T10:00:00.000Z",
      currentPeriodEnd: endIso,
    },
  };
}

describe("SubscriptionOverviewCard", () => {
  it("renders loading skeleton while status is loading", () => {
    render(
      <SubscriptionOverviewCard
        isLoading
        onRenewClick={jest.fn()}
        onSubscribeClick={jest.fn()}
        now={FIXED_NOW}
      />,
    );

    expect(screen.getByTestId("subscription-overview-card-loading")).toBeInTheDocument();
  });

  it("enables Renew Now when subscription is within 30 days of expiry", async () => {
    const user = userEvent.setup();
    const onRenewClick = jest.fn();

    render(
      <SubscriptionOverviewCard
        statusData={buildStatus("2026-11-20T10:00:00.000Z")}
        plans={MOCK_PLANS}
        onRenewClick={onRenewClick}
        onSubscribeClick={jest.fn()}
        now={FIXED_NOW}
      />,
    );

    expect(screen.getByText("Queue Pro")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();

    const renewBtn = screen.getByTestId("overview-renew-button");
    expect(renewBtn).not.toBeDisabled();

    await user.click(renewBtn);
    expect(onRenewClick).toHaveBeenCalledTimes(1);
  });

  it("disables manual renewal and displays accessible tooltip on focus and touch/click when > 30 days remain", async () => {
    const user = userEvent.setup();
    const onRenewClick = jest.fn();

    render(
      <SubscriptionOverviewCard
        statusData={buildStatus("2026-12-25T10:00:00.000Z")}
        plans={MOCK_PLANS}
        onRenewClick={onRenewClick}
        onSubscribeClick={jest.fn()}
        now={FIXED_NOW}
      />,
    );

    const renewBtn = screen.getByTestId("overview-renew-button");
    expect(renewBtn).toHaveAttribute("aria-disabled", "true");

    fireEvent.focus(renewBtn);
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Renewal opens 30 days prior to expiration",
    );

    fireEvent.blur(renewBtn);

    await user.click(renewBtn);
    expect(onRenewClick).not.toHaveBeenCalled();
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Renewal opens 30 days prior to expiration",
    );
  });
});
