import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CreateMenuItemForm } from "@/features/menu/components/CreateMenuItemForm";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";

export function CreateMenuItemPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";

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
        <span className="text-[#9a3412] font-bold">New Dish</span>
      </div>

      {/* Page Header: Direct & Compact */}
      <div className="flex items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={() => navigate(RESTAURANT_ROUTES.MENU.ITEMS)}
          className="p-1 -ml-1 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Back to Catalog"
        >
          <ArrowLeft className="size-4 text-neutral-600" />
        </button>
        <h1 className="text-base sm:text-xl font-bold text-neutral-900 tracking-tight">
          {MENU_MESSAGES.CREATE_ITEM_TITLE}
        </h1>
      </div>

      {/* Form Content */}
      <CreateMenuItemForm restaurantId={restaurantId} />
    </div>
  );
}

export default CreateMenuItemPage;
