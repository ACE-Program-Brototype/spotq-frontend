/**
 * Edit Category Modal Component
 * Hosts the Edit Category Form inside a modal dialog.
 * Handles pre-filling, submitting updates, loading state, and error preservation.
 */

import { AlertTriangle, Edit3, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MENU_MESSAGES } from "../constants/menu.constants";
import { useUpdateMenuCategory } from "../hooks/use-update-menu-category";
import type { MenuCategory, MenuCategoryFormValues } from "../types/menu-category.types";
import { MenuCategoryForm } from "./MenuCategoryForm";

export interface EditCategoryModalProps {
  isOpen: boolean;
  category: MenuCategory | null;
  restaurantId: string;
  onClose: () => void;
  onSuccess?: (updated: MenuCategory) => void;
}

export function EditCategoryModal({
  isOpen,
  category,
  restaurantId,
  onClose,
  onSuccess,
}: EditCategoryModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedFormDraft, setSavedFormDraft] = useState<Partial<MenuCategoryFormValues> | null>(
    null,
  );

  const updateMutation = useUpdateMenuCategory();

  // Reset error state and draft whenever modal opens or category changes
  useEffect(() => {
    if (isOpen && category) {
      setErrorMessage(null);
      setSavedFormDraft({
        name: category.name,
        description: category.description || "",
        displayOrder: category.displayOrder,
        isActive: category.isActive,
      });
    }
  }, [isOpen, category]);

  if (!isOpen || !category) return null;

  const handleSubmit = async (values: MenuCategoryFormValues) => {
    setErrorMessage(null);
    // Preserve values in case submission fails
    setSavedFormDraft(values);

    try {
      const updated = await updateMutation.mutateAsync({
        restaurantId,
        categoryId: category.id,
        payload: {
          name: values.name,
          description: values.description,
          displayOrder: values.displayOrder,
          isActive: values.isActive,
        },
      });

      if (onSuccess) {
        onSuccess(updated);
      }
      onClose();
    } catch (err: unknown) {
      // Keep form open, preserve admin's changes, display user-friendly message
      setErrorMessage((err as Error)?.message || MENU_MESSAGES.UPDATE_ERROR);
    }
  };

  const handleClose = () => {
    if (!updateMutation.isPending) {
      setErrorMessage(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white border border-[#eddcd4] shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-category-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#f3e6de] bg-[#fffcf9]">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-[#fef3ec] flex items-center justify-center text-[#9a3412] border border-[#fae2d3] shrink-0">
              <Edit3 className="size-4.5 text-[#e8631b]" />
            </div>
            <div>
              <h2
                id="edit-category-title"
                className="text-base font-bold text-neutral-900 leading-tight"
              >
                Edit Menu Category
              </h2>
              <p className="text-xs text-neutral-500">
                Update category details, display sequence, and visibility
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={updateMutation.isPending}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Friendly Error Banner if submission fails */}
          {errorMessage && (
            <div
              className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex items-start gap-2.5 text-rose-800"
              role="alert"
            >
              <AlertTriangle className="size-4.5 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-semibold">Unable to update menu category.</p>
                <p className="text-rose-700/90 leading-relaxed">
                  Please review the details and try again. Your changes have been preserved.
                </p>
              </div>
            </div>
          )}

          <MenuCategoryForm
            mode="edit"
            initialValues={savedFormDraft || undefined}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isLoading={updateMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
