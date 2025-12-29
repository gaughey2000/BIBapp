import { Link } from "react-router-dom";

export default function Footer() {
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
          </div>
        </div>
      </div>
    </footer>
  );
}
