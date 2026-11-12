import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Armchair, Circle, Loader2, Square, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { TABLE_MESSAGES, TABLE_SHAPE, TABLE_STATUS } from "../constants/table.constants";
import { useTableSections } from "../hooks/useTableSections";
import { type UpdateTableFormData, updateTableSchema } from "../schemas/update-table.schema";
import type { RestaurantTableDetails } from "../types/table.types";

interface EditTableModalProps {
  /** Target table to edit */
  table: RestaurantTableDetails | null;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback invoked when the modal is closed */
  onClose: () => void;
  /** Current restaurant ID */
  restaurantId: string;
  /** Async submit callback */
  onSubmit: (tableId: string, payload: UpdateTableFormData) => Promise<unknown>;
  /** Whether the save mutation is in flight */
  isLoading?: boolean;
}

/**
 * EditTableModal
 *
 * Implements the table update dialog (SCRUM-6).
 * Pre-populates existing properties and validates updates before saving.
 */
export function EditTableModal({
  table,
  isOpen,
  onClose,
  restaurantId,
  onSubmit,
  isLoading = false,
}: EditTableModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsExpanded(false);
    }
  }, [isOpen]);

  const { sections, isLoading: isSectionsLoading } = useTableSections(restaurantId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateTableFormData>({
    resolver: zodResolver(updateTableSchema),
    defaultValues: {
      tableCode: "",
      sectionId: "",
      capacity: 2,
      tableShape: TABLE_SHAPE.CIRCLE,
    },
  });

  useEffect(() => {
    if (table && isOpen) {
      reset({
        tableCode: table.tableCode,
        sectionId: table.sectionId,
        capacity: table.capacity,
        tableShape: table.shape || TABLE_SHAPE.CIRCLE,
      });
    }
  }, [table, isOpen, reset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, isLoading, onClose]);

  if (!isOpen || !table) return null;

  const tableId = table.tableId;
  const isOccupied =
    table.status === TABLE_STATUS.OCCUPIED || table.status === TABLE_STATUS.PARTIAL_OCCUPIED;
  const currentShape = watch("tableShape");
  const isLongCode = Boolean(table.tableCode && table.tableCode.length > 10);

  const handleFormSubmit = async (data: UpdateTableFormData) => {
    try {
      await onSubmit(tableId, data);
      onClose();
    } catch {
      // Errors are handled by mutation hook toasts
    }
  };

  const fieldClass =
    "mt-1.5 h-11 w-full rounded-xl border border-[#e8e2dd] bg-white px-3 text-sm text-[#282d29] outline-none transition-colors focus:border-[#b4532a] focus:ring-2 focus:ring-orange-100 disabled:bg-[#f7f4f2] disabled:text-[#888e88]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-table-title"
    >
      <div
        className={cn(
          "relative w-full rounded-2xl border border-[#ede4de] bg-white p-6 shadow-2xl transition-all duration-200 sm:p-7 max-w-[calc(100vw-2rem)]",
          isExpanded ? "max-w-2xl" : "max-w-lg",
        )}
      >
        {/* Modal header */}
        <header className="flex items-start justify-between gap-4 border-b border-[#f1ebe6] pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f4eee9] text-[#9a3412]">
              <Armchair className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2
                id="edit-table-title"
                className="break-all text-xl font-bold tracking-tight text-[#202522]"
                title={`Edit Table ${table.tableCode}`}
              >
                Edit Table{" "}
                {isLongCode ? (
                  <>
                    <span>
                      {isExpanded ? table.tableCode : `${table.tableCode.slice(0, 10)}...`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsExpanded((prev) => !prev)}
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? "Show less table code" : "Show more table code"}
                      className="ml-1.5 inline-block text-xs font-semibold text-[#b4532a] underline hover:text-[#9a3412] cursor-pointer"
                    >
                      {isExpanded ? "less" : "more"}
                    </button>
                  </>
                ) : (
                  table.tableCode
                )}
              </h2>
              <p className="mt-0.5 text-xs text-[#778078]">
                Update seating capacity, dining section, and floor shape.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close edit table modal"
            className="shrink-0 rounded-lg p-1.5 text-[#888e88] transition-colors hover:bg-[#f4eee9] hover:text-[#202522] disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </header>

        {/* Occupied warning alert */}
        {isOccupied && (
          <div
            role="note"
            className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"
          >
            <AlertCircle className="size-4 shrink-0 text-amber-700" aria-hidden="true" />
            <p>{TABLE_MESSAGES.OCCUPIED_EDIT_WARNING}</p>
          </div>
        )}

        {/* Form controls */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-5 space-y-4">
          <div>
            <label htmlFor="edit-tableCode" className="text-sm font-semibold text-[#353b36]">
              Table Code / Number
            </label>
            <input
              id="edit-tableCode"
              type="text"
              className={fieldClass}
              placeholder="e.g. T-12, Booth 4"
              maxLength={40}
              aria-invalid={Boolean(errors.tableCode)}
              {...register("tableCode")}
            />
            {errors.tableCode && (
              <p className="mt-1 text-xs text-red-700">{errors.tableCode.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-sectionId" className="text-sm font-semibold text-[#353b36]">
                Dining Section
              </label>
              <select
                id="edit-sectionId"
                className={fieldClass}
                disabled={isSectionsLoading || sections.length === 0}
                aria-invalid={Boolean(errors.sectionId)}
                {...register("sectionId")}
              >
                <option value="" disabled>
                  {isSectionsLoading ? "Loading sections..." : "Select a section"}
                </option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
              {errors.sectionId && (
                <p className="mt-1 text-xs text-red-700">{errors.sectionId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-capacity" className="text-sm font-semibold text-[#353b36]">
                Seating Capacity
              </label>
              <input
                id="edit-capacity"
                type="number"
                min={1}
                max={100}
                className={fieldClass}
                aria-invalid={Boolean(errors.capacity)}
                {...register("capacity", { valueAsNumber: true })}
              />
              {errors.capacity && (
                <p className="mt-1 text-xs text-red-700">{errors.capacity.message}</p>
              )}
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-[#353b36]">Table Shape</legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <label
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                  currentShape === TABLE_SHAPE.CIRCLE
                    ? "border-[#b4532a] bg-orange-50 text-[#8b3b1d] ring-1 ring-[#b4532a]"
                    : "border-[#e8e2dd] bg-white text-[#505750] hover:border-[#d0c6bf]"
                }`}
              >
                <input
                  type="radio"
                  name="tableShape"
                  value={TABLE_SHAPE.CIRCLE}
                  className="sr-only"
                  checked={currentShape === TABLE_SHAPE.CIRCLE}
                  onChange={() =>
                    setValue("tableShape", TABLE_SHAPE.CIRCLE, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
                <Circle className="size-4 shrink-0" aria-hidden="true" />
                <span>Round</span>
              </label>

              <label
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                  currentShape === TABLE_SHAPE.SQUARE
                    ? "border-[#b4532a] bg-orange-50 text-[#8b3b1d] ring-1 ring-[#b4532a]"
                    : "border-[#e8e2dd] bg-white text-[#505750] hover:border-[#d0c6bf]"
                }`}
              >
                <input
                  type="radio"
                  name="tableShape"
                  value={TABLE_SHAPE.SQUARE}
                  className="sr-only"
                  checked={currentShape === TABLE_SHAPE.SQUARE}
                  onChange={() =>
                    setValue("tableShape", TABLE_SHAPE.SQUARE, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
                <Square className="size-4 shrink-0" aria-hidden="true" />
                <span>Square</span>
              </label>
            </div>
          </fieldset>

          {/* Modal footer actions */}
          <div className="mt-6 flex justify-end gap-3 border-t border-[#f1ebe6] pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="h-10 rounded-xl px-4"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading || !isDirty}
              className="h-10 gap-2 rounded-xl bg-[#b4532a] px-5 text-white hover:bg-[#963f1d] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
