import { Navigate, Outlet } from "react-router-dom";

import { CustomerFooter } from "@/components/layout/CustomerFooter";
import { CustomerMobileNav, CustomerNavbar } from "@/components/layout/CustomerNavbar";
import { NotificationBanner } from "@/components/layout/NotificationBanner";
import { usePushNotification } from "@/features/auth/context/push-notification.context";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getRoleHome } from "@/features/auth/utils/auth.helpers";

export function CustomerLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const pushNotification = usePushNotification();

  if (isAuthenticated && user?.role && user.role !== "CUSTOMER") {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return (
    <div className="flex min-h-svh w-full max-w-full flex-col overflow-x-hidden bg-[#f5f6f8] text-neutral-900 pb-16 md:pb-0">
      <CustomerNavbar />

      <NotificationBanner {...pushNotification} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 box-border">
        <Outlet />
      </main>

      <CustomerFooter />

      <CustomerMobileNav />
    </div>
  );
}

export default CustomerLayout;
