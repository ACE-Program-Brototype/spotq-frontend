import { AlertCircle, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CreateMenuItemForm } from "@/features/menu/components/CreateMenuItemForm";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import { useMenuItemDetails } from "@/features/menu/hooks/use-menu-item-details";

export function EditMenuItemPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";

  const { item, isLoading, isError, error } = useMenuItemDetails(restaurantId, itemId || "");

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
        <Link to="/restaurant/dashboard" className="hover:text-neutral-700 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="size-3" />
        <Link to="/restaurant/menu/items" className="hover:text-neutral-700 transition-colors">
          Menu Items
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-[#9a3412] font-bold">
          {isLoading ? "Loading..." : item?.name ? `Edit: ${item.name}` : "Edit Dish"}
        </span>
      </div>

      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate("/restaurant/menu/items")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            Back to Catalog
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {MENU_MESSAGES.EDIT_ITEM_TITLE}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {MENU_MESSAGES.EDIT_ITEM_SUBTITLE}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-2xl border border-[#eddcd4] bg-white p-12 flex flex-col items-center justify-center space-y-4 shadow-xs">
          <Loader2 className="size-8 text-[#e8631b] animate-spin" />
          <p className="text-sm font-semibold text-neutral-600">Loading menu item details...</p>
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center space-y-4">
          <div className="inline-flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertCircle className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-900">Failed to Load Menu Item</h3>
            <p className="text-xs text-rose-600 mt-1">
              {error?.message || "The requested menu item could not be found or failed to load."}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/restaurant/menu/items")}
            className="border-rose-300 text-rose-700 hover:bg-rose-100"
          >
            Return to Menu Items
          </Button>
        </div>
      )}

      {/* Edit Form */}
      {!isLoading && !isError && item && (
        <CreateMenuItemForm
          restaurantId={restaurantId}
          mode="edit"
          menuItemId={itemId}
          initialData={item}
        />
      )}
    </div>
  );
}

export default EditMenuItemPage;
