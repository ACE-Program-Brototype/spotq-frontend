import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import spotqLogo from "@/assets/logos/spotq-logo.png";
import { AuthHeroPanel, ForgotPasswordForm } from "../components";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full select-none bg-background text-foreground antialiased font-sans">
      <AuthHeroPanel
        title="Secure your spotQ"
        description="We take your security seriously. Follow the steps to safely recover your account and protect your culinary journey."
        iconType="shield-lock"
      />

      <div className="w-full md:w-1/2 flex flex-col justify-between bg-white relative">
        <header className="flex items-center px-4 h-14 border-b border-gray-100 md:hidden select-none">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors mr-3 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="size-6 text-foreground/80" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">Forgot Password</h2>
        </header>

        <div className="w-full max-w-md mx-auto px-6 py-12 md:py-16 my-auto flex flex-col justify-center gap-8">
          <div className="flex justify-center md:hidden">
            <img src={spotqLogo} alt="SpotQ Logo" className="h-12 w-auto object-contain" />
          </div>

          <div className="text-center md:text-left space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-500">
              Enter your email address and we'll send you a code to reset your password.
            </p>
          </div>

          <ForgotPasswordForm />
        </div>

        <div className="h-6 md:hidden" />
      </div>
    </div>
  );
}
