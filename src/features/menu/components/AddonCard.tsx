import { Sparkles, Utensils } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { MenuAddon } from "@/features/menu/types/menu.types";
import { usePresignedUrl } from "@/hooks/usePresignedUrl";

export interface AddonCardProps {
  addon: MenuAddon;
}

function AddonThumbnail({ imageKey, name }: { imageKey?: string | null; name: string }) {
  const isHttpUrl = Boolean(imageKey && /^https?:\/\//i.test(imageKey));
  const { data: presignedUrl, isLoading } = usePresignedUrl(!isHttpUrl ? imageKey : null);
  const [hasError, setHasError] = useState(false);

  const displayUrl = isHttpUrl ? imageKey : presignedUrl || imageKey;

  if (isLoading) {
    return (
      <div className="size-12 shrink-0 rounded-xl overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (displayUrl && !hasError) {
    return (
      <div className="size-12 shrink-0 rounded-xl overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center">
        <img
          src={displayUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className="size-12 shrink-0 rounded-xl overflow-hidden bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#e8631b]">
      <Utensils className="size-5 opacity-70" />
    </div>
  );
}

export function AddonCard({ addon }: AddonCardProps) {
  const price = Number(addon.price || 0);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-xs hover:border-[#e8631b]/50 hover:shadow-md transition-all">
      {/* Top Meta & Availability Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#faf7f5] px-2.5 py-1 text-xs font-semibold text-neutral-600 border border-[#eddcd4]">
          <Sparkles className="size-3 text-[#e8631b]" />
          <span>Modifier / Add-on</span>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            addon.isAvailable
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-neutral-100 text-neutral-600 border border-neutral-200"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              addon.isAvailable ? "bg-emerald-500" : "bg-neutral-400"
            }`}
          />
          {addon.isAvailable ? "In Stock" : "Unavailable"}
        </span>
      </div>

      {/* Add-on Thumbnail & Main Details */}
      <div className="flex items-start gap-3.5 mb-4 flex-1">
        <AddonThumbnail imageKey={addon.imageKey} name={addon.name} />

        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-base font-bold text-neutral-900 group-hover:text-[#9a3412] transition-colors leading-snug truncate">
            {addon.name}
          </h3>
          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
            {addon.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Footer: Price */}
      <div className="flex items-center justify-between pt-3 border-t border-[#f3e6de]">
        <span className="text-xs font-semibold text-neutral-500">Standard Price</span>
        <span className="text-sm font-extrabold text-[#9a3412]">
          ₹{Number.isFinite(price) ? price.toFixed(2) : "0.00"}
        </span>
      </div>
    </div>
  );
}
