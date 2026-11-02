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
