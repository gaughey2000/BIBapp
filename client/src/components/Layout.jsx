import { Outlet, Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer style={{ borderTop: "1px solid var(--silver)" }}>
        <div className="container-narrow h-16 flex items-center justify-between text-sm text-slate-600">
          <span>© {new Date().getFullYear()} BIB Clinic</span>
          <Link to="/admin/login" className="hover:underline">Admin</Link>
        </div>
      </footer>
    </div>
  );
}