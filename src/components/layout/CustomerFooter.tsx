/**
 * Customer Footer Navigation Component
 * Provides platform branding, social links, company and legal navigation, and copyright info.
 */

import { Globe, Mail, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5 select-none">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white shadow-xs border border-neutral-100">
                <img src={spotqLogo} alt="spotQ" className="size-5 object-contain" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#ff6b00]">spotQ</span>
            </Link>

            <p className="text-xs leading-relaxed text-neutral-500 max-w-sm">
              Connecting your dining experience with top restaurants. Fast, simple, and queue-free.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://spotq.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Website"
                className="flex size-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:border-[#ff6b00] hover:text-[#ff6b00] transition-colors"
              >
                <Globe className="size-4" />
              </a>
              <a
                href="mailto:contact@spotq.com"
                aria-label="Email Us"
                className="flex size-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:border-[#ff6b00] hover:text-[#ff6b00] transition-colors"
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
                className="flex size-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:border-[#ff6b00] hover:text-[#ff6b00] transition-colors"
              >
                <Share2 className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Company</h2>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link to="/" className="hover:text-neutral-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-neutral-900 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Legal</h2>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link to="/terms" className="hover:text-neutral-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-neutral-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <p>© {currentYear} SpotQ. All rights reserved.</p>

          <div className="flex items-center gap-4 text-neutral-500">
            <Link to="/terms" className="hover:text-neutral-900 transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-neutral-900 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default CustomerFooter;
