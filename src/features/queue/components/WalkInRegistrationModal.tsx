import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Minus, Phone, Plus, User, UserPlus, Users, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { PARTY_SIZE_PRESETS, QUEUE_MESSAGES } from "../constants/queue.constants";
import { useRegisterWalkIn } from "../hooks/use-register-walk-in";
import { type WalkInFormData, walkInSchema } from "../schemas/walk-in.schema";
import type { QueueEntry } from "../types/queue.types";

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

  // Handle ESC key
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

      // Clear the form fields after successful registration
      resetModalState();

      // Trigger success callback and close modal
      onSuccess?.(response.data);
      onClose();
    } catch {
      // Error handled by mutation error state and toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      {/* Backdrop overlay */}
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#eddcd4] bg-[#fffcf9]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#fed7aa]/50 flex items-center justify-center text-[#9a3412] border border-[#fbd0a7]">
              <UserPlus className="size-5 text-[#9a3412]" />
            </div>
            <div>
              <h3
                id="walkin-modal-title"
                className="text-lg font-bold text-neutral-900 leading-tight"
              >
                Add to Queue
              </h3>
              <p className="text-xs text-[#756c66] mt-0.5">
                Register arriving walk-in guest to the waitlist.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-[#eddcd4]/40 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Missing restaurant error */}
          {!effectiveRestaurantId && (
            <div
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
              role="alert"
            >
              <AlertCircle className="size-4 shrink-0" />
              <span>{QUEUE_MESSAGES.NO_RESTAURANT}</span>
            </div>
          )}

          {/* API Error Banner */}
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

          {/* Guest Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="guestName"
              className="text-xs font-bold text-neutral-800 flex items-center gap-1"
            >
              <User className="size-3.5 text-[#9a3412]" />
              Guest Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="guestName"
              placeholder="e.g. David Miller"
              autoFocus
              disabled={isSubmitting}
              className="h-10 text-sm border-[#eddcd4] focus-visible:border-[#9a3412] focus-visible:ring-[#fed7aa]"
              {...register("guestName")}
            />
            {errors.guestName && (
              <p className="text-xs font-medium text-red-600">{errors.guestName.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label
              htmlFor="guestPhone"
              className="text-xs font-bold text-neutral-800 flex items-center justify-between"
            >
              <span className="flex items-center gap-1">
                <Phone className="size-3.5 text-[#9a3412]" />
                Phone Number <span className="text-red-500">*</span>
              </span>
              <span className="text-[11px] font-normal text-neutral-500">
                10-digit mobile number
              </span>
            </label>
            <div className="relative flex rounded-xl border border-[#eddcd4] focus-within:border-[#9a3412] focus-within:ring-2 focus-within:ring-[#fed7aa] bg-white overflow-hidden transition-all">
              <span className="inline-flex items-center px-3 bg-[#faf7f5] text-xs font-bold text-neutral-700 border-r border-[#eddcd4] select-none">
                +91
              </span>
              <input
                id="guestPhone"
                type="tel"
                placeholder="9876543210"
                maxLength={14}
                disabled={isSubmitting}
                className="flex-1 h-10 px-3 text-sm bg-transparent outline-none disabled:opacity-50 text-neutral-900 placeholder:text-neutral-400"
                {...register("guestPhone")}
              />
            </div>
            {errors.guestPhone && (
              <p className="text-xs font-medium text-red-600">{errors.guestPhone.message}</p>
            )}
          </div>

          {/* Party Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 flex items-center gap-1">
                <Users className="size-3.5 text-[#9a3412]" />
                Party Size <span className="text-red-500">*</span>
              </span>
              <span className="text-xs font-semibold text-[#9a3412]">
                {partySize} {partySize === 1 ? "Guest" : "Guests"}
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5">
              {PARTY_SIZE_PRESETS.map((preset) => {
                const isSelected =
                  preset === "6+"
                    ? selectedPreset === "6+"
                    : partySize === preset && selectedPreset !== "6+";

                return (
                  <button
                    key={String(preset)}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    disabled={isSubmitting}
                    aria-pressed={isSelected}
                    aria-label={`Party size ${preset}`}
                    className={`h-10 rounded-xl text-sm font-bold border transition-all flex items-center justify-center ${
                      isSelected
                        ? "bg-[#9a3412] text-white border-[#9a3412] shadow-xs"
                        : "bg-[#faf7f5] text-neutral-700 border-[#eddcd4] hover:bg-[#eddcd4]/50"
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>

            {selectedPreset === "6+" && (
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#eddcd4] bg-[#fffcf9] mt-2">
                <span className="text-xs font-medium text-neutral-700">Exact Party Size:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={isSubmitting || partySize <= 6}
                    className="size-8 rounded-lg border border-[#eddcd4] bg-white flex items-center justify-center text-neutral-700 hover:bg-[#faf7f5] disabled:opacity-40"
                    aria-label="Decrease party size"
                  >
                    <Minus className="size-3.5" />
                  </button>

                  <Input
                    type="number"
                    min={6}
                    max={20}
                    value={partySize ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === "") {
                        setValue("partySize", "" as unknown as number, {
                          shouldValidate: true,
                        });
                        return;
                      }
                      const val = Number.parseInt(raw, 10);
                      if (!Number.isNaN(val)) {
                        setValue("partySize", Math.min(20, Math.max(6, val)), {
                          shouldValidate: true,
                        });
                      }
                    }}
                    onBlur={() => {
                      if (!partySize || partySize < 6) {
                        setValue("partySize", 6, { shouldValidate: true });
                      }
                    }}
                    disabled={isSubmitting}
                    className="w-16 h-8 text-center font-bold text-sm border-[#eddcd4]"
                  />

                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={isSubmitting || partySize >= 20}
                    className="size-8 rounded-lg border border-[#eddcd4] bg-white flex items-center justify-center text-neutral-700 hover:bg-[#faf7f5] disabled:opacity-40"
                    aria-label="Increase party size"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>
            )}

            {errors.partySize && (
              <p className="text-xs font-medium text-red-600">{errors.partySize.message}</p>
            )}
          </div>

          {/* Special Notes */}
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

          {/* Footer Actions */}
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
