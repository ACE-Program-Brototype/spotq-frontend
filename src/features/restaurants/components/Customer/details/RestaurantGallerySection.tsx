import { Camera, X } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePresignedUrl } from "@/features/restaurants/hooks/usePresignedUrl";
import type { CustomerRestaurantImage } from "@/features/restaurants/types/customer-restaurant-details.types";

export interface RestaurantGallerySectionProps {
  images: CustomerRestaurantImage[];
}

function GalleryImageItem({
  image,
  onClick,
}: {
  image: CustomerRestaurantImage;
  onClick: (url: string) => void;
}) {
  const [hasError, setHasError] = useState(false);
  const { data: imageUrl, isLoading } = usePresignedUrl(image.objectKey);

  if (hasError) return null;

  return (
    <div
      onClick={() => imageUrl && onClick(imageUrl)}
      className="group relative aspect-4/3 overflow-hidden rounded-xl bg-neutral-100 cursor-pointer border border-neutral-200"
    >
      {isLoading ? (
        <Skeleton className="size-full rounded-none" />
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={`Restaurant photo ${image.displayOrder}`}
          onError={() => setHasError(true)}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : null}
      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
    </div>
  );
}

export function RestaurantGallerySection({ images }: RestaurantGallerySectionProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-3">
          <Camera className="size-6" />
        </div>
        <h3 className="font-bold text-neutral-800 text-base">No Photos Available</h3>
        <p className="text-xs text-neutral-500 mt-1">
          Photos of this restaurant's dining area and ambiance will be added soon.
        </p>
      </div>
    );
  }

  const sortedImages = [...images].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-neutral-900 text-base">
          Photos ({images.length})
        </h3>
      </div>

      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {sortedImages.map((img) => (
          <GalleryImageItem
            key={img.id}
            image={img}
            onClick={(url) => setPreviewUrl(url)}
          />
        ))}
      </div>

      {/* Lightbox Preview Modal */}
      {previewUrl && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <button
            type="button"
            onClick={() => setPreviewUrl(null)}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            aria-label="Close photo preview"
          >
            <X className="size-6" />
          </button>
          <img
            src={previewUrl}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
