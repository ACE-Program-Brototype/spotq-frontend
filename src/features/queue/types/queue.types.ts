import type { SuccessResponse } from "@/components/common";
import type {
  QUEUE_CANCEL_REASON,
  QUEUE_STATUS,
  REGISTRATION_TYPE,
} from "@/features/queue/constants/queue.constants";

export type RegistrationType = (typeof REGISTRATION_TYPE)[keyof typeof REGISTRATION_TYPE];
export type RegistrationTypeFilter = "ALL" | "ONLINE" | "WALK_IN";
export type PartySizeBucket = "ALL" | "SMALL" | "MEDIUM" | "LARGE";
export type QueueStatus = (typeof QUEUE_STATUS)[keyof typeof QUEUE_STATUS];

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

export type RegisterWalkInResponse = SuccessResponse<QueueEntry>;

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

export type JoinQueueResponse = SuccessResponse<QueueEntry>;

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

export type AssignTablesResponse = SuccessResponse<AssignTablesData>;

export interface CustomerQueueStatusSnapshot {
  queueEntryId: string;
  restaurantId: string;
  restaurantName?: string;
  queueNumber: string;
  guestName?: string;
  partySize: number;
  status: QueueStatus;
  position: number | null;
  totalWaitingParties?: number;
  peopleAhead?: number;
  estimatedWaitMinutes: number | null;
  estimatedWaitMinutesAtJoin?: number | null;
  registrationType?: RegistrationType;
  joinedAt: string;
  updatedAt?: string;
  lastRingAt?: string | null;
  assignedTableId?: string | null;
  assignedTableNumber?: string | null;
  responseDeadline: string | null;
  canCancel?: boolean;
  serverTime?: string;
}

export type CustomerQueueStatusResponse = SuccessResponse<CustomerQueueStatusSnapshot>;

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
  position?: number | null;
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

export type LeaveQueueResponse = SuccessResponse<LeaveQueueData>;

export interface ActiveCustomerQueueData {
  restaurantId: string;
  queueEntryId: string;
  queueNumber: string;
  status: QueueStatus;
}

export type ActiveCustomerQueueResponse = SuccessResponse<ActiveCustomerQueueData | null>;

export interface StaffLiveQueueEntry {
  queueEntryId: string;
  queueNumber: string;
  position: number | null;
  guestName: string;
  guestPhone: string | null;
  partySize: number;
  specialNotes?: string | null;
  registrationType: RegistrationType;
  status: QueueStatus;
  assignedTableId?: string | null;
  joinedAt: string;
  ringCount: number;
  lastRingAt: string | null;
  responseDeadline: string | null;
  waitDurationMinutes: number;
}

export interface GetStaffQueueParams {
  status?: QueueStatus;
  partySizeBucket?: "ALL" | "SMALL" | "MEDIUM" | "LARGE";
}

export interface StaffLiveQueueData {
  restaurantId: string;
  totalWaiting: number;
  entries: StaffLiveQueueEntry[];
}

export interface StaffLiveQueueResponse {
  success: boolean;
  message: string;
  data: StaffLiveQueueData;
}

export interface RingCustomerData {
  queueEntryId: string;
  status: QueueStatus;
  ringCount: number;
  lastRingAt: string;
  responseDeadline: string;
}

export interface RingCustomerResponse {
  success: boolean;
  message: string;
  data: RingCustomerData;
}

export interface SkipPartyInput {
  reason: string;
  skipPositions?: number;
}

export interface SkipPartyData {
  queueEntryId: string;
  status: QueueStatus;
  newPosition?: number;
}

export interface SkipPartyResponse {
  success: boolean;
  message: string;
  data: SkipPartyData;
}

export type QueueCancelReason = (typeof QUEUE_CANCEL_REASON)[keyof typeof QUEUE_CANCEL_REASON];

export interface CancelQueueEntryInput {
  reason: QueueCancelReason;
  notes?: string;
}

export interface CancelQueueEntryData {
  queueEntryId: string;
  status: QueueStatus;
}

export interface CancelQueueEntryResponse {
  success: boolean;
  message: string;
  data: CancelQueueEntryData;
}

export interface StaffQueueStatistics {
  waitingParties: number;
  waitingPeople: number;
  ringingParties: number;
  ringingPeople: number;
}
