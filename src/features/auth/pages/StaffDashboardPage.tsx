import { useAuthStore } from "@/features/auth/store/auth.store";

export default function StaffDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <main className="min-h-svh bg-[#fcf8f5]">
      <header className="border-b border-[#eadfd8] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-[#1c1714]">Staff Dashboard</h1>

          <span className="text-sm text-[#756c66]">{user?.email}</span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-[#eadfd8] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#1c1714]">
            Welcome{user?.name ? `, ${user.name}` : ""}! 👋
          </h2>

          <p className="mt-2 text-sm text-[#756c66]">
            You are successfully logged in as restaurant staff.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-[#eadfd8] p-5">
              <p className="text-sm text-[#756c66]">Today's Queue</p>
              <p className="mt-2 text-2xl font-semibold">0</p>
            </div>

            <div className="rounded-lg border border-[#eadfd8] p-5">
              <p className="text-sm text-[#756c66]">Waiting Customers</p>
              <p className="mt-2 text-2xl font-semibold">0</p>
            </div>

            <div className="rounded-lg border border-[#eadfd8] p-5">
              <p className="text-sm text-[#756c66]">Completed</p>
              <p className="mt-2 text-2xl font-semibold">0</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
