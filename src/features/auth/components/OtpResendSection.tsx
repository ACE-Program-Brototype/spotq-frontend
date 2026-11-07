export interface OtpResendSectionProps {
  cooldown: number;
  canResend: boolean;
  isResending: boolean;
  onResend: () => void;
}

export function OtpResendSection({
  cooldown,
  canResend,
  isResending,
  onResend,
}: OtpResendSectionProps) {
  return (
    <div className="mt-5 text-center">
      {cooldown > 0 ? (
        <p className="text-sm text-neutral-500">Resend code in {cooldown}s</p>
      ) : (
        <button
          type="button"
          onClick={onResend}
          disabled={!canResend}
          className={`text-sm font-semibold ${
            canResend
              ? "text-orange-600 hover:text-orange-700"
              : "cursor-not-allowed text-neutral-400"
          }`}
        >
          {isResending ? "Sending new code..." : "Resend OTP"}
        </button>
      )}
    </div>
  );
}
