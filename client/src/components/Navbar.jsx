import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock scroll when mobile menu open
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
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo-full-rose.png"
              alt="BIB Clinic logo"
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
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
            <Link
              to="/book"
              className="btn btn-primary ml-2 shadow-md hover:shadow-lg"
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
            </Link>
          </nav>

          {/* Mobile toggle */}
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

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden nav-frosted border-t border-[color:var(--rose)]/20 mobile-menu animate-slide-down">
          <nav className="container-narrow py-4 space-y-2">
            <NavLink
              to="/book"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Book
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
            <div className="pt-4 border-t border-slate-200 mt-4">
              <Link
                to="/book"
                onClick={() => setOpen(false)}
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
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
