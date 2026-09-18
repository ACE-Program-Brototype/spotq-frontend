import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import * as storageService from "@/services/storage/storage.service";
import { usePresignedUrl } from "./usePresignedUrl";

jest.mock("@/services/storage/storage.service");

describe("usePresignedUrl hook", () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it("does not execute query when key is undefined, null, or whitespace", () => {
    const { result: rUndefined } = renderHook(() => usePresignedUrl(undefined), {
      wrapper: createWrapper(),
    });
    expect(rUndefined.current.fetchStatus).toBe("idle");
    expect(storageService.getPresignedDownloadUrl).not.toHaveBeenCalled();

    const { result: rNull } = renderHook(() => usePresignedUrl(null), {
      wrapper: createWrapper(),
    });
    expect(rNull.current.fetchStatus).toBe("idle");
    expect(storageService.getPresignedDownloadUrl).not.toHaveBeenCalled();

    const { result: rEmpty } = renderHook(() => usePresignedUrl("   "), {
      wrapper: createWrapper(),
    });
    expect(rEmpty.current.fetchStatus).toBe("idle");
    expect(storageService.getPresignedDownloadUrl).not.toHaveBeenCalled();
  });

  it("fetches and returns presigned download URL when key is provided", async () => {
    (storageService.getPresignedDownloadUrl as jest.Mock).mockResolvedValue(
      "https://s3.amazonaws.com/bucket/avatar.png?token=123",
    );

    const { result } = renderHook(() => usePresignedUrl("avatars/user-123.png"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(storageService.getPresignedDownloadUrl).toHaveBeenCalledWith("avatars/user-123.png");
    expect(result.current.data).toBe("https://s3.amazonaws.com/bucket/avatar.png?token=123");
  });

  it("handles errors when getPresignedDownloadUrl fails", async () => {
    (storageService.getPresignedDownloadUrl as jest.Mock).mockRejectedValue(
      new Error("Failed to retrieve presigned download URL."),
    );

    const { result } = renderHook(() => usePresignedUrl("invalid-key.png"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Failed to retrieve presigned download URL.");
  });
});
