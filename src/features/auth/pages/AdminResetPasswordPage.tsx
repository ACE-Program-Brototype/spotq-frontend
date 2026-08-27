import AdminResetPasswordForm from "@/features/auth/components/AdminResetPasswordForm";

function AdminResetPasswordPage() {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      {/* ── Left panel: branding ── */}
      <section
        className="relative hidden flex-col justify-between overflow-hidden bg-foreground px-12 py-16 lg:flex"
        aria-label="spotQ platform branding"
      >
        {/* Subtle grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,currentColor 39px,currentColor 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,currentColor 39px,currentColor 40px)",
          }}
          aria-hidden="true"
        />

        {/* Logo / brand mark */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-background/10 backdrop-blur-sm">
            <span className="text-sm font-bold text-background">S</span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-background/70">spotQ</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-background xl:text-5xl">
            Set your new administrative key.
          </h1>
          <blockquote className="border-l-2 border-background/30 pl-5">
            <p className="text-base leading-relaxed text-background/60">
              Establish a strong, robust key with uppercase letters, numbers, and symbols to ensure
              impenetrable platform and console security.
            </p>
          </blockquote>
        </div>

        {/* Footer note */}
        <div className="relative z-10">
          <p className="text-xs text-background/30">
            © {new Date().getFullYear()} spotQ. All rights reserved.
          </p>
        </div>
      </section>

      {/* ── Right panel: form ── */}
      <section
        className="flex flex-col items-center justify-center px-6 py-16 sm:px-12 lg:px-16"
        aria-label="Reset key form"
      >
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-2 lg:hidden">
          <div className="flex size-8 items-center justify-center rounded-lg bg-foreground">
            <span className="text-sm font-bold text-background">S</span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-foreground/70">spotQ</span>
        </div>

        <div className="w-full max-w-sm space-y-10">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">New key</h2>
            <p className="text-sm text-muted-foreground">
              Define your new administrative key to complete recovery.
            </p>
          </div>

          {/* Form */}
          <AdminResetPasswordForm />
        </div>
      </section>
    </main>
  );
}

export default AdminResetPasswordPage;
