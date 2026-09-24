import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import { useMenuCategories } from "@/features/menu/hooks/use-menu-categories";
import {
  type CreateCategoryFormData,
  createCategorySchema,
} from "@/features/menu/schemas/create-category.schema";
import type { MenuCategory } from "@/features/menu/types/menu.types";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  onCategoryCreated?: (category: MenuCategory) => void;
}

export function CreateCategoryModal({
  isOpen,
  onClose,
  restaurantId,
  onCategoryCreated,
}: CreateCategoryModalProps) {
  const { createCategory, isCreating } = useMenuCategories(restaurantId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      displayOrder: 0,
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  if (!isOpen) return null;

  const onSubmit = async (data: CreateCategoryFormData) => {
    try {
      const created = await createCategory(data);
      reset();
      onCategoryCreated?.(created);
      onClose();
    } catch {
      // Handled in mutation hook toast
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-category-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#eddcd4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3e6de] bg-[#fffcf9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-[#fef3ec] flex items-center justify-center text-[#9a3412] border border-[#fae2d3]">
              <FolderPlus className="size-4.5 text-[#e8631b]" />
            </div>
            <div>
              <h3
                id="create-category-modal-title"
                className="text-base font-bold text-neutral-900 leading-tight"
              >
                {MENU_MESSAGES.MODAL_CREATE_CATEGORY_TITLE}
              </h3>
              <p className="text-xs text-neutral-500">{MENU_MESSAGES.MODAL_CREATE_CATEGORY_DESC}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1.5">
            <Label htmlFor="category-name" className="text-xs font-semibold text-neutral-800">
              {MENU_MESSAGES.CATEGORY_NAME_LABEL} <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="category-name"
              placeholder={MENU_MESSAGES.CATEGORY_NAME_PLACEHOLDER}
              {...register("name")}
              className="h-10 text-sm bg-neutral-50/50 focus:bg-white border-[#e5dcd6]"
            />
            {errors.name && (
              <p className="text-xs font-medium text-rose-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="category-description"
              className="text-xs font-semibold text-neutral-800"
            >
              {MENU_MESSAGES.CATEGORY_DESC_LABEL}
            </Label>
            <Textarea
              id="category-description"
              rows={3}
              placeholder={MENU_MESSAGES.CATEGORY_DESC_PLACEHOLDER}
              {...register("description")}
              className="text-sm bg-neutral-50/50 focus:bg-white border-[#e5dcd6] resize-none"
            />
            {errors.description && (
              <p className="text-xs font-medium text-rose-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category-order" className="text-xs font-semibold text-neutral-800">
                {MENU_MESSAGES.CATEGORY_ORDER_LABEL}
              </Label>
              <Input
                id="category-order"
                type="number"
                min="0"
                placeholder={MENU_MESSAGES.CATEGORY_ORDER_PLACEHOLDER}
                {...register("displayOrder", { valueAsNumber: true })}
                className="h-10 text-sm bg-neutral-50/50 focus:bg-white border-[#e5dcd6]"
              />
              <p className="text-[10px] text-neutral-400">{MENU_MESSAGES.CATEGORY_ORDER_HINT}</p>
              {errors.displayOrder && (
                <p className="text-xs font-medium text-rose-500">{errors.displayOrder.message}</p>
              )}
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-[#fae2d3] bg-[#fffaf5] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800">
                  {MENU_MESSAGES.CATEGORY_STATUS_LABEL}
                </span>
                <Switch
                  checked={isActive}
                  onChange={(e) => setValue("isActive", e.target.checked)}
                  aria-label="Category active status"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">
                {isActive ? "Visible on menu" : "Hidden from menu"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#f3e6de]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isCreating}
              className="border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            >
              {MENU_MESSAGES.BTN_CANCEL}
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-[#e8631b] hover:bg-[#cf5413] text-white font-medium"
            >
              {isCreating ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                  {MENU_MESSAGES.BTN_CREATING_CATEGORY}
                </>
              ) : (
                MENU_MESSAGES.BTN_CREATE_CATEGORY
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
