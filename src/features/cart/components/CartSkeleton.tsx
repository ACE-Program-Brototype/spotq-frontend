import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div
      data-testid="cart-skeleton"
      className="flex flex-col gap-4 py-2 w-full animate-pulse"
      role="status"
      aria-label="Loading cart items"
    >
      {[1, 2, 3].map((key) => (
        <div
          key={key}
          className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-neutral-100 bg-neutral-50/50"
        >
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32 rounded bg-neutral-200" />
              <Skeleton className="h-4 w-12 rounded-full bg-neutral-200" />
            </div>
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3 w-20 rounded bg-neutral-200" />
              <Skeleton className="h-3 w-16 rounded bg-neutral-200" />
            </div>
            <Skeleton className="h-3 w-24 rounded bg-neutral-200" />
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Skeleton className="h-4 w-14 rounded bg-neutral-200" />
            <Skeleton className="h-6 w-16 rounded-full bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartSkeleton;
