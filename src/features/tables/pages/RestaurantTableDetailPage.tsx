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
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { DeleteTableDialog } from "../components/DeleteTableDialog";
import { EditTableModal } from "../components/EditTableModal";
import { TABLE_SHAPE } from "../constants/table.constants";
import { useDeleteTable } from "../hooks/useDeleteTable";
import { useRestaurantTableDetails } from "../hooks/useRestaurantTableDetails";
import { useUpdateTable } from "../hooks/useUpdateTable";
import type { UpdateTableFormData } from "../schemas/update-table.schema";

export default function RestaurantTableDetailPage() {
  const { tableId = "" } = useParams();
  const navigate = useNavigate();
  const restaurantId = useAuthStore((state) => state.user?.restaurantId || "");

  // Query table details
  const { table, isLoading, isError, error, refetch } = useRestaurantTableDetails(
    restaurantId,
    tableId,
  );

  // Mutations for table update and soft deletion
  const updateTableMutation = useUpdateTable(restaurantId);
  const deleteTableMutation = useDeleteTable(restaurantId);

  // Modal and dialog visibility state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
    shape === TABLE_SHAPE.CIRCLE
      ? Circle
      : shape === TABLE_SHAPE.SQUARE
        ? RectangleHorizontal
        : Armchair;

  // Handle table updates from the EditTableModal
  const handleUpdateTable = async (id: string, formData: UpdateTableFormData) => {
    await updateTableMutation.mutateAsync({
      tableId: id,
      payload: {
        tableCode: formData.tableCode,
        capacity: formData.capacity,
        sectionId: formData.sectionId,
        type: formData.tableShape,
      },
    });
    await refetch();
  };

  // Handle table soft-deletion from DeleteTableDialog
  const handleDeleteTable = async (id: string) => {
    await deleteTableMutation.mutateAsync(id);
    navigate(RESTAURANT_ROUTES.TABLE.ROOT);
  };

  return (
    <main
      className="mx-auto max-w-7xl space-y-6 px-3 pb-8 sm:px-5 sm:pb-10"
      data-testid="restaurant-table-detail-page"
    >
      <div>
        {/* Navigation Breadcrumb */}
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

        {/* Header with Title, Status Badge, and Action Buttons */}
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#202522] sm:text-3xl">
              Table {title}
            </h1>
            <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
              {status}
            </Badge>
          </div>

          {/* Action Buttons: Edit and Soft-Delete */}
          <div className="flex items-center gap-2">
            {/* Edit Table Trigger Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="gap-1.5 rounded-xl border-[#e2d8d0] hover:bg-[#fbf7f4] hover:text-[#9a3412]"
            >
              <Pencil className="size-3.5" /> Edit
            </Button>

            {/* Soft Delete Table Trigger Button */}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="gap-1.5 rounded-xl"
            >
              <Trash2 className="size-3.5" /> Delete
            </Button>
          </div>
        </div>
        <p className="mt-1 text-sm text-[#778078]">Table overview and floor properties.</p>
      </div>

      {/* Summary Stat Cards */}
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

      {/* Detailed Table Attributes Card */}
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

      {/* Edit and soft-delete dialogs */}
      <EditTableModal
        table={table}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        restaurantId={restaurantId}
        onSubmit={handleUpdateTable}
        isLoading={updateTableMutation.isPending}
      />

      <DeleteTableDialog
        table={table}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteTable}
        isLoading={deleteTableMutation.isPending}
      />
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
