import { Camera, Loader2 } from "lucide-react";

interface RestaurantOverviewLogoAvatarProps {
  logoSrc: string;
  name: string;
  isEditing: boolean;
  isSaving: boolean;
  isUploading: boolean;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoError: () => void;
}

export function RestaurantOverviewLogoAvatar({
  logoSrc,
  name,
  isEditing,
  isSaving,
  isUploading,
  onLogoChange,
  onLogoError,
}: RestaurantOverviewLogoAvatarProps) {
  return (
    <div className="relative size-24 sm:size-28 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden shrink-0 group">
      <img
        src={logoSrc}
        alt={`${name} Logo`}
        onError={onLogoError}
        className="h-full w-full object-cover"
      />

      {isEditing && (
        <label className="absolute inset-0 bg-black/50 hover:bg-black/60 flex flex-col items-center justify-center text-white cursor-pointer transition-all">
          {isUploading ? (
            <>
              <Loader2 className="size-6 mb-1 animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Uploading</span>
            </>
          ) : (
            <>
              <Camera className="size-6 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Change Logo</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onLogoChange}
            disabled={isSaving}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
