// src/features/auth/pages/StaffLoginPage.tsx

import { useNavigate } from "react-router-dom";

import spotqLogo from "@/assets/logos/spotq-logo.png";
import StaffLoginForm from "../components/StaffLoginForm";


export default function StaffLoginPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-svh bg-[#fcf8f5] text-[#171717]">
      {/* Header */}
      <header className="h-14 border-b border-[#eadfd8] bg-white">
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#b84b00]/30 cursor-pointer"
            aria-label="Go to SpotQ home"
          >
            <img
              src={spotqLogo}
              alt="SpotQ"
              className="h-16 w-auto object-contain"
            />
          </button>
        </div>
      </header>

      {/* Login area */}
      <section className="flex min-h-[calc(100svh-3.5rem)] items-start justify-center px-4 py-12 sm:px-6 sm:py-16 md:items-center">
        <div className="w-full max-w-[430px]">
          <div className="rounded-xl border border-[#eadfd8] bg-white p-6 shadow-[0_8px_30px_rgba(45,30,20,0.04)] sm:p-8">
            <div className="mb-7">
              <h1 className="text-xl font-semibold tracking-[-0.02em] text-[#1c1714] sm:text-2xl">
                Staff Login
              </h1>

              <p className="mt-1.5 text-xs leading-5 text-[#756c66] sm:text-sm">
                Enter your email and password to access your staff account.
              </p>
            </div>

            <StaffLoginForm />
          </div>

          <p className="mt-5 text-center text-[11px] leading-5 text-[#918780]">
            Authorized SpotQ staff only
          </p>
        </div>
      </section>
    </main>
  );
}