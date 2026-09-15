import { zodResolver } from "@hookform/resolvers/zod";
import { Hash, Lock, Mail, Phone, Shield, Store, User, UserCheck, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateStaffInfo } from "@/features/staff/hooks/use-update-staff-info";
import {
  normalizePhoneNumber,
  type UpdateStaffInfoFormValues,
  updateStaffInfoSchema,
} from "@/features/staff/schemas/update-staff-info.schema";
import type { EditStaffModalProps } from "@/features/staff/types/staff-detail.types";

export function EditStaffModal({ isOpen, onClose, staff }: EditStaffModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateStaffInfoFormValues>({
    resolver: zodResolver(updateStaffInfoSchema),
    defaultValues: {
      name: staff.fullName,
      phone: staff.phone || "",
    },
  });

  // Re-populate form when modal opens or staff data changes
  useEffect(() => {
    if (isOpen) {
      reset({
        name: staff.fullName,
        phone: staff.phone || "",
      });
    }
  }, [isOpen, staff, reset]);

  const updateMutation = useUpdateStaffInfo({
    restaurantId: staff.restaurantId,
    staffId: staff.id,
    onSuccess: () => {
      onClose();
    },
  });

  if (!isOpen) return null;

  const handleClose = () => {
    reset({
      name: staff.fullName,
      phone: staff.phone || "",
    });
    onClose();
  };

  const onSubmit = (values: UpdateStaffInfoFormValues) => {
    // Send only name and phone to the API
    updateMutation.mutate({
      name: values.name.trim(),
      phone: normalizePhoneNumber(values.phone),
    });
  };

  const isSubmitting = updateMutation.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-staff-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#eddcd4] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3e6de] bg-[#fffcf9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-[#fef3ec] flex items-center justify-center text-[#9a3412] border border-[#fae2d3]">
              <UserCheck className="size-4.5 text-[#e8631b]" />
            </div>
            <div>
              <h3
                id="edit-staff-modal-title"
                className="text-base font-bold text-neutral-900 leading-tight"
              >
                Edit Staff Information
              </h3>
              <p className="text-xs text-neutral-500">
                Update staff member's name and contact number
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body & Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="p-6 space-y-5 overflow-y-auto flex-1"
        >
          {/* Section: Editable Fields */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9a3412]">
              Editable Information
            </h4>

            {/* Full Name Field */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-staff-name" className="text-xs font-semibold text-neutral-700">
                Full Name <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="size-4 text-neutral-400" />
                </div>
                <Input
                  id="edit-staff-name"
                  type="text"
                  placeholder="e.g. Ravi Kumar"
                  disabled={isSubmitting}
                  className={`h-10.5 rounded-xl pl-10 pr-3.5 text-sm bg-white border-[#eddcd4] focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b] ${
                    errors.name ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500" : ""
                  }`}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-xs font-medium text-rose-500">{errors.name.message}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-staff-phone" className="text-xs font-semibold text-neutral-700">
                Phone Number <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Phone className="size-4 text-neutral-400" />
                </div>
                <Input
                  id="edit-staff-phone"
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  disabled={isSubmitting}
                  className={`h-10.5 rounded-xl pl-10 pr-3.5 text-sm bg-white border-[#eddcd4] focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b] ${
                    errors.phone ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500" : ""
                  }`}
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-xs font-medium text-rose-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Section: Non-Editable / Read-Only Information */}
          <div className="space-y-3 pt-2 border-t border-[#eddcd4]/60">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Read-Only System Details
              </h4>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400">
                <Lock className="size-3" />
                Non-editable
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Email Address */}
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-neutral-500">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                  <Input
                    readOnly
                    tabIndex={-1}
                    value={staff.email}
                    className="h-9 rounded-lg border-[#eddcd4] bg-neutral-100/70 pl-9 pr-2.5 text-xs text-neutral-600 cursor-default"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-neutral-500">Assigned Role</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                  <Input
                    readOnly
                    tabIndex={-1}
                    value={staff.role}
                    className="h-9 rounded-lg border-[#eddcd4] bg-neutral-100/70 pl-9 pr-2.5 text-xs text-neutral-600 cursor-default"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-neutral-500">Account Status</Label>
                <Input
                  readOnly
                  tabIndex={-1}
                  value={staff.status}
                  className="h-9 rounded-lg border-[#eddcd4] bg-neutral-100/70 px-3 text-xs text-neutral-600 cursor-default"
                />
              </div>

              {/* Staff ID */}
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-neutral-500">Staff ID</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                  <Input
                    readOnly
                    tabIndex={-1}
                    value={staff.id}
                    className="h-9 rounded-lg border-[#eddcd4] bg-neutral-100/70 pl-9 pr-2.5 text-xs font-mono text-neutral-600 cursor-default"
                  />
                </div>
              </div>
            </div>

            {staff.restaurantId && (
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-neutral-500">Restaurant ID</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                  <Input
                    readOnly
                    tabIndex={-1}
                    value={staff.restaurantId}
                    className="h-9 rounded-lg border-[#eddcd4] bg-neutral-100/70 pl-9 pr-2.5 text-xs font-mono text-neutral-600 cursor-default"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eddcd4]/80 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="h-10 rounded-xl px-4 text-xs font-semibold border-[#eddcd4] text-neutral-700 hover:bg-[#faf7f5]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="h-10 rounded-xl px-5 text-xs font-semibold bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" theme="white" />
                  <span>Updating...</span>
                </div>
              ) : (
                <span>Update</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
