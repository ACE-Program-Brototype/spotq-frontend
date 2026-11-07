import { type ClipboardEvent, type KeyboardEvent, useCallback, useRef, useState } from "react";

export interface UseOtpInputOptions {
  length: number;
  onClearErrors?: () => void;
}

export function useOtpInput({ length, onClearErrors }: UseOtpInputOptions) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const handleChange = (index: number, rawValue: string) => {
    const value = rawValue.replace(/\D/g, "");
    onClearErrors?.();

    if (value.length === 0) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    const chars = value.split("");
    setDigits((prev) => {
      const next = [...prev];
      let cursor = index;
      for (const ch of chars) {
        if (cursor >= length) break;
        next[cursor] = ch;
        cursor += 1;
      }
      return next;
    });

    const nextIndex = Math.min(index + chars.length, length - 1);
    focusInput(nextIndex);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        focusInput(index - 1);
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
      return;
    }
    if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    onClearErrors?.();
    const chars = pasted.slice(0, length).split("");
    setDigits((prev) => {
      const next = [...prev];
      chars.forEach((ch, i) => {
        next[i] = ch;
      });
      return next;
    });
    focusInput(Math.min(chars.length, length - 1));
  };

  const resetOtpBoxes = useCallback(() => {
    setDigits(Array(length).fill(""));
    focusInput(0);
  }, [focusInput, length]);

  const otp = digits.join("");
  const isComplete = otp.length === length;

  return {
    digits,
    setDigits,
    inputRefs,
    otp,
    isComplete,
    handleChange,
    handleKeyDown,
    handlePaste,
    resetOtpBoxes,
  };
}
