import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import StaffAuthLayout from "./StaffAuthLayout";

describe("StaffAuthLayout", () => {
  it("renders SpotQ header branding and outlet content", () => {
    render(
      <MemoryRouter initialEntries={["/staff/forgot-password"]}>
        <Routes>
          <Route element={<StaffAuthLayout />}>
            <Route path="/staff/forgot-password" element={<div>Staff Forgot Password Form</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("SpotQ")).toBeInTheDocument();
    expect(screen.getByText("Staff Forgot Password Form")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /spotq/i })).toHaveAttribute("href", "/staff/login");
  });
});
