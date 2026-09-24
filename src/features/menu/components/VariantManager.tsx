import { CheckCircle2, Layers, Plus, Trash2 } from "lucide-react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import type { CreateMenuItemFormData } from "@/features/menu/schemas/create-menu-item.schema";

interface VariantManagerProps {
  form: UseFormReturn<CreateMenuItemFormData>;
}

export function VariantManager({ form }: VariantManagerProps) {
  const {
    watch,
    setValue,
    register,
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const variants = watch("variants") || [];

  const handleAddVariant = () => {
    const isFirst = variants.length === 0;
    append({
      name: "",
      portion: "",
      price: 0,
      sku: "",
      isDefault: isFirst,
      isAvailable: true,
    });
  };

  const handleRemoveVariant = (index: number) => {
    if (fields.length <= 1) return;
    const wasDefault = variants[index]?.isDefault;
    remove(index);
    if (wasDefault && fields.length > 1) {
      setValue("variants.0.isDefault", true, { shouldValidate: true });
    }
  };

  const handleSetDefault = (targetIndex: number) => {
    variants.forEach((_, i) => {
      setValue(`variants.${i}.isDefault`, i === targetIndex, {
        shouldValidate: true,
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Layers className="size-4 text-[#e8631b]" />
            {MENU_MESSAGES.VARIANTS_SECTION_TITLE}
          </h4>
          <p className="text-xs text-neutral-500">{MENU_MESSAGES.VARIANTS_SECTION_DESC}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddVariant}
          className="border-[#e5dcd6] hover:bg-[#fff9f4] hover:text-[#9a3412] text-xs font-semibold"
        >
          <Plus className="size-3.5 mr-1 text-[#e8631b]" />
          {MENU_MESSAGES.ADD_VARIANT_BTN}
        </Button>
      </div>

      {errors.variants?.message && (
        <p className="text-xs font-medium text-rose-500">{errors.variants.message}</p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => {
          const variantErrors = errors.variants?.[index];
          const isDefault = variants[index]?.isDefault ?? false;
          const isAvailable = variants[index]?.isAvailable ?? true;

          return (
            <div
              key={field.id}
              className={`rounded-2xl border p-4 transition-all ${
                isDefault
                  ? "border-[#e8631b] bg-[#fffaf5] shadow-xs"
                  : "border-[#eddcd4] bg-white hover:border-[#dfcece]"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                {/* Variant Name */}
                <div className="sm:col-span-3 space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">
                    {MENU_MESSAGES.VARIANT_NAME_LABEL} <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    placeholder={MENU_MESSAGES.VARIANT_NAME_PLACEHOLDER}
                    {...register(`variants.${index}.name`)}
                    className="h-9 text-xs bg-neutral-50/50 focus:bg-white"
                  />
                  {variantErrors?.name && (
                    <p className="text-[10px] text-rose-500 font-medium">
                      {variantErrors.name.message}
                    </p>
                  )}
                </div>

                {/* Portion Size */}
                <div className="sm:col-span-3 space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">
                    {MENU_MESSAGES.VARIANT_PORTION_LABEL} <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    placeholder={MENU_MESSAGES.VARIANT_PORTION_PLACEHOLDER}
                    {...register(`variants.${index}.portion`)}
                    className="h-9 text-xs bg-neutral-50/50 focus:bg-white"
                  />
                  {variantErrors?.portion && (
                    <p className="text-[10px] text-rose-500 font-medium">
                      {variantErrors.portion.message}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">
                    {MENU_MESSAGES.VARIANT_PRICE_LABEL} <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs font-semibold text-neutral-400">
                      ₹
                    </span>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      placeholder={MENU_MESSAGES.VARIANT_PRICE_PLACEHOLDER}
                      {...register(`variants.${index}.price`, { valueAsNumber: true })}
                      className="pl-6 h-9 text-xs bg-neutral-50/50 focus:bg-white"
                    />
                  </div>
                  {variantErrors?.price && (
                    <p className="text-[10px] text-rose-500 font-medium">
                      {variantErrors.price.message}
                    </p>
                  )}
                </div>

                {/* SKU */}
                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">
                    {MENU_MESSAGES.VARIANT_SKU_LABEL}
                  </Label>
                  <Input
                    placeholder={MENU_MESSAGES.VARIANT_SKU_PLACEHOLDER}
                    {...register(`variants.${index}.sku`)}
                    className="h-9 text-xs uppercase bg-neutral-50/50 focus:bg-white"
                  />
                </div>

                {/* Actions & Defaults */}
                <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-5">
                  <button
                    type="button"
                    onClick={() => handleSetDefault(index)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      isDefault
                        ? "bg-[#e8631b] text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    <CheckCircle2 className="size-3" />
                    {isDefault ? "Default" : "Set Default"}
                  </button>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      aria-label="Remove variant"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* In Stock toggle */}
              <div className="mt-2.5 pt-2 border-t border-[#f3e6de]/60 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500 font-medium">
                  {isDefault
                    ? "Pre-selected choice for customers on checkout"
                    : "Alternative portion size"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-neutral-700">
                    {isAvailable ? "In Stock" : "86'd / Sold Out"}
                  </span>
                  <Switch
                    checked={isAvailable}
                    onChange={(e) => setValue(`variants.${index}.isAvailable`, e.target.checked)}
                    aria-label={`Toggle availability for variant ${variants[index]?.name || index + 1}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
