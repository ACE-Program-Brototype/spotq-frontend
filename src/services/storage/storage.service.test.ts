import { apiClient } from "@/lib/api/client";
import { STORAGE_ENDPOINTS } from "./storage.constants";
import { getPresignedUrl, uploadFile, uploadFileToS3 } from "./storage.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe("storage.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPresignedUrl", () => {
    it("requests presigned URL from backend and returns data", async () => {
      const mockResponse = {
        success: true,
        data: {
          uploadUrl: "https://s3.amazonaws.com/test-bucket/test.pdf",
          s3ObjectKey: "restaurants/res-123/documents/uuid_test.pdf",
          expiresInSeconds: 900,
        },
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const request = {
        entity_type: "restaurants",
        entity_id: "res-123",
        file_name: "test.pdf",
        content_type: "application/pdf",
        file_category: "DOCUMENTS",
        file_size: 1024,
      };

      const result = await getPresignedUrl(request);

      expect(apiClient.post).toHaveBeenCalledWith(STORAGE_ENDPOINTS.PRESIGNED_URL, {
        json: request,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("throws error if response is unsuccessful", async () => {
      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: false,
          message: "Unauthorized entity access",
        }),
      });

      const request = {
        entity_type: "restaurants",
        entity_id: "res-123",
        file_name: "test.pdf",
        content_type: "application/pdf",
        file_category: "DOCUMENTS",
        file_size: 1024,
      };

      await expect(getPresignedUrl(request)).rejects.toThrow("Unauthorized entity access");
    });
  });

  describe("uploadFileToS3", () => {
    let mockXHR: {
      open: jest.Mock;
      setRequestHeader: jest.Mock;
      send: jest.Mock;
      upload: { onprogress?: (event: ProgressEvent) => void };
      status: number;
      statusText: string;
      onload: () => void;
    };

    beforeEach(() => {
      mockXHR = {
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: jest.fn(),
        upload: {},
        status: 200,
        statusText: "OK",
        onload: () => {},
      };

      // @ts-expect-error Mocking global XMLHttpRequest
      global.XMLHttpRequest = jest.fn(() => mockXHR);
    });

    it("sends PUT request to uploadUrl with file and content type", async () => {
      const file = new File(["dummy content"], "test.pdf", { type: "application/pdf" });
      const uploadPromise = uploadFileToS3("https://s3.amazonaws.com/upload", file);

      mockXHR.onload();

      await expect(uploadPromise).resolves.toBeUndefined();
      expect(mockXHR.open).toHaveBeenCalledWith("PUT", "https://s3.amazonaws.com/upload", true);
      expect(mockXHR.setRequestHeader).toHaveBeenCalledWith("Content-Type", "application/pdf");
      expect(mockXHR.send).toHaveBeenCalledWith(file);
    });

    it("rejects when S3 returns non-2xx status", async () => {
      const file = new File(["dummy content"], "test.pdf", { type: "application/pdf" });
      const uploadPromise = uploadFileToS3("https://s3.amazonaws.com/upload", file);

      mockXHR.status = 403;
      mockXHR.statusText = "Forbidden";
      mockXHR.onload();

      await expect(uploadPromise).rejects.toThrow("S3 upload failed with status 403: Forbidden");
    });

    it("rejects with sanitized message on network error", async () => {
      const mockXHRNetworkError = {
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: jest.fn(),
        upload: {},
        status: 0,
        statusText: "",
        onerror: () => {},
      };

      // @ts-expect-error Mocking global XMLHttpRequest
      global.XMLHttpRequest = jest.fn(() => mockXHRNetworkError);

      const file = new File(["dummy content"], "test.pdf", { type: "application/pdf" });
      const uploadPromise = uploadFileToS3("https://s3.amazonaws.com/upload", file);

      mockXHRNetworkError.onerror();

      await expect(uploadPromise).rejects.toThrow(
        "Network error occurred during file upload. Please check your network connection and try again.",
      );
    });
  });

  describe("uploadFile", () => {
    it("orchestrates presigned URL request and direct S3 upload", async () => {
      const mockPresigned = {
        success: true,
        data: {
          uploadUrl: "https://s3.amazonaws.com/upload-target",
          s3ObjectKey: "restaurants/res-100/documents/uuid_doc.pdf",
          expiresInSeconds: 900,
        },
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockPresigned),
      });

      let instanceXHR: {
        open: jest.Mock;
        setRequestHeader: jest.Mock;
        send: jest.Mock;
        upload: { onprogress?: (event: ProgressEvent) => void };
        status: number;
        onload: () => void;
      };
      // @ts-expect-error Mocking global XMLHttpRequest
      global.XMLHttpRequest = jest.fn(() => {
        instanceXHR = {
          open: jest.fn(),
          setRequestHeader: jest.fn(),
          send: jest.fn(() => {
            setTimeout(() => instanceXHR.onload(), 0);
          }),
          upload: {},
          status: 200,
          onload: () => {},
        };
        return instanceXHR;
      });

      const file = new File(["test file content"], "doc.pdf", { type: "application/pdf" });

      const result = await uploadFile({
        file,
        entityType: "restaurants",
        entityId: "res-100",
        fileCategory: "DOCUMENTS",
      });

      expect(result).toEqual({
        s3ObjectKey: "restaurants/res-100/documents/uuid_doc.pdf",
        fileName: "doc.pdf",
      });
    });
  });
});
