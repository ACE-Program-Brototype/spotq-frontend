export const STORAGE_ENDPOINTS = {
  PRESIGNED_URL: "auth/restaurants/storage/presigned-url",
} as const;

export const STORAGE_ERRORS = {
  PRESIGNED_URL_FAILED: "Failed to generate presigned upload URL.",
  S3_UPLOAD_FAILED: (status: number, statusText: string) =>
    `S3 upload failed with status ${status}: ${statusText}`,
  S3_NETWORK_ERROR:
    "Network error occurred during direct S3 file upload. Please verify AWS S3 bucket existence and CORS permissions (AllowedOrigins & PUT method).",
  S3_UPLOAD_ABORTED: "Direct S3 upload was aborted.",
} as const;
