import { QUEUE_ENDPOINTS } from "@/features/queue/constants/queue.constants";
import { normalizePhone } from "@/features/queue/schemas/walk-in.schema";
import type {
  AssignTablesInput,
  AssignTablesResponse,
  CancelQueueEntryInput,
  CancelQueueEntryResponse,
  GetStaffQueueParams,
  JoinQueueInput,
  JoinQueueResponse,
  QueueEtaResponse,
  RegisterWalkInInput,
  RegisterWalkInResponse,
  RingCustomerResponse,
  SkipPartyInput,
  SkipPartyResponse,
  StaffLiveQueueResponse,
} from "@/features/queue/types/queue.types";
import { apiClient } from "@/lib/api/client";

export const queueService = {
  /**
   * Fetches the live queue list and statistics snapshot for staff.
   */
  async getStaffLiveQueue(
    restaurantId: string,
    params?: GetStaffQueueParams,
  ): Promise<StaffLiveQueueResponse> {
    const searchParams: Record<string, string> = {};
    if (params?.status) {
      searchParams.status = params.status;
    }
    if (params?.partySizeBucket && params.partySizeBucket !== "ALL") {
      searchParams.partySizeBucket = params.partySizeBucket;
    }

    return apiClient
      .get(QUEUE_ENDPOINTS.STAFF_LIVE_QUEUE(restaurantId), {
        searchParams: Object.keys(searchParams).length > 0 ? searchParams : undefined,
      })
      .json<StaffLiveQueueResponse>();
  },

  /**
   * Notifies/rings the customer that their table is ready.
   */
  async ringCustomer(queueEntryId: string): Promise<RingCustomerResponse> {
    return apiClient.post(QUEUE_ENDPOINTS.RING_CUSTOMER(queueEntryId)).json<RingCustomerResponse>();
  },

  /**
   * Skips a party in the queue to a lower position.
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
          skipPositions: input.skipPositions,
        },
      })
      .json<SkipPartyResponse>();
  },

  /**
   * Cancels a queue entry or marks it as a no-show.
   */
  async cancelQueueEntry(
    restaurantId: string,
    queueEntryId: string,
    input: CancelQueueEntryInput,
  ): Promise<CancelQueueEntryResponse> {
    return apiClient
      .post(QUEUE_ENDPOINTS.CANCEL_QUEUE_ENTRY(restaurantId, queueEntryId), {
        json: {
          reason: input.reason,
          notes: input.notes?.trim() || undefined,
        },
      })
      .json<CancelQueueEntryResponse>();
  },

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
   * Fetches estimated waiting time for a prospective party size.
   */
  async getQueueEta(restaurantId: string, partySize: number): Promise<QueueEtaResponse> {
    return apiClient
      .get(QUEUE_ENDPOINTS.GET_ETA(restaurantId), {
        searchParams: { partySize },
      })
      .json<QueueEtaResponse>();
  },

  /**
   * Submits a customer queue registration request.
   */
  async joinQueue(restaurantId: string, input: JoinQueueInput): Promise<JoinQueueResponse> {
    const payload = {
      guestName: input.guestName.trim(),
      guestPhone: input.guestPhone.trim(),
      partySize: input.partySize,
      specialNotes: input.specialNotes?.trim() || undefined,
      fid: input.fid?.trim() || undefined,
    };

    return apiClient
      .post(QUEUE_ENDPOINTS.JOIN_QUEUE(restaurantId), {
        json: payload,
      })
      .json<JoinQueueResponse>();
  },

  /**
   * Assigns physical dining tables and seats a waiting queue party.
   */
  async assignTables(
    queueEntryId: string,
    input: AssignTablesInput,
  ): Promise<AssignTablesResponse> {
    return apiClient
      .patch(QUEUE_ENDPOINTS.ASSIGN_TABLE(queueEntryId), {
        json: input,
      })
      .json<AssignTablesResponse>();
  },
};
