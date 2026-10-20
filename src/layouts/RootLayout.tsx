import { Suspense } from "react";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex min-h-screen w-full items-center justify-center bg-white">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff6b00] border-t-transparent" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
}

export default RootLayout;
