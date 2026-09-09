import { useLocation, useNavigate } from "react-router-dom";

interface OnboardStep {
  path: string;
  label: string;
}

const ONBOARD_BASE_PATH = "/restaurant/onboarding";

const STEPS: OnboardStep[] = [
  { path: "business-information", label: "Business Information" },
  { path: "documents", label: "Business Documents" },
  { path: "location", label: "Location" },
  { path: "review", label: "Review & Submit" },
];

type StepState = "completed" | "active" | "upcoming";

function getActiveStepIndex(pathname: string): number {
  const index = STEPS.findIndex((step) =>
    pathname.includes(`${ONBOARD_BASE_PATH}/${step.path}`)
  );
  return index === -1 ? 0 : index;
}

function getStepState(stepIndex: number, activeIndex: number): StepState {
  if (stepIndex < activeIndex) return "completed";
  if (stepIndex === activeIndex) return "active";
  return "upcoming";
}

export default function OnboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeIndex = getActiveStepIndex(location.pathname);

  const handleStepClick = (stepIndex: number, state: StepState) => {
    if (state !== "completed") return;
    navigate(`${ONBOARD_BASE_PATH}/${STEPS[stepIndex].path}`);
  };

  return (
    <aside className="w-full lg:w-[280px] lg:shrink-0">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-10 flex items-center gap-1 text-neutral-700 hover:text-neutral-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
        <span className="font-semibold underline underline-offset-2">
          Back
        </span>
      </button>

      <ol>
        {STEPS.map((step, index) => {
          const state = getStepState(index, activeIndex);
          const isLast = index === STEPS.length - 1;
          const clickable = state === "completed";

          return (
            <li key={step.path} className="flex gap-4">
              {/* Indicator + connecting line */}
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    state === "upcoming" ? "bg-neutral-200" : "bg-emerald-100"
                  }`}
                >
                  {state === "completed" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="h-4 w-4 text-emerald-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  ) : (
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        state === "active" ? "bg-emerald-500" : "bg-neutral-400"
                      }`}
                    />
                  )}
                </span>
                {!isLast && (
                  <span
                    aria-hidden
                    className="my-1 w-px flex-1 border-l-2 border-dotted border-neutral-300"
                  />
                )}
              </div>

              {/* Step text */}
              <div className={isLast ? "pb-0" : "pb-8"}>
                <p className="pt-1.5 text-xs font-semibold tracking-widest text-neutral-400">
                  STEP {index + 1}
                </p>
                {clickable ? (
                  <button
                    type="button"
                    onClick={() => handleStepClick(index, state)}
                    className="mt-1 text-left text-lg font-semibold text-neutral-700 hover:text-neutral-900 hover:underline"
                  >
                    {step.label}
                  </button>
                ) : (
                  <p
                    className={`mt-1 text-lg ${
                      state === "active"
                        ? "font-bold text-neutral-900"
                        : "font-semibold text-neutral-400"
                    }`}
                  >
                    {step.label}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}