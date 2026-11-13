import { Navigate, Outlet, useLocation } from "react-router-dom";

import { CustomerFooter } from "@/components/layout/CustomerFooter";
import { CustomerMobileNav, CustomerNavbar } from "@/components/layout/CustomerNavbar";
import { NotificationBanner } from "@/components/layout/NotificationBanner";
import { usePushNotification } from "@/features/auth/context/push-notification.context";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getRoleHome } from "@/features/auth/utils/auth.helpers";
import { useCartStore } from "@/features/cart/store/cart.store";
import {
  ActiveQueueFloatingPill,
  CustomerRingAlertContainer,
  useActiveCustomerQueue,
} from "@/features/queue";

export function CustomerLayout() {
  const { isAuthenticated, user } = useAuthStore();
  useActiveCustomerQueue();
  const pushNotification = usePushNotification();
  const cartItemCount = useCartStore((state) => state.totalCount);
  const location = useLocation();

  if (isAuthenticated && user?.role && user.role !== "CUSTOMER") {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  const isOnTrackerPage = location.pathname.includes("/queue/status");

  return (
    <div className="flex min-h-svh w-full max-w-full flex-col overflow-x-hidden bg-white text-neutral-900 pb-16 md:pb-0">
      <CustomerNavbar cartItemCount={cartItemCount} />

      <NotificationBanner {...pushNotification} />
      {!isOnTrackerPage && <CustomerRingAlertContainer />}
      <ActiveQueueFloatingPill />

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 box-border">
        <Outlet />
      </main>

      <CustomerFooter />

      <CustomerMobileNav cartItemCount={cartItemCount} />
    </div>
  );
}

export default CustomerLayout;
