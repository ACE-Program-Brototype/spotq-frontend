export function WalletLoadingSkeleton() {
  return (
    <main
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading wallet"
    >
      <div className="h-10 w-48 animate-pulse rounded bg-neutral-100" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl bg-neutral-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-neutral-100" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-32 animate-pulse rounded-2xl bg-neutral-100" />
        <div className="h-32 animate-pulse rounded-2xl bg-neutral-100" />
        <div className="h-32 animate-pulse rounded-2xl bg-neutral-100" />
      </div>
    </main>
  );
}
