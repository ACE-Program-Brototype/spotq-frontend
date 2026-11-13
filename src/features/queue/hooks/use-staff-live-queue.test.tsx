import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { PARTY_SIZE_BUCKET, REGISTRATION_TYPE_FILTER } from "../constants/queue.constants";
import { queueService } from "../services/queue.service";
import type { StaffLiveQueueEntry } from "../types/queue.types";
import { useStaffLiveQueue } from "./use-staff-live-queue";

jest.mock("../services/queue.service");

describe("useStaffLiveQueue", () => {
  let queryClient: QueryClient;
  const restaurantId = "rest-test-live-1";

  const entries: StaffLiveQueueEntry[] = [
    {
      queueEntryId: "entry-1",
      queueNumber: "Q-001",
      position: 1,
      guestName: "John Doe",
      guestPhone: "+919876543210",
      partySize: 2,
      specialNotes: null,
      registrationType: "WALK_IN",
      status: "WAITING",
      assignedTableId: null,
      joinedAt: "2026-11-09T10:00:00.000Z",
      ringCount: 0,
      lastRingAt: null,
      responseDeadline: null,
      waitDurationMinutes: 10,
    },
    {
      queueEntryId: "entry-2",
      queueNumber: "Q-002",
      position: 2,
      guestName: "Sarah Connor",
      guestPhone: "+919876543211",
      partySize: 4,
      specialNotes: "Quiet booth",
      registrationType: "ONLINE",
      status: "WAITING",
      assignedTableId: null,
      joinedAt: "2026-11-09T10:05:00.000Z",
      ringCount: 1,
      lastRingAt: "2026-11-09T10:15:00.000Z",
      responseDeadline: "2026-11-09T10:18:00.000Z",
      waitDurationMinutes: 15,
    },
    {
      queueEntryId: "entry-3",
      queueNumber: "Q-003",
      position: 3,
      guestName: "Michael Scott",
      guestPhone: "+919876543212",
      partySize: 6,
      specialNotes: null,
      registrationType: "WALK_IN",
      status: "WAITING",
      assignedTableId: null,
      joinedAt: "2026-11-09T10:10:00.000Z",
      ringCount: 0,
      lastRingAt: null,
      responseDeadline: null,
      waitDurationMinutes: 5,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    (queueService.getStaffLiveQueue as jest.Mock).mockResolvedValue({
      success: true,
      message: "Queue retrieved",
      data: {
        restaurantId,
        totalWaiting: 3,
        entries,
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("calculates queue statistics regardless of UI filters", async () => {
    const { result } = renderHook(() => useStaffLiveQueue({ restaurantId }), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.statistics).toEqual({
      waitingParties: 3, // entry-1 (2) + entry-2 (4) + entry-3 (6)
      waitingPeople: 12, // 2 + 4 + 6
      ringingParties: 1, // entry-2 (4)
      ringingPeople: 4,
    });
  });

  it("filters entries by registration type", async () => {
    const { result } = renderHook(() => useStaffLiveQueue({ restaurantId }), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Default: all 3
    expect(result.current.filteredEntries).toHaveLength(3);

    // Online only
    act(() => {
      result.current.setRegistrationTypeFilter(REGISTRATION_TYPE_FILTER.ONLINE);
    });
    expect(result.current.filteredEntries).toHaveLength(1);
    expect(result.current.filteredEntries[0].guestName).toBe("Sarah Connor");

    // Walk-In only
    act(() => {
      result.current.setRegistrationTypeFilter(REGISTRATION_TYPE_FILTER.WALK_IN);
    });
    expect(result.current.filteredEntries).toHaveLength(2);
  });

  it("filters entries by party size buckets (Small, Medium, Large)", async () => {
    const { result } = renderHook(() => useStaffLiveQueue({ restaurantId }), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Small (1-2)
    act(() => {
      result.current.setPartySizeFilter(PARTY_SIZE_BUCKET.SMALL);
    });
    expect(result.current.filteredEntries).toHaveLength(1);
    expect(result.current.filteredEntries[0].guestName).toBe("John Doe");

    // Medium (3-4)
    act(() => {
      result.current.setPartySizeFilter(PARTY_SIZE_BUCKET.MEDIUM);
    });
    expect(result.current.filteredEntries).toHaveLength(1);
    expect(result.current.filteredEntries[0].guestName).toBe("Sarah Connor");

    // Large (5+)
    act(() => {
      result.current.setPartySizeFilter(PARTY_SIZE_BUCKET.LARGE);
    });
    expect(result.current.filteredEntries).toHaveLength(1);
    expect(result.current.filteredEntries[0].guestName).toBe("Michael Scott");
  });

  it("filters entries by search query", async () => {
    const { result } = renderHook(() => useStaffLiveQueue({ restaurantId }), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    act(() => {
      result.current.setSearchQuery("Q-002");
    });
    expect(result.current.filteredEntries).toHaveLength(1);
    expect(result.current.filteredEntries[0].guestName).toBe("Sarah Connor");

    act(() => {
      result.current.setSearchQuery("543212");
    });
    expect(result.current.filteredEntries).toHaveLength(1);
    expect(result.current.filteredEntries[0].guestName).toBe("Michael Scott");
  });
});
