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
      price: undefined as never,
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
    const updatedVariants = variants.map((v, i) => ({
      ...v,
      isDefault: i === targetIndex,
    }));
    setValue("variants", updatedVariants, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 pb-2 border-b border-[#f3e6de] min-w-0">
        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-1.5 min-w-0">
          <Layers className="size-3.5 sm:size-4 text-[#e8631b] shrink-0" />
          <span className="truncate sm:overflow-visible">
            {MENU_MESSAGES.VARIANTS_SECTION_TITLE}
          </span>
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddVariant}
          className="border-[#e5dcd6] hover:bg-[#fff9f4] hover:text-[#9a3412] text-[11px] sm:text-xs font-semibold h-7.5 sm:h-8 px-2 sm:px-2.5 shrink-0 shadow-2xs cursor-pointer"
        >
          <Plus className="size-3 sm:size-3.5 mr-1 text-[#e8631b]" />
          <span className="sm:hidden">Add Variant</span>
          <span className="hidden sm:inline">{MENU_MESSAGES.ADD_VARIANT_BTN}</span>
        </Button>
      </div>

      {errors.variants?.message && (
        <p className="text-xs font-medium text-rose-500">{errors.variants.message}</p>
      )}

      {/* Variant Cards List */}
      <div className="space-y-3">
        {fields.map((field, index) => {
          const variantErrors = errors.variants?.[index];
          const isDefault = variants[index]?.isDefault ?? false;
          const isAvailable = variants[index]?.isAvailable ?? true;

          return (
            <div
              key={field.id}
              className={`rounded-2xl border p-3.5 sm:p-4 transition-all space-y-3 ${
                isDefault
                  ? "border-[#e8631b]/80 bg-[#fffaf5] shadow-xs"
                  : "border-[#eddcd4] bg-white hover:border-[#dfcece]"
              }`}
            >
              {/* Variant Card Header: Identity, Default Badge/Button, Availability, Delete */}
              <div className="flex items-center justify-between gap-1.5 sm:gap-2 pb-2.5 border-b border-[#f3e6de]/70 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-wrap">
                  <span className="text-xs font-bold text-neutral-800">
                    Variant #{index + 1}
                  </span>

                  {isDefault ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e8631b] px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-2xs">
                      <CheckCircle2 className="size-3" />
                      Default Choice
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(index)}
                      className="inline-flex items-center gap-1 rounded-full bg-neutral-100 hover:bg-[#fef3ec] hover:text-[#9a3412] px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-neutral-600 transition-colors cursor-pointer border border-neutral-200"
                    >
                      <CheckCircle2 className="size-3 text-neutral-400" />
                      Set as Default
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Availability Switch */}
                  <div className="flex items-center gap-1 sm:gap-1.5 bg-white/80 rounded-lg px-1.5 sm:px-2 py-0.5 border border-[#eddcd4]">
                    <span className="text-[10px] font-semibold text-neutral-600 hidden sm:inline">
                      {isAvailable ? "In Stock" : "Out of Stock"}
                    </span>
                    <Switch
                      checked={isAvailable}
                      onChange={(e) => setValue(`variants.${index}.isAvailable`, e.target.checked)}
                      aria-label={`Toggle availability for variant ${variants[index]?.name || index + 1}`}
                    />
                  </div>

                  {/* Remove Variant Button */}
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      aria-label="Remove variant"
                      title="Remove variant"
                    >
                      <Trash2 className="size-3.5 sm:size-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Variant Inputs Grid: 2 cols on mobile, 12 cols on desktop/laptop */}
              <div className="grid grid-cols-2 md:grid-cols-12 gap-2.5 sm:gap-3 items-start">
                {/* Variant Name */}
                <div className="col-span-2 md:col-span-4 space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">
                    {MENU_MESSAGES.VARIANT_NAME_LABEL} <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    placeholder={MENU_MESSAGES.VARIANT_NAME_PLACEHOLDER}
                    {...register(`variants.${index}.name`)}
                    className="h-9 text-xs sm:text-sm bg-neutral-50/50 focus:bg-white"
                  />
                  {variantErrors?.name && (
                    <p className="text-[10px] text-rose-500 font-medium">
                      {variantErrors.name.message}
                    </p>
                  )}
                </div>

                {/* Portion Size */}
                <div className="col-span-1 md:col-span-3 space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">
                    {MENU_MESSAGES.VARIANT_PORTION_LABEL} <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    placeholder={MENU_MESSAGES.VARIANT_PORTION_PLACEHOLDER}
                    {...register(`variants.${index}.portion`)}
                    className="h-9 text-xs sm:text-sm bg-neutral-50/50 focus:bg-white"
                  />
                  {variantErrors?.portion && (
                    <p className="text-[10px] text-rose-500 font-medium">
                      {variantErrors.portion.message}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">
                    {MENU_MESSAGES.VARIANT_PRICE_LABEL} <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs font-bold text-neutral-400">
                      ₹
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={MENU_MESSAGES.VARIANT_PRICE_PLACEHOLDER}
                      {...register(`variants.${index}.price`, {
                        setValueAs: (val) =>
                          val === "" || Number.isNaN(Number(val)) ? undefined : Number(val),
                      })}
                      className="pl-6 h-9 text-xs sm:text-sm font-semibold bg-neutral-50/50 focus:bg-white"
                    />
                  </div>
                  {variantErrors?.price && (
                    <p className="text-[10px] text-rose-500 font-medium">
                      {variantErrors.price.message}
                    </p>
                  )}
                </div>

                {/* SKU */}
                <div className="col-span-2 md:col-span-3 space-y-1">
                  <Label className="text-[11px] font-bold text-neutral-700">
                    {MENU_MESSAGES.VARIANT_SKU_LABEL}
                  </Label>
                  <Input
                    placeholder={MENU_MESSAGES.VARIANT_SKU_PLACEHOLDER}
                    {...register(`variants.${index}.sku`)}
                    className="h-9 text-xs uppercase bg-neutral-50/50 focus:bg-white"
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
