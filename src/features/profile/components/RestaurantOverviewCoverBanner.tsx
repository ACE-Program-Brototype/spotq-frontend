import { Loader2, Upload } from "lucide-react";

interface RestaurantOverviewCoverBannerProps {
  coverSrc: string;
  name: string;
  isEditing: boolean;
  isSaving: boolean;
  isUploading: boolean;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverError: () => void;
}

export function RestaurantOverviewCoverBanner({
  coverSrc,
  name,
  isEditing,
  isSaving,
  isUploading,
  onCoverChange,
  onCoverError,
}: RestaurantOverviewCoverBannerProps) {
  return (
    <div className="relative h-44 sm:h-56 w-full bg-neutral-900 overflow-hidden">
      <img
        src={coverSrc}
        alt={`${name} Cover`}
        onError={onCoverError}
        className="h-full w-full object-cover transition-opacity duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {isEditing && (
        <label className="absolute top-4 right-4 cursor-pointer inline-flex items-center gap-2 bg-black/70 hover:bg-black/80 text-white text-xs font-semibold px-3 py-2 rounded-xl backdrop-blur-xs transition-all shadow-md">
          {isUploading ? (
            <Loader2 className="size-3.5 animate-spin text-white" />
          ) : (
            <Upload className="size-3.5" />
          )}
          <span>{isUploading ? "Uploading..." : "Change Cover"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={onCoverChange}
            disabled={isSaving}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
