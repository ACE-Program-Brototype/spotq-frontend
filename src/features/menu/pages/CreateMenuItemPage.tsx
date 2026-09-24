import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CreateMenuItemForm } from "@/features/menu/components/CreateMenuItemForm";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";

export function CreateMenuItemPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || user?.id || "";

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
        <span className="text-[#9a3412] font-bold">New Dish</span>
      </div>

      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate("/restaurant/menu/items")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 mb-2 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to Catalog
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {MENU_MESSAGES.CREATE_ITEM_TITLE}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {MENU_MESSAGES.CREATE_ITEM_SUBTITLE}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <CreateMenuItemForm restaurantId={restaurantId} />
    </div>
  );
}

export default CreateMenuItemPage;
