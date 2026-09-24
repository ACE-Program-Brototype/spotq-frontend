import { Image as ImageIcon, Loader2, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import { uploadFile } from "@/services/storage/storage.service";

interface ImageUploaderProps {
  value?: string;
  onChange: (s3Key: string) => void;
  restaurantId: string;
}

export function ImageUploader({ value, onChange, restaurantId }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size exceeds the 5MB limit.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const result = await uploadFile({
        file,
        entityType: "RESTAURANT",
        entityId: restaurantId || "temp",
        fileCategory: "MENUS",
        onProgress: (pct) => setUploadProgress(pct),
      });

      onChange(result.s3ObjectKey);
      toast.success(MENU_MESSAGES.IMAGE_UPLOAD_SUCCESS);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload image.";
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {value ? (
        <div className="relative rounded-2xl border border-[#eddcd4] bg-[#fffaf5] p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-12 rounded-xl bg-[#fae2d3] flex items-center justify-center text-[#9a3412] shrink-0 overflow-hidden">
              {value.startsWith("http") ? (
                <img src={value} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="size-6 text-[#e8631b]" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-neutral-800 truncate">
                {value.split("/").pop() || "Uploaded Item Image"}
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold">Ready for menu</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
          >
            <Trash2 className="size-4 mr-1" />
            {MENU_MESSAGES.IMAGE_REMOVE}
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full rounded-2xl border-2 border-dashed border-[#ecd8cc] hover:border-[#e8631b] bg-[#fffdfb] hover:bg-[#fff9f4] p-5 text-center transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-7 animate-spin text-[#e8631b]" />
              <p className="text-xs font-semibold text-neutral-700">
                {MENU_MESSAGES.IMAGE_UPLOADING} ({uploadProgress}%)
              </p>
            </div>
          ) : (
            <>
              <div className="size-10 rounded-xl bg-[#fef3ec] flex items-center justify-center text-[#e8631b] group-hover:scale-105 transition-transform">
                <UploadCloud className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-800">
                  {MENU_MESSAGES.IMAGE_DROPZONE_TEXT}
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  {MENU_MESSAGES.IMAGE_DROPZONE_HINT}
                </p>
              </div>
            </>
          )}
        </button>
      )}
    </div>
  );
}
