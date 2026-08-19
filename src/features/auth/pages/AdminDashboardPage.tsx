import { BarChart3, Package, Settings, ShieldCheck, TrendingUp, Users } from "lucide-react";

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

function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <Badge variant="secondary" className="text-xs">
            Coming Soon
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, {user?.name ?? "Admin"}. Your platform overview will appear here.
        </p>
      </div>

      {/* Stat cards (skeleton) */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, icon: Icon, description }) => (
          <Card key={label}>
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

      {/* Coming soon section */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="size-4" />
                  Analytics Overview
                </CardTitle>
                <CardDescription className="mt-1">Platform metrics and performance</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                In Development
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
                <BarChart3 className="size-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Charts & analytics coming soon</p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                Real-time order tracking, revenue charts, and user growth metrics will be displayed
                here.
              </p>
              {/* Skeleton chart placeholder */}
              <div className="mt-8 flex w-full max-w-sm items-end justify-center gap-2">
                {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                  <Skeleton
                    // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder bars
                    key={i}
                    className="w-8 rounded-md"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side panel */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="size-4" />
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Settings className="size-4" />
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
