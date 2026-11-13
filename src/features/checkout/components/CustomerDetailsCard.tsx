import { MessageSquareText, Phone, User as UserIcon } from "lucide-react";
import type React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CheckoutFormValues } from "../schemas/checkout-form.schema";

interface CustomerDetailsCardProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  isSubmitting?: boolean;
}

export const CustomerDetailsCard: React.FC<CustomerDetailsCardProps> = ({
  register,
  errors,
  isSubmitting = false,
}) => {
  return (
    <Card className="rounded-lg sm:rounded-xl border border-[#eddcd4] bg-white shadow-2xs">
      <CardHeader className="flex flex-row items-center gap-2 sm:gap-2.5 border-b border-[#eddcd4]/50 px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="flex size-6 sm:size-7 items-center justify-center rounded-md bg-orange-50 text-[#e8631b]">
          <UserIcon className="size-3 sm:size-3.5" />
        </div>
        <div>
          <CardTitle className="text-xs sm:text-sm font-bold text-neutral-900">Customer Details</CardTitle>
          <p className="text-[10px] sm:text-[11px] text-neutral-500">
            For kitchen ticket verification, callouts, and digital receipt
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-2.5 sm:p-3.5 space-y-2 sm:space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
          {/* userName field */}
          <div className="space-y-1">
            <Label htmlFor="checkout-user-name" className="text-[10.5px] sm:text-[11px] font-semibold text-neutral-700">
              Customer Name <span className="text-neutral-400 font-normal">(Optional)</span>
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-neutral-400" />
              <Input
                id="checkout-user-name"
                type="text"
                {...register("userName")}
                disabled={isSubmitting}
                placeholder="Enter your name"
                className={`pl-7.5 h-8 sm:h-8.5 rounded-md sm:rounded-lg text-xs border-[#eddcd4] ${
                  errors.userName
                    ? "border-rose-400 focus-visible:ring-rose-200"
                    : "focus-visible:ring-1 focus-visible:ring-[#e8631b]"
                }`}
              />
            </div>
            {errors.userName?.message && (
              <p className="text-[10px] font-medium text-rose-600">{errors.userName.message}</p>
            )}
          </div>

          {/* userPhone field */}
          <div className="space-y-1">
            <Label htmlFor="checkout-user-phone" className="text-[10.5px] sm:text-[11px] font-semibold text-neutral-700">
              Mobile Number <span className="text-neutral-400 font-normal">(Optional)</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-neutral-400" />
              <Input
                id="checkout-user-phone"
                type="tel"
                {...register("userPhone")}
                disabled={isSubmitting}
                placeholder="e.g. +91 9876543210 or mobile number"
                className={`pl-7.5 h-8 sm:h-8.5 rounded-md sm:rounded-lg text-xs border-[#eddcd4] ${
                  errors.userPhone
                    ? "border-rose-400 focus-visible:ring-rose-200"
                    : "focus-visible:ring-1 focus-visible:ring-[#e8631b]"
                }`}
              />
            </div>
            {errors.userPhone?.message && (
              <p className="text-[10px] font-medium text-rose-600">{errors.userPhone.message}</p>
            )}
          </div>
        </div>

        {/* Special Instructions (Optional) */}
        <div className="space-y-1 pt-0.5">
          <Label
            htmlFor="checkout-instructions"
            className="text-[10.5px] sm:text-[11px] font-semibold text-neutral-700 flex items-center gap-1.5"
          >
            <MessageSquareText className="size-3 text-neutral-400" />
            Chef & Dining Notes <span className="text-neutral-400 font-normal">(Optional)</span>
          </Label>
          <Input
            id="checkout-instructions"
            type="text"
            {...register("specialInstructions")}
            disabled={isSubmitting}
            placeholder="e.g. Less spicy, keep sauce on the side, allergies..."
            className="h-8 sm:h-8.5 rounded-md sm:rounded-lg text-xs border-[#eddcd4] focus-visible:ring-1 focus-visible:ring-[#e8631b]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDetailsCard;
