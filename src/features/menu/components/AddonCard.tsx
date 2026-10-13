import { Edit3, Loader2, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { MenuAddon } from "@/features/menu/types/menu.types";
import { AddonThumbnail } from "./AddonThumpnail";

export interface AddonCardProps {
  addon: MenuAddon;
  onEdit?: (addon: MenuAddon) => void;
  onDelete?: (addon: MenuAddon) => void;
  onToggleAvailability?: (addon: MenuAddon) => void;
  isToggling?: boolean;
  isDeleting?: boolean;
  isStaffView?: boolean;
}

export function AddonCard({
  addon,
  onEdit,
  onDelete,
  onToggleAvailability,
  isToggling = false,
  isDeleting = false,
  isStaffView = false,
}: AddonCardProps) {
  const price = Number(addon.price || 0);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-xs hover:border-[#e8631b]/50 hover:shadow-md transition-all">
      {/* Top Meta & Availability Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#faf7f5] px-2.5 py-1 text-xs font-semibold text-neutral-600 border border-[#eddcd4]">
          <Sparkles className="size-3 text-[#e8631b]" />
          <span>Modifier / Add-on</span>
        </div>

        {/* Live Status Badge */}
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

      {/* Footer / Actions Area */}
      <div className="pt-3 border-t border-[#f3e6de] flex items-center justify-between gap-3">
        {/* Price Display */}
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            Price
          </span>
          <span className="text-sm font-extrabold text-[#9a3412]">
            ₹{Number.isFinite(price) ? price.toFixed(2) : "0.00"}
          </span>
        </div>

        {/* Staff view: only availability toggle */}
        {/* Admin view: edit button + delete button (no toggle — availability managed via Edit modal) */}
        {isStaffView ? (
          <div className="flex items-center gap-2">
            {isToggling && <Loader2 className="size-3.5 animate-spin text-[#e8631b]" />}
            <div className="flex items-center gap-2 rounded-xl bg-[#faf7f5] border border-[#eddcd4] px-3 py-1.5">
              <span className="text-xs font-semibold text-neutral-700">
                {addon.isAvailable ? "Available" : "86'd"}
              </span>
              <Switch
                checked={addon.isAvailable}
                disabled={isToggling}
                onChange={() => onToggleAvailability?.(addon)}
                aria-label={`Toggle availability for ${addon.name}`}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onEdit(addon)}
                className="rounded-xl border-[#eddcd4] text-[#9a3412] hover:bg-[#fef3ec] hover:border-[#fae2d3] font-semibold text-xs h-8.5 px-3 transition-colors shadow-2xs cursor-pointer"
                aria-label={`Edit ${addon.name} addon`}
              >
                <Edit3 className="size-3.5 mr-1 text-[#e8631b]" />
                <span>Edit</span>
              </Button>
            )}

            {onDelete && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isDeleting}
                onClick={() => onDelete(addon)}
                className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold text-xs h-8.5 px-3 transition-colors shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Delete ${addon.name} addon`}
              >
                {isDeleting ? (
                  <Loader2 className="size-3.5 mr-1 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5 mr-1" />
                )}
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default AddonCard;
