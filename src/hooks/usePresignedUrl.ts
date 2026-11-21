import { useQuery } from "@tanstack/react-query";
import { STORAGE_DEFAULTS, STORAGE_QUERY_KEYS } from "@/services/storage/storage.constants";
import { getPresignedDownloadUrl } from "@/services/storage/storage.service";

/**
 * Hook to retrieve and cache presigned S3 download/view URLs.
 */
export function usePresignedUrl(key?: string | null) {
  return useQuery<string, Error>({
    queryKey: STORAGE_QUERY_KEYS.PRESIGNED_URL(key),
    queryFn: () => {
      if (!key?.trim()) {
        throw new Error("S3 key is required");
      }
      return getPresignedDownloadUrl(key.trim());
    },
    enabled: Boolean(key && key.trim().length > 0),
    staleTime: STORAGE_DEFAULTS.PRESIGNED_URL_STALE_TIME_MS,
  });
}
