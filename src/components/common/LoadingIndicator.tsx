/**
 * Universal Loading Indicator Component
 * Provides spinners, pulsing dots, skeleton loaders, and full-page overlay variants.
 */

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { LoadingIndicatorProps } from "./types";

export type { LoadingIndicatorProps };

const sizeClasses = {
  sm: "size-4 text-xs",
  md: "size-6 text-sm",
  lg: "size-10 text-base",
  xl: "size-14 text-lg",
};

const spinnerColorClasses = {
  brand: "text-spotq-orange",
  admin: "text-[#1e3a5f]",
  primary: "text-foreground",
  muted: "text-muted-foreground",
  white: "text-white",
};

export function LoadingIndicator({
  variant = "spinner",
  theme = "brand",
  size = "md",
  text,
  fullPage = false,
  center = false,
  className,
  ...props
}: LoadingIndicatorProps) {
  const content = (() => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span
              className={cn(
                "rounded-full animate-bounce [animation-delay:-0.3s]",
                size === "sm" ? "size-1.5" : size === "lg" ? "size-3" : "size-2",
                theme === "brand"
                  ? "bg-spotq-orange"
                  : theme === "admin"
                    ? "bg-[#1e3a5f]"
                    : "bg-current",
              )}
            />
            <span
              className={cn(
                "rounded-full animate-bounce [animation-delay:-0.15s]",
                size === "sm" ? "size-1.5" : size === "lg" ? "size-3" : "size-2",
                theme === "brand"
                  ? "bg-spotq-orange"
                  : theme === "admin"
                    ? "bg-[#1e3a5f]"
                    : "bg-current",
              )}
            />
            <span
              className={cn(
                "rounded-full animate-bounce",
                size === "sm" ? "size-1.5" : size === "lg" ? "size-3" : "size-2",
                theme === "brand"
                  ? "bg-spotq-orange"
                  : theme === "admin"
                    ? "bg-[#1e3a5f]"
                    : "bg-current",
              )}
            />
          </div>
        );

      case "card-skeleton":
        return (
          <div className="w-full space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-12 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
            </div>
          </div>
        );

      case "table-skeleton":
        return (
          <div className="w-full space-y-3 rounded-2xl border border-border bg-card p-5 shadow-xs">
            <div className="flex gap-4 border-b border-border pb-3">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="h-4 w-36 animate-pulse rounded bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-4 w-16 ml-auto animate-pulse rounded bg-muted" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-2.5">
                <div className="size-8 shrink-0 animate-pulse rounded-full bg-muted" />
                <div className="h-3.5 w-36 animate-pulse rounded bg-muted" />
                <div className="h-3.5 w-44 animate-pulse rounded bg-muted" />
                <div className="h-6 w-16 ml-auto animate-pulse rounded-full bg-muted" />
              </div>
            ))}
          </div>
        );

      case "skeleton":
        return <div className="h-20 w-full animate-pulse rounded-xl bg-muted" />;

      default:
        return (
          <Loader2
            className={cn("animate-spin", sizeClasses[size], spinnerColorClasses[theme])}
            aria-hidden="true"
          />
        );
    }
  })();

  const wrapper = (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 transition-all",
        center && "py-12 w-full",
        className,
      )}
      {...props}
    >
      {content}
      {text && (
        <p className="text-xs sm:text-sm font-medium text-muted-foreground animate-pulse text-center">
          {text}
        </p>
      )}
      <span className="sr-only">{text || "Loading..."}</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">{wrapper}</div>
      </div>
    );
  }

  return wrapper;
}

export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return <LoadingIndicator fullPage text={text} size="lg" theme="brand" />;
}

export function Spinner({
  size = "sm",
  theme = "brand",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "brand" | "admin" | "primary" | "muted" | "white";
  className?: string;
}) {
  return <LoadingIndicator variant="spinner" size={size} theme={theme} className={className} />;
}

export default LoadingIndicator;
