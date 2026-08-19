import type { User } from "@/features/auth/types/auth.types";
import { useAuthStore } from "./auth.store";

describe("auth.store - useAuthStore", () => {
  const sampleUser: User = {
    _id: "user-123",
    name: "SpotQ Admin",
    email: "admin@spotq.com",
    created_at: "2026-08-18T21:59:52.665Z",
  };

  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().clearAuth();
  });

  it("initializes with default unauthenticated state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("updates user and sets isAuthenticated to true when setUser is called", () => {
    useAuthStore.getState().setUser(sampleUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(sampleUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("clears user and sets isAuthenticated to false when clearAuth is called", () => {
    useAuthStore.getState().setUser(sampleUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
