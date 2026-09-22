import { render, screen } from "@testing-library/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

describe("Atomic Table Components", () => {
  it("renders a semantic HTML table with all sub-components", () => {
    render(
      <Table aria-label="Sample Table">
        <TableCaption>Sample Caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Header 1</TableHead>
            <TableHead>Header 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
            <TableCell>Cell 2</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Footer Content</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    expect(screen.getByRole("table", { name: "Sample Table" })).toBeInTheDocument();
    expect(screen.getByText("Sample Caption")).toBeInTheDocument();
    expect(screen.getByText("Header 1")).toBeInTheDocument();
    expect(screen.getByText("Header 2")).toBeInTheDocument();
    expect(screen.getByText("Cell 1")).toBeInTheDocument();
    expect(screen.getByText("Cell 2")).toBeInTheDocument();
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });
});
