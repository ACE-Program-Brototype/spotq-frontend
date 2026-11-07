import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ResetPasswordPage from "./ResetPasswordPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe("Customer ResetPasswordPage", () => {
  it("renders reset password headers, inputs, criteria checklist, and submit button", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/forgot-password/reset-password",
              state: { email: "customer@example.com" },
            },
          ]}
        >
          <ResetPasswordPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByRole("heading", { name: /secure your new password/i })).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { name: /reset password/i }).length,
    ).toBeGreaterThanOrEqual(1);

    expect(screen.getByLabelText(/^new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password/i)).toBeInTheDocument();

    expect(screen.getByText(/at least 8 characters long/i)).toBeInTheDocument();
    expect(screen.getByText(/include a special character/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /update password/i })).toBeInTheDocument();
  });
});
