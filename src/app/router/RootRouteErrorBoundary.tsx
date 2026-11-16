import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function RootRouteErrorBoundary() {
  const error = useRouteError();

  let errorMessage = "An unexpected application error occurred. Please try reloading.";
  let errorTitle = "Something Went Wrong";

  if (isRouteErrorResponse(error)) {
    errorTitle = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <main
      role="alert"
      className="flex min-h-dvh flex-col items-center justify-center bg-[#faf7f5] px-4 py-12 text-center select-none"
    >
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 shadow-2xs">
        <AlertTriangle className="size-8" />
      </div>

      <h1 className="mt-5 text-2xl font-bold text-neutral-900 sm:text-3xl">
        {errorTitle}
      </h1>

      <p className="mt-2 max-w-md text-sm text-neutral-600 leading-relaxed">
        {errorMessage}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          onClick={handleReload}
          className="rounded-xl bg-[#e8631b] hover:bg-[#d55716] text-white text-xs font-semibold px-4 py-2 gap-2 shadow-2xs"
        >
          <RefreshCw className="size-3.5" />
          <span>Reload Application</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoHome}
          className="rounded-xl border-[#eddcd4] bg-white text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] px-4 py-2 gap-2"
        >
          <Home className="size-3.5" />
          <span>Return to Home</span>
        </Button>
      </div>
    </main>
  );
}

export default RootRouteErrorBoundary;
