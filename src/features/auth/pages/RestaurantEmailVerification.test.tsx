import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import EmailVerification from "./RestaurantEmailVerification";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe("RestaurantEmailVerification", () => {
  it("renders the restaurant email entry form and branding copy", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EmailVerification />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/partner with spotq!/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /get started/i })).toBeInTheDocument();
    expect(
      screen.getByLabelText(/enter your restaurant email to continue/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });

  it("shows validation and confirms before sending the OTP", async () => {
    const requestOtp = jest.fn().mockResolvedValue(undefined);
    const onCodeSent = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <EmailVerification requestOtp={requestOtp} onCodeSent={onCodeSent} />
      </QueryClientProvider>,
    );

    const emailInput = screen.getByLabelText(
      /enter your restaurant email to continue/i,
    );

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      screen.getByText(/please enter a valid email address\./i),
    ).toBeInTheDocument();
    expect(requestOtp).not.toHaveBeenCalled();

    fireEvent.change(emailInput, { target: { value: "owner@restaurant.com" } });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText(/send verification code\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /send code/i }));

    await waitFor(() => {
      expect(requestOtp).toHaveBeenCalledWith("owner@restaurant.com");
    });

    expect(onCodeSent).toHaveBeenCalledWith("owner@restaurant.com");
  });
});
