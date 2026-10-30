import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CART_MESSAGES } from "../constants/cart.constants";

interface CartRestaurantMismatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CartRestaurantMismatchDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: CartRestaurantMismatchDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-stone-900">
            {CART_MESSAGES.CONFIRM_TITLE}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-stone-600 leading-relaxed">
            {CART_MESSAGES.RESTAURANT_MISMATCH_CONFIRMATION}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex flex-row justify-end gap-3">
          <AlertDialogCancel
            onClick={onCancel}
            className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            {CART_MESSAGES.CANCEL_BUTTON}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-xl bg-[#ff6b00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e05e00]"
          >
            {CART_MESSAGES.CONFIRM_BUTTON}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
