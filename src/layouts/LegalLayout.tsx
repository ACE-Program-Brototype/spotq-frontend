import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { CustomerFooter } from "@/components/layout/CustomerFooter";
import { CustomerNavbar } from "@/components/layout/CustomerNavbar";

interface LegalPageLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export const LegalPageLayout = ({
  title,
  description,
  lastUpdated,
  children,
}: LegalPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#fffdfb] text-neutral-900 flex flex-col justify-between">
      {/* Top Navbar */}
      <CustomerNavbar />

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="border-b border-[#f3e6de] bg-white">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="inline-flex rounded-full bg-[#ff6b00]/10 px-3 py-1 text-xs font-bold text-[#ff6b00]">
                SpotQ Legal
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-[#ff6b00] transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Home</span>
              </Link>
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
              className="
                prose prose-neutral max-w-none
                prose-headings:font-bold
                prose-headings:tracking-tight
                prose-headings:text-neutral-900
                prose-h2:mb-3 prose-h2:mt-8 prose-h2:text-lg
                prose-h3:mb-2 prose-h3:mt-6 prose-h3:text-sm
                prose-p:text-xs sm:prose-p:text-sm prose-p:leading-relaxed prose-p:text-neutral-600
                prose-li:text-xs sm:prose-li:text-sm prose-li:leading-relaxed prose-li:text-neutral-600
                prose-strong:text-neutral-900
                prose-a:text-[#ff6b00] hover:prose-a:underline
              "
            >
              {children}
            </div>
          </article>
        </section>
      </main>

      {/* Customer Footer */}
      <CustomerFooter />
    </div>
  );
};

export default LegalPageLayout;
