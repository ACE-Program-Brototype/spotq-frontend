import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import CookiePolicyPage from "./CookiePolicyPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
import RestaurantPrivacyPage from "./RestaurantPrivacyPage";
import TermsAndConditionsPage from "./TermsAndConditionsPage";

describe("Legal Pages", () => {
  it("renders RestaurantPrivacyPage with headings and content", () => {
    render(
      <MemoryRouter>
        <RestaurantPrivacyPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /restaurant partner privacy policy/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /1\. information we collect from restaurant partners/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /2\. processing dining & customer waitlist data/i }),
    ).toBeInTheDocument();
  });

  it("renders CookiePolicyPage with headings and content", () => {
    render(
      <MemoryRouter>
        <CookiePolicyPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /cookie & tracking policy/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /1\. what are cookies and local storage\?/i }),
    ).toBeInTheDocument();
  });

  it("renders TermsAndConditionsPage with headings and content", () => {
    render(
      <MemoryRouter>
        <TermsAndConditionsPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /^terms & conditions$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /1\. about spotq/i })).toBeInTheDocument();
  });

  it("renders PrivacyPolicyPage with headings and content", () => {
    render(
      <MemoryRouter>
        <PrivacyPolicyPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /^privacy policy$/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /1\. information we collect/i }),
    ).toBeInTheDocument();
  });
});
