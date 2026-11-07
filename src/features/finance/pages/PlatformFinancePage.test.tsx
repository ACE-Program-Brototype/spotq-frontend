import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { financeService } from "../services/finance.service";
import { getDateRange } from "../utils/finance.utils";
import PlatformFinancePage from "./PlatformFinancePage";

jest.mock("../services/finance.service", () => ({
  financeService: {
    getFinanceLedger: jest.fn(),
    getFinanceSummary: jest.fn(),
    downloadFinanceCsv: jest.fn(),
  },
}));

const mockSummary = financeService.getFinanceSummary as jest.MockedFunction<
  typeof financeService.getFinanceSummary
>;
const mockLedger = financeService.getFinanceLedger as jest.MockedFunction<
  typeof financeService.getFinanceLedger
>;

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <PlatformFinancePage />
    </QueryClientProvider>,
  );
}

describe("PlatformFinancePage", () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    mockSummary.mockResolvedValue({
      currency: "INR",
      masterBalancePaise: "1000000",
      todayTurnoverPaise: "14250000",
      tonightEodPayoutQueuePaise: "12850000",
      lifetimeDisbursedPaise: "381500000",
      totalRefundsProcessedPaise: "0",
      saasSubscriptionMrrPaise: "4500000",
      activeVenuesCount: 18,
    });
    mockLedger.mockResolvedValue({
      entries: [],
      pagination: { page: 1, totalPages: 1, limit: 20 },
    });
  });

  it("loads the summary and formats the four INR metric cards", async () => {
    renderPage();

    expect(await screen.findByText("₹1,42,500.00")).toBeInTheDocument();
    expect(screen.getByText("₹1,28,500.00")).toBeInTheDocument();
    expect(screen.getByText("₹38,15,000.00")).toBeInTheDocument();
    expect(screen.getByText("₹45,000.00")).toBeInTheDocument();
    expect(mockSummary).toHaveBeenCalledTimes(1);
  });

  it("debounces search requests by 300ms", async () => {
    jest.useFakeTimers();
    renderPage();
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    await waitFor(() => expect(mockLedger).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByRole("textbox", { name: "Search ledger" }), {
      target: { value: "SQ-98214" },
    });
    expect(mockLedger).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(299);
    });
    expect(mockLedger).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    await waitFor(() => expect(mockLedger).toHaveBeenCalledTimes(2));
    expect(mockLedger.mock.calls[1][0].search).toBe("SQ-98214");
  });

  it("builds inclusive quick filter dates and custom ranges", () => {
    expect(getDateRange("CUSTOM", "2026-10-01", "2026-10-31")).toEqual({
      startDate: "2026-10-01",
      endDate: "2026-10-31",
    });
    const range = getDateRange("LAST_7_DAYS", "", "");
    expect(range.startDate).toBeTruthy();
    expect(range.endDate).toBeTruthy();
  });
});
