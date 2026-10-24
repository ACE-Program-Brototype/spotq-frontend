import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  ArrowLeft,
  Circle,
  Layers,
  Pencil,
  RectangleHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useRestaurantTableDetails } from "../hooks/useRestaurantTableDetails";

export default function RestaurantTableDetailPage() {
  const { tableId = "" } = useParams();
  const navigate = useNavigate();
  const restaurantId = useAuthStore((state) => state.user?.restaurantId || "");
  const { table, isLoading, isError, error, refetch } = useRestaurantTableDetails(
    restaurantId,
    tableId,
  );

  if (isLoading) {
    return <LoadingIndicator text="Loading table details..." />;
  }

  if (isError || !table) {
    return (
      <main className="mx-auto max-w-7xl space-y-4 px-3 py-8 sm:px-5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate(RESTAURANT_ROUTES.TABLE.ROOT)}
        >
          <ArrowLeft className="mr-2 size-4" /> Back to tables
        </Button>
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
        >
          <p className="font-semibold">
            {error instanceof Error ? error.message : "Failed to load table details."}
          </p>
          <Button type="button" variant="outline" className="mt-3" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      </main>
    );
  }

  const title = table.tableCode;
  const status = table.status.replaceAll("_", " ");
  const summaries: {
    label: string;
    value: string | number;
    Icon: LucideIcon;
  }[] = [
    { label: "Seats", value: table.capacity, Icon: Armchair },
    { label: "Current guests", value: table.currentOccupancy, Icon: Users },
    { label: "Section name", value: table.sectionName, Icon: Layers },
  ];
  const shape = table.shape;
  const ShapeIcon =
    shape === "CIRCLE" ? Circle : shape === "RECTANGLE" ? RectangleHorizontal : Armchair;

  return (
    <main
      className="mx-auto max-w-7xl space-y-6 px-3 pb-8 sm:px-5 sm:pb-10"
      data-testid="restaurant-table-detail-page"
    >
      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate(RESTAURANT_ROUTES.TABLE.ROOT)}
          className="-ml-2 mb-2 gap-2 text-[#68716a]"
        >
          <ArrowLeft className="size-4" /> Back to tables
        </Button>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#b4532a]">
          Floor management
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#202522] sm:text-3xl">
              Table {title}
            </h1>
            <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
              {status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm">
              <Pencil /> Edit
            </Button>
            <Button type="button" variant="destructive" size="sm">
              <Trash2 /> Delete
            </Button>
          </div>
        </div>
        <p className="mt-1 text-sm text-[#778078]">Table overview and recent guest orders.</p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        {summaries.map(({ label, value, Icon }) => (
          <Card key={label} className="border-[#ede4de] shadow-none">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#f4eee9]">
                <Icon className="size-5 text-[#51483f]" />
              </span>
              <div>
                <p className="text-xs text-[#858b85]">{label}</p>
                <p className="mt-0.5 font-semibold text-[#252a26]">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border-[#ede4de] shadow-none">
        <CardHeader className="border-b border-[#f0e9e4]">
          <CardTitle className="text-base text-[#282d29]">Table details</CardTitle>
          <CardDescription>Information for table {title}.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3">
            <ShapeIcon className="size-5 text-[#8a5a3b]" />
            <div>
              <p className="text-xs text-[#858b85]">Shape</p>
              <p className="mt-0.5 font-medium text-[#252a26]">{shape.toLowerCase()}</p>
            </div>
          </div>
          <Detail label="Section name" value={table.sectionName} />
          <Detail label="Table ID" value={table.tableId} mono />
          <Detail label="Section ID" value={table.sectionId} mono />
          <Detail label="Restaurant ID" value={table.restaurantId} mono />
          <Detail label="Status" value={status.toLowerCase()} />
          <Detail label="Capacity" value={`${table.capacity} guests`} />
          <Detail label="Created at" value={new Date(table.createdAt).toLocaleString()} />
        </CardContent>
      </Card>
    </main>
  );
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-[#858b85]">{label}</p>
      <p
        className={`mt-0.5 font-medium text-[#252a26] ${mono ? "break-all font-mono text-sm" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
