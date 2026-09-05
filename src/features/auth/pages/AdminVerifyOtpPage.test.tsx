import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AdminVerifyOtpPage from "./AdminVerifyOtpPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe("AdminVerifyOtpPage", () => {
  it("renders branding hero, copy, security code form, and back link", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/admin/forgot-password/verify", state: { email: "admin@spotq.com" } },
          ]}
        >
          <AdminVerifyOtpPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      screen.getByRole("heading", {
        name: /security first\./i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/security code/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /verify code/i })).toBeInTheDocument();

    const backLink = screen.getByRole("link", { name: /back to forgot key/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/admin/forgot-password");
  });
});
