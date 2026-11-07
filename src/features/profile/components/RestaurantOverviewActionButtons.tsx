import { Check, Edit3, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestaurantOverviewActionButtonsProps {
  isEditing: boolean;
  isSaving: boolean;
  onStartEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function RestaurantOverviewActionButtons({
  isEditing,
  isSaving,
  onStartEdit,
  onCancel,
  onSave,
}: RestaurantOverviewActionButtonsProps) {
  if (!isEditing) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={onStartEdit}
        className="rounded-xl border-[#eddcd4] bg-[#faf7f5] text-neutral-800 hover:bg-[#f3e6de] font-semibold text-xs h-9 px-4 self-start sm:self-auto cursor-pointer"
      >
        <Edit3 className="size-3.5 mr-1.5 text-[#e8631b]" />
        <span>Edit Overview</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 self-start sm:self-auto">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSaving}
        className="rounded-xl border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-semibold text-xs h-9 px-3.5"
      >
        <X className="size-3.5 mr-1" />
        <span>Cancel</span>
      </Button>

      <Button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="rounded-xl bg-[#e8631b] hover:bg-[#d55513] text-white font-semibold text-xs h-9 px-4"
      >
        {isSaving ? (
          <>
            <Loader2 className="size-3.5 mr-1.5 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Check className="size-3.5 mr-1.5" />
            <span>Save Overview</span>
          </>
        )}
      </Button>
    </div>
  );
}
