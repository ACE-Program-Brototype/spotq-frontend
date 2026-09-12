import { useRef, useState } from "react";
import { uploadFile } from "@/services/storage/storage.service";
import { ONBOARD_MESSAGES } from "../constants/onboard.constants";
import type { RestaurantImageItem } from "../types/onboard.types";

interface ImageUploadSectionProps {
  images: RestaurantImageItem[];
  onAddImage: (img: Omit<RestaurantImageItem, "displayOrder">) => void;
  onRemoveImage: (index: number) => void;
  restaurantId: string;
  allowedTypes?: string[];
  maxSizeMB?: number;
  onUploadingChange?: (uploading: boolean) => void;
}

export default function ImageUploadSection({
  images,
  onAddImage,
  onRemoveImage,
  restaurantId,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  maxSizeMB = 5,
  onUploadingChange,
}: ImageUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const updateUploading = (uploading: boolean) => {
    setIsUploading(uploading);
    onUploadingChange?.(uploading);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Limit check: maximum 5 photos allowed
    if (images.length >= 5) {
      setError(ONBOARD_MESSAGES.IMAGE_MAX_LIMIT);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      setError(ONBOARD_MESSAGES.IMAGE_INVALID_FORMAT);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(ONBOARD_MESSAGES.IMAGE_MAX_SIZE(maxSizeMB));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!restaurantId) {
      setError(ONBOARD_MESSAGES.NO_RESTAURANT_SESSION);
      return;
    }

    try {
      updateUploading(true);
      setProgress(0);

      const result = await uploadFile({
        file,
        entityType: "restaurants",
        entityId: restaurantId,
        fileCategory: "IMAGES",
        onProgress: (p) => setProgress(p),
      });

      onAddImage({
        fileName: file.name,
        objectKey: result.s3ObjectKey,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : ONBOARD_MESSAGES.UPLOAD_FAILED_IMAGE);
    } finally {
      updateUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isMaxReached = images.length >= 5;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 ${
        images.length > 0
          ? "border-orange-200/80 bg-gradient-to-r from-orange-50/30 via-white to-white shadow-xs"
          : "border-neutral-200/90 bg-white hover:border-neutral-300 hover:shadow-xs"
      } p-4.5 sm:p-5`}
    >
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100/80 text-orange-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-neutral-900 sm:text-base">
                Restaurant Photos
              </h3>
              <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-200">
                Required
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                  isMaxReached
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-neutral-100 text-neutral-600 border-neutral-200"
                }`}
              >
                {images.length}/5 photos
              </span>
            </div>
            <p className="mt-0.5 text-xs text-neutral-500">
              Accepted formats: JPG, PNG, WEBP • Max size: {maxSizeMB}MB • Up to 5 photos
            </p>
          </div>
        </div>

        <input
          id="restaurant-photos-input"
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isMaxReached}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-orange-600 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer self-start sm:self-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {isMaxReached ? "Limit Reached" : "Add Photo"}
        </button>
      </div>

      {isUploading && (
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1.5">
            <span className="font-medium animate-pulse">Uploading photo...</span>
            <span className="font-bold text-orange-600">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-4 space-y-2">
          {images.map((img, index) => (
            <div
              key={img.objectKey || index}
              className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-white px-3.5 py-2 text-xs shadow-2xs transition-colors hover:border-neutral-300"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-700">
                  {img.displayOrder}
                </span>
                <span className="truncate font-semibold text-neutral-800">{img.fileName}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="ml-2 shrink-0 rounded-lg p-1 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                aria-label={`Remove photo ${img.fileName}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
