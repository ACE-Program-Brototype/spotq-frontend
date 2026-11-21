import { AlertCircle, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
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

  const isParamsMissing = !restaurantId || !itemId;
  const { item, isLoading, isError, error } = useMenuItemDetails(restaurantId, itemId || "");

  const hasError = isParamsMissing || isError;
  const errorMessage = isParamsMissing
    ? MENU_MESSAGES.RESTAURANT_OR_ITEM_ID_REQUIRED
    : error?.message || MENU_MESSAGES.EDIT_ITEM_ERROR_FALLBACK;

  return (
    <div className="space-y-3 sm:space-y-4 pb-12 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium sm:font-semibold text-neutral-400 overflow-x-auto no-scrollbar whitespace-nowrap py-0.5">
        <Link to={RESTAURANT_ROUTES.DASHBOARD} className="hover:text-neutral-700 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="size-2.5 sm:size-3 shrink-0 text-neutral-300" />
        <Link
          to={RESTAURANT_ROUTES.MENU.ITEMS}
          className="hover:text-neutral-700 transition-colors"
        >
          Menu Items
        </Link>
        <ChevronRight className="size-2.5 sm:size-3 shrink-0 text-neutral-300" />
        <span className="text-[#9a3412] font-bold truncate max-w-[140px] sm:max-w-none">
          {isLoading
            ? MENU_MESSAGES.LOADING_BREADCRUMB
            : item?.name
              ? `${MENU_MESSAGES.EDIT_ITEM_BREADCRUMB_PREFIX}${item.name}`
              : MENU_MESSAGES.EDIT_ITEM_FALLBACK_TITLE}
        </span>
      </div>

      {/* Page Header: Direct & Compact */}
      <div className="flex items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={() => navigate(RESTAURANT_ROUTES.MENU.ITEMS)}
          className="p-1 -ml-1 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label={MENU_MESSAGES.BACK_TO_CATALOG}
        >
          <ArrowLeft className="size-4 text-neutral-600" />
        </button>
        <h1 className="text-base sm:text-xl font-bold text-neutral-900 tracking-tight">
          {MENU_MESSAGES.EDIT_ITEM_TITLE}
        </h1>
      </div>

      {/* Loading State */}
      {isLoading && !isParamsMissing && (
        <div className="rounded-2xl border border-[#eddcd4] bg-white p-12 flex flex-col items-center justify-center space-y-4 shadow-xs">
          <Loader2 className="size-8 text-[#e8631b] animate-spin" />
          <p className="text-sm font-semibold text-neutral-600">
            {MENU_MESSAGES.LOADING_ITEM_DETAILS}
          </p>
        </div>
      )}

      {/* Error State */}
      {hasError && !isLoading && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center space-y-4">
          <div className="inline-flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertCircle className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-900">
              {MENU_MESSAGES.EDIT_ITEM_ERROR_TITLE}
            </h3>
            <p className="text-xs text-rose-600 mt-1">{errorMessage}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(RESTAURANT_ROUTES.MENU.ITEMS)}
            className="border-rose-300 text-rose-700 hover:bg-rose-100"
          >
            {MENU_MESSAGES.BTN_RETURN_TO_ITEMS}
          </Button>
        </div>
      )}

      {/* Edit Form */}
      {!isLoading && !hasError && item && (
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
