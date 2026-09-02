import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import spotqLogo from "@/assets/logos/spotq-logo.png";
import { CustomerFooter } from "@/components/layout/CustomerFooter";
import { CustomerNavbar } from "@/components/layout/CustomerNavbar";

interface LegalPageLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  backTo?: string;
  backLabel?: string;
  variant?: "customer" | "restaurant";
  children: React.ReactNode;
}

export const LegalPageLayout = ({
  title,
  description,
  lastUpdated,
  backTo,
  backLabel,
  variant = "customer",
  children,
}: LegalPageLayoutProps) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const isCustomer = variant === "customer";
  const defaultBackLabel = isCustomer ? "Back" : "Back to Restaurant Portal";
  const effectiveBackLabel = backLabel ?? defaultBackLabel;

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else if (isCustomer && window.history.length > 1) {
      navigate(-1);
    } else if (!isCustomer) {
      navigate("/restaurant/email/verification");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdfb] text-neutral-900 flex flex-col justify-between">
      {/* Top Navbar: Customer Navbar for customers, Clean Partner Header for restaurants */}
      {isCustomer ? (
        <CustomerNavbar />
      ) : (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#eddcd4] bg-white/95 px-4 sm:px-8 backdrop-blur shadow-2xs">
          <Link
            to="/restaurant/email/verification"
            className="flex items-center gap-2.5 select-none"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-white shadow-xs border border-[#eddcd4]">
              <img src={spotqLogo} alt="spotQ" className="size-5 object-contain" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black tracking-tight text-[#9a3412]">spotQ</span>
              <span className="text-xs font-semibold text-neutral-500">Partner Legal</span>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#9a3412] transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>{effectiveBackLabel}</span>
          </button>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="border-b border-[#f3e6de] bg-white">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                  isCustomer ? "bg-[#ff6b00]/10 text-[#ff6b00]" : "bg-[#9a3412]/10 text-[#9a3412]"
                }`}
              >
                {isCustomer ? "SpotQ Legal" : "Restaurant Partner Agreement"}
              </div>

              {isCustomer && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-[#ff6b00] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>{effectiveBackLabel}</span>
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              {title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-neutral-500">
              {description}
            </p>

            <p className="mt-4 text-xs font-medium text-neutral-400">Last updated: {lastUpdated}</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <article className="rounded-2xl border border-[#f3e6de] bg-white p-6 shadow-2xs sm:p-10">
            <div
              className={`
                prose prose-neutral max-w-none
                prose-headings:font-bold
                prose-headings:tracking-tight
                prose-headings:text-neutral-900
                prose-h2:mb-3 prose-h2:mt-8 prose-h2:text-lg
                prose-h3:mb-2 prose-h3:mt-6 prose-h3:text-sm
                prose-p:text-xs sm:prose-p:text-sm prose-p:leading-relaxed prose-p:text-neutral-600
                prose-li:text-xs sm:prose-li:text-sm prose-li:leading-relaxed prose-li:text-neutral-600
                prose-strong:text-neutral-900
                ${isCustomer ? "prose-a:text-[#ff6b00]" : "prose-a:text-[#9a3412]"} hover:prose-a:underline
              `}
            >
              {children}
            </div>
          </article>
        </section>
      </main>

      {/* Footer: Customer Footer only for customers, clean minimal footer for restaurant partners */}
      {isCustomer ? (
        <CustomerFooter />
      ) : (
        <footer className="border-t border-[#eddcd4] bg-white py-6 text-center text-xs text-neutral-500">
          <div className="mx-auto max-w-7xl px-4">
            <p>© {currentYear} SpotQ Hospitality Network. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default LegalPageLayout;
