import { apiClient } from "@/lib/api/client";
import { STORAGE_ENDPOINTS } from "./storage.constants";

export interface PresignedUrlRequest {
  entity_type: string;
  entity_id: string;
  file_name: string;
  content_type: string;
  file_category: string;
  file_size: number;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  s3ObjectKey: string;
  expiresInSeconds: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: T;
}

export interface UploadFileParams {
  file: File;
  entityType: string;
  entityId: string;
  fileCategory: string;
  contentType?: string;
  onProgress?: (progress: number) => void;
}

export interface UploadFileResult {
  s3ObjectKey: string;
  fileName: string;
}

/**
 * Requests a presigned upload URL from the backend storage endpoint.
 */
export async function getPresignedUrl(request: PresignedUrlRequest): Promise<PresignedUrlResponse> {
  const response = await apiClient
    .post(STORAGE_ENDPOINTS.PRESIGNED_URL, { json: request })
    .json<ApiResponse<PresignedUrlResponse>>();

  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to generate presigned upload URL.");
  }

  return response.data;
}

/**
 * Uploads a file directly to AWS S3 using a presigned PUT URL.
 */
export function uploadFileToS3(
  uploadUrl: string,
  file: File,
  contentType?: string,
  onProgress?: (progress: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", contentType || file.type || "application/octet-stream");

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`S3 upload failed with status ${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Network error occurred during direct S3 file upload. Please verify AWS S3 bucket existence and CORS permissions (AllowedOrigins & PUT method).",
        ),
      );
    };

    xhr.onabort = () => {
      reject(new Error("Direct S3 upload was aborted."));
    };

    xhr.send(file);
  });
}

/**
 * High-level helper function to request presigned URL and upload file directly to S3.
 */
export async function uploadFile(params: UploadFileParams): Promise<UploadFileResult> {
  const { file, entityType, entityId, fileCategory, contentType, onProgress } = params;

  const resolvedContentType = contentType || file.type || "application/octet-stream";

  const presignedRequest: PresignedUrlRequest = {
    entity_type: entityType,
    entity_id: entityId,
    file_name: file.name,
    content_type: resolvedContentType,
    file_category: fileCategory,
    file_size: file.size,
  };

  const presignedResponse = await getPresignedUrl(presignedRequest);

  await uploadFileToS3(presignedResponse.uploadUrl, file, resolvedContentType, onProgress);

  return {
    s3ObjectKey: presignedResponse.s3ObjectKey,
    fileName: file.name,
  };
}
