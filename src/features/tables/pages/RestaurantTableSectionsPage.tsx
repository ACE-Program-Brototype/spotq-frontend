import { Layers, Plus, RefreshCw, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CreateSectionModal } from "../components/CreateSectionModal";
import { TableSectionCard } from "../components/TableSectionCard";
import { TableSkeletonGrid } from "../components/TableSkeletonGrid";
import { UnlistSectionDialog } from "../components/UnlistSectionDialog";
import { useCreateTableSection } from "../hooks/useCreateTableSection";
import { useUnlistTableSection } from "../hooks/useUnlistTableSection";
import { useTableSectionsPaginated } from "../hooks/useTableSectionsPaginated";
import type { TableSectionAll } from "../types/table.types";

const PAGE_SIZE = 8;

export default function RestaurantTableSectionsPage() {
  const restaurantId = useAuthStore((state) => state.user?.restaurantId || "");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } = useTableSectionsPaginated(
    restaurantId,
    page,
    PAGE_SIZE,
  );

  const createMutation = useCreateTableSection(restaurantId);
  const unlistMutation = useUnlistTableSection(restaurantId);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [sectionToUnlist, setSectionToUnlist] = useState<TableSectionAll | null>(null);

  const sections = data?.sections ?? [];
  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const handleCreateSubmit = async (name: string): Promise<boolean> => {
    try {
      await createMutation.mutateAsync({ name });
      return true;
    } catch {
      return false;
    }
  };

  const handleUnlistConfirm = async (sectionId: string) => {
    try {
      await unlistMutation.mutateAsync(sectionId);
      setSectionToUnlist(null);
    } catch {
      // Error toast is handled by useUnlistTableSection
    }
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-3 pb-10 sm:px-5">
      {/* Breadcrumb Navigation */}
      <nav
        className="flex items-center gap-2 text-xs font-semibold text-neutral-400"
        aria-label="Breadcrumb"
      >
        <Link to={RESTAURANT_ROUTES.TABLE.ROOT} className="hover:text-neutral-700">
          Tables
        </Link>
        <span>/</span>
        <span className="text-[#9a3412]">Table Sections</span>
      </nav>

      {/* Page Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2.5">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#b4532a]">
              Floor Configuration
            </p>
            <span className="rounded-full bg-[#fef3ec] px-2.5 py-0.5 text-xs font-bold text-[#9a3412] ring-1 ring-inset ring-[#fadbc8]">
              {totalItems} {totalItems === 1 ? "Section" : "Sections"}
            </span>
          </div>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#202522] sm:text-3xl">
            Table Sections
          </h1>
          <p className="mt-1 text-sm text-[#778078]">
            Organize and manage dining areas, zones, and floor plans for your restaurant.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isLoading || isFetching}
            className="h-10 rounded-xl border-[#ede4de] bg-white text-xs font-semibold text-[#51483f] hover:bg-[#faf4f0]"
          >
            <RefreshCw
              className={`size-3.5 mr-1.5 ${isLoading || isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-10 gap-2 rounded-xl bg-[#b4532a] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#963f1d]"
          >
            <Plus className="size-4" />
            Create Section
          </Button>
        </div>
      </header>

      {/* Metrics Banner */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-[#ede4de] bg-white p-4 shadow-[0_2px_8px_rgba(65,44,31,.03)]">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f8f3ef] text-[#9a3412]">
            <Layers className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#8c948e]">Total Sections</p>
            <p className="text-xl font-bold text-[#252a26]">{totalItems}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#ede4de] bg-[#fffcf9] p-4 shadow-[0_2px_8px_rgba(65,44,31,.03)]">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed] text-[#c2410c]">
            <ShieldAlert className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#8c948e]">Deletion Guard</p>
            <p className="text-xs font-semibold text-[#666c66]">Protected when tables exist</p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-8">
          <TableSkeletonGrid count={PAGE_SIZE} />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 py-12 px-4 text-center">
          <p className="text-sm font-semibold text-red-700">
            Unable to load table sections. Please check your connection.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => void refetch()}
            className="mt-4 rounded-xl border-red-300 bg-white text-xs font-semibold text-red-700 hover:bg-red-50"
          >
            Retry
          </Button>
        </div>
      ) : sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dfd3cb] bg-white py-14 px-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#f8f3ef] text-[#9a3412]">
            <Layers className="size-7" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-[#252a26]">No Table Sections Found</h3>
          <p className="mt-1 max-w-sm text-xs text-[#7c837d]">
            No dining sections have been configured for this restaurant yet. Create your first
            section to begin adding tables to your floor plan.
          </p>
          <Button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="mt-5 h-10 gap-2 rounded-xl bg-[#b4532a] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#963f1d]"
          >
            <Plus className="size-4" />
            Create Your First Section
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sections.map((section) => (
            <TableSectionCard
              key={section.id}
              section={section}
              onUnlist={(sec) => setSectionToUnlist(sec)}
            />
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="pt-2">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            disabled={isFetching}
            theme="restaurant"
          />
        </div>
      )}

      {/* Create Section Modal */}
      <CreateSectionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      {/* Unlist Verification Dialog */}
      <UnlistSectionDialog
        section={sectionToUnlist}
        isOpen={Boolean(sectionToUnlist)}
        onClose={() => setSectionToUnlist(null)}
        onConfirm={handleUnlistConfirm}
        isLoading={unlistMutation.isPending}
      />
    </main>
  );
}
