import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { MenuAddon } from "@/features/menu/types/menu.types";

export interface DeleteAddonDialogProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  addon: MenuAddon | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteAddonDialog({
  open,
  isOpen,
  onOpenChange,
  addon,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteAddonDialogProps) {
  const isDialogOpen = open ?? isOpen ?? false;

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent
        size="sm"
        className="w-[calc(100vw-2rem)] sm:w-full max-w-sm min-w-0 overflow-hidden p-4 sm:p-6"
      >
        <AlertDialogHeader className="min-w-0 max-w-full overflow-hidden text-center">
          <AlertDialogMedia className="mx-auto bg-red-50 text-red-500">
            <Trash2 className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-base sm:text-lg font-bold text-neutral-900">
            Delete Add-on?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-neutral-600 break-words [overflow-wrap:anywhere] min-w-0 max-w-full leading-relaxed">
            <span className="font-semibold text-neutral-900 break-all [overflow-wrap:anywhere] inline">
              &ldquo;{addon?.name}&rdquo;
            </span>{" "}
            will be permanently removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="-mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-3 sm:p-4 grid grid-cols-2 gap-2 sm:gap-3 bg-neutral-50/80 border-t border-neutral-100 min-w-0 max-w-full">
          <AlertDialogCancel
            onClick={onCancel}
            disabled={isDeleting}
            className="h-10 min-h-[40px] text-xs sm:text-sm font-medium rounded-xl border-neutral-300 hover:bg-neutral-100 min-w-0 px-2 sm:px-4"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-10 min-h-[40px] text-xs sm:text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white border-none shadow-sm min-w-0 px-2 sm:px-4"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteAddonDialog;
