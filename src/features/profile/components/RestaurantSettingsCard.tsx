import { Edit3, QrCode, Sliders, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { RestaurantSettingsDetails } from "../types/restaurant-profile.types";

interface RestaurantSettingsCardProps {
  settings: RestaurantSettingsDetails;
}

export function RestaurantSettingsCard({ settings }: RestaurantSettingsCardProps) {
  const settingItems = [
    {
      key: "acceptsQueue",
      title: "Accepts Queue",
      description: "Allow customers to join virtual queue remotely or at door",
      enabled: settings.acceptsQueue,
      icon: Users,
    },
    {
      key: "acceptsQrOrders",
      title: "Accepts QR Orders",
      description: "Enable table-side QR scanning and direct menu ordering",
      enabled: settings.acceptsQrOrders,
      icon: QrCode,
    },
    {
      key: "loyaltyEnabled",
      title: "Loyalty Enabled",
      description: "Allow customers to earn and redeem SpotQ rewards points",
      enabled: settings.loyaltyEnabled,
      icon: Sliders,
    },
    {
      key: "autoAcceptQueue",
      title: "Auto Accept Queue",
      description: "Automatically accept newly placed queue entries",
      enabled: settings.autoAcceptQueue,
      icon: Zap,
    },
  ];

  return (
    <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900">Restaurant Settings</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Core operational toggles for queue management, ordering, and loyalty
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled
          className="rounded-xl border-[#eddcd4] bg-[#faf7f5] text-neutral-400 font-semibold cursor-not-allowed text-xs h-9 px-4 shrink-0"
          title="Update functionality placeholder"
        >
          <Edit3 className="size-3.5 mr-1.5" />
          <span>Update Settings</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[#f3e6de] bg-[#fffcf9] p-4 transition-all"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#fef3ec] text-[#e8631b] shrink-0 mt-0.5">
                  <Icon className="size-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-neutral-900 leading-tight">{item.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-snug">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Switch
                  checked={item.enabled}
                  disabled
                  aria-label={item.title}
                  className="cursor-not-allowed"
                />
                <span className="text-xs font-bold text-neutral-600 min-w-8 text-right">
                  {item.enabled ? "ON" : "OFF"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
