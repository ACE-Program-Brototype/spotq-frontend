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
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-50">
            <Trash2 className="size-5 text-red-500" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Add-on?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold text-neutral-800">{addon?.name}</span> will be
            permanently removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white border-none"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteAddonDialog;
