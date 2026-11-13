import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { toast } from "sonner";
import { TABLE_QUERY_KEYS } from "@/features/tables/constants/table.constants";
import { QUEUE_QUERY_KEYS } from "../constants/queue.constants";
import { queueService } from "../services/queue.service";
import type { AssignTablesResponse } from "../types/queue.types";
import { useAssignTables } from "./use-assign-tables";

jest.mock("../services/queue.service");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("useAssignTables", () => {
  let queryClient: QueryClient;
  const restaurantId = "rest-777";
  const queueEntryId = "entry-888";

  const mockResponse: AssignTablesResponse = {
    success: true,
    statusCode: 200,
    message: "Tables assigned and party seated successfully",
    data: {
      queueEntryId,
      restaurantId,
      tableIds: ["table-1", "table-2"],
      status: "SEATED",
      seatedAt: "2026-11-07T12:00:00.000Z",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("successfully assigns tables, invalidates caches, and triggers toast.success", async () => {
    (queueService.assignTables as jest.Mock).mockResolvedValue(mockResponse);
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useAssignTables(restaurantId, { onSuccess }), {
      wrapper: createWrapper(),
    });

    const payload = {
      tables: [{ tableId: "table-1", count: 2 }],
    };

    let response: AssignTablesResponse | undefined;
    await act(async () => {
      response = await result.current.assignTables({ queueEntryId, input: payload });
    });

    expect(response).toEqual(mockResponse);
    expect(queueService.assignTables).toHaveBeenCalledWith(queueEntryId, payload);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: [QUEUE_QUERY_KEYS.QUEUE, restaurantId],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: TABLE_QUERY_KEYS.LIST(restaurantId),
    });
    expect(toast.success).toHaveBeenCalledWith(mockResponse.message);
    expect(onSuccess).toHaveBeenCalledWith(mockResponse);
  });

  it("handles assignment failure, displays error toast, invalidates table cache, and calls onError", async () => {
    const error = new Error("Table Not Available");
    (queueService.assignTables as jest.Mock).mockRejectedValue(error);
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const onError = jest.fn();

    const { result } = renderHook(() => useAssignTables(restaurantId, { onError }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(
        result.current.assignTables({
          queueEntryId,
          input: { tables: [{ tableId: "table-1", count: 1 }] },
        }),
      ).rejects.toThrow("Table Not Available");
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: TABLE_QUERY_KEYS.LIST(restaurantId),
    });
    expect(toast.error).toHaveBeenCalledWith("Table Not Available");
    expect(onError).toHaveBeenCalledWith(error);
  });
});
