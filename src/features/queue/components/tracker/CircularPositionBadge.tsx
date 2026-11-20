function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;
  return `${num}th`;
}

export interface CircularPositionBadgeProps {
  position: number | null;
  peopleAhead?: number | null;
}

export function CircularPositionBadge({ position, peopleAhead }: CircularPositionBadgeProps) {
  const validPosition = typeof position === "number" && position > 0 ? position : null;
  const isNext = validPosition === 1;
  const resolvedPeopleAhead =
    typeof peopleAhead === "number" && peopleAhead >= 0
      ? peopleAhead
      : validPosition !== null
        ? Math.max(0, validPosition - 1)
        : null;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center">
        <div
          className={`relative flex size-24 sm:size-28 items-center justify-center rounded-full border-[3px] shadow-sm transition-all duration-300 ${
            isNext
              ? "border-emerald-500 bg-emerald-50/70 text-emerald-800 shadow-emerald-500/10"
              : "border-[#e8631b] bg-[#fcf5f0] text-[#9a3412] shadow-[#e8631b]/10"
          }`}
        >
          <div className="flex flex-col items-center">
            <span
              className={`text-2xl sm:text-3xl font-black tracking-tight leading-none ${
                isNext ? "text-emerald-700" : "text-neutral-900"
              }`}
            >
              {validPosition !== null ? getOrdinalSuffix(validPosition) : "—"}
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              in line
            </span>
          </div>
        </div>

        {isNext && (
          <span className="absolute -top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase text-white shadow-xs animate-bounce">
            You're Next!
          </span>
        )}
      </div>

      <div className="mt-2">
        {isNext ? (
          <p className="text-xs font-semibold text-emerald-700">
            Please be ready near the host stand
          </p>
        ) : resolvedPeopleAhead !== null ? (
          <p className="text-xs text-neutral-600">
            <span className="font-bold text-neutral-900">{resolvedPeopleAhead}</span>{" "}
            {resolvedPeopleAhead === 1 ? "party" : "parties"} ahead of you
          </p>
        ) : (
          <p className="text-xs text-neutral-500">Updating queue position...</p>
        )}
      </div>
    </div>
  );
}
