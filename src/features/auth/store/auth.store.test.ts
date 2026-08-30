import type { User } from "../types/auth.types";
import { useAuthStore } from "./auth.store";

const mockUser: User = {
  id: "test-user-id",
  fullName: "Test User",
  email: "test@example.com",
  role: "CUSTOMER",
  phone: "1234567890",
  status: "Active",
  createdAt: "2026-08-18T00:00:00.000Z",
  updatedAt: "2026-08-18T00:00:00.000Z",
};

describe("useAuthStore State and Persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    useAuthStore.getState().clearAuth();
  });

  it("initializes with default unauthenticated state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("saves credentials to store and persists user to localStorage", () => {
    useAuthStore.getState().setAuth(mockUser, "test-token-value");

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe("test-token-value");
    expect(state.isAuthenticated).toBe(true);

    const localData = localStorage.getItem("spotq-auth-storage");
    expect(localData).not.toBeNull();

    const parsed = JSON.parse(localData as string);
    expect(parsed.state.user).toEqual(mockUser);
    expect(parsed.state.accessToken).toBeUndefined();
  });

  it("clears user and session on clearAuth", () => {
    useAuthStore.getState().setAuth(mockUser, "test-token-value");
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);

    const localData = localStorage.getItem("spotq-auth-storage");
    expect(localData).not.toBeNull();
    const parsed = JSON.parse(localData as string);
    expect(parsed.state.user).toBeNull();
  });

  it("sets user via setUser and marks authenticated", () => {
    useAuthStore.getState().setUser(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("automatically expires session if savedAt is older than 30 days", () => {
    const expiredTime = Date.now() - 31 * 24 * 60 * 60 * 1000; // 31 days ago
    const expiredState = {
      state: {
        user: mockUser,
        accessToken: "expired-token",
        isAuthenticated: true,
        savedAt: expiredTime,
      },
      version: 0,
    };

    localStorage.setItem("spotq-auth-storage", JSON.stringify(expiredState));

    useAuthStore.persist.rehydrate();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem("spotq-auth-storage")).toBeNull();
  });
});
