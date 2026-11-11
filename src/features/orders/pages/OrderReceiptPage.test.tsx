import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import OrderReceiptPage from "./OrderReceiptPage";

describe("OrderReceiptPage", () => {
  it("redirects to customer order details page", () => {
    render(
      <MemoryRouter initialEntries={["/orders/ord-123/receipt"]}>
        <Routes>
          <Route path="/orders/:orderId/receipt" element={<OrderReceiptPage />} />
          <Route path="/orders/:orderId" element={<div>Order Details Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Order Details Page")).toBeInTheDocument();
  });
});
