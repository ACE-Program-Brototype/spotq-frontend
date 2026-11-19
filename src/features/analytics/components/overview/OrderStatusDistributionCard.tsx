import { CheckCircle2, Donut, PieChart as PieChartIcon, XCircle } from "lucide-react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  getOrderStatusDisplayInfo,
  ORDER_STATUS_CHART_MODES,
  ORDER_STATUS_CHART_STYLES,
  type OrderStatusChartMode,
} from "@/features/analytics/constants/order-status-chart.constants";
import { ANALYTICS_SECTION_STATUSES } from "@/features/analytics/constants/restaurant-analytics.constants";
import type { OrderStatusBreakdownResultDto } from "@/features/analytics/types/restaurant-analytics.types";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/currency";

export interface OrderStatusDistributionCardProps {
  breakdown: OrderStatusBreakdownResultDto;
  className?: string;
}

interface ChartSliceData {
  status: string;
  name: string;
  count: number;
  percentage: number;
  amountRupees: number;
  color: string;
}

export function OrderStatusDistributionCard({
  breakdown,
  className,
}: OrderStatusDistributionCardProps) {
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);
  const [chartMode, setChartMode] = useState<OrderStatusChartMode>(ORDER_STATUS_CHART_MODES.PIE);

  if (breakdown.status !== ANALYTICS_SECTION_STATUSES.AVAILABLE) {
    return null;
  }

  const { totalOrdersTracked, distribution } = breakdown;
  const validItems = distribution.filter((item) => item.count > 0);
  const totalCount =
    totalOrdersTracked > 0
      ? totalOrdersTracked
      : validItems.reduce((acc, item) => acc + item.count, 0);

  const chartData: ChartSliceData[] = validItems.map((item, idx) => {
    const info = getOrderStatusDisplayInfo(item.status, idx);
    return {
      status: item.status,
      name: info.label,
      count: item.count,
      percentage: item.percentage,
      amountRupees: item.amountRupees,
      color: info.color,
    };
  });

  const activeItem = chartData.find((item) => item.status === hoveredStatus);
  const isDonut = chartMode === ORDER_STATUS_CHART_MODES.DONUT;

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
              onClick={() => setChartMode(ORDER_STATUS_CHART_MODES.PIE)}
              title="Pie Chart View"
              className={cn(
                ORDER_STATUS_CHART_STYLES.TOGGLE_BUTTON_BASE,
                chartMode === ORDER_STATUS_CHART_MODES.PIE
                  ? ORDER_STATUS_CHART_STYLES.TOGGLE_BUTTON_ACTIVE
                  : ORDER_STATUS_CHART_STYLES.TOGGLE_BUTTON_INACTIVE,
              )}
            >
              <PieChartIcon className="size-3.5" />
              <span>Pie</span>
            </button>
            <button
              type="button"
              onClick={() => setChartMode(ORDER_STATUS_CHART_MODES.DONUT)}
              title="Donut Chart View"
              className={cn(
                ORDER_STATUS_CHART_STYLES.TOGGLE_BUTTON_BASE,
                chartMode === ORDER_STATUS_CHART_MODES.DONUT
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

      {/* Main Content: Recharts Visualization + Legend */}
      <div className="mt-3 md:mt-5 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-center">
        {/* Left: Recharts Pie / Donut Chart */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div
            role="img"
            aria-label="Order status pie chart"
            className="relative size-[190px] sm:size-[220px] flex items-center justify-center"
          >
            {totalCount === 0 || chartData.length === 0 ? (
              <div className={ORDER_STATUS_CHART_STYLES.EMPTY_CONTAINER}>
                <PieChartIcon className="size-8 text-neutral-400" />
                <p className="mt-1 text-xs font-semibold text-neutral-600">No Orders</p>
                <p className="text-[10px] text-neutral-400">Zero orders in this period</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={isDonut ? 52 : 0}
                      outerRadius={88}
                      paddingAngle={chartData.length > 1 ? 1 : 0}
                      isAnimationActive={false}
                      onMouseEnter={(_, index) => {
                        setHoveredStatus(chartData[index]?.status ?? null);
                      }}
                      onMouseLeave={() => setHoveredStatus(null)}
                    >
                      {chartData.map((entry) => {
                        const isHovered = hoveredStatus === entry.status;
                        return (
                          <Cell
                            key={`cell-${entry.status}`}
                            fill={entry.color}
                            stroke="#ffffff"
                            strokeWidth={isHovered ? 3 : 1.5}
                            opacity={hoveredStatus && !isHovered ? 0.6 : 1}
                            className="cursor-pointer transition-opacity duration-200"
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload?.length) {
                          const data = payload[0].payload as ChartSliceData;
                          return (
                            <div className="rounded-lg border border-[#eddcd4] bg-white p-2.5 shadow-md text-xs">
                              <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                                <span
                                  className="size-2 rounded-full inline-block"
                                  style={{ backgroundColor: data.color }}
                                />
                                {data.name}
                              </p>
                              <p className="text-neutral-600 mt-1">
                                Orders:{" "}
                                <span className="font-semibold text-neutral-900">
                                  {data.count.toLocaleString()}
                                </span>{" "}
                                ({data.percentage}%)
                              </p>
                              <p className="text-neutral-600">
                                Value:{" "}
                                <span className="font-semibold text-neutral-900">
                                  {formatCurrency(data.amountRupees)}
                                </span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut center cutout overlay */}
                {isDonut && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center select-none">
                    <p className="text-xl font-extrabold text-neutral-900 leading-none">
                      {activeItem ? activeItem.count.toLocaleString() : totalCount.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mt-1">
                      {activeItem ? `${activeItem.percentage}%` : "Total Orders"}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Active Status Hint / Tip */}
          <div className="mt-2 text-center h-5">
            {activeItem ? (
              <p className="text-xs font-semibold text-neutral-700 animate-in fade-in duration-200">
                <span
                  className="inline-block size-2 rounded-full mr-1.5 align-middle"
                  style={{ backgroundColor: activeItem.color }}
                />
                {activeItem.name}: {activeItem.count.toLocaleString()} orders (
                {activeItem.percentage}%)
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
              <button
                type="button"
                key={item.status}
                onMouseEnter={() => setHoveredStatus(item.status)}
                onMouseLeave={() => setHoveredStatus(null)}
                onFocus={() => setHoveredStatus(item.status)}
                onBlur={() => setHoveredStatus(null)}
                className={cn(
                  "w-full text-left",
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
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
