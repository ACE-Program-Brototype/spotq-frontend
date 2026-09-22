import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "./DataTable";
import type { Column } from "./DataTable.types";

interface TestItem {
  id: string;
  name: string;
  age: number;
  role: string;
  status: "active" | "inactive";
}

const mockData: TestItem[] = [
  { id: "1", name: "Alice Johnson", age: 32, role: "Manager", status: "active" },
  { id: "2", name: "Bob Smith", age: 24, role: "Developer", status: "inactive" },
  { id: "3", name: "Charlie Brown", age: 29, role: "Designer", status: "active" },
];

const mockColumns: Column<TestItem>[] = [
  {
    key: "name",
    header: "Full Name",
    accessor: "name",
    sortable: true,
  },
  {
    key: "age",
    header: "Age",
    accessor: "age",
    sortable: true,
    align: "right",
  },
  {
    key: "role",
    header: "Role",
    accessor: (row) => row.role.toUpperCase(),
  },
  {
    key: "status",
    header: "Status",
    cell: ({ row }) => <span data-testid={`badge-${row.id}`}>{row.status.toUpperCase()}</span>,
  },
];

describe("DataTable", () => {
  describe("Rendering & Column Definitions", () => {
    it("renders column headers and cell values correctly", () => {
      render(<DataTable data={mockData} columns={mockColumns} />);

      expect(screen.getByText("Full Name")).toBeInTheDocument();
      expect(screen.getByText("Age")).toBeInTheDocument();
      expect(screen.getByText("Role")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();

      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
      expect(screen.getByText("32")).toBeInTheDocument();
      expect(screen.getByText("MANAGER")).toBeInTheDocument();
      expect(screen.getByTestId("badge-1")).toHaveTextContent("ACTIVE");

      expect(screen.getByText("Bob Smith")).toBeInTheDocument();
      expect(screen.getByText("DEVELOPER")).toBeInTheDocument();
    });

    it("renders custom header functions with sortDirection parameter", () => {
      const customCol: Column<TestItem>[] = [
        {
          key: "name",
          header: ({ sortDirection }) => <span>Name Col (Dir: {sortDirection || "none"})</span>,
          accessor: "name",
          sortable: true,
        },
      ];

      render(<DataTable data={mockData} columns={customCol} />);
      expect(screen.getByText("Name Col (Dir: none)")).toBeInTheDocument();
    });
  });

  describe("Sorting", () => {
    it("sorts rows in-memory when onSort is not provided (client-side mode)", () => {
      render(<DataTable data={mockData} columns={mockColumns} />);

      const sortNameBtn = screen.getByRole("button", { name: /sort by full name/i });

      // Click to sort ASC (Alice, Bob, Charlie)
      fireEvent.click(sortNameBtn);
      let rows = screen.getAllByRole("row");
      // Row 0 is the header row
      expect(rows[1]).toHaveTextContent("Alice Johnson");
      expect(rows[2]).toHaveTextContent("Bob Smith");
      expect(rows[3]).toHaveTextContent("Charlie Brown");

      // Click again to sort DESC (Charlie, Bob, Alice)
      fireEvent.click(sortNameBtn);
      rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent("Charlie Brown");
      expect(rows[2]).toHaveTextContent("Bob Smith");
      expect(rows[3]).toHaveTextContent("Alice Johnson");
    });

    it("sorts numeric columns accurately", () => {
      render(<DataTable data={mockData} columns={mockColumns} />);

      const sortAgeBtn = screen.getByRole("button", { name: /sort by age/i });

      // Click ASC -> Bob (24), Charlie (29), Alice (32)
      fireEvent.click(sortAgeBtn);
      let rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent("Bob Smith");
      expect(rows[2]).toHaveTextContent("Charlie Brown");
      expect(rows[3]).toHaveTextContent("Alice Johnson");

      // Click DESC -> Alice (32), Charlie (29), Bob (24)
      fireEvent.click(sortAgeBtn);
      rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent("Alice Johnson");
      expect(rows[2]).toHaveTextContent("Charlie Brown");
      expect(rows[3]).toHaveTextContent("Bob Smith");
    });

    it("calls onSort callback when provided (server-side mode)", () => {
      const handleSort = jest.fn();
      render(
        <DataTable
          data={mockData}
          columns={mockColumns}
          sortBy="name"
          sortOrder="asc"
          onSort={handleSort}
        />,
      );

      const sortNameBtn = screen.getByRole("button", { name: /sort by full name/i });
      fireEvent.click(sortNameBtn);
      expect(handleSort).toHaveBeenCalledWith("name", "desc");
    });

    it("has correct aria-sort attributes on header cells", () => {
      const { rerender } = render(
        <DataTable
          data={mockData}
          columns={mockColumns}
          sortBy="name"
          sortOrder="asc"
          onSort={jest.fn()}
        />,
      );

      const nameTh = screen.getByRole("columnheader", { name: /full name/i });
      expect(nameTh).toHaveAttribute("aria-sort", "ascending");

      rerender(
        <DataTable
          data={mockData}
          columns={mockColumns}
          sortBy="name"
          sortOrder="desc"
          onSort={jest.fn()}
        />,
      );
      expect(nameTh).toHaveAttribute("aria-sort", "descending");
    });
  });

  describe("Row Interactions & Click Handlers", () => {
    it("calls onRowClick when a row is clicked", () => {
      const handleRowClick = jest.fn();
      render(<DataTable data={mockData} columns={mockColumns} onRowClick={handleRowClick} />);

      const firstRow = screen.getByTestId("data-table-row-1");
      fireEvent.click(firstRow);

      expect(handleRowClick).toHaveBeenCalledTimes(1);
      expect(handleRowClick).toHaveBeenCalledWith(mockData[0], expect.any(Object));
    });
  });

  describe("Row Selection", () => {
    it("renders row checkboxes and select-all checkbox when selectable is true", () => {
      const handleSelectionChange = jest.fn();

      render(
        <DataTable
          data={mockData}
          columns={mockColumns}
          selectable
          onSelectionChange={handleSelectionChange}
        />,
      );

      const selectAllCheckbox = screen.getByLabelText("Select all rows");
      const row1Checkbox = screen.getByLabelText("Select row 1");

      expect(selectAllCheckbox).toBeInTheDocument();
      expect(row1Checkbox).toBeInTheDocument();

      // Click row 1
      fireEvent.click(row1Checkbox);
      expect(handleSelectionChange).toHaveBeenCalledWith(["1"], [mockData[0]]);

      // Select all rows
      fireEvent.click(selectAllCheckbox);
      expect(handleSelectionChange).toHaveBeenCalledWith(["1", "2", "3"], mockData);
    });
  });

  describe("Expandable Rows", () => {
    it("renders expander toggle button and displays expanded row content on toggle", async () => {
      const user = userEvent.setup();

      render(
        <DataTable
          data={mockData}
          columns={mockColumns}
          renderExpandedRow={(row) => (
            <div data-testid={`expanded-${row.id}`}>Expanded info for {row.name}</div>
          )}
        />,
      );

      expect(screen.queryByTestId("expanded-1")).not.toBeInTheDocument();

      const expandButtons = screen.getAllByRole("button", { name: "Expand row" });
      await user.click(expandButtons[0]);

      expect(screen.getByTestId("expanded-1")).toBeInTheDocument();
      expect(screen.getByText("Expanded info for Alice Johnson")).toBeInTheDocument();
    });
  });

  describe("States: Loading, Error, and Empty", () => {
    it("renders skeleton loader when isLoading is true", () => {
      render(<DataTable data={mockData} columns={mockColumns} isLoading />);

      expect(screen.getByTestId("data-table-skeleton")).toBeInTheDocument();
      expect(screen.queryByText("Alice Johnson")).not.toBeInTheDocument();
    });

    it("renders custom empty state when data is empty", () => {
      render(
        <DataTable
          data={[]}
          columns={mockColumns}
          emptyTitle="Custom Empty Title"
          emptyDescription="Custom Empty Description"
        />,
      );

      expect(screen.getByTestId("data-table-empty")).toBeInTheDocument();
      expect(screen.getByText("Custom Empty Title")).toBeInTheDocument();
      expect(screen.getByText("Custom Empty Description")).toBeInTheDocument();
    });

    it("renders error state when error prop is provided", () => {
      render(<DataTable data={mockData} columns={mockColumns} error="Failed to load items" />);

      expect(screen.getByTestId("data-table-error")).toBeInTheDocument();
      expect(screen.getByText("Failed to load items")).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("renders pagination controls when pagination prop is provided", () => {
      const handlePageChange = jest.fn();
      render(
        <DataTable
          data={mockData}
          columns={mockColumns}
          pagination={{
            currentPage: 1,
            totalPages: 5,
            totalItems: 50,
            pageSize: 10,
            onPageChange: handlePageChange,
          }}
        />,
      );

      expect(screen.getByTestId("data-table-pagination")).toBeInTheDocument();
      expect(screen.getByText(/Showing 1 to 10 of 50 entries/i)).toBeInTheDocument();

      const nextBtn = screen.getByRole("button", { name: /next page/i });
      fireEvent.click(nextBtn);
      expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    it("renders page size options dropdown and triggers callback on change", () => {
      const handleSizeChange = jest.fn();
      render(
        <DataTable
          data={mockData}
          columns={mockColumns}
          pagination={{
            currentPage: 1,
            totalPages: 5,
            pageSize: 10,
            pageSizeOptions: [10, 20, 50],
            onPageChange: jest.fn(),
            onPageSizeChange: handleSizeChange,
          }}
        />,
      );

      const sizeSelect = screen.getByRole("combobox", {
        name: "Select number of rows per page",
      });
      fireEvent.change(sizeSelect, { target: { value: "20" } });
      expect(handleSizeChange).toHaveBeenCalledWith(20);
    });
  });
});
