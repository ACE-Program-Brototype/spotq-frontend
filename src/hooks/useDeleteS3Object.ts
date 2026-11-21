import {
  type UseMutationOptions,
  type UseMutationResult,
  useMutation,
} from "@tanstack/react-query";
import { deleteS3Object } from "@/services/storage/storage.service";

export type UseDeleteS3ObjectOptions = Omit<UseMutationOptions<void, Error, string>, "mutationFn">;

export type UseDeleteS3ObjectResult = UseMutationResult<void, Error, string> & {
  deleteFile: (key: string) => Promise<void>;
  isDeleting: boolean;
};

/**
 * Custom TanStack mutation hook for deleting S3 storage objects.
 */
export function useDeleteS3Object(options?: UseDeleteS3ObjectOptions): UseDeleteS3ObjectResult {
  const mutation = useMutation<void, Error, string>({
    mutationFn: (key: string) => deleteS3Object(key),
    ...options,
  });

  return {
    ...mutation,
    deleteFile: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
}
