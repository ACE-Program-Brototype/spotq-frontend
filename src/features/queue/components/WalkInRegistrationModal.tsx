import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, UserPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { QUEUE_MESSAGES } from "../constants/queue.constants";
import { useRegisterWalkIn } from "../hooks/use-register-walk-in";
import { type WalkInFormData, walkInSchema } from "../schemas/walk-in.schema";
import type { QueueEntry } from "../types/queue.types";
import { PartySizeSelector } from "./PartySizeSelector";
import { WalkInGuestFields } from "./WalkInGuestFields";
import { WalkInModalHeader } from "./WalkInModalHeader";

interface WalkInRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId?: string;
  onSuccess?: (entry: QueueEntry) => void;
}

export function WalkInRegistrationModal({
  isOpen,
  onClose,
  restaurantId: propRestaurantId,
  onSuccess,
}: WalkInRegistrationModalProps) {
  const user = useAuthStore((state) => state.user);
  const effectiveRestaurantId = propRestaurantId || user?.restaurantId || "";

  const [selectedPreset, setSelectedPreset] = useState<number | "6+">(2);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<WalkInFormData>({
    resolver: zodResolver(walkInSchema),
    defaultValues: {
      guestName: "",
      guestPhone: "",
      partySize: 2,
      specialNotes: "",
    },
  });

  const partySize = watch("partySize");

  const {
    registerWalkIn,
    isSubmitting,
    error: apiError,
    reset: resetMutation,
  } = useRegisterWalkIn(effectiveRestaurantId);

  const resetModalState = useCallback(() => {
    reset({
      guestName: "",
      guestPhone: "",
      partySize: 2,
      specialNotes: "",
    });
    setSelectedPreset(2);
    resetMutation();
  }, [reset, resetMutation]);

  useEffect(() => {
    if (isOpen) {
      resetModalState();
    }
  }, [isOpen, resetModalState]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    resetModalState();
    onClose();
  }, [isSubmitting, resetModalState, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, handleClose]);

  if (!isOpen) return null;

  const handlePresetSelect = (preset: number | "6+") => {
    setSelectedPreset(preset);
    if (preset === "6+") {
      if (partySize < 6) {
        setValue("partySize", 6, { shouldValidate: true });
      }
    } else {
      setValue("partySize", preset, { shouldValidate: true });
    }
  };

  const handleIncrement = () => {
    const next = Math.min(20, (partySize || 6) + 1);
    setValue("partySize", next, { shouldValidate: true });
  };

  const handleDecrement = () => {
    const next = Math.max(6, (partySize || 6) - 1);
    setValue("partySize", next, { shouldValidate: true });
  };

  const handleDirectPartySizeChange = (raw: string) => {
    if (raw === "") {
      setValue("partySize", "" as unknown as number, { shouldValidate: true });
      return;
    }
    const val = Number.parseInt(raw, 10);
    if (!Number.isNaN(val)) {
      setValue("partySize", Math.min(20, Math.max(6, val)), { shouldValidate: true });
    }
  };

  const handlePartySizeBlur = () => {
    if (!partySize || partySize < 6) {
      setValue("partySize", 6, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: WalkInFormData) => {
    if (!effectiveRestaurantId) {
      return;
    }

    try {
      const response = await registerWalkIn({
        guestName: data.guestName,
        guestPhone: data.guestPhone,
        partySize: data.partySize,
        specialNotes: data.specialNotes,
      });

      resetModalState();
      onSuccess?.(response.data);
      onClose();
    } catch {
      // Error handled by mutation error state and toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={handleClose}
        disabled={isSubmitting}
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs cursor-default border-0 outline-none w-full h-full disabled:cursor-not-allowed"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="walkin-modal-title"
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-[#eddcd4] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
      >
        <WalkInModalHeader onClose={handleClose} isSubmitting={isSubmitting} />

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          {!effectiveRestaurantId && (
            <div
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
              role="alert"
            >
              <AlertCircle className="size-4 shrink-0" />
              <span>{QUEUE_MESSAGES.NO_RESTAURANT}</span>
            </div>
          )}

          {apiError && (
            <div
              className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-700"
              role="alert"
            >
              <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">Registration Failed</p>
                <p className="mt-0.5">{apiError.message}</p>
              </div>
            </div>
          )}

          <WalkInGuestFields
            register={register}
            isSubmitting={isSubmitting}
            nameError={errors.guestName?.message}
            phoneError={errors.guestPhone?.message}
          />

          <PartySizeSelector
            partySize={partySize}
            selectedPreset={selectedPreset}
            isSubmitting={isSubmitting}
            onPresetSelect={handlePresetSelect}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onDirectChange={handleDirectPartySizeChange}
            onBlur={handlePartySizeBlur}
            error={errors.partySize?.message}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="specialNotes"
              className="text-xs font-bold text-neutral-800 flex items-center justify-between"
            >
              <span>Special Notes / Seating Preference</span>
              <span className="text-[11px] font-normal text-neutral-500">Optional</span>
            </label>
            <Textarea
              id="specialNotes"
              placeholder="e.g. Prefers booth, high chair needed, window table"
              rows={2}
              disabled={isSubmitting}
              className="text-sm border-[#eddcd4] focus-visible:border-[#9a3412] focus-visible:ring-[#fed7aa]"
              {...register("specialNotes")}
            />
            {errors.specialNotes && (
              <p className="text-xs font-medium text-red-600">{errors.specialNotes.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eddcd4]">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleClose}
              className="h-10 px-4 rounded-xl border-[#eddcd4] text-neutral-700 hover:bg-[#faf7f5] font-semibold"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !effectiveRestaurantId}
              className="h-10 px-5 rounded-xl bg-[#9a3412] hover:bg-[#7c2d12] text-white font-bold shadow-sm transition-all"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="size-4 mr-2" />
                  Adding to Queue...
                </>
              ) : (
                <>
                  <UserPlus className="size-4 mr-1.5" />
                  Add to Queue
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
