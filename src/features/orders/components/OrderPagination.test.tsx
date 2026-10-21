import { fireEvent, render, screen } from "@testing-library/react";
import { OrderPagination } from "./OrderPagination";

describe("OrderPagination", () => {
  it("does not render when totalPages is 1 and totalOrders is <= 10", () => {
    const { container } = render(
      <OrderPagination
        pagination={{ current_page: 1, total_pages: 1, total_orders: 5, has_next: false }}
        onPageChange={jest.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders page info and navigation buttons when total_pages > 1", () => {
    render(
      <OrderPagination
        pagination={{ current_page: 2, total_pages: 4, total_orders: 40, has_next: true }}
        onPageChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 4" })).toBeInTheDocument();
    expect(screen.getByText(/40 entries/i)).toBeInTheDocument();
  });

  it("calls onPageChange on clicking next, previous, and specific page buttons", () => {
    const handlePageChange = jest.fn();
    render(
      <OrderPagination
        pagination={{ current_page: 2, total_pages: 5, total_orders: 50, has_next: true }}
        onPageChange={handlePageChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /previous page/i }));
    expect(handlePageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole("button", { name: /next page/i }));
    expect(handlePageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole("button", { name: "Page 4" }));
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it("disables previous button on first page and next button on last page", () => {
    const { rerender } = render(
      <OrderPagination
        pagination={{ current_page: 1, total_pages: 3, total_orders: 30, has_next: true }}
        onPageChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /previous page/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next page/i })).not.toBeDisabled();

    rerender(
      <OrderPagination
        pagination={{ current_page: 3, total_pages: 3, total_orders: 30, has_next: false }}
        onPageChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /previous page/i })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /next page/i })).toBeDisabled();
  });
});
