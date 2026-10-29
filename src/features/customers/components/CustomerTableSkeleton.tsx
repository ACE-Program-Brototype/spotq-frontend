import { TableSkeleton } from "@/components/common/skeletons";

export function CustomerTableSkeleton({ rowCount = 5 }: { rowCount?: number }) {
  return (
    <div data-testid="customer-table-skeleton">
      <TableSkeleton
        columns={["USER PROFILE", "CONTACT INFO", "STATUS", "ACTIONS"]}
        rowCount={rowCount}
        hasAvatar
        hasActions
      />
    </div>
  );
}

export default CustomerTableSkeleton;
