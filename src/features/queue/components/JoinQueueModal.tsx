import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Sparkles, UtensilsCrossed, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { MAX_PARTY_SIZE, MIN_CUSTOM_PARTY_SIZE } from "../constants/queue.constants";
import { useJoinQueue } from "../hooks/use-join-queue";
import { useQueueEta } from "../hooks/use-queue-eta";
import {
  formatFullPhone,
  type JoinQueueFormData,
  joinQueueSchema,
} from "../schemas/join-queue.schema";
import type { QueueEntry } from "../types/queue.types";
import { setActiveCustomerTicket } from "../utils/active-queue.utils";
import { JoinQueueGuestFields } from "./JoinQueueGuestFields";
import { PartySizeSelector } from "./PartySizeSelector";
import { QueueEtaPreview } from "./QueueEtaPreview";

export interface JoinQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  restaurantName?: string;
  onSuccess?: (entry: QueueEntry) => void;
}

export function JoinQueueModal({
  isOpen,
  onClose,
  restaurantId,
  restaurantName,
  onSuccess,
}: JoinQueueModalProps) {
  const user = useAuthStore((state) => state.user);

  const [selectedPreset, setSelectedPreset] = useState<number | "6+">(2);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<JoinQueueFormData>({
    resolver: zodResolver(joinQueueSchema),
    defaultValues: {
      guestName: "",
      countryCode: "+91",
      phone: "",
      partySize: 2,
      specialNotes: "",
    },
  });

  const partySize = watch("partySize");
  const countryCode = watch("countryCode");

  // Fetch Live ETA estimate with 300ms debounce
  const {
    data: etaResponse,
    isLoading: isEtaLoading,
    isError: isEtaError,
  } = useQueueEta(restaurantId, partySize || 2, { enabled: isOpen });

  // Pre-populate name and phone if user is authenticated
  useEffect(() => {
    if (isOpen) {
      const defaultName = user?.name || (user?.email ? user.email.split("@")[0] : "");
      const defaultPhone = user?.phone?.replace(/^\+91/, "") || "";

      reset({
        guestName: defaultName,
        countryCode: "+91",
        phone: defaultPhone,
        partySize: 2,
        specialNotes: "",
      });
      setSelectedPreset(2);
    }
  }, [isOpen, user, reset]);

  // Handle Escape key to dismiss modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const { mutateAsync: joinQueue, isPending, error: apiError } = useJoinQueue(restaurantId);

  const handlePresetSelect = (preset: number | "6+") => {
    setSelectedPreset(preset);
    if (preset === "6+") {
      if (partySize < MIN_CUSTOM_PARTY_SIZE) {
        setValue("partySize", MIN_CUSTOM_PARTY_SIZE, { shouldValidate: true });
      }
    } else {
      setValue("partySize", preset, { shouldValidate: true });
    }
  };

  const handleIncrement = () => {
    const next = Math.min(MAX_PARTY_SIZE, (partySize || MIN_CUSTOM_PARTY_SIZE) + 1);
    setValue("partySize", next, { shouldValidate: true });
  };

  const handleDecrement = () => {
    const next = Math.max(MIN_CUSTOM_PARTY_SIZE, (partySize || MIN_CUSTOM_PARTY_SIZE) - 1);
    setValue("partySize", next, { shouldValidate: true });
  };

  const handleDirectPartySizeChange = (raw: string) => {
    if (raw.trim() === "") {
      setValue("partySize", Number.NaN, { shouldValidate: true });
      return;
    }
    const val = Number.parseInt(raw, 10);
    if (!Number.isNaN(val)) {
      setValue("partySize", Math.min(MAX_PARTY_SIZE, Math.max(MIN_CUSTOM_PARTY_SIZE, val)), {
        shouldValidate: true,
      });
    }
  };

  const handlePartySizeBlur = () => {
    if (!partySize || Number.isNaN(partySize) || partySize < MIN_CUSTOM_PARTY_SIZE) {
      setValue("partySize", MIN_CUSTOM_PARTY_SIZE, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: JoinQueueFormData) => {
    if (!restaurantId) return;

    try {
      const fullPhone = formatFullPhone(data.countryCode, data.phone);

      const response = await joinQueue({
        guestName: data.guestName,
        guestPhone: fullPhone,
        partySize: data.partySize,
        specialNotes: data.specialNotes,
      });

      const entry = response.data;

      // 1. Initialize customer queue ticket for real-time ring alerts and active tracking
      setActiveCustomerTicket({
        queueEntryId: entry.queueEntryId,
        restaurantId,
        queueNumber: entry.queueNumber,
        status: entry.status,
      });

      // 2. Trigger optional caller callback
      onSuccess?.(entry);

      // 3. Close the modal
      onClose();
    } catch {
      // Error is caught by useJoinQueue and surfaced in toast & apiError banner
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      {/* Dimmed backdrop */}
      <button
        type="button"
        aria-label="Dismiss backdrop"
        tabIndex={-1}
        onClick={onClose}
        disabled={isPending}
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs cursor-default border-0 outline-none w-full h-full disabled:cursor-not-allowed"
      />

      {/* Main Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-queue-title"
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-neutral-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="relative border-b border-neutral-100 bg-linear-to-r from-orange-50/60 via-amber-50/30 to-white px-6 py-4.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-md shadow-orange-600/20">
                <UtensilsCrossed className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2
                    id="join-queue-title"
                    className="text-lg font-black text-neutral-900 tracking-tight"
                  >
                    Join the Queue
                  </h2>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-orange-800">
                    <Sparkles className="size-2.5" /> Live
                  </span>
                </div>
                <p className="text-xs font-semibold text-neutral-500 truncate max-w-xs">
                  {restaurantName || "Reserve your spot & track live updates"}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={isPending}
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100/80 cursor-pointer"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4.5">
          {apiError && (
            <div
              className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-700"
              role="alert"
            >
              <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">Unable to Join Queue</p>
                <p className="mt-0.5">{apiError.message}</p>
              </div>
            </div>
          )}

          {/* Guest Information */}
          <JoinQueueGuestFields
            register={register}
            isSubmitting={isPending}
            nameError={errors.guestName?.message}
            phoneError={errors.phone?.message}
            countryCode={countryCode}
          />

          {/* Party Size Selection */}
          <PartySizeSelector
            partySize={partySize}
            selectedPreset={selectedPreset}
            isSubmitting={isPending}
            onPresetSelect={handlePresetSelect}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onDirectChange={handleDirectPartySizeChange}
            onBlur={handlePartySizeBlur}
            error={errors.partySize?.message}
          />

          {/* Live ETA Calculation Banner */}
          <QueueEtaPreview
            isLoading={isEtaLoading}
            isError={isEtaError}
            estimatedWaitMinutes={etaResponse?.data?.estimatedWaitMinutes}
            partiesAhead={etaResponse?.data?.partiesAhead ?? etaResponse?.data?.queueDepth}
            partySize={partySize || 2}
          />

          {/* Special Requests / Notes */}
          <div className="space-y-1.5">
            <label
              htmlFor="specialNotes"
              className="text-xs font-bold text-neutral-800 flex items-center justify-between"
            >
              <span>Special Requests</span>
              <span className="text-[11px] font-normal text-neutral-400">Optional</span>
            </label>
            <Textarea
              id="specialNotes"
              placeholder="e.g. High chair needed, wheelchair accessible seating, outdoor preferred"
              disabled={isPending}
              rows={2}
              className="resize-none text-sm border-neutral-200 focus-visible:border-orange-500 focus-visible:ring-orange-200"
              {...register("specialNotes")}
            />
            {errors.specialNotes && (
              <p className="text-xs font-medium text-red-600">{errors.specialNotes.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onClose}
              className="h-11 flex-1 rounded-xl border-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 flex-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-md shadow-orange-600/20 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  <span>Joining Line...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>Join Queue</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
