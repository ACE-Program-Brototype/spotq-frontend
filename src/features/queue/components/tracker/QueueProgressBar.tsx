export interface QueueProgressBarProps {
  currentPosition: number | null;
  initialPosition?: number | null;
}

export function QueueProgressBar({ currentPosition, initialPosition }: QueueProgressBarProps) {
  let progressPercent = 0;
  if (typeof currentPosition === "number" && currentPosition > 0) {
    const maxPos = Math.max(initialPosition || currentPosition, currentPosition, 1);
    progressPercent =
      currentPosition <= 1
        ? 100
        : Math.max(10, Math.min(95, Math.round(((maxPos - currentPosition + 1) / maxPos) * 100)));
  }

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs font-medium text-stone-500">
        <span>Queue Progress</span>
        <span>{progressPercent}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-100 p-0.5 border border-stone-200/60">
        <div
          className="h-full rounded-full bg-linear-to-r from-orange-400 to-amber-500 transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
