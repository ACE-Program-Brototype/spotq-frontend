import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ChevronRight,
  Hash,
  Lock,
  Mail,
  Phone,
  Shield,
  Store,
  User,
  UserCheck,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StaffDetailOverviewCard } from "@/features/staff/components/StaffDetailCards";
import { StaffDetailErrorState } from "@/features/staff/components/StaffDetailErrorState";
import { StaffDetailSkeleton } from "@/features/staff/components/StaffDetailSkeleton";
import { STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
import { useStaffDetail } from "@/features/staff/hooks/use-staff-detail";
import { useUpdateStaffInfo } from "@/features/staff/hooks/use-update-staff-info";
import {
  normalizePhoneNumber,
  type UpdateStaffInfoFormValues,
  updateStaffInfoSchema,
} from "@/features/staff/schemas/update-staff-info.schema";

export default function RestaurantStaffEditPage() {
  return (
    <ErrorBoundary>
      <StaffEditContent />
    </ErrorBoundary>
  );
}

function StaffEditContent() {
  const navigate = useNavigate();
  const { staff, isLoading, isError, error, isForbidden, isNotFound, refetch } = useStaffDetail();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateStaffInfoFormValues>({
    resolver: zodResolver(updateStaffInfoSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // Re-populate form once staff details are loaded
  useEffect(() => {
    if (staff) {
      reset({
        name: staff.fullName,
        phone: staff.phone || "",
      });
    }
  }, [staff, reset]);

  const updateMutation = useUpdateStaffInfo({
    restaurantId: staff?.restaurantId || "",
    staffId: staff?.id || "",
    onSuccess: () => {
      navigate(`/restaurant/staff/${staff?.id}`);
    },
  });

  // 1. Loading State
  if (isLoading) {
    return <StaffDetailSkeleton />;
  }

  // 2. Forbidden / Access Denied State
  if (isForbidden) {
    return <StaffDetailErrorState isForbidden />;
  }

  // 3. Not Found State
  if (isNotFound) {
    return <StaffDetailErrorState isNotFound />;
  }

  // 4. General Error State
  if (isError || !staff) {
    return (
      <StaffDetailErrorState
        message={error?.message || STAFF_MESSAGES.FETCH_STAFF_DETAIL_ERROR}
        onRetry={() => refetch()}
      />
    );
  }

  const isSubmitting = updateMutation.isPending;

  const handleCancel = () => {
    navigate(`/restaurant/staff/${staff.id}`);
  };

  const onSubmit = (values: UpdateStaffInfoFormValues) => {
    updateMutation.mutate({
      name: values.name.trim(),
      phone: normalizePhoneNumber(values.phone),
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full pb-10">
      {/* Breadcrumbs & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav
          aria-label="Breadcrumbs"
          className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium"
        >
          <Link to="/restaurant/dashboard" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3 text-neutral-400" />
          <Link to="/restaurant/staff" className="hover:text-neutral-900 transition-colors">
            Staff
          </Link>
          <ChevronRight className="size-3 text-neutral-400" />
          <Link
            to={`/restaurant/staff/${staff.id}`}
            className="hover:text-neutral-900 transition-colors"
          >
            {staff.fullName}
          </Link>
          <ChevronRight className="size-3 text-neutral-400" />
          <span className="font-bold text-[#9a3412]">Edit Information</span>
        </nav>

        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Cancel and Return
        </button>
      </div>

      {/* Page Title */}
      <div className="pt-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Edit Staff Information
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500">
          Update employee contact records while preserving role designation and permissions.
        </p>
      </div>

      {/* Main Grid: Overview card + Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StaffDetailOverviewCard staff={staff} />
        </div>

        <div className="lg:col-span-2">
          <Card className="rounded-2xl border-[#eddcd4] bg-white shadow-2xs">
            <CardHeader className="pb-3 border-b border-[#eddcd4]/60">
              <CardTitle className="flex items-center gap-2 text-base font-bold text-neutral-900">
                <UserCheck className="size-4 text-[#e8631b]" />
                <span>Staff Profile Details</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-5">
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                {/* Section: Editable Fields */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#9a3412]">
                    Editable Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="staff-edit-name"
                        className="text-xs font-semibold text-neutral-700"
                      >
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
                          className={`h-10.5 rounded-xl pl-10 pr-3.5 text-sm bg-white border-[#eddcd4] focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b] ${errors.name
                              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                              : ""
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
                      <Label
                        htmlFor="staff-edit-phone"
                        className="text-xs font-semibold text-neutral-700"
                      >
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
                          className={`h-10.5 rounded-xl pl-10 pr-3.5 text-sm bg-white border-[#eddcd4] focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b] ${errors.phone
                              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                              : ""
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

                {/* Section: Non-Editable Read-Only Details */}
                <div className="space-y-4 pt-4 border-t border-[#eddcd4]/60">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Non-Editable System Information
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400">
                      <Lock className="size-3" />
                      Read-only
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-neutral-500">
                        Email Address
                      </Label>
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
                      <Label className="text-xs font-semibold text-neutral-500">
                        Assigned Role
                      </Label>
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
                      <Label className="text-xs font-semibold text-neutral-500">
                        Account Status
                      </Label>
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
                    <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
                      <Store className="size-3.5 text-neutral-400" />
                      <span className="font-semibold text-neutral-600">Restaurant ID:</span>
                      <span className="font-mono text-neutral-700 bg-neutral-100 border border-[#eddcd4]/80 px-2 py-0.5 rounded-md text-[11px]">
                        {staff.restaurantId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Form Buttons */}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
