import { Outlet } from "react-router-dom";
import { PushNotificationProvider } from "@/features/auth/context/push-notification.context";

function RootLayout() {
  return (
    <PushNotificationProvider>
      <Outlet />
    </PushNotificationProvider>
  );
}

export default RootLayout;
