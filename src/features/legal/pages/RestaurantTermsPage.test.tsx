import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import RestaurantTermsPage from "./RestaurantTermsPage";

describe("RestaurantTermsPage", () => {
  it("renders restaurant partner terms and conditions heading and sections", () => {
    render(
      <MemoryRouter>
        <RestaurantTermsPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /restaurant partner terms & conditions/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/SpotQ's Restaurant Partner Program/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /1\. restaurant partner registration/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /2\. queue & waitlist management obligations/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /7\. contact & support/i })).toBeInTheDocument();
  });
});
