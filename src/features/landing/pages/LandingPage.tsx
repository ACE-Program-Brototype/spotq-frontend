import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChefHat,
  ChevronRight,
  ClipboardList,
  Clock,
  Compass,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  TrendingUp,
  UserPlus,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { CUSTOMER_ROUTES, RESTAURANT_ROUTES, STAFF_ROUTES } from "@/app/router/routes.constants";
import spotqLogo from "@/assets/logos/spotq-logo.png";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getRoleHome } from "@/features/auth/utils/auth.helpers";
import { getUserDisplayName, getUserInitials } from "@/features/auth/utils/user.utils";

export function LandingPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { handleLogout, isLoading: isLoggingOut } = useLogout();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const getDashboardRoute = () => {
    if (!user) return CUSTOMER_ROUTES.HOME;
    return getRoleHome(user.role);
  };

  const executeLogout = async () => {
    setShowLogoutConfirm(false);
    await handleLogout();
  };

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardRoute()} replace />;
  }

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900 antialiased selection:bg-[#ff6b00]/20 selection:text-[#ff6b00]">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP UTILITY BAR (Partner & Staff Direct Access)
      ───────────────────────────────────────────────────────────── */}
      <div className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#ff6b00]" />
            <span className="font-medium text-neutral-300 tracking-wide text-[11px] sm:text-xs">
              Live Waitlist &amp; Smart Dining Platform
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-[11px] sm:text-xs font-medium">
            <Link
              to={RESTAURANT_ROUTES.LOGIN}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Store className="size-3.5 text-[#ff6b00]" />
              <span>Partner with us</span>
            </Link>

            <span className="text-neutral-700">|</span>

            <Link
              to={STAFF_ROUTES.LOGIN}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <ChefHat className="size-3.5 text-[#ff6b00]" />
              <span>Staff Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN NAVIGATION HEADER (SpotQ Orange Theme)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-spotq-orange text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to={CUSTOMER_ROUTES.LANDING}
            className="flex items-center gap-3 shrink-0 select-none group"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-white shadow-xs group-hover:scale-105 transition-transform">
              <img src={spotqLogo} alt="spotQ" className="size-5.5 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white leading-none">
                spotQ
              </span>
              <span className="text-[10px] font-bold text-white/80 tracking-wider uppercase">
                Zero Wait Dining
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-white/90">
            <Link
              to={CUSTOMER_ROUTES.HOME}
              className="hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10"
            >
              <span>Explore Restaurants</span>
              <span className="bg-white text-[#ff6b00] text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                Live
              </span>
            </Link>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/10"
            >
              How It Works
            </a>
            <a
              href="#live-queue-preview"
              className="hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/10"
            >
              Live Queue Pass
            </a>
            <a
              href="#for-restaurants"
              className="hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/10"
            >
              For Restaurants
            </a>
          </nav>

          {/* Customer Auth Actions (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardRoute()}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 px-3 py-1.5 text-xs font-bold text-white transition-colors border border-white/20 backdrop-blur-xs shadow-2xs"
                >
                  <div className="flex size-7 items-center justify-center rounded-full bg-white text-[#ff6b00] text-[11px] font-bold shrink-0">
                    {initials}
                  </div>
                  <span>{displayName || "My Account"}</span>
                  <ChevronRight className="size-3.5 text-white/70" />
                </Link>

                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  disabled={isLoggingOut}
                  className="inline-flex items-center gap-1.5 rounded-xl text-xs font-semibold text-white/85 hover:text-white hover:bg-white/15 cursor-pointer h-9 px-3 transition-colors disabled:opacity-50"
                >
                  <LogOut className="size-3.5" />
                  <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to={CUSTOMER_ROUTES.AUTH.LOGIN}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-white hover:bg-white/15 text-xs font-bold transition-colors"
                >
                  <LogIn className="size-4" />
                  <span>Sign In</span>
                </Link>

                <Link
                  to={CUSTOMER_ROUTES.AUTH.REGISTER}
                  className="inline-flex items-center gap-1.5 h-10 px-4.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <UserPlus className="size-4" />
                  <span>Create Account</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            {isAuthenticated && user && (
              <Link to={getDashboardRoute()}>
                <div className="flex size-8 items-center justify-center rounded-full bg-white text-[#ff6b00] text-xs font-bold shrink-0">
                  {initials}
                </div>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-white hover:bg-white/10"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-spotq-orange text-white px-4 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-1.5 font-semibold text-white/90">
              <Link
                to={CUSTOMER_ROUTES.HOME}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-white"
              >
                <span className="flex items-center gap-2 font-bold">
                  <Compass className="size-4 text-white" />
                  <span>Explore Restaurants</span>
                </span>
                <span className="bg-white text-[#ff6b00] text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                  Live
                </span>
              </Link>

              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-left font-semibold text-white"
              >
                <span>How It Works</span>
                <ChevronRight className="size-4 text-white/70" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("live-queue-preview")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-left font-semibold text-white"
              >
                <span>Live Queue Pass</span>
                <ChevronRight className="size-4 text-white/70" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("for-restaurants")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-left font-semibold text-white"
              >
                <span>For Restaurants</span>
                <ChevronRight className="size-4 text-white/70" />
              </button>
            </nav>

            <div className="pt-3 border-t border-white/20 flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <Link
                  to={RESTAURANT_ROUTES.LOGIN}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <Store className="size-3.5 text-white" />
                  <span>Partner Login</span>
                </Link>
                <Link
                  to={STAFF_ROUTES.LOGIN}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <ChefHat className="size-3.5 text-white" />
                  <span>Staff Login</span>
                </Link>
              </div>

              {isAuthenticated && user ? (
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    to={getDashboardRoute()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-950 text-white font-bold text-xs"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="size-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 p-3 rounded-xl border border-white/30 text-white hover:bg-white/10 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    to={CUSTOMER_ROUTES.AUTH.LOGIN}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-white/30 font-bold text-xs text-white hover:bg-white/10"
                  >
                    <LogIn className="size-4" />
                    <span>Customer Sign In</span>
                  </Link>

                  <Link
                    to={CUSTOMER_ROUTES.AUTH.REGISTER}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-950 text-white font-bold text-xs shadow-xs hover:bg-neutral-900"
                  >
                    <UserPlus className="size-4" />
                    <span>Register as Customer</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. ELEGANT HERO SECTION WITH INTERACTIVE SHOWCASE
      ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-white pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-neutral-200/70 overflow-hidden">
        {/* Soft Radial Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[400px] bg-[#ff6b00]/10 blur-[140px] rounded-full"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Subtle Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-[#faf9f6] px-3.5 py-1 text-xs font-semibold text-neutral-800 shadow-2xs">
              <span className="size-1.5 rounded-full bg-[#ff6b00]" />
              <span>Smart Virtual Queuing &amp; Pre-Order Dining</span>
            </div>

            {/* Refined Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-950 leading-[1.08]">
              Skip the wait. <br />
              <span className="text-[#ff6b00]">Savor every moment.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-neutral-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Join live restaurant waitlists from your phone, track real-time queue ETAs, and
              pre-order your meals before you step foot in the dining room.
            </p>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                to={CUSTOMER_ROUTES.HOME}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white text-sm font-bold shadow-xs hover:shadow transition-all"
              >
                <span>Explore Restaurants</span>
                <ArrowRight className="size-4" />
              </Link>

              {!isAuthenticated ? (
                <Link
                  to={CUSTOMER_ROUTES.AUTH.REGISTER}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white hover:bg-neutral-50 text-neutral-900 text-sm font-semibold border border-neutral-300 shadow-2xs transition-all"
                >
                  <UserPlus className="size-4 text-neutral-600" />
                  <span>Create Free Account</span>
                </Link>
              ) : (
                <Link
                  to={getDashboardRoute()}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white hover:bg-neutral-50 text-neutral-900 text-sm font-semibold border border-neutral-300 shadow-2xs transition-all"
                >
                  <span>Go to Dashboard</span>
                  <ChevronRight className="size-4 text-neutral-600" />
                </Link>
              )}
            </div>
          </div>

          {/* ── Interactive Smartphone Showcase Stage (Matching Reference Image) ── */}
          <div className="relative min-h-[560px] sm:min-h-[620px] flex items-end justify-center mt-12 sm:mt-16">
            {/* ── Left Floating Feature Cards (Desktop) ── */}
            {/* Card 1: Live Queue */}
            <div className="hidden md:flex absolute left-[4%] lg:left-[10%] top-[8%] z-10 w-28 sm:w-32 bg-white rounded-3xl p-4 shadow-xl shadow-neutral-200/70 border border-neutral-100 flex-col items-center text-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="size-11 sm:size-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                <ClipboardList className="size-5 sm:size-6" />
              </div>
              <span className="text-xs font-bold text-neutral-800 tracking-tight">Live Queue</span>
            </div>

            {/* Card 2: Walk-ins */}
            <div className="hidden md:flex absolute left-[18%] lg:left-[22%] top-[30%] z-10 w-28 sm:w-32 bg-white rounded-3xl p-4 shadow-xl shadow-neutral-200/70 border border-neutral-100 flex-col items-center text-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="size-11 sm:size-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                <UserPlus className="size-5 sm:size-6" />
              </div>
              <span className="text-xs font-bold text-neutral-800 tracking-tight">Walk-ins</span>
            </div>

            {/* Card 3: Table Assign */}
            <div className="hidden md:flex absolute left-[2%] lg:left-[8%] top-[50%] z-10 w-28 sm:w-32 bg-white rounded-3xl p-4 shadow-xl shadow-neutral-200/70 border border-neutral-100 flex-col items-center text-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="size-11 sm:size-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-xs">
                <UtensilsCrossed className="size-5 sm:size-6" />
              </div>
              <span className="text-xs font-bold text-neutral-800 tracking-tight">
                Table Assign
              </span>
            </div>

            {/* Card 4: Staff Tools */}
            <div className="hidden md:flex absolute left-[16%] lg:left-[20%] top-[70%] z-10 w-28 sm:w-32 bg-white rounded-3xl p-4 shadow-xl shadow-neutral-200/70 border border-neutral-100 flex-col items-center text-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="size-11 sm:size-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
                <Store className="size-5 sm:size-6" />
              </div>
              <span className="text-xs font-bold text-neutral-800 tracking-tight">Staff Tools</span>
            </div>

            {/* ── Centerpiece: Smartphone Mockup ── */}
            <div className="relative z-20 w-[290px] sm:w-[330px] bg-neutral-950 rounded-t-[44px] p-2.5 sm:p-3 shadow-2xl border-t-[6px] border-x-[6px] border-neutral-900 overflow-hidden">
              <div className="w-full bg-[#fbfbfb] rounded-t-[36px] pt-2 px-3.5 pb-6 flex flex-col items-center min-h-[460px] relative">
                {/* Status Bar */}
                <div className="w-full flex items-center justify-between text-[11px] font-semibold text-neutral-800 px-2 pt-1 select-none">
                  <span>2:41</span>
                  {/* Dynamic Island */}
                  <div className="w-24 h-5 bg-neutral-950 rounded-full flex items-center justify-between px-2.5 shadow-inner">
                    <div className="size-2 rounded-full bg-neutral-800" />
                    <div className="size-2 rounded-full bg-[#ff6b00]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold">5G</span>
                    <div className="w-4 h-2 border border-neutral-800 rounded-xs p-0.5 flex items-center">
                      <div className="w-2 h-full bg-neutral-800 rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* Mockup Center Floating Feature: Manage your queue */}
                <div className="w-48 bg-white rounded-2xl p-4 shadow-lg border border-neutral-100 flex flex-col items-center text-center gap-2 mt-5 animate-in fade-in duration-300">
                  <div className="size-11 rounded-xl bg-orange-50 text-[#ff6b00] flex items-center justify-center shadow-xs">
                    <Clock className="size-6 text-[#ff6b00]" />
                  </div>
                  <span className="text-xs font-bold text-neutral-800 tracking-tight">
                    Manage your queue
                  </span>
                </div>

                {/* Inside-Phone Live Token Card */}
                <div className="w-full bg-white rounded-2xl p-3.5 shadow-sm border border-neutral-100 mt-3 space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-neutral-400 uppercase tracking-wider">Live Waitlist</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold">
                      Calling Next
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-black text-[#ff6b00]">#Q-18</div>
                    <span className="text-xs font-semibold text-neutral-500">3 Guests</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff6b00] w-4/5 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-500 font-medium">
                    <span>Copper Kettle Bistro</span>
                    <span className="text-[#ff6b00] font-bold">~7 mins</span>
                  </div>
                </div>

                {/* Seat Guest Action */}
                <div className="w-full mt-3">
                  <div className="w-full py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-bold text-center shadow-xs">
                    Seat Guest Now
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Floating Feature Cards (Desktop) ── */}
            {/* Card 5: AI ETA */}
            <div className="hidden md:flex absolute right-[4%] lg:right-[10%] top-[8%] z-10 w-28 sm:w-32 bg-white rounded-3xl p-4 shadow-xl shadow-neutral-200/70 border border-neutral-100 flex-col items-center text-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="size-11 sm:size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                <Sparkles className="size-5 sm:size-6" />
              </div>
              <span className="text-xs font-bold text-neutral-800 tracking-tight">AI ETA</span>
            </div>

            {/* Card 6: Guest Alerts */}
            <div className="hidden md:flex absolute right-[18%] lg:right-[22%] top-[28%] z-10 w-28 sm:w-32 bg-white rounded-3xl p-4 shadow-xl shadow-neutral-200/70 border border-neutral-100 flex-col items-center text-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="size-11 sm:size-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center shadow-xs">
                <Bell className="size-5 sm:size-6" />
              </div>
              <span className="text-xs font-bold text-neutral-800 tracking-tight">
                Guest Alerts
              </span>
            </div>

            {/* Card 7: Analytics */}
            <div className="hidden md:flex absolute right-[2%] lg:right-[8%] top-[52%] z-10 w-28 sm:w-32 bg-white rounded-3xl p-4 shadow-xl shadow-neutral-200/70 border border-neutral-100 flex-col items-center text-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="size-11 sm:size-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                <BarChart3 className="size-5 sm:size-6" />
              </div>
              <span className="text-xs font-bold text-neutral-800 tracking-tight">Analytics</span>
            </div>

            {/* Card 8: Remote Join */}
            <div className="hidden md:flex absolute right-[16%] lg:right-[20%] top-[72%] z-10 w-28 sm:w-32 bg-white rounded-3xl p-4 shadow-xl shadow-neutral-200/70 border border-neutral-100 flex-col items-center text-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="size-11 sm:size-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-xs">
                <Smartphone className="size-5 sm:size-6" />
              </div>
              <span className="text-xs font-bold text-neutral-800 tracking-tight">Remote Join</span>
            </div>
          </div>

          {/* ── Mobile Grid Fallback (Shown on screens < md) ── */}
          <div className="md:hidden mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-3.5 shadow-md border border-neutral-100 flex flex-col items-center text-center gap-2">
              <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ClipboardList className="size-5" />
              </div>
              <span className="text-[11px] font-bold text-neutral-800">Live Queue</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 shadow-md border border-neutral-100 flex flex-col items-center text-center gap-2">
              <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <UserPlus className="size-5" />
              </div>
              <span className="text-[11px] font-bold text-neutral-800">Walk-ins</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 shadow-md border border-neutral-100 flex flex-col items-center text-center gap-2">
              <div className="size-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <UtensilsCrossed className="size-5" />
              </div>
              <span className="text-[11px] font-bold text-neutral-800">Table Assign</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 shadow-md border border-neutral-100 flex flex-col items-center text-center gap-2">
              <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Store className="size-5" />
              </div>
              <span className="text-[11px] font-bold text-neutral-800">Staff Tools</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 shadow-md border border-neutral-100 flex flex-col items-center text-center gap-2">
              <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="size-5" />
              </div>
              <span className="text-[11px] font-bold text-neutral-800">AI ETA</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 shadow-md border border-neutral-100 flex flex-col items-center text-center gap-2">
              <div className="size-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <Bell className="size-5" />
              </div>
              <span className="text-[11px] font-bold text-neutral-800">Guest Alerts</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 shadow-md border border-neutral-100 flex flex-col items-center text-center gap-2">
              <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="size-5" />
              </div>
              <span className="text-[11px] font-bold text-neutral-800">Analytics</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 shadow-md border border-neutral-100 flex flex-col items-center text-center gap-2">
              <div className="size-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Smartphone className="size-5" />
              </div>
              <span className="text-[11px] font-bold text-neutral-800">Remote Join</span>
            </div>
          </div>

          {/* Editorial Metric Strip */}
          <div className="pt-12 mt-12 border-t border-neutral-200/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left sm:text-center">
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-neutral-950 tracking-tight">0 min</div>
              <div className="text-xs font-medium text-neutral-500">Physical Sidewalk Wait</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-[#ff6b00] tracking-tight">98%</div>
              <div className="text-xs font-medium text-neutral-500">Live ETA Accuracy</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-neutral-950 tracking-tight">500+</div>
              <div className="text-xs font-medium text-neutral-500">Curated Partner Spots</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-neutral-950 tracking-tight">35%</div>
              <div className="text-xs font-medium text-neutral-500">Faster Table Turnover</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. LIVE QUEUE EXPERIENCE PREVIEW (Refined Architectural Pass)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="live-queue-preview"
        className="py-20 sm:py-28 bg-[#faf9f6] border-b border-neutral-200/70"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Narrative */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#ff6b00] uppercase tracking-wider">
                <Sparkles className="size-3.5" />
                <span>Real-Time Dining Intelligence</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 leading-tight">
                Your table, ready the exact minute you walk in.
              </h2>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                Never wonder when your party will be seated. SpotQ calculates machine-learned wait
                times using live dining room turnover, party sizes, and kitchen throughput.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="size-5 rounded-full bg-neutral-200/80 text-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-950">
                      Live Queue Position &amp; Real-Time Countdown
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Track precisely how many parties are ahead with dynamic ETA refreshes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="size-5 rounded-full bg-neutral-200/80 text-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-950">
                      Smart Pre-Ordering From the Queue
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Select appetizers and signature mains in advance so the kitchen starts prep as
                      you arrive.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="size-5 rounded-full bg-neutral-200/80 text-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-950">
                      Audio Chime &amp; Notification Alerts
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Grab coffee nearby—SpotQ sounds an alert when your table is 5 minutes from
                      ready.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={CUSTOMER_ROUTES.HOME}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6b00] hover:text-[#e05e00] transition-colors"
                >
                  <span>Explore open waitlists near you</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: Refined Dining Pass Card */}
            <div className="flex justify-center">
              <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-6 sm:p-7 space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                      Active Queue Pass
                    </span>
                  </div>
                  <span className="bg-neutral-100 text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Verified Token
                  </span>
                </div>

                {/* Venue Details */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Venue
                  </span>
                  <h3 className="text-lg font-bold text-neutral-950">The Copper Kettle Bistro</h3>
                  <p className="text-xs text-neutral-500 flex items-center gap-1">
                    <MapPin className="size-3 text-[#ff6b00]" />
                    <span>Indiranagar &bull; Casual Dining</span>
                  </p>
                </div>

                {/* Refined Token Box */}
                <div className="p-4 rounded-xl bg-neutral-950 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Your Queue Number
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-[#ff6b00] tracking-tight">
                      #Q-18
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Party Size
                    </span>
                    <div className="text-base font-bold text-white">3 Guests</div>
                  </div>
                </div>

                {/* Live Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/60">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide">
                      Ahead of You
                    </span>
                    <div className="text-lg font-bold text-neutral-950 mt-0.5">2 Parties</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/60">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide">
                      Estimated Wait
                    </span>
                    <div className="text-lg font-bold text-neutral-950 mt-0.5">~7 mins</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-neutral-600">
                    <span>Queue Progress</span>
                    <span className="text-[#ff6b00]">80% Ready</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff6b00] rounded-full w-4/5" />
                  </div>
                </div>

                {/* Pre-order Notice */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-neutral-50 text-neutral-700 text-xs font-medium border border-neutral-200/70">
                  <UtensilsCrossed className="size-4 text-[#ff6b00] shrink-0" />
                  <span>3 Items Pre-Ordered (Kitchen primed on arrival)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. HOW IT WORKS (Restrained, Editorial 3-Step Flow)
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white border-b border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-[#ff6b00] uppercase tracking-wider">
              The Dining Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950">
              How SpotQ works for diners
            </h2>
            <p className="text-sm text-neutral-500">
              Go from craving to dining in 3 effortless steps without standing outside.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-neutral-200/80 bg-white hover:border-neutral-300 transition-colors space-y-4">
              <span className="text-xs font-mono font-bold text-neutral-400 tracking-wider">
                01
              </span>
              <h3 className="text-lg font-bold text-neutral-950">Discover &amp; Review</h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                Explore curated restaurants, review live queue depths, estimated wait times, and
                digital menus straight from your phone.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-neutral-200/80 bg-white hover:border-neutral-300 transition-colors space-y-4">
              <span className="text-xs font-mono font-bold text-[#ff6b00] tracking-wider">02</span>
              <h3 className="text-lg font-bold text-neutral-950">Join Queue</h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                Claim your digital token while commuting or running errands. Track dynamic ETA
                updates and pre-order your meals.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-neutral-200/80 bg-white hover:border-neutral-300 transition-colors space-y-4">
              <span className="text-xs font-mono font-bold text-neutral-400 tracking-wider">
                03
              </span>
              <h3 className="text-lg font-bold text-neutral-950">Walk Straight In</h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                Receive an instant alert, walk directly to your ready table, and enjoy dishes served
                shortly after you sit down.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. FOR RESTAURANTS & STAFF (Architectural Dark Section)
      ───────────────────────────────────────────────────────────── */}
      <section id="for-restaurants" className="py-20 sm:py-28 bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Restaurant B2B Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-[#ff6b00]">
                <Store className="size-3.5" />
                <span>SpotQ for Restaurant Partners</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Turn waiting crowds into <br />
                <span className="text-[#ff6b00]">high-turnover revenue.</span>
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl font-normal">
                Eliminate crowded waiting areas and walkaways. SpotQ equips restaurant operators
                with intelligent waitlist automation, table capacity controls, and digital
                pre-ordering.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="size-5 rounded-full bg-neutral-800 text-[#ff6b00] flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="size-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">35% Faster Table Turnover</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Pre-ordered meals reduce dining cycles by 15-20 minutes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-5 rounded-full bg-neutral-800 text-[#ff6b00] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="size-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Zero Walkaways</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Virtual queues keep guests engaged and retained.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-5 rounded-full bg-neutral-800 text-[#ff6b00] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="size-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Smart Table Dispatch</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Auto-match party sizes to ready tables instantly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-5 rounded-full bg-neutral-800 text-[#ff6b00] flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="size-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Floor Telemetry &amp; Insights</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Analyze peak demand trends and optimize kitchen prep.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  to={RESTAURANT_ROUTES.LOGIN}
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Store className="size-4" />
                  <span>Partner With SpotQ</span>
                </Link>

                <Link
                  to={RESTAURANT_ROUTES.LOGIN}
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-neutral-800 hover:border-neutral-600 text-neutral-300 text-xs font-bold transition-all"
                >
                  <span>Restaurant Owner Login</span>
                  <ArrowRight className="size-3.5 text-neutral-500" />
                </Link>
              </div>
            </div>

            {/* Host & Staff Console Card */}
            <div className="lg:col-span-5">
              <div className="p-7 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[#ff6b00]">
                    <ChefHat className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Host &amp; Waitstaff Console</h3>
                    <p className="text-xs text-neutral-400">On-shift operational dashboard</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                  Are you managing table seating, calling queue tokens, or verifying order statuses
                  tonight? Access your live floor terminal directly.
                </p>

                <div className="pt-2">
                  <Link
                    to={STAFF_ROUTES.LOGIN}
                    className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 text-xs font-bold transition-colors"
                  >
                    <Users className="size-4 text-[#ff6b00]" />
                    <span>Open Staff Portal</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-12 sm:py-16 text-neutral-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-neutral-200">
            {/* Brand */}
            <div className="col-span-2 space-y-4">
              <Link to={CUSTOMER_ROUTES.LANDING} className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-white border border-neutral-200 shadow-2xs">
                  <img src={spotqLogo} alt="spotQ" className="size-5 object-contain" />
                </div>
                <span className="text-xl font-black tracking-tight text-[#ff6b00]">spotQ</span>
              </Link>
              <p className="text-neutral-500 max-w-sm leading-relaxed">
                SpotQ is the intelligent dining and virtual queue platform eliminating physical wait
                lines for food lovers and restaurants everywhere.
              </p>
              <p className="text-neutral-400 text-[11px]">
                &copy; {new Date().getFullYear()} SpotQ Inc. All rights reserved.
              </p>
            </div>

            {/* Diners */}
            <div className="space-y-3">
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                For Diners
              </h4>
              <ul className="space-y-2 font-medium">
                <li>
                  <Link
                    to={CUSTOMER_ROUTES.HOME}
                    className="hover:text-[#ff6b00] transition-colors"
                  >
                    Explore Restaurants
                  </Link>
                </li>
                <li>
                  <Link
                    to={CUSTOMER_ROUTES.AUTH.LOGIN}
                    className="hover:text-[#ff6b00] transition-colors"
                  >
                    Customer Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to={CUSTOMER_ROUTES.AUTH.REGISTER}
                    className="hover:text-[#ff6b00] transition-colors"
                  >
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link
                    to={CUSTOMER_ROUTES.ABOUT}
                    className="hover:text-[#ff6b00] transition-colors"
                  >
                    About SpotQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Restaurants */}
            <div className="space-y-3">
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                For Restaurants
              </h4>
              <ul className="space-y-2 font-medium">
                <li>
                  <Link
                    to={RESTAURANT_ROUTES.LOGIN}
                    className="hover:text-[#ff6b00] transition-colors"
                  >
                    Partner with Us
                  </Link>
                </li>
                <li>
                  <Link
                    to={RESTAURANT_ROUTES.LOGIN}
                    className="hover:text-[#ff6b00] transition-colors"
                  >
                    Merchant Login
                  </Link>
                </li>
                <li>
                  <Link
                    to={RESTAURANT_ROUTES.SUBSCRIPTION}
                    className="hover:text-[#ff6b00] transition-colors"
                  >
                    Subscription Plans
                  </Link>
                </li>
              </ul>
            </div>

            {/* Staff & Legal */}
            <div className="space-y-3">
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                Staff &amp; Legal
              </h4>
              <ul className="space-y-2 font-medium">
                <li>
                  <Link to={STAFF_ROUTES.LOGIN} className="hover:text-[#ff6b00] transition-colors">
                    Staff Floor Console
                  </Link>
                </li>
                <li>
                  <Link
                    to={CUSTOMER_ROUTES.LEGAL.TERMS}
                    className="hover:text-[#ff6b00] transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to={CUSTOMER_ROUTES.LEGAL.PRIVACY}
                    className="hover:text-[#ff6b00] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to={CUSTOMER_ROUTES.LEGAL.COOKIES}
                    className="hover:text-[#ff6b00] transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400 text-[11px]">
            <p>Designed with care for seamless dining experiences.</p>
            <div className="flex items-center gap-4">
              <Link to={CUSTOMER_ROUTES.LEGAL.TERMS} className="hover:text-neutral-600">
                Terms
              </Link>
              <span>&bull;</span>
              <Link to={CUSTOMER_ROUTES.LEGAL.PRIVACY} className="hover:text-neutral-600">
                Privacy
              </Link>
              <span>&bull;</span>
              <Link to={CUSTOMER_ROUTES.LEGAL.COOKIES} className="hover:text-neutral-600">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          8. LOGOUT CONFIRMATION MODAL
      ───────────────────────────────────────────────────────────── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900">Sign Out</h3>
            <p className="text-xs text-neutral-500">
              Are you sure you want to end your SpotQ session?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
