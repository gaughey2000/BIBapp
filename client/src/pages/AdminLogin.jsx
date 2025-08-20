import { useState } from "react";
import { adminLogin } from "../api";
import { useNavigate } from "react-router-dom";
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
      setAuthed(true);                   // in-memory flag → lost on refresh
      nav("/admin", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h1>Admin Login</h1>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="username"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}