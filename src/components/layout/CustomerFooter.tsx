/**
 * Customer Footer Navigation Component
 * Provides platform branding, social links, company and legal navigation, and copyright info.
 */

import { Globe, Mail, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import spotqLogo from "@/assets/logos/spotq-logo.png";
import { cn } from "@/lib/utils/cn";
import type { CustomerFooterProps } from "./types";

export type { CustomerFooterProps };

export function CustomerFooter({ className }: CustomerFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "w-full border-t border-neutral-200/80 bg-white text-neutral-600 transition-colors",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Brand & Platform Info */}
          <div className="flex flex-col gap-3.5 md:col-span-6 lg:col-span-6">
            <Link to={CUSTOMER_ROUTES.HOME} className="flex items-center gap-2.5 select-none w-fit">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white shadow-2xs border border-[#eddcd4]">
                <img src={spotqLogo} alt="spotQ" className="size-5 object-contain" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#e8631b]">spotQ</span>
            </Link>

            <p className="text-xs leading-relaxed text-neutral-500 max-w-sm">
              Connecting your dining experience with top restaurants. Fast, simple, and queue-free.
            </p>

            <div className="flex items-center gap-2 pt-0.5">
              <a
                href="https://spotq.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Website"
                className="flex size-8 items-center justify-center rounded-full border border-[#eddcd4] text-neutral-600 hover:border-[#e8631b] hover:text-[#e8631b] hover:bg-orange-50/50 transition-colors"
              >
                <Globe className="size-4" />
              </a>
              <a
                href="mailto:contact@spotq.com"
                aria-label="Email Us"
                className="flex size-8 items-center justify-center rounded-full border border-[#eddcd4] text-neutral-600 hover:border-[#e8631b] hover:text-[#e8631b] hover:bg-orange-50/50 transition-colors"
              >
                <Mail className="size-4" />
              </a>
              <button
                type="button"
                aria-label="Share"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: "SpotQ", url: window.location.origin });
                  }
                }}
                className="flex size-8 items-center justify-center rounded-full border border-[#eddcd4] text-neutral-600 hover:border-[#e8631b] hover:text-[#e8631b] hover:bg-orange-50/50 transition-colors cursor-pointer"
              >
                <Share2 className="size-4" />
              </button>
            </div>
          </div>

          {/* Navigation Links: 2 Columns side-by-side on Mobile and Tablet */}
          <div className="grid grid-cols-2 gap-6 md:col-span-6 lg:col-span-6">
            {/* Company Links */}
            <div className="flex flex-col gap-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Company</h2>
              <ul className="flex flex-col gap-2 text-xs">
                <li>
                  <Link
                    to={CUSTOMER_ROUTES.HOME}
                    className="hover:text-[#e8631b] transition-colors py-0.5 inline-block"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={CUSTOMER_ROUTES.ABOUT}
                    className="hover:text-[#e8631b] transition-colors py-0.5 inline-block"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col gap-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Legal</h2>
              <ul className="flex flex-col gap-2 text-xs">
                <li>
                  <Link
                    to={CUSTOMER_ROUTES.LEGAL.TERMS}
                    className="hover:text-[#e8631b] transition-colors py-0.5 inline-block"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to={CUSTOMER_ROUTES.LEGAL.PRIVACY}
                    className="hover:text-[#e8631b] transition-colors py-0.5 inline-block"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Status Bar */}
        <div className="mt-8 pt-5 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-neutral-400 text-center sm:text-left">
          <p>© {currentYear} SpotQ. All rights reserved.</p>
          <p className="text-[11px] text-neutral-400">Digital takeaway & live queue management</p>
        </div>
      </div>
    </footer>
  );
}

export default CustomerFooter;
