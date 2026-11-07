import { render, screen } from "@testing-library/react";
import { CardSkeleton } from "./CardSkeleton";
import { DetailSkeleton } from "./DetailSkeleton";
import { FormSkeleton } from "./FormSkeleton";
import { ListSkeleton } from "./ListSkeleton";
import { PageSkeleton } from "./PageSkeleton";
import { TableSkeleton } from "./TableSkeleton";

describe("Skeleton Primitives", () => {
  describe("CardSkeleton", () => {
    it("renders card skeleton with default props", () => {
      render(<CardSkeleton />);
      const card = document.querySelector('[data-slot="card-skeleton"]');
      expect(card).toBeInTheDocument();
    });

    it("renders without image or footer when configured", () => {
      render(<CardSkeleton hasImage={false} hasFooter={false} lines={2} />);
      const card = document.querySelector('[data-slot="card-skeleton"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe("TableSkeleton", () => {
    it("renders table skeleton with default columns and rows", () => {
      render(<TableSkeleton columns={3} rowCount={4} />);
      const table = document.querySelector('[data-slot="table-skeleton"]');
      expect(table).toBeInTheDocument();
      expect(screen.getAllByRole("row")).toHaveLength(5); // 1 header + 4 body rows
    });

    it("renders custom column headers and avatar layout", () => {
      render(
        <TableSkeleton columns={["Name", "Email", "Status", "Actions"]} rowCount={2} hasAvatar />,
      );
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
    });
  });

  describe("FormSkeleton", () => {
    it("renders configured number of form fields", () => {
      render(<FormSkeleton fieldCount={3} columns={2} />);
      const form = document.querySelector('[data-slot="form-skeleton"]');
      expect(form).toBeInTheDocument();
    });

    it("renders without submit button", () => {
      render(<FormSkeleton fieldCount={2} hasSubmitButton={false} />);
      const form = document.querySelector('[data-slot="form-skeleton"]');
      expect(form).toBeInTheDocument();
    });
  });

  describe("ListSkeleton", () => {
    it("renders list skeleton with items", () => {
      render(<ListSkeleton count={4} hasAvatar avatarShape="square" />);
      const list = document.querySelector('[data-slot="list-skeleton"]');
      expect(list).toBeInTheDocument();
    });
  });

  describe("DetailSkeleton", () => {
    it("renders detail skeleton with cover and sections", () => {
      render(<DetailSkeleton hasCoverImage hasAvatar gridSections={3} />);
      const detail = document.querySelector('[data-slot="detail-skeleton"]');
      expect(detail).toBeInTheDocument();
    });
  });

  describe("PageSkeleton", () => {
    it("renders page skeleton with different layouts", () => {
      const { rerender } = render(<PageSkeleton layout="cards" />);
      expect(document.querySelector('[data-slot="page-skeleton"]')).toBeInTheDocument();

      rerender(<PageSkeleton layout="table" />);
      expect(document.querySelector('[data-slot="page-skeleton"]')).toBeInTheDocument();

      rerender(<PageSkeleton layout="form" />);
      expect(document.querySelector('[data-slot="page-skeleton"]')).toBeInTheDocument();

      rerender(<PageSkeleton layout="detail" />);
      expect(document.querySelector('[data-slot="page-skeleton"]')).toBeInTheDocument();
    });
  });
});
