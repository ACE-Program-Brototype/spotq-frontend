import { LogOut } from "lucide-react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface RestaurantAdminUserProfileProps {
  userName?: string;
  userRole?: string;
  initials: string;
  onLogout: () => void;
}

export function RestaurantAdminUserProfile({
  userName = "Jane Doe",
  userRole = "Global Admin",
  initials,
  onLogout,
}: RestaurantAdminUserProfileProps) {
  return (
    <div className="pt-4 mt-6 border-t border-[#f3e6de]">
      <div className="flex items-center justify-between rounded-2xl bg-[#fef3ec] p-2.5 shadow-2xs border border-[#fae2d3]">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar className="size-8.5 rounded-xl bg-[#e8631b] text-white font-bold shrink-0">
            <AvatarFallback className="bg-[#e8631b] text-white text-xs font-bold rounded-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-neutral-900 leading-tight">{userName}</p>
            <p className="text-[10px] font-medium text-neutral-500">{userRole}</p>
          </div>
        </div>

        <ConfirmDialog
          trigger={
            <button
              type="button"
              aria-label="Logout"
              className="size-7 rounded-lg flex items-center justify-center text-neutral-600 hover:text-destructive hover:bg-white/80 transition-colors shrink-0"
            >
              <LogOut className="size-3.5" />
            </button>
          }
          title="Sign Out"
          description="Are you sure you want to end your session?"
          confirmText="Sign Out"
          confirmVariant="destructive"
          onConfirm={onLogout}
        />
      </div>
    </div>
  );
}
