import { Utensils } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePresignedUrl } from "@/hooks/usePresignedUrl";

interface AddonThumbnailProps {
  imageKey?: string | null;
  name: string;
}

export function AddonThumbnail({ imageKey, name }: AddonThumbnailProps) {
  const [hasError, setHasError] = useState(false);
  const { data: imageUrl, isLoading } = usePresignedUrl(imageKey);

  if (!imageKey && hasError) {
    return (
      <div className="size-12 shrink-0 rounded-xl overflow-hidden bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#e8631b]">
        <Utensils className="size-5 opacity-70" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="size-12 shrink-0 rounded-xl overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="size-12 shrink-0 rounded-xl overflow-hidden bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#e8631b]">
        <Utensils className="size-5 opacity-70" />
      </div>
    );
  }

  return (
    <div className="size-12 shrink-0 rounded-xl overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center">
      <img
        src={imageUrl}
        alt={name}
        className="h-full w-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
