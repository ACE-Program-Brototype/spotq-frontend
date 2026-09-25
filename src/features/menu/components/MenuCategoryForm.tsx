/**
 * Menu Category Form Component
 * Reusable form component supporting both edit and create modes.
 * Implements validation, loading state, and accessible input fields.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Hash, Layers, Tag } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { type MenuCategorySchema, menuCategorySchema } from "../schemas/menu-category.schema";
import type { MenuCategoryFormValues } from "../types/menu-category.types";

export interface MenuCategoryFormProps {
  mode?: "edit" | "create";
  initialValues?: Partial<MenuCategoryFormValues>;
  onSubmit: (values: MenuCategoryFormValues) => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MenuCategoryForm({
  mode = "edit",
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
}: MenuCategoryFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MenuCategorySchema>({
    resolver: zodResolver(menuCategorySchema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      displayOrder: initialValues?.displayOrder ?? 1,
      isActive: initialValues?.isActive ?? true,
    },
  });

  // Re-sync default values when initialValues update (e.g. category selected)
  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || "",
        description: initialValues.description || "",
        displayOrder: initialValues.displayOrder ?? 1,
        isActive: initialValues.isActive ?? true,
      });
    }
  }, [initialValues, reset]);

  const currentIsActive = watch("isActive");
  const isPending = isLoading || isSubmitting;

  const onFormSubmit = async (data: MenuCategorySchema) => {
    await onSubmit({
      name: data.name.trim(),
      description: data.description.trim(),
      displayOrder: Number(data.displayOrder),
      isActive: data.isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5" noValidate>
      {/* Category Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="category-name"
          className="flex items-center justify-between text-xs font-semibold text-neutral-700"
        >
          <span className="flex items-center gap-1.5">
            <Tag className="size-3.5 text-neutral-400" />
            Category Name <span className="text-rose-500">*</span>
          </span>
          <span className="text-[11px] font-normal text-neutral-400">Max 255 chars</span>
        </label>
        <Input
          id="category-name"
          type="text"
          placeholder="e.g. Starters"
          disabled={isPending}
          className="h-10 rounded-xl border-[#eddcd4] bg-[#faf7f5]/40 focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b]"
          {...register("name")}
        />
        {errors.name && (
          <p className="flex items-center gap-1 text-xs font-medium text-rose-500">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.name.message}</span>
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label
          htmlFor="category-description"
          className="flex items-center justify-between text-xs font-semibold text-neutral-700"
        >
          <span className="flex items-center gap-1.5">
            <Layers className="size-3.5 text-neutral-400" />
            Description <span className="text-rose-500">*</span>
          </span>
          <span className="text-[11px] font-normal text-neutral-400">Max 1000 chars</span>
        </label>
        <Textarea
          id="category-description"
          rows={3}
          placeholder="e.g. Delicious starters and appetizers."
          disabled={isPending}
          className="rounded-xl border-[#eddcd4] bg-[#faf7f5]/40 focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b] resize-none"
          {...register("description")}
        />
        {errors.description && (
          <p className="flex items-center gap-1 text-xs font-medium text-rose-500">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.description.message}</span>
          </p>
        )}
      </div>

      {/* Display Order */}
      <div className="space-y-1.5">
        <label
          htmlFor="category-display-order"
          className="flex items-center justify-between text-xs font-semibold text-neutral-700"
        >
          <span className="flex items-center gap-1.5">
            <Hash className="size-3.5 text-neutral-400" />
            Display Order <span className="text-rose-500">*</span>
          </span>
          <span className="text-[11px] font-normal text-neutral-400">Positive integer</span>
        </label>
        <Input
          id="category-display-order"
          type="number"
          min={1}
          step={1}
          placeholder="1"
          disabled={isPending}
          className="h-10 rounded-xl border-[#eddcd4] bg-[#faf7f5]/40 focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b]"
          {...register("displayOrder", { valueAsNumber: true })}
        />
        {errors.displayOrder && (
          <p className="flex items-center gap-1 text-xs font-medium text-rose-500">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.displayOrder.message}</span>
          </p>
        )}
      </div>

      {/* Active / Inactive Status */}
      <div className="space-y-2 pt-1">
        <label
          htmlFor="category-status-switch"
          className="block text-xs font-semibold text-neutral-700"
        >
          Status
        </label>
        <div className="flex items-center justify-between rounded-xl border border-[#fae2d3] bg-[#fffcf9] p-3.5">
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${currentIsActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                }`}
            >
              <span
                className={`size-1.5 rounded-full ${currentIsActive ? "bg-emerald-500" : "bg-neutral-400"
                  }`}
              />
              {currentIsActive ? "Active" : "Inactive"}
            </span>
            <span className="text-xs text-neutral-500">
              {currentIsActive
                ? "Visible to customers browsing the digital menu"
                : "Hidden from customers until activated"}
            </span>
          </div>

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                id="category-status-switch"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={isPending}
              />
            )}
          />
        </div>
        {errors.isActive && (
          <p className="flex items-center gap-1 text-xs font-medium text-rose-500">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.isActive.message}</span>
          </p>
        )}
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f3e6de]">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
          className="rounded-xl border-[#eddcd4] text-neutral-700 hover:bg-[#faf7f5] px-4"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="min-w-[140px] rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" theme="white" />
              <span>Saving Changes...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4" />
              <span>{mode === "edit" ? "Save Changes" : "Create Category"}</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
