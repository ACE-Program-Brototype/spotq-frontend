import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import spotqLogo from "@/assets/logos/spotq-logo.png";
import { AuthDivider, GoogleLoginButton } from "../components";
import { RegisterForm } from "../components/RegisterForm";
import { RegisterHeroPanel } from "../components/RegisterHeroPanle";
import { useGoogleAuth } from "../hooks/use-google.auth";
import { useRegister } from "../hooks/use-register";
import type { RegisterFormValues } from "../schemas/register.schema";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleRegister, isLoading: isRegistering } = useRegister();

  const destination = (location?.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const { handleGoogleSuccess, isLoading: isGoogleAuth } = useGoogleAuth(destination);

  const isLoading = isRegistering || isGoogleAuth;

  const onSubmit = async (values: RegisterFormValues) => {
    if (isLoading) return;
    values.phoneNumber = `+91 ${values.phoneNumber}`;
    console.log("---Register data----", values);
    await handleRegister(values);
  };

  return (
    <div className="flex min-h-screen w-full select-none bg-background text-foreground antialiased font-sans">
      {/* LEFT PANEL: Branding & Hero */}
      <RegisterHeroPanel />

      {/* RIGHT PANEL: Form Area */}
      <div className="w-full md:w-1/2 flex flex-col justify-between bg-white relative">
        {/* Mobile top bar navigation header */}
        <header className="flex items-center px-4 h-14 border-b border-gray-100 md:hidden select-none">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors mr-3"
            aria-label="Go back"
          >
            <ArrowLeft className="size-6 text-foreground/80" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">Register</h2>
        </header>

        {/* Content body container */}
        <div className="w-full max-w-md mx-auto px-6 py-12 md:py-16 my-auto flex flex-col justify-center gap-8">
          {/* Mobile brand logo block */}
          <div className="flex justify-center md:hidden">
            <img src={spotqLogo} alt="SpotQ Logo" className="h-12 w-auto object-contain" />
          </div>

          {/* Main titles */}
          <div className="text-center md:text-left space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Register to spotQ
            </h2>
            <p className="text-sm text-gray-500">
              <span className="hidden md:inline">
                Access your bookings and avoid waiting times.
              </span>
              <span className="inline md:hidden">
                Access your bookings and avoid waiting times.
              </span>
            </p>
          </div>

          {/* Form */}
          <RegisterForm onSubmit={onSubmit} isLoading={isLoading} />

          {/* Social login separator */}
          <AuthDivider />

          {/* Google Sign In Button */}
          <GoogleLoginButton onSuccess={handleGoogleSuccess} disabled={isLoading} />

          {/* Footer link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/Login")}
              className="font-bold text-spotq-orange hover:text-spotq-orange/80 transition-colors cursor-pointer"
            >
              <span className="hidden md:inline">Login</span>
              <span className="inline md:hidden">Login</span>
            </button>
          </p>
        </div>

        {/* Mobile footer spacing */}
        <div className="h-6 md:hidden" />
      </div>
    </div>
  );
}
