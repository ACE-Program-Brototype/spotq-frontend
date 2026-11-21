import { Utensils } from "lucide-react";
import { useState } from "react";

export interface StaffMenuItemThumbnailProps {
  image?: string | null;
  name: string;
}

export function StaffMenuItemThumbnail({ image, name }: StaffMenuItemThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  if (image && !hasError) {
    return (
      <div className="size-10 shrink-0 rounded-xl overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className="size-10 shrink-0 rounded-xl bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center text-[#9a3412]">
      <Utensils className="size-4" />
    </div>
  );
}
