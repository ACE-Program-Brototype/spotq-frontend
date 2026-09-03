import { ArrowRight, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useAuthStore } from "@/features/auth/store/auth.store";
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

  const { user, setUser } = useAuthStore();
  const { handleLogout, isLoading: isLoggingOut } = useLogout();

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "CU";

  const handleDemoLogin = () => {
    setUser({
      _id: "demo-cust-1",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      role: "CUSTOMER",
      created_at: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-8">
      {/* Session / Authentication Demo Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/80 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 bg-[#ff6b00] text-white font-bold border border-neutral-200">
            <AvatarFallback className="bg-[#ff6b00] text-white text-xs font-bold">
              {user ? initials : <User className="size-4.5" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-neutral-900">
                {user ? user.name || "Customer User" : "Guest Visitor"}
              </span>
              <span className="rounded-md bg-neutral-200/80 px-2 py-0.5 text-[10px] font-bold text-neutral-700 uppercase tracking-wider">
                {user?.role ?? "GUEST"}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              {user?.email ?? "Sign in to save favorites and track your waitlists"}
            </p>
          </div>
        </div>

        {/* Action Buttons: Sign Out or Sign In */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {user ? (
            <ConfirmDialog
              trigger={
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isLoggingOut}
                  className="gap-2 rounded-xl text-xs font-bold shadow-xs"
                >
                  <LogOut className="size-3.5" />
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </Button>
              }
              title="Sign Out"
              description={`Are you sure you want to end your session, ${user.name || "Customer"}?`}
              confirmText="Sign Out"
              confirmVariant="destructive"
              isLoading={isLoggingOut}
              onConfirm={handleLogout}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDemoLogin}
                className="rounded-xl text-xs font-semibold border-neutral-300 hover:bg-neutral-100"
              >
                Demo Login
              </Button>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white text-xs font-bold shadow-xs transition-colors"
              >
                <LogIn className="size-3.5" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </div>

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
          pageSize={8}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          theme="brand"
        />
      </div>
    </div>
  );
}
