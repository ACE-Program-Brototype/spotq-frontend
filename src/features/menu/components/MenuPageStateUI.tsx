/**
 * MenuPageStateUI
 * Reusable error and empty-state UI blocks shared across menu management pages.
 */

import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*  Error State                                                                 */
/* -------------------------------------------------------------------------- */

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center space-y-3">
      <AlertCircle className="size-8 text-rose-500 mx-auto" />
      <h3 className="text-base font-bold text-neutral-900">{title}</h3>
      <p className="text-xs text-neutral-500 max-w-sm mx-auto">{description}</p>
      <Button
        type="button"
        variant="outline"
        onClick={onRetry}
        className="rounded-xl border-rose-300 text-rose-700 hover:bg-rose-100/50 text-xs"
      >
        Try Again
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Empty State                                                                 */
/* -------------------------------------------------------------------------- */

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  createLabel?: string;
  onCreateClick?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  createLabel,
  onCreateClick,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[#eddcd4] bg-white p-12 text-center space-y-3">
      <div className="size-12 rounded-2xl bg-[#fef3ec] text-[#e8631b] flex items-center justify-center mx-auto border border-[#fae2d3]">
        {icon}
      </div>
      <h3 className="text-base font-bold text-neutral-900">{title}</h3>
      <p className="text-xs text-neutral-500 max-w-sm mx-auto">{description}</p>
      {createLabel && onCreateClick && (
        <Button
          type="button"
          onClick={onCreateClick}
          className="rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white text-xs font-semibold px-4 py-2 cursor-pointer"
        >
          {createLabel}
        </Button>
      )}
    </div>
  );
}
