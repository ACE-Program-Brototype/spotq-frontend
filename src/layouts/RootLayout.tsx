import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { PageSkeleton } from "@/components/common/skeletons";
import { PushNotificationProvider } from "@/features/auth/context/push-notification.context";

function RootLayout() {
  return (
    <PushNotificationProvider>
      <Suspense fallback={<PageSkeleton />}>
        <Outlet />
      </Suspense>
    </PushNotificationProvider>
  );
}

export default RootLayout;
