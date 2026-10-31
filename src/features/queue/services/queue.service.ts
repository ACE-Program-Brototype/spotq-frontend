import { apiClient } from "@/lib/api/client";
import { QUEUE_ENDPOINTS } from "../constants/queue.constants";
import { normalizePhone } from "../schemas/walk-in.schema";
import type {
  CancelQueueEntryInput,
  CancelQueueEntryResponse,
  RegisterWalkInInput,
  RegisterWalkInResponse,
  SeatPartyInput,
  SeatPartyResponse,
  SkipPartyInput,
  SkipPartyResponse,
} from "../types/queue.types";

export const queueService = {
  /**
   * Register an arriving walk-in party to the queue.
   */
  async registerWalkIn(
    restaurantId: string,
    input: RegisterWalkInInput,
  ): Promise<RegisterWalkInResponse> {
    const payload = {
      guestName: input.guestName.trim(),
      guestPhone: normalizePhone(input.guestPhone),
      partySize: input.partySize,
      specialNotes: input.specialNotes?.trim() || undefined,
    };

    return apiClient
      .post(QUEUE_ENDPOINTS.REGISTER_WALK_IN(restaurantId), {
        json: payload,
      })
      .json<RegisterWalkInResponse>();
  },

  /**
   * Transition a waiting party to SEATED.
   */
  async seatParty(
    restaurantId: string,
    queueEntryId: string,
    input: SeatPartyInput,
  ): Promise<SeatPartyResponse> {
    return apiClient
      .post(QUEUE_ENDPOINTS.SEAT_PARTY(restaurantId, queueEntryId), {
        json: {
          tableIds: input.tableIds,
        },
      })
      .json<SeatPartyResponse>();
  },

  /**
   * Skip a party in queue.
   */
  async skipParty(
    restaurantId: string,
    queueEntryId: string,
    input: SkipPartyInput,
  ): Promise<SkipPartyResponse> {
    return apiClient
      .post(QUEUE_ENDPOINTS.SKIP_PARTY(restaurantId, queueEntryId), {
        json: {
          reason: input.reason.trim(),
          ...(input.skipPositions !== undefined && { skipPositions: input.skipPositions }),
        },
      })
      .json<SkipPartyResponse>();
  },

  /**
   * Cancel a queue entry or mark as no-show.
   */
  async cancelQueueEntry(
    restaurantId: string,
    queueEntryId: string,
    input: CancelQueueEntryInput,
  ): Promise<CancelQueueEntryResponse> {
    return apiClient
      .post(QUEUE_ENDPOINTS.CANCEL_QUEUE_ENTRY(restaurantId, queueEntryId), {
        json: {
          reason: input.reason.trim(),
          notes: input.notes?.trim() || undefined,
        },
      })
      .json<CancelQueueEntryResponse>();
  },
};
