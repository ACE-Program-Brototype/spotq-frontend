import { useLocation, useNavigate } from "react-router-dom";

interface LocationState {
  email?: string;
  verificationToken?: string;
}

export default function RestaurantOnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;
  const email = state.email ?? "your restaurant email";
  const verificationToken = state.verificationToken ?? "verification-token";

  return (
    <div className="min-h-screen bg-neutral-100 px-6 py-12 text-neutral-900">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-lg sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          Restaurant onboarding
        </p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Complete your restaurant setup</h1>
        <p className="mt-4 text-neutral-600">
          We have verified the email address for{" "}
          <span className="font-semibold text-neutral-900">{email}</span>. Finish the onboarding
          flow to activate your account.
        </p>

        <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm text-neutral-500">Verification token</p>
          <p className="mt-2 break-all font-mono text-sm text-neutral-800">{verificationToken}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => navigate("/restaurant/email/verification", { replace: false })}
            className="rounded-lg border border-neutral-300 px-5 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-100"
          >
            Change email
          </button>
        </div>
      </div>
    </div>
  );
}
