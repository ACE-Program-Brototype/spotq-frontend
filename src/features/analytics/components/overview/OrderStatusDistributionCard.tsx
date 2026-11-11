import { CheckCircle2, Donut, PieChart as PieChartIcon, XCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/currency";
import {
  ORDER_STATUS_CHART_CONFIG,
  ORDER_STATUS_CHART_STYLES,
  getOrderStatusDisplayInfo,
} from "../../constants/order-status-chart.constants";
import type { OrderStatusBreakdownResultDto } from "../../types/restaurant-analytics.types";

export interface OrderStatusDistributionCardProps {
  breakdown: OrderStatusBreakdownResultDto;
  className?: string;
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

  // SVG Geometry from constants
  const size = ORDER_STATUS_CHART_CONFIG.SIZE;
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = ORDER_STATUS_CHART_CONFIG.OUTER_RADIUS;
  const innerRadius =
    chartMode === "donut"
      ? ORDER_STATUS_CHART_CONFIG.DONUT_INNER_RADIUS
      : ORDER_STATUS_CHART_CONFIG.PIE_INNER_RADIUS;

  // Build slices data
  let currentAngle = -Math.PI / 2; // Start at 12 o'clock
  const slices = validItems.map((item, idx) => {
    const fraction = totalCount > 0 ? item.count / totalCount : 0;
    const angle = fraction * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const midAngle = (startAngle + endAngle) / 2;
    const info = getOrderStatusDisplayInfo(item.status, idx);

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
    <div className={cn(ORDER_STATUS_CHART_STYLES.CARD_CONTAINER, className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className={ORDER_STATUS_CHART_STYLES.HEADER_TITLE}>Order Fulfillment</h3>
          <p className={ORDER_STATUS_CHART_STYLES.HEADER_SUBTITLE}>
            Distribution by order status and financial value
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Mode switch */}
          <div className={ORDER_STATUS_CHART_STYLES.TOGGLE_CONTAINER}>
            <button
              type="button"
              onClick={() => setChartMode("pie")}
              title="Pie Chart View"
              className={cn(
                ORDER_STATUS_CHART_STYLES.TOGGLE_BUTTON_BASE,
                chartMode === "pie"
                  ? ORDER_STATUS_CHART_STYLES.TOGGLE_BUTTON_ACTIVE
                  : ORDER_STATUS_CHART_STYLES.TOGGLE_BUTTON_INACTIVE,
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
                ORDER_STATUS_CHART_STYLES.TOGGLE_BUTTON_BASE,
                chartMode === "donut"
                  ? ORDER_STATUS_CHART_STYLES.TOGGLE_BUTTON_ACTIVE
                  : ORDER_STATUS_CHART_STYLES.TOGGLE_BUTTON_INACTIVE,
              )}
            >
              <Donut className="size-3.5" />
              <span>Donut</span>
            </button>
          </div>

          <span className={ORDER_STATUS_CHART_STYLES.TRACKED_BADGE}>
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
              <div className={ORDER_STATUS_CHART_STYLES.EMPTY_CONTAINER}>
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
                  const pullDistance = isHovered ? ORDER_STATUS_CHART_CONFIG.PULL_DISTANCE : 0;
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
                        stroke={ORDER_STATUS_CHART_CONFIG.STROKE_COLOR}
                        strokeWidth={ORDER_STATUS_CHART_CONFIG.STROKE_WIDTH}
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
        <div className={ORDER_STATUS_CHART_STYLES.LEGEND_CONTAINER}>
          {distribution.map((item, idx) => {
            const info = getOrderStatusDisplayInfo(item.status, idx);
            const isHovered = hoveredStatus === item.status;
            const isCompleted = item.status === "COMPLETED";
            const isCancelled = item.status === "CANCELLED";

            return (
              <div
                key={item.status}
                onMouseEnter={() => setHoveredStatus(item.status)}
                onMouseLeave={() => setHoveredStatus(null)}
                className={cn(
                  ORDER_STATUS_CHART_STYLES.LEGEND_ROW_BASE,
                  isHovered
                    ? ORDER_STATUS_CHART_STYLES.LEGEND_ROW_ACTIVE
                    : ORDER_STATUS_CHART_STYLES.LEGEND_ROW_INACTIVE,
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
                        isCompleted && ORDER_STATUS_CHART_STYLES.LEGEND_AMOUNT_COMPLETED,
                        isCancelled && ORDER_STATUS_CHART_STYLES.LEGEND_AMOUNT_CANCELLED,
                        !isCompleted &&
                          !isCancelled &&
                          ORDER_STATUS_CHART_STYLES.LEGEND_AMOUNT_NEUTRAL,
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
