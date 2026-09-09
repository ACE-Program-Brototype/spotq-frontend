import { Outlet } from "react-router-dom";


/**
 * OnboardLayout
 *
 * Shell for the restaurant onboarding flow. Purely structural:
 * - A minimal top navbar with only the SpotQ brand mark (no app-level
 *   navigation, menus, or profile controls).
 * - A two-column body: onboarding sidebar (step list) + main content
 *   area where the active onboarding step renders via <Outlet />.
 *
 * All step content, form fields, validation, API calls, and state
 * management live in the routed child pages / OnboardSidebar, not here.
 */
export default function OnboardLayout() {
  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Top navbar — branding only */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="flex h-16 items-center px-6 sm:px-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span className="text-lg">
              <span className="font-bold text-neutral-900">SpotQ</span>{" "}
              <span className="text-neutral-500">for restaurants</span>
            </span>
          </div>
        </div>
      </header>

      {/* Onboarding body: sidebar + main content */}
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 sm:px-10 lg:flex-row">
        {/* <OnboardSidebar /> */}

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}