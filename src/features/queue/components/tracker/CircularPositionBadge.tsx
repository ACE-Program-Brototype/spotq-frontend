function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;
  return `${num}th`;
}

export interface CircularPositionBadgeProps {
  position: number;
  peopleAhead: number;
}

export function CircularPositionBadge({ position, peopleAhead }: CircularPositionBadgeProps) {
  const isNext = position === 1;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center">
        <div
          className={`relative flex h-40 w-40 sm:h-48 sm:w-48 items-center justify-center rounded-full border-4 shadow-xl transition-all duration-500 ${
            isNext
              ? "border-emerald-500 bg-linear-to-b from-emerald-50 to-emerald-100/60 shadow-emerald-500/20"
              : "border-orange-500 bg-linear-to-b from-orange-50 to-amber-50/50 shadow-orange-500/15"
          }`}
        >
          <div className="flex flex-col items-center">
            <span
              className={`text-4xl sm:text-5xl font-black tracking-tight transition-transform duration-300 scale-100 ${
                isNext ? "text-emerald-700" : "text-stone-900"
              }`}
            >
              {position > 0 ? getOrdinalSuffix(position) : "—"}
            </span>
            <span className="mt-0.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-500">
              in line
            </span>
          </div>
        </div>

        {isNext && (
          <span className="absolute -top-2 rounded-full bg-emerald-600 px-3 py-0.5 text-[11px] font-bold tracking-wide uppercase text-white shadow-md animate-bounce">
            You're Next!
          </span>
        )}
      </div>

      <div className="mt-4">
        {isNext ? (
          <p className="text-sm font-semibold text-emerald-700">
            Please be ready near the host stand
          </p>
        ) : (
          <p className="text-sm text-stone-600">
            <span className="font-semibold text-stone-900">{peopleAhead}</span>{" "}
            {peopleAhead === 1 ? "party" : "parties"} ahead of you
          </p>
        )}
      </div>
    </div>
  );
}
