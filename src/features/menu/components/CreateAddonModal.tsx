import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/features/menu/components/ImageUploader";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import { useRestaurantAddons } from "@/features/menu/hooks/use-restaurant-addons";
import {
  type CreateAddonFormData,
  createAddonSchema,
} from "@/features/menu/schemas/create-addon.schema";
import type { MenuAddon } from "@/features/menu/types/menu.types";

interface CreateAddonModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  onAddonCreated?: (addon: MenuAddon) => void;
}

export function CreateAddonModal({
  isOpen,
  onClose,
  restaurantId,
  onAddonCreated,
}: CreateAddonModalProps) {
  const { createAddon, isCreating } = useRestaurantAddons(restaurantId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateAddonFormData>({
    resolver: zodResolver(createAddonSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      isAvailable: true,
      imageKey: "",
    },
  });

  const isAvailable = watch("isAvailable");
  const imageKey = watch("imageKey");

  if (!isOpen) return null;

  const onSubmit = async (data: CreateAddonFormData) => {
    try {
      const created = await createAddon({
        name: data.name,
        description: data.description || undefined,
        price: data.price,
        isAvailable: data.isAvailable,
        imageKey: data.imageKey || undefined,
      });
      reset();
      onAddonCreated?.(created);
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
      aria-labelledby="create-addon-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#eddcd4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3e6de] bg-[#fffcf9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-[#fef3ec] flex items-center justify-center text-[#9a3412] border border-[#fae2d3]">
              <PlusCircle className="size-4.5 text-[#e8631b]" />
            </div>
            <div>
              <h3
                id="create-addon-modal-title"
                className="text-base font-bold text-neutral-900 leading-tight"
              >
                {MENU_MESSAGES.MODAL_CREATE_ADDON_TITLE}
              </h3>
              <p className="text-xs text-neutral-500">{MENU_MESSAGES.MODAL_CREATE_ADDON_DESC}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1.5">
            <Label htmlFor="addon-name" className="text-xs font-semibold text-neutral-800">
              {MENU_MESSAGES.ADDON_NAME_LABEL} <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="addon-name"
              placeholder={MENU_MESSAGES.ADDON_NAME_PLACEHOLDER}
              {...register("name")}
              className="h-10 text-sm bg-neutral-50/50 focus:bg-white border-[#e5dcd6]"
            />
            {errors.name && (
              <p className="text-xs font-medium text-rose-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addon-description" className="text-xs font-semibold text-neutral-800">
              {MENU_MESSAGES.ADDON_DESC_LABEL}
            </Label>
            <Textarea
              id="addon-description"
              rows={2}
              placeholder={MENU_MESSAGES.ADDON_DESC_PLACEHOLDER}
              {...register("description")}
              className="text-sm bg-neutral-50/50 focus:bg-white border-[#e5dcd6] resize-none"
            />
            {errors.description && (
              <p className="text-xs font-medium text-rose-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="addon-price" className="text-xs font-semibold text-neutral-800">
                {MENU_MESSAGES.ADDON_PRICE_LABEL} <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-neutral-400">
                  ₹
                </span>
                <Input
                  id="addon-price"
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder={MENU_MESSAGES.ADDON_PRICE_PLACEHOLDER}
                  {...register("price", { valueAsNumber: true })}
                  className="pl-7 h-10 text-sm bg-neutral-50/50 focus:bg-white border-[#e5dcd6]"
                />
              </div>
              {errors.price && (
                <p className="text-xs font-medium text-rose-500">{errors.price.message}</p>
              )}
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-[#fae2d3] bg-[#fffaf5] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800">
                  {MENU_MESSAGES.ADDON_STATUS_LABEL}
                </span>
                <Switch
                  checked={isAvailable}
                  onChange={(e) => setValue("isAvailable", e.target.checked)}
                  aria-label="Addon availability status"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">{MENU_MESSAGES.ADDON_STATUS_HINT}</p>
            </div>
          </div>

          {/* Add-on Photo (Optional) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-neutral-800">
              {MENU_MESSAGES.IMAGE_LABEL}{" "}
              <span className="text-neutral-400 font-normal">(Optional)</span>
            </Label>
            <ImageUploader
              value={imageKey}
              onChange={(key) => setValue("imageKey", key)}
              restaurantId={restaurantId}
            />
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
                  {MENU_MESSAGES.BTN_CREATING_ADDON}
                </>
              ) : (
                MENU_MESSAGES.BTN_CREATE_ADDON
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
