/**
 * Table Feature Domain & API Types
 */

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "PARTIAL_OCCUPIED" | "MAINTENANCE";

export type StaffUpdatableStatus = "AVAILABLE" | "MAINTENANCE";

export type TableShape = "SQUARE" | "CIRCLE" | "RECTANGLE";

export interface TableItem {
  id: string;
  tableCode: string;
  capacity: number;
  status: TableStatus;
  sectionId: string;
  tableShape: TableShape;
  currentOccupancy: number;
  isActive: boolean;
  sectionName?: string;
}

export type AdminTables = {
  tables: TableItem;
  stats: {
    totalTables: number;
    occupied: number;
    available: number;
    maintenance: number;
  };
  total: number;
};

export type TablesGroupedBySection = Record<string, TableItem[]>;

export interface GetTablesResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    sections: TablesGroupedBySection;
  };
}

export interface UpdateTableStatusInput {
  tableId: string;
  status: StaffUpdatableStatus;
}

export interface UpdateTableStatusPayload {
  status: StaffUpdatableStatus;
}

export interface UpdateTableStatusResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data?: TableItem;
}

export interface TableStatusTransitionRule {
  allowed: boolean;
  targetStatus: StaffUpdatableStatus | null;
  reason?: string;
}
