import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Pagination } from "@/components/common/Pagination";
import { cn } from "@/lib/utils/cn";

const categories = ["Mandi", "Chinese", "Multi-Cuisine", "Pure Veg", "Open Now"];

const sampleRestaurants = [
  {
    id: 1,
    name: "Spice Route",
    location: "Ernakulam",
    description:
      "Authentic North Indian cuisine bringing the rich traditions of the Spice Route to the heart of New Delhi.",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Spice Route",
    location: "Ernakulam",
    description:
      "Authentic North Indian cuisine bringing the rich traditions of the Spice Route to the heart of New Delhi.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Spice Route",
    location: "Ernakulam",
    description:
      "Authentic North Indian cuisine bringing the rich traditions of the Spice Route to the heart of New Delhi.",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Spice Route",
    location: "Ernakulam",
    description:
      "Authentic North Indian cuisine bringing the rich traditions of the Spice Route to the heart of New Delhi.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Spice Route",
    location: "Ernakulam",
    description:
      "Authentic North Indian cuisine bringing the rich traditions of the Spice Route to the heart of New Delhi.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Spice Route",
    location: "Ernakulam",
    description:
      "Authentic North Indian cuisine bringing the rich traditions of the Spice Route to the heart of New Delhi.",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    name: "Spice Route",
    location: "Ernakulam",
    description:
      "Authentic North Indian cuisine bringing the rich traditions of the Spice Route to the heart of New Delhi.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    name: "Spice Route",
    location: "Ernakulam",
    description:
      "Authentic North Indian cuisine bringing the rich traditions of the Spice Route to the heart of New Delhi.",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=80",
  },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("Pure Veg");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-8">
      {/* Title & Filter Pills Header */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
          Find your next favorite restaurant
        </h1>

        {/* Categories Carousel / Badges */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all border shadow-2xs",
                  isSelected
                    ? "bg-[#ff6b00] text-white border-[#ff6b00] shadow-xs"
                    : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4-Column Restaurant Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {sampleRestaurants.map((res) => (
          <div
            key={res.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs transition-all hover:shadow-md hover:border-neutral-300"
          >
            {/* Card Image */}
            <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
              <img
                src={res.image}
                alt={res.name}
                loading="lazy"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Card Content */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-neutral-900 text-sm">{res.name}</h3>
                  <span className="text-[10px] font-medium text-neutral-400">{res.location}</span>
                </div>
                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {res.description}
                </p>
              </div>

              {/* View Details Link */}
              <div className="pt-4">
                <Link
                  to={`/restaurant/${res.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6b00] hover:text-[#e05e00] transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination component matching mockup */}
      <div className="pt-4">
        <Pagination
          totalItems={64}
          itemsPerPage={8}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          theme="brand"
        />
      </div>
    </div>
  );
}
