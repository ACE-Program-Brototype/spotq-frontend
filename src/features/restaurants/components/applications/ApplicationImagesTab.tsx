import { Calendar, Eye, ImageIcon, ImageOff, Maximize2 } from "lucide-react";
import { useState } from "react";
import { MediaPreviewModal } from "@/components/common/MediaPreviewModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/date";
import { usePresignedUrl } from "../../hooks/usePresignedUrl";
import type { ApplicationImage } from "../../types/restaurant-application.types";

export interface ApplicationImagesTabProps {
  images?: ApplicationImage[];
}

function ApplicationImageCard({
  image,
  index,
  onOpenPreview,
}: {
  image: ApplicationImage;
  index: number;
  onOpenPreview: (url: string, title: string, badge: string, date: string) => void;
}) {
  const { data: imageUrl, isLoading, isError } = usePresignedUrl(image.object_key);
  const [imageFailed, setImageFailed] = useState(false);

  const orderText = `Photo #${image.display_order ?? index + 1}`;
  const uploadDate = formatDate(image.created_at);

  const handlePreview = () => {
    if (imageUrl) {
      onOpenPreview(
        imageUrl,
        `Store Photo ${image.display_order ?? index + 1}`,
        orderText,
        uploadDate,
      );
    }
  };

  return (
    <Card
      className="overflow-hidden border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all bg-white flex flex-col group cursor-pointer"
      onClick={handlePreview}
      data-testid={`image-card-${image.id}`}
    >
      <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 border-b border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center">
            <ImageIcon className="size-8 text-slate-300 animate-pulse" />
          </div>
        ) : imageUrl && !imageFailed && !isError ? (
          <>
            <img
              src={imageUrl}
              alt={`Restaurant showcase #${image.display_order ?? index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageFailed(true)}
              data-testid={`image-preview-${image.id}`}
            />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold backdrop-blur-xs">
              <Eye className="size-4" />
              <span>Click to Preview</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 p-2 text-center">
            <ImageIcon className="size-8 text-slate-300" />
            <span className="text-[10px] text-slate-400">Preview unavailable</span>
          </div>
        )}

        <Badge className="absolute top-2.5 left-2.5 bg-black/70 hover:bg-black/70 text-white text-[10px] font-mono shadow-xs backdrop-blur-xs pointer-events-none">
          {orderText}
        </Badge>
      </div>

      <CardContent className="p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar className="size-3.5 text-slate-400" />
          <span className="text-[11px]">Uploaded: {uploadDate}</span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={(e) => {
            e.stopPropagation();
            handlePreview();
          }}
          title="Open large preview"
          className="size-6 text-slate-400 hover:text-slate-900 cursor-pointer"
        >
          <Maximize2 className="size-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function ApplicationImagesTab({ images = [] }: ApplicationImagesTabProps) {
  const [previewState, setPreviewState] = useState<{
    isOpen: boolean;
    src?: string;
    title?: string;
    badge?: string;
    subtitle?: string;
  }>({
    isOpen: false,
  });

  const handleOpenPreview = (src: string, title: string, badge: string, date: string) => {
    setPreviewState({
      isOpen: true,
      src,
      title,
      badge,
      subtitle: `Uploaded on ${date}`,
    });
  };

  const handleClosePreview = () => {
    setPreviewState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6" data-testid="application-images-tab">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900">Submitted Store Photos</h2>
            <Badge variant="secondary" className="font-mono text-xs">
              {images.length} Photos
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Storefront facade, interior dining area, and kitchen setup photos
          </p>
        </div>
      </div>

      {/* Grid */}
      {images.length === 0 ? (
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardContent className="py-14 text-center">
            <div className="size-12 mx-auto mb-3 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <ImageOff className="size-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No storefront photos submitted</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              This application does not contain any uploaded restaurant facade photos.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <ApplicationImageCard
              key={img.id}
              image={img}
              index={index}
              onOpenPreview={handleOpenPreview}
            />
          ))}
        </div>
      )}

      {/* Media Preview Modal */}
      <MediaPreviewModal
        isOpen={previewState.isOpen}
        onClose={handleClosePreview}
        src={previewState.src}
        title={previewState.title}
        badge={previewState.badge}
        subtitle={previewState.subtitle}
        type="image"
      />
    </div>
  );
}
