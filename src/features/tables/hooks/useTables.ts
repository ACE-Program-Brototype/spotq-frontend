import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { TABLE_QUERY_KEYS } from "../constants/table.constants";
import { tableService } from "../services/table.service";
import type { TablesGroupedBySection } from "../types/table.types";

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

  const allTables = useMemo(() => Object.values(tablesBySection).flat(), [tablesBySection]);

  const stats = useMemo(() => {
    let available = 0;
    let occupied = 0;
    let maintenance = 0;
    let currentDiners = 0;
    let totalCapacity = 0;

    for (const t of allTables) {
      totalCapacity += t.capacity || 0;
      currentDiners += t.currentOccupancy || 0;

      if (t.status === "AVAILABLE") available++;
      else if (t.status === "MAINTENANCE") maintenance++;
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
