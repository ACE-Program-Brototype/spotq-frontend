import { ArrowLeft, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

function AdminForgotPasswordPage() {
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
            Secure administrative key recovery.
          </h1>
          <blockquote className="border-l-2 border-background/30 pl-5">
            <p className="text-base leading-relaxed text-background/60">
              Protecting access to critical infrastructure and platform operations with
              enterprise-grade verification and safety protocols.
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

      {/* ── Right panel: coming soon content ── */}
      <section
        className="flex flex-col items-center justify-center px-6 py-16 sm:px-12 lg:px-16"
        aria-label="Key recovery coming soon"
      >
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-2 lg:hidden">
          <div className="flex size-8 items-center justify-center rounded-lg bg-foreground">
            <span className="text-sm font-bold text-background">S</span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-foreground/70">spotQ</span>
        </div>

        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-border bg-muted/60">
            <KeyRound className="size-7 text-foreground" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Key Recovery</h2>
              <Badge variant="secondary" className="text-xs">
                Coming Soon
              </Badge>
            </div>
            <p className="text-sm text-balance text-muted-foreground">
              Self-service administrative key reset is currently in development. If you are locked
              out of your console, please contact your systems administrator or root engineering
              team.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/admin/login"
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminForgotPasswordPage;
