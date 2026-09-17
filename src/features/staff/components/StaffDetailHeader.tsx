import { ArrowLeft, ChevronRight, Trash2, UserCheck, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
import type { StaffDetailHeaderProps } from "@/features/staff/types/staff-detail.types";

export function StaffDetailHeader({
  staff,
  onToggleStatus,
  onRequestDelete,
  isUpdatingStatus = false,
  isDeleting = false,
}: StaffDetailHeaderProps) {
  const isActive = staff.status.toUpperCase() === "ACTIVE";

  return (
    <div className="space-y-4">
      {/* Breadcrumbs & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumbs">
          <ol className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <li>
              <Link to="/restaurant/dashboard" className="hover:text-neutral-900 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3 text-neutral-400" />
            </li>
            <li>
              <Link to="/restaurant/staff" className="hover:text-neutral-900 transition-colors">
                Staff
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3 text-neutral-400" />
            </li>
            <li>
              <span aria-current="page" className="font-bold text-[#9a3412]">
                Staff Details
              </span>
            </li>
          </ol>
        </nav>

        <Link
          to="/restaurant/staff"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          {STAFF_MESSAGES.ACTION_BACK_TO_STAFF_MEMBERS}
        </Link>
      </div>

      {/* Main Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              {staff.fullName}
            </h1>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-neutral-100 text-neutral-600 border-neutral-200"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-neutral-400"}`}
              />
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Review staff account details, designated role permissions, and access status.
          </p>
        </div>

        {/* Action Buttons (UI-Only in this story): 1. Active/Inactive Toggle, 2. Remove Staff */}
        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          {/* Active/Inactive Toggle Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleStatus}
            disabled={isUpdatingStatus || isDeleting}
            className={`h-10 rounded-xl px-4 text-xs font-semibold transition-colors border shadow-2xs ${
              isActive
                ? "border-amber-200 bg-amber-50/70 text-amber-800 hover:bg-amber-100/80 hover:text-amber-900"
                : "border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100/80 hover:text-emerald-900"
            }`}
          >
            {isActive ? (
              <>
                <UserX className="size-3.5 mr-1.5 text-amber-700" />
                {STAFF_MESSAGES.ACTION_DEACTIVATE}
              </>
            ) : (
              <>
                <UserCheck className="size-3.5 mr-1.5 text-emerald-700" />
                {STAFF_MESSAGES.ACTION_ACTIVATE}
              </>
            )}
          </Button>

          {/* Remove Staff Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRequestDelete}
            disabled={isUpdatingStatus || isDeleting}
            className="h-10 rounded-xl px-4 text-xs font-semibold border-rose-200 bg-rose-50/60 text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-colors shadow-2xs"
          >
            <Trash2 className="size-3.5 mr-1.5 text-rose-600" />
            {STAFF_MESSAGES.ACTION_REMOVE}
          </Button>
        </div>
      </div>
    </div>
  );
}
