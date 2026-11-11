import { CheckCircle2, Donut, PieChart as PieChartIcon, XCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/currency";
import type { OrderStatusBreakdownResultDto } from "../../types/restaurant-analytics.types";

export interface OrderStatusDistributionCardProps {
  breakdown: OrderStatusBreakdownResultDto;
  className?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; border: string; bg: string }> =
  {
    COMPLETED: {
      label: "Completed Orders",
      color: "#10b981", // Emerald 500
      border: "#059669",
      bg: "#ecfdf5",
    },
    CONFIRMED: {
      label: "Confirmed",
      color: "#3b82f6", // Blue 500
      border: "#2563eb",
      bg: "#eff6ff",
    },
    PREPARING: {
      label: "Preparing",
      color: "#f59e0b", // Amber 500
      border: "#d97706",
      bg: "#fffbeb",
    },
    PLACED: {
      label: "Placed",
      color: "#8b5cf6", // Violet 500
      border: "#7c3aed",
      bg: "#f5f3ff",
    },
    SERVED: {
      label: "Served",
      color: "#14b8a6", // Teal 500
      border: "#0d9488",
      bg: "#f0fdfa",
    },
    READY: {
      label: "Ready for Pickup",
      color: "#06b6d4", // Cyan 500
      border: "#0891b2",
      bg: "#ecfeff",
    },
    CANCELLED: {
      label: "Cancelled Orders",
      color: "#f43f5e", // Rose 500
      border: "#e11d48",
      bg: "#fff1f2",
    },
  };

const FALLBACK_PALETTE = [
  "#e8631b", // SpotQ Terracotta
  "#9a3412", // Dark Terracotta
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#84cc16", // Lime
  "#a855f7", // Violet
  "#64748b", // Slate
];

function getStatusInfo(status: string, index: number) {
  const normalized = status.toUpperCase().trim();
  if (STATUS_CONFIG[normalized]) {
    return STATUS_CONFIG[normalized];
  }
  const color = FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
  const formatted = status
    .toLowerCase()
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
  return {
    label: formatted,
    color,
    border: color,
    bg: "#faf7f5",
  };
}

export function OrderStatusDistributionCard({
  breakdown,
  className,
}: OrderStatusDistributionCardProps) {
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);
  const [chartMode, setChartMode] = useState<"pie" | "donut">("pie");

  if (breakdown.status !== "AVAILABLE") {
    return null;
  }

  const { totalOrdersTracked, distribution } = breakdown;
  const validItems = distribution.filter((item) => item.count > 0);
  const totalCount =
    totalOrdersTracked > 0
      ? totalOrdersTracked
      : validItems.reduce((acc, item) => acc + item.count, 0);

  // SVG Geometry
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = 88;
  const innerRadius = chartMode === "donut" ? 52 : 0;

  // Build slices data
  let currentAngle = -Math.PI / 2; // Start at 12 o'clock
  const slices = validItems.map((item, idx) => {
    const fraction = totalCount > 0 ? item.count / totalCount : 0;
    const angle = fraction * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const midAngle = (startAngle + endAngle) / 2;
    const info = getStatusInfo(item.status, idx);

    return {
      item,
      info,
      fraction,
      startAngle,
      endAngle,
      midAngle,
      isSingle: validItems.length === 1 || fraction >= 0.9999,
    };
  });

  const activeSlice = slices.find((s) => s.item.status === hoveredStatus);

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#eddcd4] bg-white p-5 sm:p-6 shadow-2xs flex flex-col justify-between",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-neutral-900">Order Fulfillment</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Distribution by order status and financial value
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Mode switch */}
          <div className="flex items-center rounded-lg border border-[#eddcd4] bg-[#faf7f5] p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setChartMode("pie")}
              title="Pie Chart View"
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 font-semibold transition-colors",
                chartMode === "pie"
                  ? "bg-white text-[#9a3412] shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900",
              )}
            >
              <PieChartIcon className="size-3.5" />
              <span>Pie</span>
            </button>
            <button
              type="button"
              onClick={() => setChartMode("donut")}
              title="Donut Chart View"
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 font-semibold transition-colors",
                chartMode === "donut"
                  ? "bg-white text-[#9a3412] shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900",
              )}
            >
              <Donut className="size-3.5" />
              <span>Donut</span>
            </button>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#faf7f5] border border-[#eddcd4] text-neutral-700 shrink-0">
            {totalOrdersTracked.toLocaleString()} tracked
          </span>
        </div>
      </div>

      {/* Main Content: Chart + Legend */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: SVG Pie / Donut Chart */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative size-[220px]">
            {totalCount === 0 || validItems.length === 0 ? (
              <div className="flex size-full flex-col items-center justify-center rounded-full border-2 border-dashed border-neutral-300 bg-[#faf7f5] p-4 text-center">
                <PieChartIcon className="size-8 text-neutral-400" />
                <p className="mt-1 text-xs font-semibold text-neutral-600">No Orders</p>
                <p className="text-[10px] text-neutral-400">Zero orders in this period</p>
              </div>
            ) : (
              <svg
                viewBox={`0 0 ${size} ${size}`}
                className="size-full overflow-visible"
                aria-label="Order status pie chart"
                role="img"
              >
                {/* Slices */}
                {slices.map((slice) => {
                  const { item, info, isSingle, startAngle, endAngle, midAngle } = slice;
                  const isHovered = hoveredStatus === item.status;
                  const pullDistance = isHovered ? 6 : 0;
                  const dx = Math.cos(midAngle) * pullDistance;
                  const dy = Math.sin(midAngle) * pullDistance;

                  if (isSingle) {
                    if (chartMode === "donut") {
                      return (
                        <circle
                          key={item.status}
                          cx={cx}
                          cy={cy}
                          r={(outerRadius + innerRadius) / 2}
                          fill="none"
                          stroke={info.color}
                          strokeWidth={outerRadius - innerRadius}
                          className="transition-all duration-300 cursor-pointer"
                          onMouseEnter={() => setHoveredStatus(item.status)}
                          onMouseLeave={() => setHoveredStatus(null)}
                        />
                      );
                    }
                    return (
                      <circle
                        key={item.status}
                        cx={cx}
                        cy={cy}
                        r={outerRadius}
                        fill={info.color}
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredStatus(item.status)}
                        onMouseLeave={() => setHoveredStatus(null)}
                      />
                    );
                  }

                  // Multi-slice Arc Math
                  const x1 = cx + outerRadius * Math.cos(startAngle);
                  const y1 = cy + outerRadius * Math.sin(startAngle);
                  const x2 = cx + outerRadius * Math.cos(endAngle);
                  const y2 = cy + outerRadius * Math.sin(endAngle);
                  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

                  let pathData = "";
                  if (chartMode === "donut") {
                    const x3 = cx + innerRadius * Math.cos(endAngle);
                    const y3 = cy + innerRadius * Math.sin(endAngle);
                    const x4 = cx + innerRadius * Math.cos(startAngle);
                    const y4 = cy + innerRadius * Math.sin(startAngle);
                    pathData = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
                  } else {
                    pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                  }

                  return (
                    <g
                      key={item.status}
                      transform={`translate(${dx}, ${dy})`}
                      className="transition-transform duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredStatus(item.status)}
                      onMouseLeave={() => setHoveredStatus(null)}
                    >
                      <path
                        d={pathData}
                        fill={info.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                        className={cn(
                          "transition-opacity duration-200",
                          hoveredStatus && !isHovered && "opacity-60",
                          isHovered && "opacity-100 drop-shadow-md",
                        )}
                      />
                    </g>
                  );
                })}

                {/* Donut center cutout content */}
                {chartMode === "donut" && (
                  <g className="pointer-events-none select-none">
                    <circle cx={cx} cy={cy} r={innerRadius - 2} fill="#ffffff" />
                    <text
                      x={cx}
                      y={cy - 5}
                      textAnchor="middle"
                      className="text-xl font-extrabold fill-neutral-900"
                      dominantBaseline="middle"
                    >
                      {activeSlice ? activeSlice.item.count : totalCount}
                    </text>
                    <text
                      x={cx}
                      y={cy + 14}
                      textAnchor="middle"
                      className="text-[10px] font-semibold uppercase tracking-wider fill-neutral-500"
                    >
                      {activeSlice ? `${activeSlice.item.percentage}%` : "Total Orders"}
                    </text>
                  </g>
                )}
              </svg>
            )}
          </div>

          {/* Active Slice Badge / Quick Tip */}
          <div className="mt-2 text-center h-5">
            {activeSlice ? (
              <p className="text-xs font-semibold text-neutral-700 animate-in fade-in duration-200">
                <span
                  className="inline-block size-2 rounded-full mr-1.5 align-middle"
                  style={{ backgroundColor: activeSlice.info.color }}
                />
                {activeSlice.info.label}: {activeSlice.item.count} orders (
                {activeSlice.item.percentage}%)
              </p>
            ) : (
              <p className="text-[11px] text-neutral-400">Hover slice or status for details</p>
            )}
          </div>
        </div>

        {/* Right: Legend Breakdown List */}
        <div className="md:col-span-7 flex flex-col gap-2 max-h-[290px] overflow-y-auto pr-1">
          {distribution.map((item, idx) => {
            const info = getStatusInfo(item.status, idx);
            const isHovered = hoveredStatus === item.status;
            const isCompleted = item.status === "COMPLETED";
            const isCancelled = item.status === "CANCELLED";

            return (
              <div
                key={item.status}
                onMouseEnter={() => setHoveredStatus(item.status)}
                onMouseLeave={() => setHoveredStatus(null)}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 cursor-pointer",
                  isHovered
                    ? "border-[#9a3412] bg-[#fef3ec]/50 shadow-xs"
                    : "border-[#eddcd4]/70 bg-[#faf7f5]/70 hover:bg-[#faf7f5]",
                )}
              >
                {/* Status Dot + Name */}
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span
                    className="size-3 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: info.color }}
                  />
                  <div className="flex items-center gap-1.5 truncate">
                    {isCompleted && <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />}
                    {isCancelled && <XCircle className="size-3.5 text-rose-600 shrink-0" />}
                    <span className="text-xs font-bold text-neutral-800 truncate">
                      {info.label}
                    </span>
                  </div>
                </div>

                {/* Metrics: Count, Percentage & Financial Value */}
                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-neutral-900">
                      {item.count.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-500 ml-1">
                      ({item.percentage}%)
                    </span>
                  </div>

                  <div className="min-w-[75px] text-right">
                    <span
                      className={cn(
                        "text-xs font-bold",
                        isCompleted && "text-emerald-700",
                        isCancelled && "text-rose-700",
                        !isCompleted && !isCancelled && "text-neutral-700",
                      )}
                    >
                      {formatCurrency(item.amountRupees)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
