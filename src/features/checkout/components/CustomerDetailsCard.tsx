import { MessageSquareText, Phone, User as UserIcon } from "lucide-react";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerDetailsCardProps {
  userName: string;
  setUserName: (val: string) => void;
  userPhone: string;
  setUserPhone: (val: string) => void;
  specialInstructions: string;
  setSpecialInstructions: (val: string) => void;
  errors: Record<string, string>;
  isSubmitting?: boolean;
}

export const CustomerDetailsCard: React.FC<CustomerDetailsCardProps> = ({
  userName,
  setUserName,
  userPhone,
  setUserPhone,
  specialInstructions,
  setSpecialInstructions,
  errors,
  isSubmitting = false,
}) => {
  return (
    <Card className="rounded-2xl border-neutral-200/80 bg-white shadow-xs">
      <CardHeader className="flex flex-row items-center gap-3 border-b border-neutral-100 pb-4 pt-5 px-5 sm:px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-[#ff6b00]">
          <UserIcon className="h-4.5 w-4.5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold text-neutral-900">Customer Details</CardTitle>
          <p className="text-xs text-neutral-500">
            For kitchen ticket verification, callouts, and digital receipt
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* userName field */}
          <div className="space-y-1.5">
            <Label htmlFor="checkout-user-name" className="text-xs font-semibold text-neutral-700">
              Customer Name <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                id="checkout-user-name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={isSubmitting}
                placeholder="e.g. Alex Morgan"
                className={`pl-9.5 h-10.5 rounded-xl text-sm ${
                  errors.userName
                    ? "border-rose-400 focus-visible:ring-rose-200"
                    : "border-neutral-200 focus-visible:ring-orange-200"
                }`}
              />
            </div>
            {errors.userName && (
              <p className="text-[11px] font-medium text-rose-600">{errors.userName}</p>
            )}
          </div>

          {/* userPhone field */}
          <div className="space-y-1.5">
            <Label htmlFor="checkout-user-phone" className="text-xs font-semibold text-neutral-700">
              Mobile Number <span className="text-rose-500">*</span>
            </Label>
            <div className="relative flex rounded-xl border border-neutral-200 focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-[#ff6b00] overflow-hidden bg-white">
              <span className="flex items-center px-3 bg-neutral-50 text-neutral-500 text-xs font-semibold border-r border-neutral-200">
                +91
              </span>
              <Input
                id="checkout-user-phone"
                type="tel"
                maxLength={10}
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value.replace(/\D/g, ""))}
                disabled={isSubmitting}
                placeholder="98765 43210"
                className="border-0 shadow-none focus-visible:ring-0 h-10.5 text-sm rounded-none"
              />
              <Phone className="mr-3 self-center h-4 w-4 text-neutral-400 pointer-events-none" />
            </div>
            {errors.userPhone && (
              <p className="text-[11px] font-medium text-rose-600">{errors.userPhone}</p>
            )}
          </div>
        </div>

        {/* Special Instructions (Optional) */}
        <div className="space-y-1.5 pt-1">
          <Label
            htmlFor="checkout-instructions"
            className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5"
          >
            <MessageSquareText className="h-3.5 w-3.5 text-neutral-400" />
            Chef & Dining Notes <span className="text-neutral-400 font-normal">(Optional)</span>
          </Label>
          <Input
            id="checkout-instructions"
            type="text"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. Less spicy, keep sauce on the side, allergies..."
            className="h-10 rounded-xl text-sm border-neutral-200 focus-visible:ring-orange-200"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDetailsCard;
