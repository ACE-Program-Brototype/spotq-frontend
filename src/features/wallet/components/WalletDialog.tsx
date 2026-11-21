import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function WalletDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-neutral-950/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-[#eddcd4] bg-white shadow-2xl outline-none">
          <div className="flex items-start justify-between border-b border-[#f0e3d6] px-5 py-4 sm:px-6">
            <div>
              <Dialog.Title className="text-lg font-bold text-neutral-900">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-neutral-500">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close render={<Button variant="ghost" size="icon" aria-label="Close dialog" />}>
              <X className="size-4" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
