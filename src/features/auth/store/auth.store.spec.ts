import type { User } from "../types/auth.types";
import { useAuthStore } from "./auth.store";

const mockUser: User = {
  id: "test-user-id",
  fullname: "Test User",
  email: "test@example.com",
  phone: "1234567890",
  status: "Active",
  createdAt: "2026-08-18T00:00:00.000Z",
  updatedAt: "2026-08-18T00:00:00.000Z",
};

describe("Auth Store State and Expiration Persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    useAuthStore.getState().clearAuth();
  });

  test("should initialize with default empty state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  test("should save credentials to localStorage", () => {
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

  test("should clear storage on clearAuth", () => {
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
    expect(parsed.state.accessToken).toBeUndefined();
  });

  test("should automatically expire session if savedAt is older than 30 days", () => {
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
