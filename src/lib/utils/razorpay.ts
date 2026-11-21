/**
 * Universal Razorpay Script Loader Utility
 * Dynamically injects checkout.js script and resolves when ready.
 * Shared across customer payments and restaurant subscriptions.
 */

export const RAZORPAY_CHECKOUT_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let razorpayScriptPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(src: string = RAZORPAY_CHECKOUT_SCRIPT_URL): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if ((window as { Razorpay?: unknown }).Razorpay) {
    return Promise.resolve(true);
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
  if (existingScript?.dataset.loaded === "true" && (window as { Razorpay?: unknown }).Razorpay) {
    return Promise.resolve(true);
  }

  razorpayScriptPromise = new Promise<boolean>((resolve) => {
    const script = existingScript || document.createElement("script");
    script.src = src;
    script.async = true;

    const cleanup = () => {
      script.onload = null;
      script.onerror = null;
    };

    script.onload = () => {
      cleanup();
      script.dataset.loaded = "true";
      resolve(true);
    };

    script.onerror = () => {
      cleanup();
      script.remove();
      razorpayScriptPromise = null;
      resolve(false);
    };

    if (!existingScript) {
      document.body.appendChild(script);
    }
  });

  return razorpayScriptPromise;
}

export function resetRazorpayScriptPromise(): void {
  razorpayScriptPromise = null;
}
