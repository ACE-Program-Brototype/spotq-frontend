export type RegistrationType = "WALK_IN" | "ONLINE";

export type QueueStatus = "WAITING" | "CALLED" | "SEATED" | "CANCELLED" | "NO_SHOW";

export interface RegisterWalkInInput {
  guestName: string;
  guestPhone: string;
  partySize: number;
  specialNotes?: string;
}

export interface QueueWebsocketMetadata {
  path: string;
  room: string;
  ticketId: string;
  subscribeEvent: string;
  updateEvent: string;
}

export interface QueueEntry {
  queueEntryId: string;
  restaurantId: string;
  userId: string | null;
  guestName: string;
  guestPhone: string | null;
  partySize: number;
  specialNotes: string | null;
  registrationType: RegistrationType;
  position: number;
  estimatedWaitMinutes: number | null;
  status: QueueStatus;
  joinedAt: string;
  queueNumber?: string;
  websocket?: QueueWebsocketMetadata;
}

export interface RegisterWalkInResponse {
  success: boolean;
  message: string;
  data: QueueEntry;
}

export interface QueueEtaData {
  restaurantId?: string;
  partySize?: number;
  estimatedWaitMinutes: number;
  queueDepth?: number;
  partiesAhead?: number;
  calculatedAt?: string;
  message?: string;
}

export interface QueueEtaResponse {
  success: boolean;
  message?: string;
  data: QueueEtaData;
}

export interface JoinQueueInput {
  guestName: string;
  guestPhone: string;
  partySize: number;
  specialNotes?: string;
  fid?: string | null;
}

export interface JoinQueueResponse {
  success: boolean;
  message: string;
  data: QueueEntry;
}

export interface AssignTableItem {
  tableId: string;
  count: number;
}

export interface AssignTablesInput {
  tables: AssignTableItem[];
}

export interface AssignTablesData {
  queueEntryId: string;
  restaurantId: string;
  tableIds: string[];
  status: QueueStatus;
  seatedAt: string;
}

export interface AssignTablesResponse {
  success: boolean;
  message: string;
  data: AssignTablesData;
}

export interface CustomerQueueStatusSnapshot {
  queueEntryId: string;
  restaurantId: string;
  restaurantName?: string;
  queueNumber: string;
  partySize: number;
  status: QueueStatus;
  position: number;
  peopleAhead: number;
  estimatedWaitMinutes: number | null;
  estimatedWaitMinutesAtJoin: number | null;
  joinedAt: string;
  assignedTableNumber: string | null;
  responseDeadline: string | null;
  canCancel: boolean;
  serverTime: string;
}

export interface CustomerQueueStatusResponse {
  success: boolean;
  message: string;
  data: CustomerQueueStatusSnapshot;
}

export interface QueuePositionUpdatedPayload {
  event?: string;
  queueEntryId: string;
  restaurantId?: string;
  position: number;
  estimatedWaitMinutes: number | null;
}

export interface QueueEntrySkippedPayload {
  event?: string;
  queueEntryId: string;
  restaurantId?: string;
  status?: QueueStatus;
  reason?: string;
  position?: number;
}

export interface QueueEntrySeatedPayload {
  event?: string;
  queueEntryId: string;
  restaurantId?: string;
  tableId?: string;
  tableIds?: string[];
  tableNumber?: string;
  seatedAt?: string;
}

export interface QueueEntryCancelledPayload {
  event?: string;
  queueEntryId: string;
  restaurantId?: string;
  status?: QueueStatus;
  reason?: string;
  cancelledAt?: string;
}

export interface LeaveQueueRequest {
  restaurantId: string;
  queueEntryId: string;
}

export interface LeaveQueueData {
  queueEntryId: string;
  restaurantId: string;
  status: QueueStatus;
  cancelledAt: string;
}

export interface LeaveQueueResponse {
  success: boolean;
  message: string;
  data: LeaveQueueData;
}
