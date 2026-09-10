import { useRef, useState } from "react";
import { uploadFile } from "@/services/storage/storage.service";
import type { RestaurantImageItem } from "../types/onboard.types";

interface ImageUploadSectionProps {
  images: RestaurantImageItem[];
  onAddImage: (img: Omit<RestaurantImageItem, "displayOrder">) => void;
  onRemoveImage: (index: number) => void;
  restaurantId: string;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export default function ImageUploadSection({
  images,
  onAddImage,
  onRemoveImage,
  restaurantId,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  maxSizeMB = 5,
}: ImageUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      setError("Invalid image format. Allowed formats: JPG, PNG, WEBP.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Image size exceeds the ${maxSizeMB}MB limit.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!restaurantId) {
      setError("Restaurant session not found. Please log in again.");
      return;
    }

    try {
      setIsUploading(true);
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
      setError(err instanceof Error ? err.message : "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 transition-colors hover:border-neutral-300">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-neutral-900">Restaurant Photos</h3>
            <span className="text-sm font-bold text-red-500">*</span>
          </div>
          <p className="mt-0.5 text-xs text-neutral-500">
            Accepted formats: JPG, PNG, WEBP • Max size: {maxSizeMB}MB
          </p>
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
          disabled={isUploading}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-orange-600 disabled:opacity-50"
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
          Add Photo
        </button>
      </div>

      {isUploading && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
            <span>Uploading photo...</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full bg-orange-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <div className="mt-4 space-y-2">
          {images.map((img, index) => (
            <div
              key={img.objectKey || index}
              className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-600">
                  {img.displayOrder}
                </span>
                <span className="truncate font-medium text-neutral-800">{img.fileName}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="ml-2 shrink-0 rounded-lg p-1 text-neutral-400 hover:bg-red-50 hover:text-red-600"
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
