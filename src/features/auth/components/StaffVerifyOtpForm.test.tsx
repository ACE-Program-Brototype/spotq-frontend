import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { useStaffResendOtp } from "@/features/auth/hooks/useStaffResendOtp";
import { useStaffVerifyOtp } from "@/features/auth/hooks/useStaffVerifyOtp";
import StaffVerifyOtpForm from "./StaffVerifyOtpForm";

jest.mock("@/features/auth/hooks/useStaffVerifyOtp");
jest.mock("@/features/auth/hooks/useStaffResendOtp");

const mockUseStaffVerifyOtp = useStaffVerifyOtp as jest.MockedFunction<typeof useStaffVerifyOtp>;
const mockUseStaffResendOtp = useStaffResendOtp as jest.MockedFunction<typeof useStaffResendOtp>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter
      initialEntries={[
        { pathname: "/staff/forgot-password/verify-otp", state: { email: "staff@spotq.com" } },
      ]}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
};

describe("StaffVerifyOtpForm", () => {
  const mockVerify = jest.fn();
  const mockResend = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseStaffVerifyOtp.mockReturnValue({
      mutate: mockVerify,
      isPending: false,
    } as unknown as ReturnType<typeof useStaffVerifyOtp>);

    mockUseStaffResendOtp.mockReturnValue({
      mutate: mockResend,
      isPending: false,
    } as unknown as ReturnType<typeof useStaffResendOtp>);
  });

  it("renders OTP inputs and verify button", () => {
    render(<StaffVerifyOtpForm initialEmail="staff@spotq.com" />, { wrapper: createWrapper() });

    expect(screen.getByRole("button", { name: /verify code/i })).toBeInTheDocument();
  });

  it("shows validation error on empty OTP submit", async () => {
    render(<StaffVerifyOtpForm initialEmail="staff@spotq.com" />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByRole("button", { name: /verify code/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/please enter a 6-digit otp/i);
    });
    expect(mockVerify).not.toHaveBeenCalled();
  });

  it("does not call verifyOtp when email is missing", async () => {
    render(<StaffVerifyOtpForm initialEmail="" />, {
      wrapper: ({ children }) => (
        <MemoryRouter
          initialEntries={[{ pathname: "/staff/forgot-password/verify-otp", state: null }]}
        >
          <QueryClientProvider
            client={
              new QueryClient({
                defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
              })
            }
          >
            {children}
          </QueryClientProvider>
        </MemoryRouter>
      ),
    });

    const inputs = screen.getAllByRole("textbox");
    for (const input of inputs) {
      fireEvent.change(input, { target: { value: "123456" } });
    }

    fireEvent.click(screen.getByRole("button", { name: /verify code/i }));

    await waitFor(() => {
      expect(mockVerify).not.toHaveBeenCalled();
    });
  });
});
