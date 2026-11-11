import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { type Column, DataTable } from "@/components/common/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { GeographicBreakdownItem } from "../../types/platform-analytics.types";
import { formatNumber } from "../../utils/platform-analytics.utils";
import { ServiceHealthBadge } from "./ServiceHealthBadge";

export interface GeographicAdoptionTableProps {
  geographicBreakdown?: GeographicBreakdownItem[];
  totalRestaurants?: number;
  isLoading?: boolean;
}

export function GeographicAdoptionTable({
  geographicBreakdown = [],
  totalRestaurants = 0,
  isLoading = false,
}: GeographicAdoptionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalItems = geographicBreakdown.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return geographicBreakdown.slice(startIndex, startIndex + pageSize);
  }, [geographicBreakdown, currentPage]);

  const columns: Column<GeographicBreakdownItem>[] = [
    {
      key: "city",
      header: "City",
      accessor: "city",
      className: "font-semibold text-slate-900 text-xs",
    },
    {
      key: "state",
      header: "State",
      accessor: "state",
      className: "text-slate-600 text-xs",
    },
    {
      key: "restaurantCount",
      header: "Active Venues",
      accessor: "restaurantCount",
      className: "font-bold text-slate-900 text-right text-xs",
      cell: ({ row }) => (
        <span className="font-semibold text-slate-800">
          {formatNumber(row.restaurantCount)}
        </span>
      ),
    },
    {
      key: "share",
      header: "Share",
      className: "text-right text-xs",
      cell: ({ row }) => {
        const share =
          totalRestaurants > 0
            ? Math.round((row.restaurantCount / totalRestaurants) * 100)
            : 0;
        return (
          <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
            {share}%
          </span>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
            <Skeleton key={i} className="h-9 w-full rounded-md" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/80 bg-white shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4 text-slate-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              Geographic Adoption
            </CardTitle>
          </div>
          <p className="text-xs text-slate-500">
            Regional distribution across active cities & states
          </p>
        </div>
        <ServiceHealthBadge serviceName="restaurant-svc" isAvailable={true} />
      </CardHeader>

      <CardContent className="p-0">
        {geographicBreakdown.length === 0 ? (
          <div className="flex h-40 items-center justify-center p-6 text-xs text-slate-400">
            No geographic adoption data recorded yet.
          </div>
        ) : (
          <DataTable
            data={paginatedData}
            columns={columns}
            pagination={{
              currentPage,
              totalPages,
              totalItems,
              pageSize,
              theme: "admin",
              onPageChange: setCurrentPage,
            }}
            theme="admin"
            className="border-0 rounded-none shadow-none text-xs"
            headerClassName="bg-slate-50/80 text-slate-500 border-y border-slate-200/80 font-semibold text-xs"
          />
        )}
      </CardContent>
    </Card>
  );
}
