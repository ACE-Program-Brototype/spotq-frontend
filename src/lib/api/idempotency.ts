/** Generates a unique key for an idempotent API request. */
export function createIdempotencyKey(): string {
  return crypto.randomUUID();
}

export const IDEMPOTENCY_KEY_HEADER = "x-idempotency-key";
