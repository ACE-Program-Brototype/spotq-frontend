import { SiFacebook, SiInstagram, SiYoutube } from "@icons-pack/react-simple-icons";

import { Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import spotqLogo from "@/assets/logos/spotq-logo.png";

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="border-t border-spotq-border bg-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label="SpotQ home">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                <img src={spotqLogo} alt="SpotQ" className="h-7 w-auto object-contain" />
              </div>

              <span className="text-lg font-extrabold tracking-tight text-gray-900">
                spot<span className="text-spotq-orange">Q</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-gray-500">
              Connecting you with the best local restaurants. Find your favourite table, join the
              queue, and enjoy dining without the wait.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <a
                href="www.instagram.com"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-spotq-border text-gray-500 transition-colors hover:border-spotq-orange hover:text-spotq-orange"
              >
                <SiInstagram className="h-4 w-4" />
              </a>

              <a
                href="www.facebook.com"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-spotq-border text-gray-500 transition-colors hover:border-spotq-orange hover:text-spotq-orange"
              >
                <SiFacebook className="h-4 w-4" />
              </a>

              <a
                href="www.youtube.com"
                aria-label="Youtube"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-spotq-border text-gray-500 transition-colors hover:border-spotq-orange hover:text-spotq-orange"
              >
                <SiYoutube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">Company</h3>

            <nav className="mt-5 flex flex-col gap-3">
              <Link
                to="/about"
                className="text-sm text-gray-500 transition-colors hover:text-spotq-orange"
              >
                About Us
              </Link>

              <Link
                to="/"
                className="text-sm text-gray-500 transition-colors hover:text-spotq-orange"
              >
                Restaurants
              </Link>

              <Link
                to="/"
                className="text-sm text-gray-500 transition-colors hover:text-spotq-orange"
              >
                Careers
              </Link>

              <Link
                to="/"
                className="text-sm text-gray-500 transition-colors hover:text-spotq-orange"
              >
                Press
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">Support</h3>

            <nav className="mt-5 flex flex-col gap-3">
              <Link
                to="/"
                className="text-sm text-gray-500 transition-colors hover:text-spotq-orange"
              >
                Help Center
              </Link>

              <Link
                to="/"
                className="text-sm text-gray-500 transition-colors hover:text-spotq-orange"
              >
                Contact Us
              </Link>

              <Link
                to="/"
                className="text-sm text-gray-500 transition-colors hover:text-spotq-orange"
              >
                FAQs
              </Link>
            </nav>

            <h3 className="mt-7 text-xs font-bold uppercase tracking-wider text-gray-900">Legal</h3>

            <nav className="mt-5 flex flex-col gap-3">
              <Link
                to="/terms-and-conditions"
                className="text-sm text-gray-500 transition-colors hover:text-spotq-orange"
              >
                Terms & Conditions
              </Link>

              <Link
                to="/privacy-policy"
                className="text-sm text-gray-500 transition-colors hover:text-spotq-orange"
              >
                Privacy Policy
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">Get SpotQ</h3>

            <p className="mt-5 text-sm leading-6 text-gray-500">
              Discover restaurants, join waitlists, and keep your dining plans moving.
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4 shrink-0 text-spotq-orange" />
                <span>support@spotq.app</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 shrink-0 text-spotq-orange" />
                <span>Made for food lovers</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-lg bg-black px-3 text-left text-white transition-opacity hover:opacity-85"
              >
                <span className="text-[9px] leading-none">Download on</span>
                <span className="text-xs font-semibold leading-none">App Store</span>
              </button>

              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-lg bg-black px-3 text-left text-white transition-opacity hover:opacity-85"
              >
                <span className="text-[9px] leading-none">GET IT ON</span>
                <span className="text-xs font-semibold leading-none">Google Play</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-spotq-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400">© {currentYear} SpotQ. All rights reserved.</p>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link to="/privacy-policy" className="transition-colors hover:text-spotq-orange">
              Privacy Policy
            </Link>

            <Link to="/terms-and-conditions" className="transition-colors hover:text-spotq-orange">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
