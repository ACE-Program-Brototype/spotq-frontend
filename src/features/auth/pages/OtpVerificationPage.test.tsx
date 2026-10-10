import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import OtpVerificationPage from "./OtpVerificationPage";

const mockHandleVerifyOtp = jest.fn();
const mockHandleResendOtp = jest.fn();
const mockStartTimer = jest.fn();

jest.mock("../hooks/use-verify-email", () => ({
  useVerifyOtp: () => ({
    handleVerifyOtp: mockHandleVerifyOtp,
    isLoading: false,
  }),
}));

jest.mock("../hooks/use-resend-otp", () => ({
  useResendOtp: () => ({
    handleResendOtp: mockHandleResendOtp,
    isLoading: false,
  }),
}));

let mockSeconds = 0;
jest.mock("../hooks/useOtpTimer", () => ({
  useOtpTimer: () => ({
    seconds: mockSeconds,
    startTimer: mockStartTimer,
  }),
}));

describe("OtpVerificationPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSeconds = 0;
  });

  it("renders email entry form when no email search param is provided", () => {
    render(
      <MemoryRouter initialEntries={["/verify-otp"]}>
        <OtpVerificationPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /verify your email/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /enter your registered email address to receive a 6-digit verification code/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send verification code/i })).toBeInTheDocument();
  });

  it("validates email format before sending verification code", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/verify-otp"]}>
        <OtpVerificationPage />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "not-an-email");

    const submitBtn = screen.getByRole("button", { name: /send verification code/i });
    await user.click(submitBtn);

    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(mockHandleResendOtp).not.toHaveBeenCalled();
  });

  it("sends verification code and switches to OTP view on valid email submission", async () => {
    const user = userEvent.setup();
    mockHandleResendOtp.mockResolvedValue({ success: true });

    render(
      <MemoryRouter initialEntries={["/verify-otp"]}>
        <OtpVerificationPage />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "customer@example.com");

    const submitBtn = screen.getByRole("button", { name: /send verification code/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockHandleResendOtp).toHaveBeenCalledWith("customer@example.com");
    });

    expect(
      await screen.findByRole("heading", { name: /enter verification code/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/customer@example\.com/i)).toBeInTheDocument();
  });

  it("renders OTP verification view directly when email is in search params", () => {
    render(
      <MemoryRouter initialEntries={["/verify-otp?email=user%40spotq.com"]}>
        <OtpVerificationPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /enter verification code/i })).toBeInTheDocument();
    expect(screen.getByText(/user@spotq\.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /\(change\)/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /verify account/i })).toBeInTheDocument();
  });

  it("allows switching back to email input view when clicking Change", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/verify-otp?email=user%40spotq.com"]}>
        <OtpVerificationPage />
      </MemoryRouter>,
    );

    const changeBtn = screen.getByRole("button", { name: /\(change\)/i });
    await user.click(changeBtn);

    expect(await screen.findByRole("heading", { name: /verify your email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it("calls handleResendOtp when clicking Resend", async () => {
    const user = userEvent.setup();
    mockHandleResendOtp.mockResolvedValue({ success: true });

    render(
      <MemoryRouter initialEntries={["/verify-otp?email=user%40spotq.com"]}>
        <OtpVerificationPage />
      </MemoryRouter>,
    );

    const resendBtn = screen.getByRole("button", { name: /^resend$/i });
    await user.click(resendBtn);

    expect(mockHandleResendOtp).toHaveBeenCalledWith("user@spotq.com");
    expect(mockStartTimer).toHaveBeenCalledWith(59);
  });
});
