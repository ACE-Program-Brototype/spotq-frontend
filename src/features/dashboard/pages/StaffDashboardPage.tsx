import { useAuthStore } from "@/features/auth/store/auth.store";

export default function StaffDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6 max-w-full">
      <div className="rounded-2xl border border-[#eadfd8] bg-white p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1c1714]">
          Welcome{user?.name ? `, ${user.name}` : ""}! 👋
        </h2>

        <p className="mt-1 text-sm text-[#756c66]">
          You are successfully logged in as restaurant staff.
        </p>

        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="rounded-xl border border-[#eadfd8] bg-[#faf7f5]/60 p-5">
            <p className="text-xs font-medium text-[#756c66]">Today's Queue</p>
            <p className="mt-2 text-2xl font-bold text-[#9a3412]">0</p>
          </div>

          <div className="rounded-xl border border-[#eadfd8] bg-[#faf7f5]/60 p-5">
            <p className="text-xs font-medium text-[#756c66]">Waiting Customers</p>
            <p className="mt-2 text-2xl font-bold text-[#9a3412]">0</p>
          </div>

          <div className="rounded-xl border border-[#eadfd8] bg-[#faf7f5]/60 p-5">
            <p className="text-xs font-medium text-[#756c66]">Completed</p>
            <p className="mt-2 text-2xl font-bold text-[#9a3412]">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
