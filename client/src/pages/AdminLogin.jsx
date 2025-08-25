import { useState } from "react";
import { adminLogin } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminLogin() {
  const nav = useNavigate();
  const { setAuthed } = useAuth();
  const [email, setEmail] = useState("admin@clinic.local");
  const [password, setPassword] = useState("changeme123");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await adminLogin(email, password); // sets httpOnly cookie server-side
      setAuthed(true);                   // in-memory flag (we require login each session)
      nav("/admin", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-narrow py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight">Admin login</h1>
        <p className="mt-1 text-sm text-slate-600">
          Sign in to manage bookings and schedule blackouts.
        </p>

        {err && (
          <div className="mt-4 card p-3 text-sm text-red-700 bg-red-50/70">
            {err}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 card p-6 grid gap-4">
          <label className="grid gap-1">
            <span className="text-sm text-slate-700">Email</span>
            <input
              className="w-full rounded-lg px-3 py-2 bg-white/70 outline-none focus:ring-2 ring-offset-0 ring-rose-300"
              style={{ border: "1px solid var(--silver)" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="username"
              inputMode="email"
              type="email"
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-slate-700">Password</span>
            <input
              className="w-full rounded-lg px-3 py-2 bg-white/70 outline-none focus:ring-2 ring-offset-0 ring-rose-300"
              style={{ border: "1px solid var(--silver)" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm hover:underline" style={{ color: "var(--rose)" }}>
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}