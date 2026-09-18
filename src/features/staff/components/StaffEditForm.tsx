import { zodResolver } from "@hookform/resolvers/zod";
import { Hash, Lock, Mail, Phone, Shield, Store, User } from "lucide-react";
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
import type { StaffEditFormProps } from "@/features/staff/types/staff-detail.types";

export function StaffEditForm({ staff, onSuccess, onCancel }: StaffEditFormProps) {
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

  // Re-populate form when staff details change
  useEffect(() => {
    reset({
      name: staff.fullName,
      phone: staff.phone || "",
    });
  }, [staff, reset]);

  const updateMutation = useUpdateStaffInfo({
    restaurantId: staff.restaurantId,
    staffId: staff.id,
    onSuccess: (updated) => {
      onSuccess?.(updated);
    },
  });

  const onSubmit = (values: UpdateStaffInfoFormValues) => {
    updateMutation.mutate({
      fullname: values.name.trim(),
      phone: normalizePhoneNumber(values.phone),
    });
  };

  const isSubmitting = updateMutation.isPending;

  const handleCancel = () => {
    reset({
      name: staff.fullName,
      phone: staff.phone || "",
    });
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Section: Editable Fields */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#9a3412]">
          Editable Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-edit-name" className="text-xs font-semibold text-neutral-700">
              Full Name <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <User className="size-4 text-neutral-400" />
              </div>
              <Input
                id="staff-edit-name"
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

          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-edit-phone" className="text-xs font-semibold text-neutral-700">
              Phone Number <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Phone className="size-4 text-neutral-400" />
              </div>
              <Input
                id="staff-edit-phone"
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
      </div>

      {/* Section: Non-Editable / Read-Only Details */}
      <div className="space-y-4 pt-4 border-t border-[#eddcd4]/60">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Read-Only System Details
          </h4>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400">
            <Lock className="size-3" />
            Non-editable
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email Address */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-neutral-500">Email Address</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Mail className="size-4 text-neutral-400" />
              </div>
              <Input
                readOnly
                tabIndex={-1}
                value={staff.email}
                className="h-10 rounded-xl border-[#eddcd4] bg-neutral-50/70 pl-10 pr-3.5 text-sm font-medium text-neutral-600 cursor-default"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-neutral-500">Assigned Role</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Shield className="size-4 text-neutral-400" />
              </div>
              <Input
                readOnly
                tabIndex={-1}
                value={staff.role}
                className="h-10 rounded-xl border-[#eddcd4] bg-neutral-50/70 pl-10 pr-3.5 text-sm font-medium text-neutral-600 cursor-default"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-neutral-500">Account Status</Label>
            <Input
              readOnly
              tabIndex={-1}
              value={staff.status}
              className="h-10 rounded-xl border-[#eddcd4] bg-neutral-50/70 px-3.5 text-sm font-medium text-neutral-600 cursor-default"
            />
          </div>

          {/* Staff ID */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-neutral-500">Staff ID</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Hash className="size-4 text-neutral-400" />
              </div>
              <Input
                readOnly
                tabIndex={-1}
                value={staff.id}
                className="h-10 rounded-xl border-[#eddcd4] bg-neutral-50/70 pl-10 pr-3.5 text-sm font-mono text-neutral-600 cursor-default"
              />
            </div>
          </div>
        </div>

        {staff.restaurantId && (
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs font-semibold text-neutral-500">Restaurant ID</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Store className="size-4 text-neutral-400" />
              </div>
              <Input
                readOnly
                tabIndex={-1}
                value={staff.restaurantId}
                className="h-10 rounded-xl border-[#eddcd4] bg-neutral-50/70 pl-10 pr-3.5 text-sm font-mono text-neutral-600 cursor-default"
              />
            </div>
          </div>
        )}
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eddcd4]/80">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="h-10 rounded-xl px-5 text-xs font-semibold border-[#eddcd4] text-neutral-700 hover:bg-[#faf7f5]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="h-10 rounded-xl px-6 text-xs font-semibold bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
