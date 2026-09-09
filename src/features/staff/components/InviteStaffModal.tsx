import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send, UserPlus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type InviteStaffFormValues,
  inviteStaffSchema,
} from "@/features/staff/schemas/staff-invitation.schema";

type InviteStaffModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: string) => Promise<boolean>;
  isLoading?: boolean;
};

export function InviteStaffModal({
  isOpen,
  onClose,
  onSend,
  isLoading = false,
}: InviteStaffModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteStaffFormValues>({
    resolver: zodResolver(inviteStaffSchema),
    defaultValues: {
      email: "",
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (values: InviteStaffFormValues) => {
    const success = await onSend(values.email);
    if (success) {
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md rounded-2xl bg-white border border-[#eddcd4] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3e6de] bg-[#fffcf9]">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-[#fef3ec] flex items-center justify-center text-[#9a3412] border border-[#fae2d3]">
              <UserPlus className="size-4 text-[#e8631b]" />
            </div>
            <div>
              <h3
                id="invite-modal-title"
                className="text-base font-bold text-neutral-900 leading-tight"
              >
                Invite Staff Member
              </h3>
              <p className="text-xs text-neutral-500">Send an onboarding invite link via email</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="staff-email" className="block text-xs font-semibold text-neutral-700">
              Staff Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <Input
                id="staff-email"
                type="email"
                placeholder="colleague@restaurant.com"
                autoFocus
                disabled={isLoading}
                className="pl-10 h-10.5 rounded-xl border-[#eddcd4] bg-[#faf7f5]/40 focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b]"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-rose-500">{errors.email.message}</p>
            )}
          </div>

          <div className="rounded-xl bg-[#fef3ec]/70 p-3.5 border border-[#fae2d3] text-xs text-[#9a3412] space-y-1">
            <p className="font-semibold">How it works:</p>
            <p className="text-[#9a3412]/80 leading-relaxed">
              We'll send a secure invitation link to this email address. The recipient can click the
              link, complete their profile, and set a password to join your team.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="rounded-xl border-[#eddcd4] text-neutral-700 hover:bg-[#faf7f5]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs"
            >
              {isLoading ? (
                <div className="flex items-center gap-1.5">
                  <Spinner size="sm" theme="white" />
                  <span>Sending...</span>
                </div>
              ) : (
                <>
                  <Send className="size-3.5 mr-1.5" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
