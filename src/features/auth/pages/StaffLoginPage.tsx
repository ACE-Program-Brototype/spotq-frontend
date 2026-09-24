import { ArrowLeft, Building2, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import spotqLogo from "@/assets/logos/spotq-logo.png";
import { Button } from "@/components/ui/button";
import StaffLoginForm from "../components/StaffLoginForm";
import { useStaffLogin } from "../hooks/useStaffLogin";

export default function StaffLoginPage() {
  const navigate = useNavigate();

  const {
    handleStaffLogin,
    handleSelectRestaurant,
    handleBackToLogin,
    selectionData,
    isLoading,
    isSelecting,
  } = useStaffLogin();

  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");

  return (
    <main className="min-h-svh bg-[#fcf8f5] text-[#171717]">
      <header className="h-14 border-b border-[#eadfd8] bg-white">
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#b84b00]/30 cursor-pointer"
            aria-label="Go to SpotQ home"
          >
            <img src={spotqLogo} alt="SpotQ" className="h-16 w-auto object-contain" />
          </button>
        </div>
      </header>

      <section className="flex min-h-[calc(100svh-3.5rem)] items-start justify-center px-4 py-12 sm:px-6 sm:py-16 md:items-center">
        <div className="w-full max-w-[460px]">
          <div className="rounded-xl border border-[#eadfd8] bg-white p-6 shadow-[0_8px_30px_rgba(45,30,20,0.04)] sm:p-8">
            {selectionData ? (
              <div>
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#863800] hover:text-[#b84b00] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back to login</span>
                </button>

                <div className="mb-6">
                  <h1 className="text-xl font-semibold tracking-[-0.02em] text-[#1c1714] sm:text-2xl">
                    Select Restaurant
                  </h1>
                  <p className="mt-1.5 text-xs leading-5 text-[#756c66] sm:text-sm">
                    Your account is associated with multiple restaurants. Choose which one to
                    access:
                  </p>
                </div>

                <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-1">
                  {selectionData.restaurants.map((restaurant) => {
                    const restId = restaurant.restaurantId;
                    const restName = restaurant.restaurantName;
                    const isSelected = selectedRestaurantId === restId;
                    return (
                      <button
                        key={restId}
                        type="button"
                        onClick={() => setSelectedRestaurantId(restId)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                          isSelected
                            ? "border-[#b84b00] bg-[#fffaf5] shadow-xs"
                            : "border-[#eddcd4] bg-white hover:border-[#d9cbc2] hover:bg-[#faf7f5]"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-[#fef3ec] text-[#b84b00]"
                                : "bg-neutral-100 text-neutral-500"
                            }`}
                          >
                            <Building2 className="size-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1c1714] truncate">
                              {restName}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="inline-block text-[11px] font-medium text-[#756c66] uppercase tracking-wider">
                                {restaurant.role}
                              </span>
                              {restaurant.status === "INACTIVE" && (
                                <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded">
                                  Deactivated
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <CheckCircle2 className="size-5 text-[#b84b00] shrink-0" />
                        ) : (
                          <ChevronRight className="size-4 text-neutral-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <Button
                  type="button"
                  disabled={!selectedRestaurantId || isSelecting}
                  onClick={() => handleSelectRestaurant(selectedRestaurantId)}
                  className="h-11 w-full rounded-md bg-[#b84b00] text-sm font-semibold text-white hover:bg-[#9d3f00] focus-visible:ring-2 focus-visible:ring-[#b84b00]/30 active:translate-y-px transition-all cursor-pointer"
                >
                  {isSelecting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
                      Entering Dashboard...
                    </>
                  ) : (
                    "Continue to Restaurant"
                  )}
                </Button>
              </div>
            ) : (
              <div>
                <div className="mb-7">
                  <h1 className="text-xl font-semibold tracking-[-0.02em] text-[#1c1714] sm:text-2xl">
                    Staff Login
                  </h1>

                  <p className="mt-1.5 text-xs leading-5 text-[#756c66] sm:text-sm">
                    Enter your email and password to access your staff account.
                  </p>
                </div>

                <StaffLoginForm onSubmit={handleStaffLogin} isLoading={isLoading} />
              </div>
            )}
          </div>

          <p className="mt-5 text-center text-[11px] leading-5 text-[#918780]">
            Authorized SpotQ staff only
          </p>
        </div>
      </section>
    </main>
  );
}
