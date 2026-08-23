import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import ForgotPasswordPage from "./ForgotPasswordPage";

describe("Customer ForgotPasswordPage", () => {
  it("renders reset password card and back to login button", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <Routes>
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/login" element={<div>Login Page Mock</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByText(/password reset flow is coming soon!/i)).toBeInTheDocument();

    const backBtn = screen.getByRole("button", { name: /back to login/i });
    expect(backBtn).toBeInTheDocument();

    await user.click(backBtn);
    expect(screen.getByText("Login Page Mock")).toBeInTheDocument();
  });
});
