import { act, renderHook } from "@testing-library/react";
import * as storageService from "@/services/storage/storage.service";
import { useFileUpload } from "./useFileUpload";

jest.mock("@/services/storage/storage.service");

describe("useFileUpload hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with default state", () => {
    const { result } = renderHook(() => useFileUpload());

    expect(result.current.isUploading).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it("handles successful file upload and state transitions", async () => {
    const mockResult = {
      s3ObjectKey: "restaurants/res-1/documents/uuid_license.pdf",
      fileName: "license.pdf",
    };

    (storageService.uploadFile as jest.Mock).mockImplementation(async (params) => {
      params.onProgress?.(50);
      return mockResult;
    });

    const { result } = renderHook(() => useFileUpload());

    const file = new File(["content"], "license.pdf", { type: "application/pdf" });

    let uploadRes: { s3ObjectKey: string; fileName: string } | undefined;
    await act(async () => {
      uploadRes = await result.current.upload(file, {
        entityType: "restaurants",
        entityId: "res-1",
        fileCategory: "DOCUMENTS",
      });
    });

    expect(uploadRes).toEqual(mockResult);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.progress).toBe(100);
    expect(result.current.error).toBeNull();
  });

  it("captures upload errors and updates error state", async () => {
    const mockError = new Error("Network failure during upload");
    (storageService.uploadFile as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFileUpload());

    const file = new File(["content"], "license.pdf", { type: "application/pdf" });

    await act(async () => {
      try {
        await result.current.upload(file, {
          entityType: "restaurants",
          entityId: "res-1",
          fileCategory: "DOCUMENTS",
        });
      } catch {}
    });

    expect(result.current.isUploading).toBe(false);
    expect(result.current.error).toEqual(mockError);
  });

  it("resets state when reset() is called", async () => {
    const mockError = new Error("Upload error");
    (storageService.uploadFile as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFileUpload());

    const file = new File(["content"], "doc.pdf", { type: "application/pdf" });

    await act(async () => {
      try {
        await result.current.upload(file, {
          entityType: "restaurants",
          entityId: "res-1",
          fileCategory: "DOCUMENTS",
        });
      } catch {}
    });

    expect(result.current.error).toEqual(mockError);

    act(() => {
      result.current.reset();
    });

    expect(result.current.isUploading).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.error).toBeNull();
  });
});
