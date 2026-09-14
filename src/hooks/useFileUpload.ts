import { useCallback, useState } from "react";
import { uploadFile } from "@/services/storage/storage.service";

export interface UseFileUploadOptions {
  entityType: string;
  entityId: string;
  fileCategory: string;
  contentType?: string;
}

export interface UseFileUploadResult {
  upload: (
    file: File,
    options: UseFileUploadOptions,
  ) => Promise<{ s3ObjectKey: string; fileName: string }>;
  isUploading: boolean;
  progress: number;
  error: Error | null;
  reset: () => void;
}

export function useFileUpload(): UseFileUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  const upload = useCallback(
    async (
      file: File,
      options: UseFileUploadOptions,
    ): Promise<{ s3ObjectKey: string; fileName: string }> => {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      try {
        const result = await uploadFile({
          file,
          entityType: options.entityType,
          entityId: options.entityId,
          fileCategory: options.fileCategory,
          contentType: options.contentType,
          onProgress: (pct) => setProgress(pct),
        });

        setIsUploading(false);
        setProgress(100);
        return result;
      } catch (err) {
        const uploadError = err instanceof Error ? err : new Error("File upload failed.");
        setError(uploadError);
        setIsUploading(false);
        throw uploadError;
      }
    },
    [],
  );

  return {
    upload,
    isUploading,
    progress,
    error,
    reset,
  };
}
