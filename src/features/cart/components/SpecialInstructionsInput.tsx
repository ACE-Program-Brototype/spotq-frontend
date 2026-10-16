import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CART_UI_MESSAGES } from "../constants/cart.constants";

export interface SpecialInstructionsInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

export function SpecialInstructionsInput({
  value,
  onChange,
  disabled = false,
  maxLength = CART_UI_MESSAGES.SPECIAL_INSTRUCTIONS_MAX_LIMIT,
}: SpecialInstructionsInputProps) {
  const remaining = maxLength - value.length;
  const isNearLimit = remaining <= 25;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = e.target.value.slice(0, maxLength);
    onChange(nextValue);
  };

  return (
    <div className="space-y-1.5" data-testid="special-instructions-input">
      <div className="flex items-center justify-between">
        <Label htmlFor="special-instructions" className="text-sm font-semibold text-neutral-900">
          {CART_UI_MESSAGES.SPECIAL_INSTRUCTIONS_LABEL_FULL}
        </Label>
        <span
          data-testid="char-counter"
          className={`text-xs ${isNearLimit ? "text-amber-600 font-medium" : "text-neutral-400"}`}
        >
          {remaining} {CART_UI_MESSAGES.CHARS_REMAINING}
        </span>
      </div>

      <Textarea
        id="special-instructions"
        rows={2}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={CART_UI_MESSAGES.SPECIAL_INSTRUCTIONS_PLACEHOLDER}
        className="resize-none text-sm placeholder:text-neutral-400 border-neutral-200 focus-visible:border-[#e8631b] focus-visible:ring-[#e8631b]/20"
      />
    </div>
  );
}

export default SpecialInstructionsInput;
