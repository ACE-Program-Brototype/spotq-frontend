import { BarChart3, Package, Settings, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import { Pagination } from "@/components/common/Pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/store/auth.store";

const statCards = [
  {
    label: "Total Users",
    icon: Users,
    description: "Registered platform users",
  },
  {
    label: "Active Orders",
    icon: Package,
    description: "Orders in progress",
  },
  {
    label: "Revenue",
    icon: TrendingUp,
    description: "Monthly earnings",
  },
  {
    label: "System Health",
    icon: ShieldCheck,
    description: "All services operational",
  },
];

const mockRestaurants = [
  {
    id: "1",
    name: "The Steakhouse Co.",
    category: "Dine-in",
    status: "Active",
    tables: 24,
    orders: 48,
  },
  { id: "2", name: "Pasta & Vino", category: "Italian", status: "Active", tables: 18, orders: 32 },
  {
    id: "3",
    name: "Zen Sushi Hub",
    category: "Japanese",
    status: "Pending",
    tables: 12,
    orders: 15,
  },
  {
    id: "4",
    name: "Ocean Grill & Bar",
    category: "Seafood",
    status: "Active",
    tables: 30,
    orders: 60,
  },
  {
    id: "5",
    name: "Green Leaf Bistro",
    category: "Organic",
    status: "Active",
    tables: 16,
    orders: 28,
  },
];

function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const totalPages = 5;
  const totalEntries = 25;

  const handlePageChange = (page: number) => {
    setIsDemoLoading(true);
    setCurrentPage(page);
    setTimeout(() => setIsDemoLoading(false), 400);
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <Badge variant="secondary" className="text-xs font-semibold">
            Console
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, {user?.name ?? "Admin"}. Your platform overview will appear here.
        </p>
      </div>

      {/* Stat cards (skeleton) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, icon: Icon, description }) => (
          <Card key={label} className="border-slate-200/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-7 w-20" />
              <CardDescription className="text-xs">{description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Restaurants Table with Reusable Pagination & LoadingIndicator */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              Partner Restaurants
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Live table and queue management across active restaurants
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-medium text-slate-600">
            Page {currentPage} of {totalPages}
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          {isDemoLoading ? (
            <div className="p-6">
              <LoadingIndicator variant="table-skeleton" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 border-y border-slate-200/80 font-semibold">
                  <tr>
                    <th className="py-3 px-6">Restaurant Name</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Tables</th>
                    <th className="py-3 px-6">Daily Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {mockRestaurants.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-slate-900">{r.name}</td>
                      <td className="py-3.5 px-6">{r.category}</td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            r.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-amber-50 text-amber-700 border border-amber-200/60"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">{r.tables} seats</td>
                      <td className="py-3.5 px-6 font-medium">{r.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Reusable Pagination Component */}
          <div className="border-t border-slate-200/80">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalEntries}
              pageSize={5}
              colorTheme="admin"
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview & Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main area */}
        <Card className="lg:col-span-2 border-slate-200/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
                  <BarChart3 className="size-4.5 text-[#1e3a5f]" />
                  Analytics Overview
                </CardTitle>
                <CardDescription className="mt-1">Platform metrics and performance</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-medium">
                In Development
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-[#1e3a5f]">
                <BarChart3 className="size-7" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Charts & analytics coming soon</p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                Real-time order tracking, revenue charts, and user growth metrics will be displayed
                here.
              </p>
              {/* Skeleton chart placeholder */}
              <div className="mt-6 flex w-full max-w-sm items-end justify-center gap-2">
                {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                  <Skeleton
                    // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder bars
                    key={i}
                    className="w-8 rounded-md bg-slate-200/80"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side panel */}
        <div className="flex flex-col gap-4">
          <Card className="border-slate-200/80 shadow-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Users className="size-4 text-slate-500" />
                Recent Users
              </CardTitle>
              <CardDescription className="text-xs">Latest registrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2.5 w-32" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Settings className="size-4 text-slate-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["Manage Users", "View Orders", "System Settings", "Audit Logs"].map((action) => (
                <button
                  key={action}
                  type="button"
                  disabled
                  className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground opacity-50 cursor-not-allowed"
                >
                  {action}
                  <Badge variant="outline" className="text-[10px]">
                    Soon
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
