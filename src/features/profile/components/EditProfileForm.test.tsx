import { render, screen } from "@testing-library/react";
import { Gender } from "../constants/profile.constants";
import type { CustomerProfile } from "../types/profile.types";
import { EditProfileForm } from "./EditProfileForm";

describe("EditProfileForm Component", () => {
  const mockProfile: CustomerProfile = {
    id: "usr-123",
    full_name: "Ajex Joshy",
    email: "ajex@example.com",
    phone: "+919876543210",
    status: "ACTIVE",
    gender: Gender.MALE,
    dob: "1995-04-12T00:00:00.000Z",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };

  it("extracts DOB without timezone day-shift", () => {
    render(<EditProfileForm profile={mockProfile} onSubmit={jest.fn()} onCancel={jest.fn()} />);

    const dobInput = screen.getByDisplayValue("1995-04-12") as HTMLInputElement;
    expect(dobInput).toBeInTheDocument();
    expect(dobInput.value).toBe("1995-04-12");
  });

  it("handles string format YYYY-MM-DD cleanly", () => {
    render(
      <EditProfileForm
        profile={{ ...mockProfile, dob: "2000-11-25" }}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    const dobInput = screen.getByDisplayValue("2000-11-25") as HTMLInputElement;
    expect(dobInput).toBeInTheDocument();
    expect(dobInput.value).toBe("2000-11-25");
  });
});
