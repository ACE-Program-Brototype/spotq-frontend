import { Layers, Plus, Tag, UtensilsCrossed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function MenuItemsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Menu Catalog
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage your restaurant offerings, portion sizes, prices, and categories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => navigate("/restaurant/menu/items/create")}
            className="bg-[#e8631b] hover:bg-[#cf5413] text-white font-semibold shadow-xs text-xs sm:text-sm"
          >
            <Plus className="size-4 mr-1.5" />
            Add Menu Item
          </Button>
        </div>
      </div>

      {/* Catalog Overview Banner */}
      <div className="rounded-2xl border border-[#eddcd4] bg-[#fffaf5] p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs">
        <div className="size-16 rounded-2xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#e8631b]">
          <UtensilsCrossed className="size-8" />
        </div>
        <div className="max-w-md">
          <h3 className="text-lg font-bold text-neutral-900">Build Your Digital Menu</h3>
          <p className="text-xs text-neutral-500 mt-1">
            Create categories, specify portion sizes, attach delicious add-ons, and upload
            high-resolution images for customer digital ordering.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/restaurant/menu/items/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#e8631b] hover:bg-[#cf5413] shadow-xs transition-all"
          >
            <Plus className="size-4" />
            Create First Dish
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl pt-6 border-t border-[#f3e6de]/80 text-left">
          <div className="p-3.5 rounded-xl bg-white border border-[#eddcd4] flex items-start gap-2.5">
            <Tag className="size-4 text-[#e8631b] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-neutral-800">Categories</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Organize items into Starters, Mains, Drinks
              </p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#eddcd4] flex items-start gap-2.5">
            <Layers className="size-4 text-[#e8631b] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-neutral-800">Portion Variants</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Configure sizes with independent SKUs and pricing
              </p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#eddcd4] flex items-start gap-2.5">
            <Plus className="size-4 text-[#e8631b] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-neutral-800">Custom Add-ons</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Offer toppings, dips, and customizable extras
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuItemsPage;
