import env from "@/config/env";

/**
 * Resolves an image object key or URL into a displayable CDN / HTTPS URL.
 * Avoids redundant asynchronous presigned URL network round-trips for public assets.
 */
export function resolveImageUrl(keyOrUrl?: string | null): string | null {
  if (!keyOrUrl?.trim()) return null;
  const trimmed = keyOrUrl.trim();

  // If already an absolute HTTP/HTTPS URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Format with configured public CDN / S3 base URL
  const cdnBase = env.cdnBaseUrl.replace(/\/+$/, "");
  const cleanKey = trimmed.replace(/^\/+/, "");

  return `${cdnBase}/${cleanKey}`;
}
