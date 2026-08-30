import { Link, Outlet } from "react-router-dom";

export default function StaffAuthLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#FAF7F5] font-sans antialiased text-foreground">
      {/* Top Header */}
      <header className="flex h-16 w-full items-center border-b border-[#EFE8E2] bg-transparent px-6 sm:px-10">
        <Link
          to="/staff/login"
          className="flex items-center gap-2 text-[#8D3A0A] font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
        >
          <div className="flex size-6 items-center justify-center rounded-full border border-[#8D3A0A]">
            <span className="text-xs font-bold leading-none">Q</span>
          </div>
          <span>SpotQ</span>
        </Link>
      </header>

      {/* Centered Content Area */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
        <Outlet />
      </main>
    </div>
  );
}
