// client/src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { whoAmI, adminLogout, fetchAdminBookings, adminCancel } from "../api";

export default function AdminDashboard() {
  const [me, setMe] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const m = await whoAmI();                 // 401 if not signed in
        if (!alive) return;
        setMe(m);

        const list = await fetchAdminBookings();  // optional { from, to }
        if (!alive) return;
        setRows(Array.isArray(list) ? list : []);
      } catch (e) {
        // If unauthorized, bounce to login and remember where we were
        const msg = (e && e.message) || "";
        if (msg.includes("HTTP 401")) {
          navigate("/admin/login", { replace: true, state: { from: location } });
          return;
        }
        setErr("Failed to load admin data.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [navigate, location]);

  async function onLogout() {
    try {
      await adminLogout();
    } finally {
      navigate("/admin/login", { replace: true });
    }
  }

  async function onCancel(id) {
    try {
      await adminCancel(id);
      setRows(prev => prev.map(r => r.booking_id === id ? { ...r, status: "cancelled" } : r));
    } catch {
      alert("Cancel failed");
    }
  }

  return (
    <div className="container-narrow py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <div className="flex items-center gap-3">
          {me && (
            <span className="text-sm text-slate-600">
              {me.email} <span className="opacity-60">({me.role})</span>
            </span>
          )}
          <button className="btn btn-ghost" onClick={onLogout}>Log out</button>
        </div>
      </div>

      {err && (
        <div className="mt-4 card p-4 text-sm text-red-700 bg-red-50/70">
          {err}
        </div>
      )}

      {loading ? (
        <div className="mt-6 card p-5">
          <p>Loading…</p>
        </div>
      ) : (
        <div className="mt-6 card p-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[color:var(--silver)]">
                <th className="py-2 pr-4">When</th>
                <th className="py-2 pr-4">Service</th>
                <th className="py-2 pr-4">Client</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.booking_id} className="border-b border-[color:var(--silver)] last:border-0">
                  <td className="py-2 pr-4">{new Date(r.starts_at).toLocaleString("en-GB")}</td>
                  <td className="py-2 pr-4">{r.service?.name || "-"}</td>
                  <td className="py-2 pr-4">
                    {r.client_name}
                    {r.client_email ? ` (${r.client_email})` : ""}
                    {r.client_phone ? ` · ${r.client_phone}` : ""}
                  </td>
                  <td className="py-2 pr-4 capitalize">{r.status}</td>
                  <td className="py-2 text-right">
                    {r.status !== "cancelled" && (
                      <button className="btn btn-ghost" onClick={() => onCancel(r.booking_id)}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No bookings in range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}