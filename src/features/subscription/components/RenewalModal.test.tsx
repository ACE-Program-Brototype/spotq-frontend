import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { subscriptionService } from "@/features/subscription/services/subscription.service";
import type {
  RestaurantStatusData,
  SubscriptionPlan,
} from "@/features/subscription/types/subscription.types";
import { RenewalModal } from "./RenewalModal";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("@/features/subscription/services/subscription.service", () => ({
  subscriptionService: {
    renewSubscription: jest.fn(),
    verifyPayment: jest.fn(),
  },
}));

const FIXED_NOW = new Date("2026-10-28T12:00:00.000Z");

const MOCK_STATUS: RestaurantStatusData = {
  restaurantId: "rest-1",
  restaurantName: "SpotQ Kitchen",
  verificationStatus: "APPROVED",
  isSubscriptionActive: true,
  subscriptionPlanCode: "QUEUE_PRO",
  subscriptionEndsAt: "2026-11-01T12:00:00.000Z",
  navigationTarget: "/restaurant/dashboard",
  subscription: {
    id: "sub-123",
    status: "ACTIVE",
    planCode: "QUEUE_PRO",
    planName: "Queue Pro",
    currentPeriodStart: "2026-10-01T12:00:00.000Z",
    currentPeriodEnd: "2026-11-01T12:00:00.000Z",
  },
};

const BOTH_CYCLE_PLANS: SubscriptionPlan[] = [
  {
    id: "plan-monthly",
    code: "QUEUE_PRO",
    name: "Queue Pro",
    pricePaise: 149900,
    priceInRupees: 1499,
    currency: "INR",
    billingCycle: "MONTHLY",
    features: [],
  },
  {
    id: "plan-yearly",
    code: "QUEUE_PRO_YEARLY",
    name: "Queue Pro",
    pricePaise: 1499000,
    priceInRupees: 14990,
    currency: "INR",
    billingCycle: "YEARLY",
    features: [],
  },
];

function renderModal(props: Partial<React.ComponentProps<typeof RenewalModal>> = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const onOpenChange = props.onOpenChange ?? jest.fn();

  const view = render(
    <QueryClientProvider client={queryClient}>
      <RenewalModal
        open
        onOpenChange={onOpenChange}
        statusData={MOCK_STATUS}
        plans={BOTH_CYCLE_PLANS}
        now={FIXED_NOW}
        {...props}
      />
    </QueryClientProvider>,
  );

  return { ...view, onOpenChange };
}

describe("RenewalModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.Razorpay = jest.fn().mockImplementation(() => ({
      open: jest.fn(),
      on: jest.fn(),
    })) as unknown as typeof window.Razorpay;
  });

  afterEach(() => {
    delete (window as { Razorpay?: unknown }).Razorpay;
  });

  it("displays current plan summary, preselects active cycle, and updates price & term preview on cycle change", async () => {
    const user = userEvent.setup();
    renderModal();

    expect(screen.getByTestId("modal-current-plan")).toHaveTextContent("Queue Pro");
    expect(screen.getByTestId("modal-current-cycle")).toHaveTextContent("Monthly");
    expect(screen.getByTestId("modal-selected-cycle")).toHaveTextContent("Monthly");
    expect(screen.getByTestId("modal-renewal-price")).toHaveTextContent("1,499.00");
    expect(screen.getByTestId("renewal-term-preview-text")).toHaveTextContent(
      "Renews from Nov 1, 2026 to Dec 1, 2026",
    );

    await user.click(screen.getByTestId("cycle-option-yearly"));

    expect(screen.getByTestId("modal-selected-cycle")).toHaveTextContent("Yearly");
    expect(screen.getByTestId("modal-renewal-price")).toHaveTextContent("14,990.00");
    expect(screen.getByTestId("renewal-term-preview-text")).toHaveTextContent(
      "Renews from Nov 1, 2026 to Nov 1, 2027",
    );
  });

  it("disables unsupported cycle option when backend only returns MONTHLY plan", () => {
    renderModal({ plans: [BOTH_CYCLE_PLANS[0]] });

    expect(screen.getByTestId("cycle-option-monthly")).not.toBeDisabled();
    expect(screen.getByTestId("cycle-option-yearly")).toBeDisabled();
    expect(screen.getByText("Not available for this plan")).toBeInTheDocument();
  });

  it("closes modal without initiating renewal when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderModal();

    await user.click(screen.getByTestId("renewal-modal-cancel-button"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(subscriptionService.renewSubscription).not.toHaveBeenCalled();
  });

  it("preserves selected cycle and displays inline error message when renewal initiation fails", async () => {
    const user = userEvent.setup();
    (subscriptionService.renewSubscription as jest.Mock).mockRejectedValueOnce(
      new Error("Payment gateway temporarily unavailable"),
    );

    renderModal();

    await user.click(screen.getByTestId("cycle-option-yearly"));
    await user.click(screen.getByTestId("renewal-modal-continue-button"));

    await waitFor(() => {
      expect(screen.getByTestId("renewal-modal-error")).toHaveTextContent(
        "Payment gateway temporarily unavailable",
      );
    });

    expect(subscriptionService.renewSubscription).toHaveBeenCalledWith(
      "sub-123",
      "plan-yearly",
      expect.any(String),
    );
    expect(screen.getByTestId("modal-selected-cycle")).toHaveTextContent("Yearly");
  });
});
