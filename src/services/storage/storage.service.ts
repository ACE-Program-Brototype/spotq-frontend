import { apiClient } from "@/lib/api/client";
import { STORAGE_ENDPOINTS } from "./storage.constants";

export interface PresignedDownloadUrlResponse {
  download_url: string;
  expires_in_seconds: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: T;
}

export async function getPresignedDownloadUrl(key: string): Promise<string> {
  if (!key?.trim()) {
    throw new Error("Object key is required");
  }

  const trimmedKey = key.trim();

  if (trimmedKey.startsWith("http://") || trimmedKey.startsWith("https://")) {
    return trimmedKey;
  }

  const response = await apiClient
    .get(STORAGE_ENDPOINTS.PRESIGNED_URL, {
      searchParams: { key: trimmedKey },
    })
    .json<ApiResponse<PresignedDownloadUrlResponse>>();

  if (!response?.success || !response?.data?.download_url) {
    throw new Error(response?.message || "Failed to retrieve presigned download URL.");
  }

  return response.data.download_url;
}
