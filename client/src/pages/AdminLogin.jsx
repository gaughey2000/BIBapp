import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { adminLogin } from "../api";
import { useAuth } from "../auth/useAuth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { refetchMe } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await adminLogin({ email, password }); 
      await refetchMe();
      const dest = location.state?.from?.pathname || "/admin";
      navigate(dest, { replace: true });
    } catch (e) {
      const msg = e?.response?.data?.error || e.message || "Login failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 card">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Admin Login
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="admin-email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg px-3 py-2 bg-white/70 border border-[color:var(--silver)] outline-none focus:ring-2 ring-rose-300"
          />
        </div>

        <div>
          <label htmlFor="admin-password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg px-3 py-2 bg-white/70 border border-[color:var(--silver)] outline-none focus:ring-2 ring-rose-300"
          />
        </div>

        {err && <div className="text-red-600">{err}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}