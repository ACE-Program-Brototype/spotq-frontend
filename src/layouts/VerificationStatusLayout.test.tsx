import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import VerificationStatusLayout from "./VerificationStatusLayout";

describe("VerificationStatusLayout", () => {
  it("renders branding header and outlet child content", () => {
    render(
      <MemoryRouter initialEntries={["/status"]}>
        <Routes>
          <Route element={<VerificationStatusLayout />}>
            <Route path="/status" element={<div>Child Status Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("SpotQ")).toBeInTheDocument();
    expect(screen.getByText("for restaurants")).toBeInTheDocument();
    expect(screen.getByText("Child Status Content")).toBeInTheDocument();
  });
});
