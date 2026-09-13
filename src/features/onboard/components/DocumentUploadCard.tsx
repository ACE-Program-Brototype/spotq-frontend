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
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-200 ${
        value
          ? "border-emerald-200/90 bg-gradient-to-br from-emerald-50/50 via-white to-white shadow-xs"
          : "border-neutral-200/90 bg-white hover:border-neutral-300 hover:shadow-xs"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
              value
                ? "bg-emerald-100 text-emerald-600"
                : "bg-neutral-100 text-neutral-500 group-hover:bg-orange-50 group-hover:text-orange-600"
            }`}
          >
            {value ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            ) : (
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
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-neutral-900 sm:text-base">
                {label}
              </h3>
              {required ? (
                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-200/80">
                  Required
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500 border border-neutral-200">
                  Optional
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-neutral-500">PDF format • Max {maxSizeMB}MB</p>
          </div>
        </div>

        <input
          id={id}
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        {!value && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-3.5 w-3.5"
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
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1.5">
            <span className="font-medium animate-pulse">Uploading document...</span>
            <span className="font-bold text-orange-600">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {value && !isUploading && (
        <div className="mt-3.5 flex items-center justify-between gap-2 rounded-xl bg-emerald-50/90 px-3.5 py-2.5 text-xs font-medium text-emerald-900 border border-emerald-200/90">
          <div className="flex items-center gap-2 truncate">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="h-4 w-4 shrink-0 text-emerald-600"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <span className="truncate font-semibold text-emerald-950">{value.documentName}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-neutral-700 border border-neutral-300 transition-colors hover:bg-neutral-50 cursor-pointer"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="rounded-lg bg-red-100/80 px-2.5 py-1 text-[11px] font-bold text-red-700 border border-red-200 transition-colors hover:bg-red-200/80 cursor-pointer"
            >
              Remove
            </button>
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
    </div>
  );
}
