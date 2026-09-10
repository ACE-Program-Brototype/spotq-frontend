import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth.store";

import { restaurantRoutes } from "./restaurant.routes";

jest.mock("@/features/subscription/services/subscription.service", () => ({
  subscriptionService: {
    fetchRestaurantStatus: jest.fn().mockResolvedValue({
      restaurantId: "res-1",
      restaurantName: "Owner Restaurant",
      verificationStatus: "APPROVED",
      isSubscriptionActive: true,
      subscriptionPlanCode: "QUEUE_PRO",
      subscriptionEndsAt: null,
      navigationTarget: "/restaurant/dashboard",
    }),
  },
  subscriptionApi: {
    fetchRestaurantStatus: jest.fn().mockResolvedValue({
      restaurantId: "res-1",
      restaurantName: "Owner Restaurant",
      verificationStatus: "APPROVED",
      isSubscriptionActive: true,
      subscriptionPlanCode: "QUEUE_PRO",
      subscriptionEndsAt: null,
      navigationTarget: "/restaurant/dashboard",
    }),
  },
}));

describe("restaurantRoutes structure and protection", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    useAuthStore.getState().clearAuth();
  });

  it("defines terms routes, privacy routes, auth layout routes, and protected layout routes", () => {
    expect(restaurantRoutes).toHaveLength(4);

    expect(restaurantRoutes[0].path).toBe("terms");
    expect(restaurantRoutes[1].path).toBe("privacy");

    const authGroup = restaurantRoutes[2];
    expect(authGroup.children?.map((child) => child.path)).toEqual([
      "email/verification",
      "otp/verification",
      "onboarding",
    ]);

    const protectedGroup = restaurantRoutes[3];
    expect(protectedGroup).toBeDefined();
    expect(protectedGroup.children).toBeDefined();
    expect(protectedGroup.children?.[0].path).toBe("subscription");
  });

  it("redirects unauthenticated user accessing protected restaurant subscription route", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/restaurant/subscription"]}>
          <Routes>
            <Route path="/restaurant">
              <Route path="email/verification" element={<div>Restaurant Email Verification</div>} />
              {restaurantRoutes.map((route, i) => {
                const Layout = route.Component as ComponentType | undefined;
                const groupKey = route.path ?? `group-${i}`;

                if (!route.children) {
                  return Layout ? (
                    <Route key={groupKey} path={route.path} element={<Layout />} />
                  ) : null;
                }

                return Layout ? (
                  <Route key={groupKey} element={<Layout />}>
                    {route.children?.map((child, j) => {
                      const ChildComp = child.Component as ComponentType | undefined;
                      const childKey = child.path ?? `child-${j}`;
                      if (child.children) {
                        return (
                          <Route key={childKey} element={ChildComp ? <ChildComp /> : null}>
                            {child.children.map((nested) => {
                              const NestedComp = nested.Component as ComponentType | undefined;
                              return (
                                <Route
                                  key={nested.path}
                                  path={nested.path}
                                  element={NestedComp ? <NestedComp /> : null}
                                />
                              );
                            })}
                          </Route>
                        );
                      }
                      return (
                        <Route
                          key={childKey}
                          path={child.path}
                          element={ChildComp ? <ChildComp /> : null}
                        />
                      );
                    })}
                  </Route>
                ) : null;
              })}
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Restaurant Email Verification")).toBeInTheDocument();
  });

  it("redirects unauthenticated user accessing protected restaurant dashboard route", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/restaurant/dashboard"]}>
          <Routes>
            <Route path="/restaurant">
              <Route path="email/verification" element={<div>Restaurant Email Verification</div>} />
              {restaurantRoutes.map((route, i) => {
                const Layout = route.Component as ComponentType | undefined;
                const groupKey = route.path ?? `group-${i}`;

                if (!route.children) {
                  return Layout ? (
                    <Route key={groupKey} path={route.path} element={<Layout />} />
                  ) : null;
                }

                return Layout ? (
                  <Route key={groupKey} element={<Layout />}>
                    {route.children?.map((child, j) => {
                      const ChildComp = child.Component as ComponentType | undefined;
                      const childKey = child.path ?? `child-${j}`;
                      if (child.children) {
                        return (
                          <Route key={childKey} element={ChildComp ? <ChildComp /> : null}>
                            {child.children.map((nested) => {
                              const NestedComp = nested.Component as ComponentType | undefined;
                              return (
                                <Route
                                  key={nested.path}
                                  path={nested.path}
                                  element={NestedComp ? <NestedComp /> : null}
                                />
                              );
                            })}
                          </Route>
                        );
                      }
                      return (
                        <Route
                          key={childKey}
                          path={child.path}
                          element={ChildComp ? <ChildComp /> : null}
                        />
                      );
                    })}
                  </Route>
                ) : null;
              })}
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Restaurant Email Verification")).toBeInTheDocument();
  });

  it("allows authenticated RESTAURANT_ADMIN user to access /restaurant/dashboard", () => {
    useAuthStore.getState().setUser({
      _id: "res-1",
      name: "Owner",
      email: "owner@restaurant.com",
      role: "RESTAURANT_ADMIN",
      created_at: "2026-08-30T10:00:00.000Z",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/restaurant/dashboard"]}>
          <Routes>
            <Route path="/restaurant">
              <Route path="email/verification" element={<div>Restaurant Email Verification</div>} />
              {restaurantRoutes.map((route, i) => {
                const Layout = route.Component as ComponentType | undefined;
                const groupKey = route.path ?? `group-${i}`;

                if (!route.children) {
                  return Layout ? (
                    <Route key={groupKey} path={route.path} element={<Layout />} />
                  ) : null;
                }

                return Layout ? (
                  <Route key={groupKey} element={<Layout />}>
                    {route.children?.map((child, j) => {
                      const ChildComp = child.Component as ComponentType | undefined;
                      const childKey = child.path ?? `child-${j}`;
                      if (child.children) {
                        return (
                          <Route key={childKey} element={ChildComp ? <ChildComp /> : null}>
                            {child.children.map((nested) => {
                              const NestedComp = nested.Component as ComponentType | undefined;
                              return (
                                <Route
                                  key={nested.path}
                                  path={nested.path}
                                  element={NestedComp ? <NestedComp /> : null}
                                />
                              );
                            })}
                          </Route>
                        );
                      }
                      return (
                        <Route
                          key={childKey}
                          path={child.path}
                          element={ChildComp ? <ChildComp /> : null}
                        />
                      );
                    })}
                  </Route>
                ) : null;
              })}
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });
});
