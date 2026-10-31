export type RegistrationType = "WALK_IN" | "ONLINE";

export type QueueStatus = "WAITING" | "CALLED" | "SEATED" | "SKIPPED" | "CANCELLED" | "NO_SHOW";

export interface RegisterWalkInInput {
  guestName: string;
  guestPhone: string;
  partySize: number;
  specialNotes?: string;
}

export interface SeatPartyInput {
  tableIds: string[];
}

export interface SeatPartyResponse {
  success: boolean;
  message: string;
  data: {
    queueEntryId: string;
    restaurantId: string;
    status: string;
    tableIds: string[];
    seatedAt: string;
  };
}

export interface SkipPartyInput {
  reason: string;
  skipPositions?: number;
}

export interface SkipPartyResponse {
  success: boolean;
  message: string;
  data: {
    queueEntryId: string;
    restaurantId: string;
    status: string;
    reason: string;
    position: number | null;
  };
}

export interface CancelQueueEntryInput {
  reason: string;
  notes?: string;
}

export interface CancelQueueEntryResponse {
  success: boolean;
  message: string;
  data: {
    queueEntryId: string;
    restaurantId: string;
    status: string;
    reason: string;
    notes?: string | null;
    cancelledAt: string;
  };
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
}

export interface RegisterWalkInResponse {
  success: boolean;
  message: string;
  data: QueueEntry;
}
