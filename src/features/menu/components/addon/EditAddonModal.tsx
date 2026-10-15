import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Edit3, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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

export interface EditAddonModalProps {
  isOpen: boolean;
  addon: MenuAddon | null;
  restaurantId: string;
  onClose: () => void;
}

export function EditAddonModal({ isOpen, addon, restaurantId, onClose }: EditAddonModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { updateAddon, isUpdating } = useRestaurantAddons(restaurantId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateAddonFormData>({
    //it uses createAddonSchema since there are no new rules for update addon schema
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

  // prefills the data if the addon is available and the model is open
  useEffect(() => {
    if (isOpen && addon) {
      setErrorMessage(null);
      reset({
        name: addon.name,
        description: addon.description || "",
        price: Number(addon.price || 0),
        isAvailable: addon.isAvailable,
        imageKey: addon.imageKey || "",
      });
    }
  }, [isOpen, addon, reset]);

  // handles close the modal if the isUpdating is false
  //useCallback memoize the function so it survies re render , we need this since we use it in the useEffect dependency array that handles the modal close on esc key
  const handleClose = useCallback(() => {
    if (!isUpdating) {
      setErrorMessage(null);
      onClose();
    }
  }, [isUpdating, onClose]);

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

  if (!isOpen || !addon) return null;

  const onSubmit = async (data: CreateAddonFormData) => {
    setErrorMessage(null);

    try {
      await updateAddon({
        addonId: addon.id,
        payload: {
          name: data.name,
          description: data.description?.trim() || null,
          price: data.price,
          isAvailable: data.isAvailable,
          imageKey: data.imageKey || null,
        },
      });

      onClose();
    } catch (err: unknown) {
      setErrorMessage((err as Error)?.message || MENU_MESSAGES.ADDON_UPDATE_FAILED);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-addon-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop overlay */}
      <button
        type="button"
        aria-label="Close modal backdrop"
        onClick={handleClose}
        disabled={isUpdating}
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs cursor-default border-0 outline-none w-full h-full disabled:cursor-not-allowed"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-[#eddcd4] shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3e6de] bg-[#fffcf9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-[#fef3ec] flex items-center justify-center text-[#9a3412] border border-[#fae2d3] shrink-0">
              <Edit3 className="size-4.5 text-[#e8631b]" />
            </div>
            <div>
              <h3
                id="edit-addon-title"
                className="text-base font-bold text-neutral-900 leading-tight"
              >
                {MENU_MESSAGES.MODAL_EDIT_ADDON_TITLE}
              </h3>
              <p className="text-xs text-neutral-500">{MENU_MESSAGES.MODAL_EDIT_ADDON_DESC}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isUpdating}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto">
          {/* Friendly Error Banner */}
          {errorMessage && (
            <div
              className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex items-start gap-2.5 text-rose-800"
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

          <div className="space-y-1.5">
            <Label htmlFor="edit-addon-name" className="text-xs font-semibold text-neutral-800">
              {MENU_MESSAGES.ADDON_NAME_LABEL} <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="edit-addon-name"
              placeholder={MENU_MESSAGES.ADDON_NAME_PLACEHOLDER}
              {...register("name")}
              className="h-10 text-sm bg-neutral-50/50 focus:bg-white border-[#e5dcd6]"
            />
            {errors.name && (
              <p className="text-xs font-medium text-rose-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="edit-addon-description"
              className="text-xs font-semibold text-neutral-800"
            >
              {MENU_MESSAGES.ADDON_DESC_LABEL}
            </Label>
            <Textarea
              id="edit-addon-description"
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
              <Label htmlFor="edit-addon-price" className="text-xs font-semibold text-neutral-800">
                {MENU_MESSAGES.ADDON_PRICE_LABEL} <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-semibold text-neutral-400">
                  ₹
                </span>
                <Input
                  id="edit-addon-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={MENU_MESSAGES.ADDON_PRICE_PLACEHOLDER}
                  {...register("price", {
                    setValueAs: (val) =>
                      val === "" || Number.isNaN(Number(val)) ? undefined : Number(val),
                  })}
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

          {/* Add-on Photo */}
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
              onClick={handleClose}
              disabled={isUpdating}
              className="border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            >
              {MENU_MESSAGES.BTN_CANCEL}
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-[#e8631b] hover:bg-[#cf5413] text-white font-medium"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                  {MENU_MESSAGES.BTN_UPDATING_ADDON}
                </>
              ) : (
                MENU_MESSAGES.BTN_UPDATE_ADDON
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
