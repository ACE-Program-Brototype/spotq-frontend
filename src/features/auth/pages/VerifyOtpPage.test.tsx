import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import VerifyOtpPage from "./VerifyOtpPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe("Customer VerifyOtpPage", () => {
  it("renders verification code header, email info, resend section, and verify button", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/forgot-password/verify", state: { email: "customer@example.com" } },
          ]}
        >
          <VerifyOtpPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Headings
    expect(screen.getByRole("heading", { name: /secure your spot\./i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /enter verification code/i })).toBeInTheDocument();

    // Email displayed in copy
    expect(screen.getByText(/customer@example\.com/i)).toBeInTheDocument();

    // Resend section
    expect(screen.getByText(/didn't receive a code\?/i)).toBeInTheDocument();

    // Verify button
    expect(screen.getByRole("button", { name: /verify account/i })).toBeInTheDocument();
  });
});
