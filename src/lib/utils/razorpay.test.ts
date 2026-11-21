import { loadRazorpayScript, resetRazorpayScriptPromise } from "./razorpay";

describe("loadRazorpayScript utility", () => {
  beforeEach(() => {
    resetRazorpayScriptPromise();
    document.querySelectorAll("script").forEach((el) => {
      el.remove();
    });
    delete (window as { Razorpay?: unknown }).Razorpay;
  });

  afterEach(() => {
    resetRazorpayScriptPromise();
  });

  it("resolves true immediately if window.Razorpay already exists", async () => {
    (window as unknown as { Razorpay: unknown }).Razorpay = jest.fn();
    const result = await loadRazorpayScript();
    expect(result).toBe(true);
  });

  it("appends script tag and resolves true on load event", async () => {
    const promise = loadRazorpayScript();

    const script = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    expect(script).not.toBeNull();

    (window as unknown as { Razorpay: unknown }).Razorpay = jest.fn();
    script?.dispatchEvent(new Event("load"));

    const result = await promise;
    expect(result).toBe(true);
  });

  it("removes script tag and resolves false on error event", async () => {
    const promise = loadRazorpayScript();

    const script = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    expect(script).not.toBeNull();

    script?.dispatchEvent(new Event("error"));

    const result = await promise;
    expect(result).toBe(false);
  });
});
