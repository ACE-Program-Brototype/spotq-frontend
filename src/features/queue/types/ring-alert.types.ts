/**
 * Types representing customer ring events, payloads, and modal state.
 */

export interface CustomerRingPayload {
  event: string;
  queueEntryId: string;
  restaurantId: string;
  ringCount?: number;
  lastRingedAt?: string;
  message?: string;
  assignedTableIds?: string[];
  tableNumbers?: string[];
  responseDeadline?: string;
  timeoutSeconds?: number;
}

export interface CustomerRingAlertState {
  isOpen: boolean;
  queueEntryId: string;
  restaurantId: string;
  ringCount: number;
  lastRingedAt?: string;
  message: string;
  assignedTableIds?: string[];
}

export interface ActiveCustomerTicket {
  queueEntryId: string;
  restaurantId: string;
  queueNumber?: string;
  status?: string;
}
