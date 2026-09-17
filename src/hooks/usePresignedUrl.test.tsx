import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import * as storageService from "@/services/storage/storage.service";
import { usePresignedUrl } from "./usePresignedUrl";

jest.mock("@/services/storage/storage.service");

describe("usePresignedUrl", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("does not fetch when key is not provided or empty", () => {
    const { result } = renderHook(() => usePresignedUrl(""), { wrapper });
    expect(result.current.data).toBeUndefined();
    expect(storageService.getPresignedDownloadUrl).not.toHaveBeenCalled();
  });

  it("fetches presigned download URL when key is provided", async () => {
    (storageService.getPresignedDownloadUrl as jest.Mock).mockResolvedValueOnce(
      "https://s3.amazonaws.com/bucket/avatar.png?signed=true",
    );

    const { result } = renderHook(() => usePresignedUrl("avatars/staff-123.png"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(storageService.getPresignedDownloadUrl).toHaveBeenCalledWith("avatars/staff-123.png");
    expect(result.current.data).toBe("https://s3.amazonaws.com/bucket/avatar.png?signed=true");
  });
});
