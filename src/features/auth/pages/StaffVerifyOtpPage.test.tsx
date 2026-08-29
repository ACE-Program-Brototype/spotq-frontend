import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import StaffVerifyOtpPage from "./StaffVerifyOtpPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe("StaffVerifyOtpPage", () => {
  it("renders verify reset code title, description, and verify button", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/staff/forgot-password/verify-otp", state: { email: "staff@spotq.com" } },
          ]}
        >
          <StaffVerifyOtpPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Headings
    expect(screen.getByRole("heading", { name: /verify reset code/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /we've sent a 6-digit code to your email. please enter it below to verify your identity/i,
      ),
    ).toBeInTheDocument();

    // Verify button
    expect(screen.getByRole("button", { name: /verify code/i })).toBeInTheDocument();
  });
});
