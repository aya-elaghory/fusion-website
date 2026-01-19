import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="
        relative z-30
        border-t border-emerald-200/60 dark:border-emerald-400/20
        bg-gradient-to-b from-emerald-50 via-emerald-50/80 to-emerald-100
        dark:from-emerald-950 dark:via-emerald-900 dark:to-emerald-900
        backdrop-blur
      "
    >
      {/* subtle top accent */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main row */}
        <div className="py-10 md:py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand + Social */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/assets/Fusion-Main-LOGO.png"
                alt="Fusion — Home"
                className="h-12 w-auto mx-auto md:mx-0"
                loading="lazy"
              />
            </Link>

            <div className="mt-4 flex items-center gap-3 justify-center md:justify-start">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-full border border-emerald-200/70 dark:border-white/10 hover:border-emerald-500 hover:text-emerald-600 transition-colors bg-white/70 dark:bg-white/5"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-full border border-emerald-200/70 dark:border-white/10 hover:border-emerald-500 hover:text-emerald-600 transition-colors bg-white/70 dark:bg-white/5"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="p-2 rounded-full border border-emerald-200/70 dark:border-white/10 hover:border-emerald-500 hover:text-emerald-600 transition-colors bg-white/70 dark:bg-white/5"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="text-sm text-gray-700 dark:text-emerald-100/90 text-center md:text-left">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Address
            </h3>
            <div className="flex items-start gap-3 justify-center md:justify-start">
              <MapPin className="h-5 w-5 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5" />
              <address className="not-italic leading-relaxed">
                7620 5th Ave.
                <br />
                Brooklyn, NY 11209, USA
              </address>
            </div>
          </div>

          {/* Contact */}
          <div className="text-sm text-gray-700 dark:text-emerald-100/90 text-center md:text-left">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <Phone className="h-5 w-5 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5" />
                <a
                  href="tel:+19297211050"
                  className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors leading-tight"
                >
                  +1 (929) 721-1050
                </a>
              </li>
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <Mail className="h-5 w-5 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5" />
                <a
                  href="mailto:info@fusionrxny.com"
                  className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors leading-tight"
                >
                  info@fusionrxny.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="text-sm text-gray-700 dark:text-emerald-100/90 text-center md:text-left">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Working Hours
            </h3>
            <div className="mx-auto md:mx-0 max-w-sm flex items-start gap-3 rounded-xl bg-white/80 dark:bg-white/5 p-4 shadow-sm border border-emerald-200/70 dark:border-white/10">
              <Clock className="mt-0.5 h-5 w-5 text-emerald-700 dark:text-emerald-300" />
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-white leading-tight">
                  Mon–Fri: 10:00am – 6:00pm
                </p>
                {/* Optional:
                <p className="text-gray-700 dark:text-emerald-100/90 leading-tight">Sat: 11:00am – 5:00pm</p>
                <p className="text-gray-700 dark:text-emerald-100/90 leading-tight">Sun: Closed</p>
                */}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-emerald-200/60 dark:border-emerald-400/20" />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-emerald-800/80 dark:text-emerald-100/80">
          <p className="order-3 md:order-1 text-center md:text-left">
            © {year}{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              Fusion Apothecary
            </span>
            . All rights reserved.
          </p>

          {/* Buttons for Privacy & Terms */}
          <div className="order-2 flex items-center gap-3">
            <Link
              to="/privacy"
              className="inline-flex items-center px-3 py-1.5 rounded-full border border-emerald-300 bg-white/80 text-emerald-800 transition-colors
               hover:bg-emerald-600 hover:text-white
               dark:border-emerald-400/40 dark:bg-white/10 dark:text-emerald-100
               dark:hover:bg-emerald-600 dark:hover:text-white
               focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="inline-flex items-center px-3 py-1.5 rounded-full border border-emerald-300 bg-white/80 text-emerald-800 transition-colors
               hover:bg-emerald-600 hover:text-white
               dark:border-emerald-400/40 dark:bg-white/10 dark:text-emerald-100
               dark:hover:bg-emerald-600 dark:hover:text-white
               focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            >
              Terms
            </Link>
          </div>

          <p className="order-1 md:order-3 text-center md:text-right">
            Designed &amp; Developed by{" "}
            <a
              href="https://aiglobalcore.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              AI Globalcore
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
