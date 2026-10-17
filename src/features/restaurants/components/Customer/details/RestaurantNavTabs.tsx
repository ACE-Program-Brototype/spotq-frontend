import { Camera, Info, UtensilsCrossed } from "lucide-react";

export type DetailTab = "menu" | "about" | "photos";

export interface RestaurantNavTabsProps {
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  photoCount?: number;
  menuItemCount?: number;
}

export function RestaurantNavTabs({
  activeTab,
  onTabChange,
  photoCount = 0,
  menuItemCount = 0,
}: RestaurantNavTabsProps) {
  const tabs: { id: DetailTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "menu", label: "Menu", icon: UtensilsCrossed, count: menuItemCount },
    { id: "about", label: "Overview & Hours", icon: Info },
    { id: "photos", label: "Photos", icon: Camera, count: photoCount },
  ];

  return (
    <div className="sticky top-16 z-30 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-6 sm:space-x-8" aria-label="Restaurant Details Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 py-4 text-xs sm:text-sm font-bold transition-colors ${
                  isActive
                    ? "text-[#ff6b00]"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{tab.label}</span>
                {typeof tab.count === "number" && tab.count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                      isActive
                        ? "bg-[#ff6b00]/15 text-[#ff6b00]"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {/* Active Indicator Underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#ff6b00]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
