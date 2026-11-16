import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { TABLE_QUERY_KEYS, TABLE_STATUS } from "@/features/tables/constants/table.constants";
import { tableService } from "@/features/tables/services/table.service";
import type { TablesGroupedBySection } from "@/features/tables/types/table.types";

/**
 * Hook to fetch tables grouped by section and compute summary statistics.
 */
export function useTables(restaurantId: string) {
  const query = useQuery<TablesGroupedBySection, Error>({
    queryKey: TABLE_QUERY_KEYS.LIST(restaurantId),
    queryFn: () => tableService.getTablesBySection(restaurantId),
    enabled: Boolean(restaurantId),
  });

  const tablesBySection = query.data || {};
  const sections = useMemo(() => Object.keys(tablesBySection), [tablesBySection]);

  const allTables = useMemo(
    () =>
      Object.entries(tablesBySection).flatMap(([sectionName, tables]) =>
        tables.map((t) => (t.sectionName ? t : { ...t, sectionName })),
      ),
    [tablesBySection],
  );

  const stats = useMemo(() => {
    let available = 0;
    let occupied = 0;
    let maintenance = 0;
    let currentDiners = 0;
    let totalCapacity = 0;

    for (const t of allTables) {
      totalCapacity += t.capacity || 0;
      currentDiners += t.currentOccupancy || 0;

      if (t.status === TABLE_STATUS.AVAILABLE) available++;
      else if (t.status === TABLE_STATUS.MAINTENANCE) maintenance++;
      else occupied++; // OCCUPIED or PARTIAL_OCCUPIED
    }

    return {
      total: allTables.length,
      available,
      occupied,
      maintenance,
      totalCapacity,
      currentDiners,
    };
  }, [allTables]);

  return {
    ...query,
    tablesBySection,
    sections,
    allTables,
    stats,
  };
}
