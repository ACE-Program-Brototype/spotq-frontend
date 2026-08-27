import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import spotqLogo from "@/assets/logos/spotq-logo.png";
import { AuthHeroPanel, VerifyOtpForm } from "../components";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email || "";

  return (
    <div className="flex min-h-screen w-full select-none bg-background text-foreground antialiased font-sans">
      {/* LEFT PANEL: Branding & Hero */}
      <AuthHeroPanel
        title="Secure your spot."
        description="Connecting your culinary passion with seamless digital protection."
        iconType="shield-lock"
      />

      {/* RIGHT PANEL: Form Area */}
      <div className="w-full md:w-1/2 flex flex-col justify-between bg-white relative">
        {/* Mobile top bar navigation header */}
        <header className="flex items-center px-4 h-14 border-b border-gray-100 md:hidden select-none">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors mr-3 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="size-6 text-foreground/80" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">Verify OTP</h2>
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
              Enter Verification Code
            </h2>
            <p className="text-sm text-gray-500">
              Please enter the 6-digit code sent to your email{" "}
              {email ? <span className="font-semibold text-gray-700">{email}</span> : "your email"}
            </p>
          </div>

          {/* Form */}
          <VerifyOtpForm initialEmail={email} />
        </div>

        {/* Mobile footer spacing */}
        <div className="h-6 md:hidden" />
      </div>
    </div>
  );
}
