/**
 * Category Card Component
 * Displays a single menu category with metadata, status badge, and an Edit action.
 */

import { ArrowUpDown, Edit3, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MenuCategory } from "../types/menu-category.types";

export interface CategoryCardProps {
  category: MenuCategory;
  onEdit: (category: MenuCategory) => void;
}

export function CategoryCard({ category, onEdit }: CategoryCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-xs hover:border-[#e8631b]/50 hover:shadow-md transition-all">
      {/* Top Meta: Display Order & Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#faf7f5] px-2.5 py-1 text-xs font-semibold text-neutral-600 border border-[#eddcd4]">
          <ArrowUpDown className="size-3 text-[#e8631b]" />
          <span>Display Order: #{category.displayOrder}</span>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            category.isActive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-neutral-100 text-neutral-600 border border-neutral-200"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              category.isActive ? "bg-emerald-500" : "bg-neutral-400"
            }`}
          />
          {category.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Category Info */}
      <div className="space-y-1.5 mb-5 flex-1">
        <h3 className="text-base font-bold text-neutral-900 group-hover:text-[#9a3412] transition-colors leading-snug">
          {category.name}
        </h3>
        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
          {category.description || "No description provided."}
        </p>
      </div>

      {/* Card Footer: Items Count & Edit Action */}
      <div className="flex items-center justify-between pt-3 border-t border-[#f3e6de]">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <UtensilsCrossed className="size-3.5 text-neutral-400" />
          <span>{category.itemCount ?? 0} menu items</span>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onEdit(category)}
          className="rounded-xl border-[#eddcd4] text-[#9a3412] hover:bg-[#fef3ec] hover:border-[#fae2d3] font-semibold text-xs h-8.5 px-3 transition-colors shadow-2xs"
          aria-label={`Edit ${category.name} category`}
        >
          <Edit3 className="size-3.5 mr-1 text-[#e8631b]" />
          <span>Edit</span>
        </Button>
      </div>
    </div>
  );
}
