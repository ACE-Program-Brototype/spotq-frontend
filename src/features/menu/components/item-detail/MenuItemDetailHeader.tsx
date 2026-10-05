/**
 * Menu Item Detail Header Component
 * Provides breadcrumb navigation, title, quick availability switch, Edit, and Delete actions.
 */

import { ArrowLeft, Edit2, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import type { MenuItemDetail } from "@/features/menu/types/menu-item.types";
import { cn } from "@/lib/utils/cn";

export interface MenuItemDetailHeaderProps {
  item: MenuItemDetail;
  isTogglingAvailability: boolean;
  isDeleting: boolean;
  onToggleAvailability: () => void;
  onDelete: () => void;
}

export function MenuItemDetailHeader({
  item,
  isTogglingAvailability,
  isDeleting,
  onToggleAvailability,
  onDelete,
}: MenuItemDetailHeaderProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="space-y-4">
        {/* Top Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link
            to="/restaurant/menu/items"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-[#9a3412] transition-colors group"
          >
            <ArrowLeft className="size-4 text-neutral-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Menu Items</span>
          </Link>

          {/* Quick Item Availability Switch */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#eddcd4] shadow-2xs">
            <span className="text-xs font-semibold text-neutral-600">Availability:</span>
            <div className="flex items-center gap-2">
              <Switch
                checked={item.isAvailable}
                onChange={onToggleAvailability}
                disabled={isTogglingAvailability}
                className={item.isAvailable ? "!bg-emerald-600" : ""}
                aria-label={`Toggle availability for ${item.name}`}
              />
              <span
                className={cn(
                  "text-xs font-bold",
                  item.isAvailable ? "text-emerald-700" : "text-neutral-500",
                )}
              >
                {isTogglingAvailability ? (
                  <Loader2 className="size-3.5 animate-spin text-neutral-400" />
                ) : item.isAvailable ? (
                  "In Stock"
                ) : (
                  "Out of Stock"
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#f3e6de]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {item.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Menu Item ID: <span className="font-mono text-neutral-700">{item.id}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to={`/restaurant/menu/items/${item.id}/edit`}
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "rounded-xl border-[#eddcd4] text-[#9a3412] hover:bg-[#fef3ec] hover:border-[#fae2d3] font-semibold text-xs sm:text-sm h-10 px-4 shadow-2xs gap-1.5",
              )}
            >
              <Edit2 className="size-4 text-[#e8631b]" />
              <span>Edit Dish</span>
            </Link>

            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="rounded-xl border-rose-200 bg-rose-50/60 text-rose-700 hover:bg-rose-100 hover:text-rose-800 font-semibold text-xs sm:text-sm h-10 px-4 shadow-2xs gap-1.5 cursor-pointer"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin text-rose-600" />
              ) : (
                <Trash2 className="size-4 text-rose-600" />
              )}
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setShowDeleteDialog(false);
          }
        }}
        title={MENU_MESSAGES.DELETE_ITEM_CONFIRM_TITLE}
        description={MENU_MESSAGES.DELETE_ITEM_CONFIRM_DESCRIPTION(item.name)}
        confirmText={MENU_MESSAGES.BTN_DELETE}
        cancelText={MENU_MESSAGES.BTN_CANCEL}
        isLoading={isDeleting}
        loadingText={MENU_MESSAGES.BTN_DELETING}
        onConfirm={onDelete}
        onCancel={() => {
          if (!isDeleting) {
            setShowDeleteDialog(false);
          }
        }}
        confirmVariant="destructive"
      />
    </>
  );
}
