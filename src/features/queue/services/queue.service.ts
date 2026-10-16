import { apiClient } from "@/lib/api/client";
import { QUEUE_ENDPOINTS } from "../constants/queue.constants";
import { normalizePhone } from "../schemas/walk-in.schema";
import type { RegisterWalkInInput, RegisterWalkInResponse } from "../types/queue.types";

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
      partySize: Number(input.partySize),
      specialNotes: input.specialNotes?.trim() || undefined,
    };

    return apiClient
      .post(QUEUE_ENDPOINTS.REGISTER_WALK_IN(restaurantId), {
        json: payload,
      })
      .json<RegisterWalkInResponse>();
  },
};
