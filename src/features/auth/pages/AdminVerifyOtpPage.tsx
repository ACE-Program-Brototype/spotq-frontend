import { Navigate, useLocation } from "react-router-dom";
import AdminVerifyOtpForm from "@/features/auth/components/AdminVerifyOtpForm";

function AdminVerifyOtpPage() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  if (!email) {
    return <Navigate to="/admin/forgot-password" replace />;
  }
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <section
        className="relative hidden flex-col justify-between overflow-hidden bg-foreground px-12 py-16 lg:flex"
        aria-label="spotQ platform branding"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,currentColor 39px,currentColor 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,currentColor 39px,currentColor 40px)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-background/10 backdrop-blur-sm">
            <span className="text-sm font-bold text-background">S</span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-background/70">spotQ</span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-background xl:text-5xl">
            Security first.
          </h1>
          <blockquote className="border-l-2 border-background/30 pl-5">
            <p className="text-base leading-relaxed text-background/60">
              A unique 6-digit verification code has been dispatched to your identity. Enter it
              below to authenticate your recovery request and maintain console safety.
            </p>
          </blockquote>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-background/30">
            © {new Date().getFullYear()} spotQ. All rights reserved.
          </p>
        </div>
      </section>

      <section
        className="flex flex-col items-center justify-center px-6 py-16 sm:px-12 lg:px-16"
        aria-label="Verify identity form"
      >
        <div className="mb-10 flex items-center gap-2 lg:hidden">
          <div className="flex size-8 items-center justify-center rounded-lg bg-foreground">
            <span className="text-sm font-bold text-background">S</span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-foreground/70">spotQ</span>
        </div>

        <div className="w-full max-w-sm space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Verify identity
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to your identity to continue.
            </p>
          </div>

          <AdminVerifyOtpForm />
        </div>
      </section>
    </main>
  );
}

export default AdminVerifyOtpPage;
