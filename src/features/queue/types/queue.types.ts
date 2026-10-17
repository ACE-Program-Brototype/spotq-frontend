export type RegistrationType = "WALK_IN" | "ONLINE";

export type QueueStatus = "WAITING" | "CALLED" | "SEATED" | "CANCELLED" | "NO_SHOW";

export interface RegisterWalkInInput {
  guestName: string;
  guestPhone: string;
  partySize: number;
  specialNotes?: string;
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
