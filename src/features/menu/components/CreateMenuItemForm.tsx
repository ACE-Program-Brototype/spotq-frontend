import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Loader2, Utensils } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AddonSelector } from "@/features/menu/components/AddonSelector";
import { ImageUploader } from "@/features/menu/components/ImageUploader";
import { VariantManager } from "@/features/menu/components/VariantManager";
import {
  DIETARY_OPTIONS,
  type DietaryType,
  MENU_MESSAGES,
} from "@/features/menu/constants/menu.constants";
import { useCreateMenuItem } from "@/features/menu/hooks/use-create-menu-item";
import { useMenuCategories } from "@/features/menu/hooks/use-menu-categories";
import { useUpdateMenuItem } from "@/features/menu/hooks/use-update-menu-item";
import {
  type CreateMenuItemFormData,
  createMenuItemSchema,
} from "@/features/menu/schemas/create-menu-item.schema";
import type { MenuItemDetails } from "@/features/menu/types/menu.types";

export interface CreateMenuItemFormProps {
  restaurantId: string;
  mode?: "create" | "edit";
  menuItemId?: string;
  initialData?: MenuItemDetails | null;
}

const parseVariantNamePortion = (fullName: string = "") => {
  if (!fullName) return { name: "", portion: "" };
  const match = fullName.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return { name: match[1].trim(), portion: match[2].trim() };
  }
  return { name: fullName.trim(), portion: "" };
};

