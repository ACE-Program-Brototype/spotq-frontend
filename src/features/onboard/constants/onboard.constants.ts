export const ONBOARD_MESSAGES = {
  DOCUMENTS_REQUIRED: "Please upload all required business documents before proceeding.",
  PHOTOS_REQUIRED: "Please upload at least one restaurant photo before proceeding.",
  FILE_INVALID_TYPE: "Invalid file type. Only PDF documents are allowed.",
  FILE_MAX_SIZE: (maxSizeMB: number) => `File size exceeds the ${maxSizeMB}MB limit.`,
  NO_RESTAURANT_SESSION: "Restaurant session not found. Please log in again.",
  IMAGE_INVALID_FORMAT: "Invalid image format. Allowed formats: JPG, PNG, WEBP.",
  IMAGE_MAX_SIZE: (maxSizeMB: number) => `Image size exceeds the ${maxSizeMB}MB limit.`,
  IMAGE_MAX_LIMIT: "Maximum of 5 restaurant photos allowed.",
  UPLOAD_FAILED_DOCUMENT: "Failed to upload document. Please try again.",
  UPLOAD_FAILED_IMAGE: "Failed to upload image. Please try again.",
} as const;
