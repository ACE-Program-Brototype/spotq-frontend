import { useRef, useState } from "react";
import { uploadFile } from "@/services/storage/storage.service";
import { ONBOARD_MESSAGES } from "../constants/onboard.constants";
import type { DocumentItem } from "../types/onboard.types";

interface DocumentUploadCardProps {
  id: string;
  label: string;
  value: DocumentItem | null;
  onChange: (doc: DocumentItem | null) => void;
  restaurantId: string;
  required?: boolean;
  allowedTypes?: string[];
  maxSizeMB?: number;
  onUploadingChange?: (uploading: boolean) => void;
}

export default function DocumentUploadCard({
  id,
  label,
  value,
  onChange,
  restaurantId,
  required = true,
  allowedTypes = ["application/pdf"],
  maxSizeMB = 5,
  onUploadingChange,
}: DocumentUploadCardProps) {
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

    // Frontend type validation
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      setError(ONBOARD_MESSAGES.FILE_INVALID_TYPE);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Frontend size validation
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(ONBOARD_MESSAGES.FILE_MAX_SIZE(maxSizeMB));
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
        fileCategory: "DOCUMENTS",
        onProgress: (p) => setProgress(p),
      });

      onChange({
        documentName: file.name,
        documentKey: result.s3ObjectKey,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : ONBOARD_MESSAGES.UPLOAD_FAILED_DOCUMENT);
    } finally {
      updateUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setError(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-b from-white to-neutral-50/50 p-5 shadow-xs transition-all duration-200 hover:border-neutral-300 hover:shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-tight text-neutral-900 sm:text-base">{label}</h3>
            {required ? (
              <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-200">
                Required
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 border border-neutral-200">
                Optional
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Accepted format: PDF • Max limit: {maxSizeMB}MB
          </p>
        </div>

        <input
          id={id}
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        {value ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="rounded-xl border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-50"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="rounded-xl border border-red-200 bg-red-50/80 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-orange-600 hover:shadow-md active:scale-[0.98] disabled:opacity-50 cursor-pointer"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            Upload Document
          </button>
        )}
      </div>

      {isUploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1.5">
            <span className="font-medium animate-pulse">Uploading document...</span>
            <span className="font-bold text-orange-600">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200/80">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {value && !isUploading && (
        <div className="mt-3.5 flex items-center justify-between gap-2 rounded-xl bg-emerald-50/80 px-3.5 py-2.5 text-xs font-medium text-emerald-900 border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center gap-2.5 truncate">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <span className="truncate font-semibold">{value.documentName}</span>
          </div>
          <span className="shrink-0 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
            Uploaded
          </span>
        </div>
      )}

      {error && (
        <div role="alert" className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
