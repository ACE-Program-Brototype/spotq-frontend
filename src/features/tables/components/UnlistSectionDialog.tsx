import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { TableSectionAll } from "../types/table.types";

interface UnlistSectionDialogProps {
  section: TableSectionAll | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sectionId: string) => Promise<void> | void;
  isLoading?: boolean;
}

export function UnlistSectionDialog({
  section,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: UnlistSectionDialogProps) {
  if (!section) return null;

  return (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) onClose();
      }}
      title={`Unlist "${section.name}"?`}
      description={`Are you sure you want to unlist this table section? If active tables are currently assigned to this section, the system will prevent unlisting until they are unassigned or moved.`}
      confirmText="Unlist Section"
      cancelText="Keep Section"
      confirmVariant="destructive"
      isLoading={isLoading}
      loadingText="Unlisting…"
      onConfirm={() => onConfirm(section.id)}
      onCancel={onClose}
    />
  );
}
