import { Download, ExternalLink, FileText, ImageOff, X } from "lucide-react";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  badge?: string;
  src?: string | null;
  type?: "image" | "pdf" | "auto";
  alt?: string;
}

export function MediaPreviewModal({
  isOpen,
  onClose,
  title = "Media Preview",
  subtitle,
  badge,
  src,
  type = "auto",
  alt = "Preview",
}: MediaPreviewModalProps) {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isPdf = type === "pdf" || (type === "auto" && src?.toLowerCase().includes(".pdf"));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      data-testid="media-preview-modal"
    >
      {/* Backdrop overlay */}
      <button
        type="button"
        aria-label="Close preview backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-default border-0 outline-none w-full h-full"
      />

      <div className="relative z-10 flex flex-col w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">{title}</h3>
                {badge && (
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] font-medium">
                    {badge}
                  </Badge>
                )}
              </div>
              {subtitle && <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-4">
            {src && (
              <>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in new tab"
                  className="inline-flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink className="size-4" />
                </a>
                <a
                  href={src}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Download file"
                  className="inline-flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Download className="size-4" />
                </a>
              </>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={onClose}
              title="Close preview"
              className="size-8 text-slate-400 hover:text-white hover:bg-slate-800 ml-1 rounded-full"
              data-testid="modal-close-button"
            >
              <X className="size-4.5" />
            </Button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center min-h-[320px] bg-slate-950/60">
          {!src ? (
            <div className="flex flex-col items-center justify-center gap-2 text-slate-500 py-12">
              <ImageOff className="size-10 text-slate-600" />
              <p className="text-sm font-medium">Preview URL is unavailable</p>
            </div>
          ) : isPdf ? (
            <div className="w-full h-[65vh] flex flex-col items-center justify-center gap-4 bg-slate-900/80 rounded-xl border border-slate-800 p-6 text-center">
              <div className="size-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <FileText className="size-8" />
              </div>
              <div className="space-y-1 max-w-md">
                <p className="text-sm font-bold text-white">{title}</p>
                <p className="text-xs text-slate-400">
                  PDF document preview. Click below to view the full certificate in a new tab.
                </p>
              </div>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors mt-2"
              >
                <ExternalLink className="size-4" />
                Open Document Viewer
              </a>
            </div>
          ) : (
            <div className="relative max-h-[75vh] flex items-center justify-center">
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default MediaPreviewModal;
