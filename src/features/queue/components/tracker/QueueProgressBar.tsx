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
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500">
        <span>Queue Progress</span>
        <span className="text-[#9a3412] font-bold">{progressPercent}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#faf7f5] p-0.5 border border-[#eddcd4]">
        <div
          className="h-full rounded-full bg-linear-to-r from-[#e8631b] to-[#ea580c] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
