import { useEffect, useState } from "react";
import { whoAmI, adminLogout, fetchAdminBookings, adminCancel } from "../api";

export default function AdminDashboard() {
  const [me, setMe]             = useState(null);
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const m = await whoAmI();
        if (!mounted) return;
        setMe(m);
        const list = await fetchAdminBookings();
        if (!mounted) return;
        setRows(list);
      } catch (e) {
        setError("Unauthorized or failed to load.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function onLogout() {
    await adminLogout();
    location.href = "/admin/login";
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
    <div className="container">
      <h1>Admin</h1>
      {me && <p>Signed in as <strong>{me.email}</strong> ({me.role})</p>}
      <button className="btn" onClick={onLogout}>Log out</button>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}

      <table className="mt">
        <thead>
          <tr>
            <th>When</th>
            <th>Service</th>
            <th>Client</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.booking_id}>
              <td>{new Date(r.starts_at).toLocaleString()}</td>
              <td>{r.service?.name || "-"}</td>
              <td>{r.client_name} ({r.client_email})</td>
              <td>{r.status}</td>
              <td>
                {r.status !== "cancelled" &&
                  <button className="btn" onClick={() => onCancel(r.booking_id)}>Cancel</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}