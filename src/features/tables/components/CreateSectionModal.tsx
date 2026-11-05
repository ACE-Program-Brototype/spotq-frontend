import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const createSectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Section name must be at least 2 characters")
    .max(100, "Section name cannot exceed 100 characters"),
});

type CreateSectionFormData = z.infer<typeof createSectionSchema>;

interface CreateSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<boolean>;
}

export function CreateSectionModal({ isOpen, onClose, onSubmit }: CreateSectionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateSectionFormData>({
    resolver: zodResolver(createSectionSchema),
    defaultValues: { name: "" },
  });

  const sectionName = watch("name") || "";

  useEffect(() => {
    if (isOpen) {
      reset({ name: "" });
    }
  }, [isOpen, reset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: CreateSectionFormData) => {
    try {
      setIsSubmitting(true);
      const success = await onSubmit(data.name);
      if (success) {
        reset();
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-section-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#ede4de] bg-[#fffcf9] p-6 shadow-2xl transition-all sm:p-7">
        <div className="flex items-start justify-between border-b border-[#f3e6de] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#f8f3ef] text-[#9a3412]">
              <FolderPlus className="size-5" />
            </div>
            <div>
              <h2
                id="create-section-title"
                className="text-lg font-bold tracking-tight text-[#252a26]"
              >
                Create Table Section
              </h2>
              <p className="text-xs text-[#7c837d]">
                Define a new dining zone on your restaurant floor.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1 text-neutral-400 hover:bg-[#f4eee9] hover:text-neutral-700 disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="section-name" className="text-sm font-semibold text-[#353b36]">
                Section Name <span className="text-[#9a3412]">*</span>
              </label>
              <span className="text-[11px] text-[#8c948e]">{sectionName.length}/100</span>
            </div>

            <input
              id="section-name"
              type="text"
              placeholder="e.g. Patio, Rooftop, Main Dining"
              maxLength={100}
              disabled={isSubmitting}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e8e2dd] bg-white px-3.5 text-sm text-[#282d29] outline-none transition-all placeholder:text-neutral-400 focus:border-[#b4532a] focus:ring-2 focus:ring-orange-100 disabled:bg-neutral-50"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />

            {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f3e6de]">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onClose}
              className="h-10 rounded-xl border-[#e2d8d0] text-xs font-semibold text-[#51483f] hover:bg-[#faf4f0]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || sectionName.trim().length < 2}
              className="h-10 gap-2 rounded-xl bg-[#b4532a] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[#963f1d] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Section"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
