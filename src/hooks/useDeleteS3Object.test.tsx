import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import * as storageService from "@/services/storage/storage.service";
import { useDeleteS3Object } from "./useDeleteS3Object";

jest.mock("@/services/storage/storage.service");

describe("useDeleteS3Object", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("initializes with default mutation state", () => {
    const { result } = renderHook(() => useDeleteS3Object(), { wrapper });

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.mutate).toBe("function");
    expect(typeof result.current.mutateAsync).toBe("function");
    expect(typeof result.current.reset).toBe("function");
  });

  it("successfully executes deletion via mutateAsync", async () => {
    (storageService.deleteS3Object as jest.Mock).mockResolvedValue(undefined);
    const onSuccessMock = jest.fn();

    const { result } = renderHook(() => useDeleteS3Object({ onSuccess: onSuccessMock }), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync("restaurants/123/images/photo.jpg");
    });

    expect(storageService.deleteS3Object).toHaveBeenCalledWith("restaurants/123/images/photo.jpg");
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isPending).toBe(false);
      expect(result.current.error).toBeNull();
    });
    expect(onSuccessMock).toHaveBeenCalled();
  });

  it("handles error during file deletion and triggers onError", async () => {
    const mockError = new Error("S3 deletion failed");
    (storageService.deleteS3Object as jest.Mock).mockRejectedValue(mockError);
    const onErrorMock = jest.fn();

    const { result } = renderHook(() => useDeleteS3Object({ onError: onErrorMock }), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync("restaurants/123/images/photo.jpg");
      } catch {
        // expected error from mutateAsync
      }
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.isPending).toBe(false);
      expect(result.current.error).toEqual(mockError);
    });
    expect(onErrorMock).toHaveBeenCalledWith(
      mockError,
      "restaurants/123/images/photo.jpg",
      undefined,
      expect.anything(),
    );
  });

  it("resets mutation state when reset is called", async () => {
    const mockError = new Error("Deletion failed");
    (storageService.deleteS3Object as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useDeleteS3Object(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync("some-key");
      } catch {
        // expected
      }
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(mockError);
    });

    act(() => {
      result.current.reset();
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
      expect(result.current.isPending).toBe(false);
    });
  });
});
