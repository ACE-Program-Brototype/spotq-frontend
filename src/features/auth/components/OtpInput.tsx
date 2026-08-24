import {
  type ClipboardEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
} from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled = false,
  autoFocus = true,
  className = "",
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const otp = value.padEnd(length, "").slice(0, length);

  // Focus first input
  useEffect(() => {
    if (autoFocus && !disabled) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus, disabled]);

  const focusInput = (index: number) => {
    if (index < 0 || index >= length) return;

    const input = inputRefs.current[index];

    input?.focus();
    input?.select();
  };

  const updateOtp = (index: number, digit: string) => {
    const digits = otp.split("");

    digits[index] = digit;

    const newValue = digits.join("").replace(/\s/g, "");

    onChange(newValue);

    // Move forward
    if (digit && index < length - 1) {
      focusInput(index + 1);
    }

    // Completed
    if (
      digit &&
      index === length - 1 &&
      newValue.length === length
    ) {
      onComplete?.(newValue);
    }
  };

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.target.value;

    // Only allow numbers
    const digits = input.replace(/\D/g, "");

    if (!digits) return;

    // If browser gives us multiple characters,
    // distribute them across the inputs.
    if (digits.length > 1) {
      const nextDigits = otp.split("");

      digits
        .slice(0, length - index)
        .split("")
        .forEach((digit, offset) => {
          nextDigits[index + offset] = digit;
        });

      const newValue = nextDigits.join("");

      onChange(newValue);

      const nextIndex = Math.min(
        index + digits.length,
        length - 1,
      );

      focusInput(nextIndex);

      if (newValue.length === length) {
        onComplete?.(newValue);
      }

      return;
    }

    updateOtp(index, digits);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    switch (event.key) {
      case "Backspace": {
        event.preventDefault();

        const digits = otp.split("");

        // If current input has a value, clear it first
        if (digits[index]) {
          digits[index] = "";

          onChange(digits.join(""));
          return;
        }

        // Otherwise move backward and clear previous
        if (index > 0) {
          digits[index - 1] = "";

          onChange(digits.join(""));
          focusInput(index - 1);
        }

        break;
      }

      case "ArrowLeft": {
        event.preventDefault();

        if (index > 0) {
          focusInput(index - 1);
        }

        break;
      }

      case "ArrowRight": {
        event.preventDefault();

        if (index < length - 1) {
          focusInput(index + 1);
        }

        break;
      }

      case "Delete": {
        event.preventDefault();

        const digits = otp.split("");

        digits[index] = "";

        onChange(digits.join(""));

        break;
      }

      default:
        break;
    }
  };

  const handlePaste = (
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    const pastedText = event.clipboardData
      .getData("text")
      .replace(/\D/g, "");

    if (!pastedText) return;

    const digits = otp.split("");

    const availableLength = length - index;

    pastedText
      .slice(0, availableLength)
      .split("")
      .forEach((digit, offset) => {
        digits[index + offset] = digit;
      });

    const newValue = digits.join("");

    onChange(newValue);

    const lastIndex = Math.min(
      index + pastedText.length,
      length - 1,
    );

    focusInput(lastIndex);

    if (newValue.length === length) {
      onComplete?.(newValue);
    }
  };

  return (
    <div
      className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otp[index] ?? ""}
          disabled={disabled}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Verification code digit ${index + 1}`}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          className="
            h-12
            w-10
            rounded-xl
            border
            border-spotq-border
            bg-spotq-cream
            text-center
            text-lg
            font-semibold
            text-gray-900
            outline-none
            transition-all

            focus:border-spotq-orange
            focus:ring-2
            focus:ring-spotq-orange/20

            disabled:cursor-not-allowed
            disabled:opacity-50

            sm:h-14
            sm:w-12
          "
        />
      ))}
    </div>
  );
}