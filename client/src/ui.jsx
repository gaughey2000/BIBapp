import { Component, createContext, useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BOOKING_URL, commonFAQ, treatmentDetails } from "./data";

const ThemeContext = createContext();
const BookingModalContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("bib-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    localStorage.setItem("bib-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export function BookingModalProvider({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <BookingModalContext.Provider value={{ open, setOpen }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              aria-label="Close"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
              Booking & Cancellation
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              A £20 deposit is required at the time of booking. We kindly ask
              for at least 24 hours’ notice for any appointment cancellations or
              changes. Deposits are non-refundable for late cancellations or
              missed appointments.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary w-full sm:w-auto justify-center"
              >
                Continue to booking
              </a>
              <Link
                to="/cancellation-policy"
                onClick={() => setOpen(false)}
                className="btn btn-secondary w-full sm:w-auto justify-center"
              >
                More info
              </Link>
            </div>
          </div>
        </div>
      )}
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const context = useContext(BookingModalContext);
  if (!context) {
    throw new Error("useBookingModal must be used within BookingModalProvider");
  }
  return context;
}

export function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 items-center rounded-full border transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--rose)]/50 bg-white/80 border-slate-200 hover:border-rose-300 dark:bg-slate-800/80 dark:border-slate-600"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="sr-only">
        {isDark ? "Dark mode on" : "Light mode on"}
      </span>
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-200 shadow-sm ${
          isDark
            ? "translate-x-6 bg-slate-900 text-amber-300"
            : "translate-x-1 bg-white text-slate-600"
        }`}
      >
        {isDark ? (
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </span>
    </button>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { setOpen: setBookingOpen } = useBookingModal();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkBase =
    "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative";
  const active =
    "text-slate-900 bg-white/80 backdrop-blur-sm shadow-sm border border-[color:var(--rose)]/20";
  const inactive =
    "text-slate-600 hover:text-slate-900 hover:bg-white/60 hover:backdrop-blur-sm";

  return (
    <header className="sticky top-0 z-50 nav-frosted">
      <div className="container-narrow">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo-full-rose.png"
              alt="BIB Clinic logo"
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              Treatments
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              Contact
            </NavLink>
            <div className="ml-4 h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 ml-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="btn btn-primary shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Book now
              </button>
            </div>
          </nav>

          <button
            className="md:hidden p-2.5 rounded-lg hover:bg-white/60 transition-colors duration-200 group"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-slate-600 group-hover:fill-slate-900 transition-colors duration-200"
            >
              {open ? (
                <path d="M18.3 5.71 12 12.01 5.7 5.7 4.29 7.11l6.3 6.3-6.3 6.3 1.41 1.41 6.3-6.3 6.29 6.3 1.42-1.41-6.3-6.3 6.3-6.3z" />
              ) : (
                <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden nav-frosted border-t border-[color:var(--rose)]/20 mobile-menu animate-slide-down">
          <nav className="container-narrow py-4 space-y-2">
            <NavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block ${linkBase} ${isActive ? active : inactive}`
              }
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z"
                  />
                </svg>
                Home
              </div>
            </NavLink>
            <NavLink
              to="/services"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block ${linkBase} ${isActive ? active : inactive}`
              }
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                Treatments
              </div>
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block ${linkBase} ${isActive ? active : inactive}`
              }
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                About
              </div>
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block ${linkBase} ${isActive ? active : inactive}`
              }
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact
              </div>
            </NavLink>
            <div className="pt-4 border-t border-slate-200 mt-4 space-y-3">
              <div className="flex items-center justify-center">
                <ThemeToggle />
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setBookingOpen(true);
                }}
                className="btn btn-primary w-full justify-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Book now
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80">
      <div className="container-narrow py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} BIB Aesthetics
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href="mailto:info@bibclinic.co.uk"
              className="text-slate-600 hover:text-[color:var(--rose)]"
            >
              info@bibclinic.co.uk
            </a>
            <Link
              to="/privacy"
              className="text-slate-600 hover:text-[color:var(--rose)]"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-slate-600 hover:text-[color:var(--rose)]"
            >
              Terms
            </Link>
            <Link
              to="/cookie-policy"
              className="text-slate-600 hover:text-[color:var(--rose)]"
            >
              Cookies
            </Link>
            <Link
              to="/cancellation-policy"
              className="text-slate-600 hover:text-[color:var(--rose)]"
            >
              Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: false,
    analytics: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      const timeoutId = window.setTimeout(() => setShowBanner(true), 1000);
      return () => window.clearTimeout(timeoutId);
    }

    try {
      const saved = JSON.parse(consent);
      setPreferences(saved);
    } catch {
      setShowBanner(true);
    }
  }, []);

  const savePreferences = (prefs) => {
    localStorage.setItem("cookie_consent", JSON.stringify(prefs));
    localStorage.setItem("cookie_consent_date", new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
    window.location.reload();
  };

  const acceptAll = () => {
    savePreferences({ essential: true, functional: true, analytics: true });
  };

  const acceptEssentialOnly = () => {
    savePreferences({ essential: true, functional: false, analytics: false });
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-rose-500 shadow-2xl z-50 animate-slide-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {!showSettings ? (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🍪</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      We Value Your Privacy
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      We use cookies to enhance your browsing experience,
                      provide personalized content, and analyze our traffic. By
                      clicking "Accept All", you consent to our use of cookies.{" "}
                      <a
                        href="/privacy"
                        className="text-rose-600 hover:text-rose-700 underline"
                      >
                        Privacy Policy
                      </a>
                      {" • "}
                      <a
                        href="/cookie-policy"
                        className="text-rose-600 hover:text-rose-700 underline"
                      >
                        Cookie Policy
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cookie Settings
                </button>
                <button
                  onClick={acceptEssentialOnly}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Essential Only
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-lg transition-all hover:shadow-xl"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close settings"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        Essential Cookies
                      </h4>
                      <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded">
                        Always Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Required for the website to function. These cannot be
                      disabled.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500 opacity-50 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Functional Cookies
                    </h4>
                    <p className="text-sm text-gray-600">
                      Enable enhanced functionality like remembering your
                      preferences and settings.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          functional: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Analytics Cookies
                    </h4>
                    <p className="text-sm text-gray-600">
                      Help us understand how you use our website to improve your
                      experience.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          analytics: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={acceptEssentialOnly}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Essential Only
                </button>
                <button
                  onClick={() => savePreferences(preferences)}
                  className="px-6 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-lg transition-all hover:shadow-xl"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function ReviewsCarousel() {
  useEffect(() => {
    if (window.ElfsightPlatform) {
      window.ElfsightPlatform.init();
    }
  }, []);

  return (
    <section className="pt-1 pb-6 sm:pt-2 sm:pb-8 md:pt-4 md:pb-10 bg-gradient-to-br from-slate-50 to-white">
      <div className="container-narrow">
        <div className="text-center mb-8 sm:mb-10 animate-fade-in-up px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[color:var(--rose)]/10 rounded-full text-xs sm:text-sm font-medium text-[color:var(--rose)] mb-3 sm:mb-4">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Client reviews
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-2 sm:mb-3">
            What our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--rose)] to-[color:var(--rose-dark)]">
              clients
            </span>{" "}
            say
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Real experiences from real clients who've transformed their
            confidence with BIB treatments.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <div
            className="elfsight-app-3831871c-a2e3-419a-b58e-2b08fc2d1c96"
            data-elfsight-app-lazy
            style={{ minHeight: "350px" }}
          >
            <div className="flex items-center justify-center py-8 text-slate-500">
              <svg
                className="w-5 h-5 animate-spin mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Loading Google Reviews...
            </div>
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <a
              href="https://www.google.com/search?q=BIB+Beauty+Clinic+Bolton+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 bg-white border border-slate-200 rounded-full text-sm sm:text-base text-slate-700 hover:border-[color:var(--rose)] hover:text-[color:var(--rose)] transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-medium">Read more reviews on Google</span>
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h2>

            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Refresh Page
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Go to Homepage
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer mb-2">
                  Error Details (Development)
                </summary>
                <div className="bg-gray-50 rounded-lg p-4 text-xs font-mono text-gray-700 overflow-auto max-h-40">
                  <div className="mb-2 font-semibold">Error:</div>
                  <div className="mb-4">{this.state.error.toString()}</div>
                  <div className="mb-2 font-semibold">Stack Trace:</div>
                  <div>{this.state.errorInfo.componentStack}</div>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorBoundary({ children }) {
  return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>;
}

function TreatmentKeyInfo({ keyInfo }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
        Key Information
      </h3>
      <ul className="space-y-2">
        {keyInfo.map((info, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm sm:text-base text-slate-700"
          >
            <svg
              className="w-4 h-4 text-[color:var(--rose)] flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {info}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TreatmentBenefits({ benefits }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
        Benefits
      </h3>
      <ul className="space-y-2">
        {benefits.map((benefit, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm sm:text-base text-slate-700"
          >
            <svg
              className="w-4 h-4 text-[color:var(--rose)] flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TreatmentPlan({ treatmentPlan }) {
  return (
    <div className="bg-[color:var(--rose)]/5 rounded-xl p-4 sm:p-6 border border-[color:var(--rose)]/20">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
        Treatment Plan
      </h3>
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-lg font-semibold text-[color:var(--rose)]">
            {treatmentPlan.sessions}
          </div>
          <div className="text-xs text-slate-600">Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-[color:var(--rose)]">
            {treatmentPlan.interval}
          </div>
          <div className="text-xs text-slate-600">Interval</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-[color:var(--rose)]">
            {treatmentPlan.maintenance}
          </div>
          <div className="text-xs text-slate-600">Maintenance</div>
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  const faqs = Object.values(commonFAQ);

  return (
    <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
        Frequently Asked Questions
      </h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index}>
            <h4 className="font-medium text-slate-900 mb-2">
              {faq.question}
            </h4>
            <p className="text-sm sm:text-base text-slate-700">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TreatmentDetailSection({ serviceName, serviceSlug }) {
  const treatmentContent =
    Object.values(treatmentDetails).find(
      (treatment) =>
        treatment.name.toLowerCase() === serviceName?.toLowerCase() ||
        treatmentDetails[serviceSlug]
    ) || treatmentDetails[serviceSlug];

  if (!treatmentContent) {
    return null;
  }

  return (
    <div className="mt-6 sm:mt-8 space-y-6">
      <div className="prose max-w-none">
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-100">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
            Overview
          </h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {treatmentContent.overview}
          </p>
          {treatmentContent.additionalInfo && (
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">
              {treatmentContent.additionalInfo}
            </p>
          )}
        </div>
      </div>

      {treatmentContent.keyInfo && (
        <TreatmentKeyInfo keyInfo={treatmentContent.keyInfo} />
      )}
      {treatmentContent.benefits && (
        <TreatmentBenefits benefits={treatmentContent.benefits} />
      )}
      {treatmentContent.treatmentPlan && (
        <TreatmentPlan treatmentPlan={treatmentContent.treatmentPlan} />
      )}

      {treatmentContent.suitableFor && (
        <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
            Suitable For
          </h3>
          <ul className="space-y-2">
            {treatmentContent.suitableFor.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm sm:text-base text-slate-700"
              >
                <svg
                  className="w-4 h-4 text-[color:var(--rose)] flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {treatmentContent.aftercare && (
        <div className="bg-amber-50 rounded-xl p-4 sm:p-6 border border-amber-200">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
            Aftercare
          </h3>
          <p className="text-sm sm:text-base text-slate-700">
            {treatmentContent.aftercare}
          </p>
        </div>
      )}

      {treatmentContent.linkedConcerns && (
        <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
            Addresses Concerns
          </h3>
          <div className="flex flex-wrap gap-2">
            {treatmentContent.linkedConcerns.map((concern, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-[color:var(--rose)]/10 text-[color:var(--rose)] text-sm rounded-full"
              >
                {concern}
              </span>
            ))}
          </div>
        </div>
      )}

      <FAQSection />
    </div>
  );
}
