import { useRef, useState } from "react";
import { uploadFile } from "@/services/storage/storage.service";
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
}: DocumentUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Frontend type validation
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only PDF documents are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Frontend size validation
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds the ${maxSizeMB}MB limit.`);
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
        fileCategory: "DOCUMENTS",
        onProgress: (p) => setProgress(p),
      });

      onChange({
        documentName: file.name,
        documentKey: result.s3ObjectKey,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setError(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 transition-colors hover:border-neutral-300">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-neutral-900">{label}</h3>
            {required && <span className="text-sm font-bold text-red-500">*</span>}
          </div>
          <p className="mt-0.5 text-xs text-neutral-500">
            Accepted format: PDF • Max size: {maxSizeMB}MB
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
              className="rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
            >
              Remove
            </button>
          </div>
        ) : (
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
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
            <span>Uploading document...</span>
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

      {value && !isUploading && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 border border-emerald-200">
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
          <span className="truncate">{value.documentName}</span>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
