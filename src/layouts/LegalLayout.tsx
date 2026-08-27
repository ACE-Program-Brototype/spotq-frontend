import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import spotqLogo from "@/assets/logos/spotq-logo.png";
import Footer from "@/features/demo/components/Footer";

interface LegalPageLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LegalPageLayout = ({ title, description, lastUpdated, children }: LegalPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-spotq-cream text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-spotq-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link to="/" className="flex items-center gap-2.5" aria-label="SpotQ home">
            <img src={spotqLogo} alt="SpotQ" className="h-7 w-auto object-contain" />

            <span className="text-lg font-extrabold tracking-tight">spotQ</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-spotq-cream hover:text-spotq-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="border-b border-spotq-border bg-white">
          <div className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
            <div className="mb-4 inline-flex rounded-full bg-spotq-orange/10 px-3 py-1 text-xs font-semibold text-spotq-orange">
              SpotQ Legal
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500">{description}</p>

            <p className="mt-5 text-xs font-medium text-gray-400">Last updated: {lastUpdated}</p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
          <article className="rounded-2xl border border-spotq-border bg-white p-6 shadow-sm sm:p-10 lg:p-12">
            <div
              className="
                prose prose-gray max-w-none
                prose-headings:font-extrabold
                prose-headings:tracking-tight
                prose-h2:mb-3 prose-h2:mt-10 prose-h2:text-xl
                prose-h3:mb-2 prose-h3:mt-7 prose-h3:text-base
                prose-p:text-sm prose-p:leading-7 prose-p:text-gray-600
                prose-li:text-sm prose-li:leading-7 prose-li:text-gray-600
                prose-strong:text-gray-800
                prose-a:text-spotq-orange
              "
            >
              {children}
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPageLayout;
