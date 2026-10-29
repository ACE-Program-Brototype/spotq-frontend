import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { AddonSelector } from "@/features/menu/components/addon/AddonSelector";
import { ImageUploader } from "@/features/menu/components/ImageUploader";
import { MenuItemGeneralInfoSection } from "@/features/menu/components/MenuItemGeneralInfoSection";
import { VariantManager } from "@/features/menu/components/VariantManager";
import { type DietaryType, MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
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
        name: initialData.name || "",
        categoryId: initialData.categoryId || "",
        description: initialData.description || "",
        dietaryType: initialDietaryType,
        preparationTime: initialData.preparationTime ?? undefined,
        imageUrl: initialData.images?.[0]?.objectKey || "",
        isAvailable: initialData.isAvailable ?? true,
        variants: parsedVariants,
        selectedAddonIds,
        addonOverrides,
      };
    }

    return {
      name: "",
      categoryId: "",
      description: "",
      dietaryType: "VEG" as DietaryType,
      preparationTime: undefined,
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
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (initialData && !isInitializedRef.current) {
      reset(defaultValues);
      isInitializedRef.current = true;
    }
  }, [initialData, defaultValues, reset]);

  const isAvailable = watch("isAvailable");
  const imageUrl = watch("imageUrl");
  const selectedAddonIds = watch("selectedAddonIds") || [];
  const addonOverrides = watch("addonOverrides") || {};
  const currentDietaryType = watch("dietaryType");

  const onSubmit = async (data: CreateMenuItemFormData) => {
    try {
      const defaultVariant = data.variants.find((v) => v.isDefault) ?? data.variants[0];
      const basePrice = defaultVariant ? Number(defaultVariant.price) : 0;

      const addonsPayload = (data.selectedAddonIds || []).map((addonId) => {
        const override = data.addonOverrides?.[addonId];
        return {
          addonId,
          ...(override !== undefined && override !== null
            ? { priceOverride: Number(override) }
            : {}),
        };
      });

      if (mode === "edit" && menuItemId) {
        const otherImages = initialData?.images?.slice(1) || [];
        const imagesPayload = data.imageUrl?.trim()
          ? [
              {
                id: initialData?.images?.[0]?.id,
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

      navigate(RESTAURANT_ROUTES.MENU.ITEMS);
    } catch {
      // Error handled by mutation hook toast
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information Section */}
      <MenuItemGeneralInfoSection
        register={register}
        errors={errors}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        currentDietaryType={currentDietaryType}
        isAvailable={isAvailable}
        setValue={setValue}
      />

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
          onClick={() => navigate(RESTAURANT_ROUTES.MENU.ITEMS)}
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
