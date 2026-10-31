import { zodResolver } from "@hookform/resolvers/zod";
import { Armchair, ArrowLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCreateTable } from "../hooks/useCreateTable";
import { useTableSections } from "../hooks/useTableSections";
import { type CreateTableFormData, createTableSchema } from "../schemas/create-table.schema";

export default function CreateTablePage() {
  const navigate = useNavigate();
  const restaurantId = useAuthStore((state) => state.user?.restaurantId || "");
  const createTableMutation = useCreateTable(restaurantId);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateTableFormData>({
    resolver: zodResolver(createTableSchema),
    defaultValues: { tableCode: "", sectionId: "", capacity: 2, tableShape: "CIRCLE" },
  });
  const sectionsQuery = useTableSections(restaurantId);
  const { sections } = sectionsQuery;

  const onSubmit = async (data: CreateTableFormData) => {
    await createTableMutation.mutateAsync(data);
    navigate(RESTAURANT_ROUTES.TABLE.ROOT);
  };

  const fieldClass =
    "mt-1.5 h-11 w-full rounded-xl border border-[#e8e2dd] bg-white px-3 text-sm text-[#282d29] outline-none focus:border-[#b4532a] focus:ring-2 focus:ring-orange-100";

  return (
    <main className="mx-auto max-w-3xl space-y-6 pb-10">
      <nav
        className="flex items-center gap-2 text-xs font-semibold text-neutral-400"
        aria-label="Breadcrumb"
      >
        <Link to={RESTAURANT_ROUTES.TABLE.ROOT} className="hover:text-neutral-700">
          Tables
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-[#9a3412]">Create table</span>
      </nav>

      <header>
        <button
          type="button"
          onClick={() => navigate(RESTAURANT_ROUTES.TABLE.ROOT)}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-900"
        >
          <ArrowLeft className="size-4" /> Back to tables
        </button>
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#f4eee9] text-[#9a3412]">
            <Armchair className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#202522]">Create table</h1>
            <p className="mt-1 text-sm text-[#778078]">Add a table to your restaurant floor.</p>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-2xl border border-[#ede4de] bg-white p-5 shadow-[0_2px_10px_rgba(65,44,31,.03)] sm:p-7"
      >
        <div>
          <label htmlFor="tableCode" className="text-sm font-semibold text-[#353b36]">
            Table name or code
          </label>
          <input
            id="tableCode"
            className={fieldClass}
            placeholder="e.g. T1"
            maxLength={40}
            aria-invalid={Boolean(errors.tableCode)}
            {...register("tableCode")}
          />
          {errors.tableCode && (
            <p className="mt-1 text-xs text-red-700">{errors.tableCode.message}</p>
          )}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="sectionId" className="text-sm font-semibold text-[#353b36]">
              Dining section
            </label>
            <select
              id="sectionId"
              className={fieldClass}
              {...register("sectionId")}
              disabled={sectionsQuery.isLoading || sections.length === 0}
            >
              <option value="" disabled>
                {sectionsQuery.isLoading
                  ? "Loading sections…"
                  : sections.length
                    ? "Select a section"
                    : "No sections available"}
              </option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
            {sectionsQuery.isError && (
              <p className="mt-1.5 text-xs text-red-700">
                Unable to load sections. Please try again.
              </p>
            )}
            {errors.sectionId && (
              <p className="mt-1 text-xs text-red-700">{errors.sectionId.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="capacity" className="text-sm font-semibold text-[#353b36]">
              Seating capacity
            </label>
            <input
              id="capacity"
              type="number"
              className={fieldClass}
              {...register("capacity", { valueAsNumber: true })}
            />
            {errors.capacity && (
              <p className="mt-1 text-xs text-red-700">{errors.capacity.message}</p>
            )}
          </div>
        </div>
        <fieldset>
          <legend className="text-sm font-semibold text-[#353b36]">Table shape</legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {(["CIRCLE", "SQUARE"] as const).map((shape) => (
              <label
                key={shape}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${watch("tableShape") === shape ? "border-[#b4532a] bg-orange-50 text-[#8b3b1d]" : "border-[#e8e2dd] text-[#505750]"}`}
              >
                <input
                  type="radio"
                  name="tableShape"
                  value={shape}
                  checked={watch("tableShape") === shape}
                  onChange={() => setValue("tableShape", shape, { shouldValidate: true })}
                />
                {shape === "CIRCLE" ? "Round" : "Square"}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex justify-end gap-3 border-t border-[#f0e9e4] pt-5">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl px-4"
            onClick={() => navigate(RESTAURANT_ROUTES.TABLE.ROOT)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              createTableMutation.isPending ||
              !restaurantId ||
              !watch("sectionId") ||
              sectionsQuery.isLoading
            }
            className="h-10 rounded-xl bg-[#b4532a] px-5 text-white hover:bg-[#963f1d]"
          >
            {createTableMutation.isPending ? "Creating…" : "Create table"}
          </Button>
        </div>
      </form>
    </main>
  );
}
