import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Mail } from "lucide-react";
import { FormError, FormField, FormInput, PasswordField, SubmitButton } from "./index";

describe("Form Primitives", () => {
  describe("FormError", () => {
    it("renders nothing when message is empty or null", () => {
      const { container } = render(<FormError message="" />);
      expect(container.firstChild).toBeNull();
    });

    it("renders error message with role='alert'", () => {
      render(<FormError id="test-error" message="Invalid email address" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Invalid email address");
      expect(alert).toHaveAttribute("id", "test-error");
    });
  });

  describe("FormField", () => {
    it("renders label, required indicator, and children", () => {
      render(
        <FormField id="email" label="Email Address" required>
          <input id="email" type="email" />
        </FormField>,
      );
      expect(screen.getByText("Email Address")).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders labelAction when provided", () => {
      render(
        <FormField id="password" label="Password" labelAction={<a href="/forgot">Forgot?</a>}>
          <input id="password" type="password" />
        </FormField>,
      );
      expect(screen.getByText("Forgot?")).toBeInTheDocument();
    });

    it("renders hint when there is no error", () => {
      render(
        <FormField id="username" label="Username" hint="Must be at least 3 chars">
          <input id="username" />
        </FormField>,
      );
      expect(screen.getByText("Must be at least 3 chars")).toBeInTheDocument();
    });

    it("renders error instead of hint when error is present", () => {
      render(
        <FormField
          id="username"
          label="Username"
          hint="Must be at least 3 chars"
          error="Username is taken"
        >
          <input id="username" />
        </FormField>,
      );
      expect(screen.queryByText("Must be at least 3 chars")).toBeNull();
      expect(screen.getByRole("alert")).toHaveTextContent("Username is taken");
    });
  });

  describe("FormInput", () => {
    it("renders standard input", () => {
      render(<FormInput placeholder="Enter name" />);
      expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
    });

    it("renders with leadingIcon", () => {
      render(<FormInput placeholder="Email" leadingIcon={<Mail data-testid="mail-icon" />} />);
      expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toHaveClass("pl-9");
    });

    it("sets aria-invalid and error border when error is true", () => {
      render(<FormInput placeholder="Email" error="Invalid email" id="email" />);
      const input = screen.getByPlaceholderText("Email");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-describedby", "email-error");
    });
  });

  describe("PasswordField", () => {
    it("defaults to password type and toggles to text on eye click", () => {
      render(<PasswordField placeholder="Password" id="password" />);
      const input = screen.getByPlaceholderText("Password");
      expect(input).toHaveAttribute("type", "password");

      const toggleButton = screen.getByRole("button", { name: "Show password" });
      fireEvent.click(toggleButton);

      expect(input).toHaveAttribute("type", "text");
      expect(screen.getByRole("button", { name: "Hide password" })).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
      expect(input).toHaveAttribute("type", "password");
    });
  });

  describe("SubmitButton", () => {
    it("renders standard button when not loading", () => {
      render(<SubmitButton>Submit</SubmitButton>);
      const button = screen.getByRole("button", { name: "Submit" });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
      expect(button).toHaveAttribute("type", "submit");
    });

    it("renders spinner and disables button when isLoading is true", () => {
      render(
        <SubmitButton isLoading loadingText="Submitting...">
          Submit
        </SubmitButton>,
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(screen.getByText("Submitting...")).toBeInTheDocument();
    });
  });
});
