import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const linkBase = "px-3 py-2 rounded-md text-sm font-medium transition";
  const active   = "text-slate-900 bg-white/60";
  const inactive = "text-slate-600 hover:bg-white/60";

  return (
    <header className="sticky top-0 z-40 nav-frosted">
      <div className="container-narrow">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            {/* Logo image */}
            <img
              src="/logo-full-rose.png"
              alt="BIB Clinic logo"
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/book" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>Book</NavLink>
            <a href="/services" className={`${linkBase} ${inactive}`}>Services</a>
            <a href="/about" className={`${linkBase} ${inactive}`}>About</a>
            <NavLink to="/admin/login" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>Admin</NavLink>
            <NavLink to="/book" className="ml-2 btn btn-primary">Book now</NavLink>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-white/60"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" className="fill-slate-700">
              {open
                ? <path d="M18.3 5.71 12 12.01 5.7 5.7 4.29 7.11l6.3 6.3-6.3 6.3 1.41 1.41 6.3-6.3 6.29 6.3 1.42-1.41-6.3-6.3 6.3-6.3z" />
                : <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[color:var(--cream)]/85" style={{ borderTop: "1px solid var(--silver)" }}>
          <nav className="container-narrow py-2 grid gap-1">
            <NavLink to="/contact" onClick={() => setOpen(false)} className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>Contact</NavLink>
            <a href="/#services" onClick={() => setOpen(false)} className={`${linkBase} ${inactive}`}>Services</a>
            <NavLink to="/about" onClick={() => setOpen(false)} className={`${linkBase} ${inactive}`}>About</NavLink>
            <NavLink to="/admin/login" onClick={() => setOpen(false)} className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>Admin</NavLink>
            <NavLink to="/book" onClick={() => setOpen(false)} className="mt-1 btn btn-primary">Book now</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}