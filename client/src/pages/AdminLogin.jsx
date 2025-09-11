import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr]           = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await adminLogin(email, password);
      nav("/admin");
    } catch (e) {
      setErr(e?.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="container">
      <h1>Admin Login</h1>
      {err && <p className="error">{err}</p>}
      <form className="card" onSubmit={onSubmit}>
        <label>Email<input value={email} onChange={e => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
        <button className="btn btn-primary">Sign in</button>
      </form>
    </div>
  );
}