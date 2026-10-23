import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CheckoutFailurePage } from "./CheckoutFailurePage";

describe("CheckoutFailurePage", () => {
  it("renders failure message and retry button linking to cart", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/checkout/failure",
            state: {
              errorMessage: "Payment declined by bank",
              cartId: "test-cart-456",
            },
          },
        ]}
      >
        <CheckoutFailurePage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Checkout Was Not Completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Payment declined by bank/i)).toBeInTheDocument();

    const retryLink = screen.getByRole("link", { name: /Retry Checkout/i });
    expect(retryLink).toHaveAttribute("href", "/checkout?cartId=test-cart-456");
  });
});
