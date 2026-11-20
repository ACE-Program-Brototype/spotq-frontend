import { Circle, Square } from "lucide-react";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { TABLE_SHAPE } from "@/features/tables/constants/table.constants";
import type { TableSection } from "@/features/tables/types/table.types";
import type { UpdateTableFormData } from "@/features/tables/schemas/update-table.schema";

interface EditTableFormFieldsProps {
  sections: TableSection[];
  isSectionsLoading: boolean;
  fieldClass: string;
  currentShape: string;
  register: UseFormRegister<UpdateTableFormData>;
  setValue: UseFormSetValue<UpdateTableFormData>;
  errors: FieldErrors<UpdateTableFormData>;
}

export function EditTableFormFields({
  sections,
  isSectionsLoading,
  fieldClass,
  currentShape,
  register,
  setValue,
  errors,
}: EditTableFormFieldsProps) {
  return (
    <>
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
    </>
  );
}
