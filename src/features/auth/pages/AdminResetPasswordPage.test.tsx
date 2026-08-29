import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AdminResetPasswordPage from "./AdminResetPasswordPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe("AdminResetPasswordPage", () => {
  it("renders branding hero, key fields, update button, and back link", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/admin/forgot-password/reset-password",
              state: { email: "admin@spotq.com" },
            },
          ]}
        >
          <AdminResetPasswordPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Headline
    expect(
      screen.getByRole("heading", {
        name: /set your new administrative key\./i,
      }),
    ).toBeInTheDocument();

    // Inputs & Button
    expect(screen.getByLabelText(/^new key$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm key$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /update key/i })).toBeInTheDocument();

    // Back to Sign In link
    const backLink = screen.getByRole("link", { name: /back to sign in/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/admin/login");
  });
});
