import { Bell, LogOut } from "lucide-react";
import { Outlet } from "react-router-dom";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAdminLogout } from "@/features/auth/hooks/useAdminLogout";
import { useAuthStore } from "@/features/auth/store/auth.store";

function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending: isLoggingOut } = useAdminLogout();

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "A";

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-svh bg-background">
      {/* ── Top nav header ── */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-foreground">
              <span className="text-sm font-bold text-background">S</span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div>
              <p className="text-sm font-semibold leading-none text-foreground">Admin Console</p>
              <p className="mt-0.5 text-xs text-muted-foreground">spotQ Platform</p>
            </div>
          </div>

          {/* User Controls & Logout */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Notifications"
              className="text-muted-foreground"
            >
              <Bell className="size-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-5" />

            <div className="flex items-center gap-2.5">
              <Avatar className="size-7">
                <AvatarFallback className="text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-xs font-medium leading-none text-foreground">
                  {user?.name ?? "Admin"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <ConfirmDialog
              trigger={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isLoggingOut}
                  aria-label="Log out"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="size-4" />
                </Button>
              }
              title="Sign Out"
              description="Are you sure you want to end your current session? You will need to sign in again to access the admin console."
              confirmText="Sign Out"
              loadingText="Signing out…"
              confirmVariant="destructive"
              isLoading={isLoggingOut}
              onConfirm={handleLogout}
            />
          </div>
        </div>
      </header>

      {/* ── Child Pages Outlet ── */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
