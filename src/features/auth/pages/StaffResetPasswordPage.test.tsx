import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import StaffResetPasswordPage from "./StaffResetPasswordPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe("StaffResetPasswordPage", () => {
  it("renders set new password title, description, and inputs", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StaffResetPasswordPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Headings
    expect(screen.getByRole("heading", { name: /set new password/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /set your new password\. choose a strong password to keep your account secure\./i,
      ),
    ).toBeInTheDocument();

    // Form inputs
    expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm new password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });
});
