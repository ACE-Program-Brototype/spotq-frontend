/**
 * Edit Category Modal Component
 * Hosts the Edit Category Form inside a modal dialog.
 * Handles pre-filling, submitting updates, loading state, and error preservation.
 */

import { AlertTriangle, Edit3, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MENU_MESSAGES } from "../constants/menu.constants";
import { useUpdateMenuCategory } from "../hooks/use-update-menu-category";
import type { MenuCategory, MenuCategoryFormValues } from "../types/menu-category.types";
import { MenuCategoryForm } from "./MenuCategoryForm";

export interface EditCategoryModalProps {
  isOpen: boolean;
  category: MenuCategory | null;
  restaurantId: string;
  onClose: () => void;
}

export function EditCategoryModal({
  isOpen,
  category,
  restaurantId,
  onClose,
}: EditCategoryModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateMutation = useUpdateMenuCategory();

  // Reset error state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (!updateMutation.isPending) {
      setErrorMessage(null);
      onClose();
    }
  }, [updateMutation.isPending, onClose]);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !category) return null;

  const handleSubmit = async (values: MenuCategoryFormValues) => {
    setErrorMessage(null);

    try {
      await updateMutation.mutateAsync({
        restaurantId,
        categoryId: category.id,
        payload: {
          name: values.name,
          description: values.description,
          displayOrder: values.displayOrder,
          isActive: values.isActive,
        },
      });

      onClose();
    } catch (err: unknown) {
      // Keep form open, preserve user's changes, display user-friendly message
      setErrorMessage((err as Error)?.message || MENU_MESSAGES.UPDATE_ERROR);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-category-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop overlay */}
      <button
        type="button"
        aria-label="Close modal backdrop"
        onClick={handleClose}
        disabled={updateMutation.isPending}
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs cursor-default border-0 outline-none w-full h-full disabled:cursor-not-allowed"
      />

      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-[#eddcd4] shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
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
                <p className="font-semibold">{errorMessage}</p>
                <p className="text-rose-700/90 leading-relaxed">
                  Your changes have been preserved. Please adjust the details and try again.
                </p>
              </div>
            </div>
          )}

          <MenuCategoryForm
            key={category.id}
            mode="edit"
            initialValues={{
              name: category.name,
              description: category.description || "",
              displayOrder: category.displayOrder,
              isActive: category.isActive,
            }}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isLoading={updateMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
