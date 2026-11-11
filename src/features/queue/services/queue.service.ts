import { apiClient } from "@/lib/api/client";
import { QUEUE_ENDPOINTS } from "../constants/queue.constants";
import { normalizePhone } from "../schemas/walk-in.schema";
import type {
  ActiveCustomerQueueResponse,
  AssignTablesInput,
  AssignTablesResponse,
  CustomerQueueStatusResponse,
  JoinQueueInput,
  JoinQueueResponse,
  LeaveQueueResponse,
  QueueEtaResponse,
  RegisterWalkInInput,
  RegisterWalkInResponse,
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

  /**
   * Checks whether the authenticated customer currently has an active queue entry.
   */
  async getActiveCustomerQueue(): Promise<ActiveCustomerQueueResponse> {
    return apiClient.get(QUEUE_ENDPOINTS.CUSTOMER_ACTIVE).json<ActiveCustomerQueueResponse>();
  },

  /**
   * Fetches authoritative customer queue status and position snapshot.
   */
  async getCustomerQueueStatus(
    restaurantId: string,
    queueEntryId: string,
  ): Promise<CustomerQueueStatusResponse> {
    return apiClient
      .get(QUEUE_ENDPOINTS.CUSTOMER_STATUS(restaurantId, queueEntryId))
      .json<CustomerQueueStatusResponse>();
  },

  async leaveQueue(restaurantId: string, queueEntryId: string): Promise<LeaveQueueResponse> {
    return apiClient
      .post(QUEUE_ENDPOINTS.LEAVE_QUEUE(restaurantId), {
        json: { queueEntryId },
      })
      .json<LeaveQueueResponse>();
  },
};
