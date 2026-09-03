import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";

function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-svh bg-[#f8fafc] text-foreground">
      <div className="hidden lg:block lg:shrink-0 sticky top-0 h-svh">
        <AdminSidebar />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMobileMenuOpen(false)}
            aria-label="Close sidebar overlay"
          />
          <div className="relative z-10 flex w-72 max-w-[85vw] flex-1 flex-col bg-white shadow-2xl">
            <div className="absolute right-3 top-3">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            <AdminSidebar onNavigate={() => setMobileMenuOpen(false)} className="w-full" />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center justify-between p-4 border-b border-slate-200/80 bg-white lg:hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open sidebar menu"
          >
            <Menu className="size-5 text-slate-700" />
          </Button>
          <span className="text-sm font-bold text-[#1e3a5f]">spotQ Console</span>
          <div className="size-8" />
        </div>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