export function CreateMenuItemForm({
  restaurantId,
  mode = "create",
  menuItemId,
  initialData,
}: CreateMenuItemFormProps) {
  const navigate = useNavigate();
  const { categories, isLoading: isLoadingCategories } = useMenuCategories(restaurantId);
  const { createMenuItem, isSubmitting: isCreating } = useCreateMenuItem(restaurantId);
  const { updateMenuItem, isSubmitting: isUpdating } = useUpdateMenuItem(
    restaurantId,
    menuItemId || "",
  );

  const isSubmitting = mode === "edit" ? isUpdating : isCreating;
  const isInitializedRef = useRef(false);

  const defaultValues = useMemo<CreateMenuItemFormData>(() => {
    if (initialData) {
      const parsedVariants =
        initialData.variants && initialData.variants.length > 0
          ? initialData.variants.map((v) => {
              const { name, portion } = parseVariantNamePortion(v.name);
              return {
                id: v.id,
                name,
                portion,
                price: v.price,
                sku: v.sku || "",
                isDefault: v.isDefault,
                isAvailable: v.isAvailable,
              };
            })
          : [
              {
                name: "",
                portion: "",
                price: undefined as never,
                sku: "",
                isDefault: true,
                isAvailable: true,
              },
            ];

      const selectedAddonIds = initialData.addons?.map((a) => a.addonId) ?? [];
      const addonOverrides: Record<string, number | null> = {};
      initialData.addons?.forEach((a) => {
        if (a.priceOverride !== null && a.priceOverride !== undefined) {
          addonOverrides[a.addonId] = a.priceOverride;
        }
      });

      const initialDietaryType: DietaryType =
        initialData.dietaryType || (initialData.isVegetarian ? "VEG" : "NON_VEG");

      return {
        name: initialData.name,
        categoryId: initialData.categoryId,
        description: initialData.description || "",
        dietaryType: initialDietaryType,
        preparationTime: initialData.preparationTime ?? (null as never),
        imageUrl: initialData.images?.[0]?.objectKey || "",
        isAvailable: initialData.isAvailable,
        variants: parsedVariants,
        selectedAddonIds,
        addonOverrides,
      };
    }

    return {
      name: "",
      categoryId: "",
      description: "",
      dietaryType: "NON_VEG",
      preparationTime: 15,
      imageUrl: "",
      isAvailable: true,
      variants: [
        {
          name: "",
          portion: "",
          price: undefined as never,
          sku: "",
          isDefault: true,
          isAvailable: true,
        },
      ],
      selectedAddonIds: [],
      addonOverrides: {},
    };
  }, [initialData]);

  const form = useForm<CreateMenuItemFormData>({
    resolver: zodResolver(createMenuItemSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      if (!isInitializedRef.current) {
        form.reset(defaultValues);
        isInitializedRef.current = true;
      } else if (!form.formState.isDirty) {
        form.reset(defaultValues);
      }
    }
  }, [defaultValues, form, initialData]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const currentDietaryType = watch("dietaryType");
  const isAvailable = watch("isAvailable");
  const imageUrl = watch("imageUrl");
  const selectedAddonIds = watch("selectedAddonIds");
  const addonOverrides = watch("addonOverrides");

  const onSubmit = async (data: CreateMenuItemFormData) => {
    try {
      const addonsPayload = data.selectedAddonIds.map((addonId) => ({
        addonId,
        ...(data.addonOverrides[addonId] === null
          ? { priceOverride: null }
          : data.addonOverrides[addonId] !== undefined
            ? { priceOverride: data.addonOverrides[addonId] }
            : {}),
      }));

      const defaultVariant = data.variants.find((v) => v.isDefault) ?? data.variants[0];
      const basePrice = defaultVariant ? Number(defaultVariant.price) : 0;

      if (mode === "edit") {
        if (!menuItemId) {
          throw new Error(MENU_MESSAGES.RESTAURANT_OR_ITEM_ID_REQUIRED);
        }

        const existingImages = initialData?.images || [];
        const firstImageId = existingImages[0]?.id;
        const otherImages = existingImages.slice(1);

        const imagesPayload = data.imageUrl?.trim()
          ? [
              {
                ...(firstImageId ? { id: firstImageId } : {}),
                objectKey: data.imageUrl.trim(),
                displayOrder: 0,
              },
              ...otherImages.map((img, idx) => ({
                id: img.id,
                objectKey: img.objectKey,
                displayOrder: idx + 1,
              })),
            ]
          : otherImages.map((img, idx) => ({
              id: img.id,
              objectKey: img.objectKey,
              displayOrder: idx,
            }));

        await updateMenuItem({
          name: data.name,
          price: basePrice,
          categoryId: data.categoryId,
          description: data.description?.trim() ? data.description.trim() : null,
          dietaryType: data.dietaryType,
          preparationTime:
            data.preparationTime !== undefined &&
            data.preparationTime !== null &&
            !Number.isNaN(Number(data.preparationTime))
              ? Number(data.preparationTime)
              : null,
          imageUrl: data.imageUrl || null,
          images: imagesPayload,
          isAvailable: data.isAvailable,
          variants: data.variants,
          addons: addonsPayload,
        });
      } else {
        await createMenuItem({
          name: data.name,
          price: basePrice,
          categoryId: data.categoryId,
          description: data.description || undefined,
          dietaryType: data.dietaryType,
          preparationTime:
            data.preparationTime !== undefined &&
            data.preparationTime !== null &&
            !Number.isNaN(Number(data.preparationTime))
              ? Number(data.preparationTime)
              : undefined,
          imageUrl: data.imageUrl || undefined,
          isAvailable: data.isAvailable,
          variants: data.variants,
          addons: addonsPayload,
        });
      }

      navigate("/restaurant/menu/items");
    } catch {
      // Error handled by mutation hook toast
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information Card */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#f3e6de]">
          <div className="size-8 rounded-lg bg-[#fef3ec] flex items-center justify-center text-[#e8631b]">
            <Utensils className="size-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 leading-tight">
              General Information
            </h3>
            <p className="text-xs text-neutral-500">
              Core details, categorization, and dietary classifications
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dish Name */}
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="item-name" className="text-xs font-semibold text-neutral-800">
              {MENU_MESSAGES.ITEM_NAME_LABEL} <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="item-name"
              placeholder={MENU_MESSAGES.ITEM_NAME_PLACEHOLDER}
              {...register("name")}
              className="h-10 text-sm bg-neutral-50/50 focus:bg-white border-[#e5dcd6]"
            />
            {errors.name && (
              <p className="text-xs font-medium text-rose-500">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="item-category" className="text-xs font-semibold text-neutral-800">
              {MENU_MESSAGES.CATEGORY_LABEL} <span className="text-rose-500">*</span>
            </Label>
            <select
              id="item-category"
              {...register("categoryId")}
              disabled={isLoadingCategories}
              className="w-full h-10 px-3 rounded-lg border border-[#e5dcd6] bg-neutral-50/50 focus:bg-white text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#e8631b]/20"
            >
              <option value="">{MENU_MESSAGES.CATEGORY_PLACEHOLDER}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs font-medium text-rose-500">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Preparation Time */}
          <div className="space-y-1.5">
            <Label htmlFor="item-prep-time" className="text-xs font-semibold text-neutral-800">
              {MENU_MESSAGES.PREPARATION_TIME_LABEL} <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 size-4 text-neutral-400" />
              <Input
                id="item-prep-time"
                type="number"
                min="0"
                placeholder={MENU_MESSAGES.PREPARATION_TIME_PLACEHOLDER}
                {...register("preparationTime", {
                  setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)),
                })}
                className="pl-9 h-10 text-sm bg-neutral-50/50 focus:bg-white border-[#e5dcd6]"
              />
            </div>
            {errors.preparationTime && (
              <p className="text-xs font-medium text-rose-500">{errors.preparationTime.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="item-description" className="text-xs font-semibold text-neutral-800">
              {MENU_MESSAGES.DESCRIPTION_LABEL} <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="item-description"
              rows={3}
              placeholder={MENU_MESSAGES.DESCRIPTION_PLACEHOLDER}
              {...register("description")}
              className="text-sm bg-neutral-50/50 focus:bg-white border-[#e5dcd6] resize-none"
            />
            {errors.description && (
              <p className="text-xs font-medium text-rose-500">{errors.description.message}</p>
            )}
          </div>

          {/* Dietary Type Selection */}
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-semibold text-neutral-800">
              {MENU_MESSAGES.DIETARY_TYPE_LABEL}
            </Label>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-0.5">
              {DIETARY_OPTIONS.map((opt) => {
                const isSelected = currentDietaryType === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? "border-[#e8631b] bg-[#fffaf5] shadow-2xs ring-1 ring-[#e8631b]/20"
                        : "border-[#e5dcd6] bg-white hover:bg-neutral-50/80"
                    }`}
                  >
                    <input
                      type="radio"
                      name="dietaryType"
                      value={opt.value}
                      checked={isSelected}
                      onChange={() => setValue("dietaryType", opt.value)}
                      className="size-4 text-[#e8631b] focus:ring-[#e8631b] border-neutral-300 accent-[#e8631b] cursor-pointer"
                    />
                    <span
                      className={`inline-flex items-center justify-center size-3.5 border ${opt.borderColor} p-0.5 rounded-xs bg-white shrink-0`}
                    >
                      <span className={`size-1.5 rounded-full ${opt.dotColor}`} />
                    </span>
                    <span className="text-xs font-semibold text-neutral-800">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Active Status */}
          <div className="md:col-span-2 flex items-center justify-between rounded-xl border border-[#fae2d3] bg-[#fffaf5] p-4">
            <div>
              <p className="text-xs font-bold text-neutral-900">
                {MENU_MESSAGES.AVAILABILITY_LABEL}
              </p>
              <p className="text-[11px] text-neutral-500">
                {isAvailable
                  ? MENU_MESSAGES.AVAILABILITY_ACTIVE_DESC
                  : MENU_MESSAGES.AVAILABILITY_INACTIVE_DESC}
              </p>
            </div>
            <Switch
              checked={isAvailable}
              onChange={(e) => setValue("isAvailable", e.target.checked)}
              aria-label="Item availability toggle"
            />
          </div>
        </div>
      </div>

      {/* Dish Image Card */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-neutral-900 leading-tight">
            {MENU_MESSAGES.IMAGE_LABEL} <span className="text-rose-500">*</span>
          </h3>
          <p className="text-xs text-neutral-500">
            High resolution photo of the dish to entice diners
          </p>
        </div>
        <ImageUploader
          value={imageUrl}
          onChange={(url) => setValue("imageUrl", url, { shouldValidate: true })}
          restaurantId={restaurantId}
        />
        {errors.imageUrl && (
          <p className="text-xs font-medium text-rose-500">{errors.imageUrl.message}</p>
        )}
      </div>

      {/* Variants & Portion Sizes Card (SCRUM-1113) */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-6 shadow-xs">
        <VariantManager form={form} />
      </div>

      {/* Complementary Add-ons Card */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-6 shadow-xs">
        <AddonSelector
          restaurantId={restaurantId}
          selectedIds={selectedAddonIds}
          overrides={addonOverrides}
          onSelectionChange={(ids, overrides) => {
            setValue("selectedAddonIds", ids);
            setValue("addonOverrides", overrides);
          }}
        />
      </div>

      {/* Form Footer Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/restaurant/menu/items")}
          disabled={isSubmitting}
          className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 px-5"
        >
          {MENU_MESSAGES.BTN_CANCEL}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#e8631b] hover:bg-[#cf5413] text-white px-6 font-semibold shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              {mode === "edit" ? MENU_MESSAGES.BTN_UPDATING : MENU_MESSAGES.BTN_SUBMITTING}
            </>
          ) : mode === "edit" ? (
            MENU_MESSAGES.BTN_UPDATE
          ) : (
            MENU_MESSAGES.BTN_SUBMIT
          )}
        </Button>
      </div>
    </form>
  );
}

export const MenuItemForm = CreateMenuItemForm;
