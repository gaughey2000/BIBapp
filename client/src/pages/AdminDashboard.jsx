import { useEffect, useState } from "react";
import { whoAmI, fetchAdminBookings, adminCancel, adminLogout } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function fmt(dt) {
  return new Date(dt).toLocaleString("en-GB");
}

export default function AdminDashboard() {
  const nav = useNavigate();
  const { setAuthed } = useAuth();
  const [me, setMe] = useState(null);
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const m = await whoAmI();
        setMe(m);
        const data = await fetchAdminBookings();
        setRows(data);
      } catch {
        nav("/admin/login");
      }
    })();
  }, [nav]);

  async function doCancel(id) {
    try {
      await adminCancel(id);
      setRows(r => r.map(x => x.booking_id === id ? { ...x, status: "cancelled" } : x));
    } catch {
      setErr("Cancel failed");
    }
  }

  async function doLogout() {
    try {
      await adminLogout();
    } finally {
      setAuthed(false);         // clear in-memory auth
      nav("/admin/login", { replace: true });
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin — Bookings</h1>
        <div>
          {me && <span style={{ marginRight: 12 }}>Signed in as <b>{me.email}</b></span>}
          <button onClick={doLogout}>Logout</button>
        </div>
      </div>

      {err && <p style={{ color:"crimson" }}>{err}</p>}

      <table border="1" cellPadding="6" style={{ marginTop: 12, width:"100%" }}>
        <thead>
          <tr>
            <th>Service</th>
            <th>Client</th>
            <th>Starts</th>
            <th>Ends</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.booking_id}>
              <td>{r.service?.name}</td>
              <td>
                {r.client_name}<br/>
                <small>{r.client_email}{r.client_phone ? ` • ${r.client_phone}` : ""}</small>
              </td>
              <td>{fmt(r.starts_at)}</td>
              <td>{fmt(r.ends_at)}</td>
              <td>{r.status}</td>
              <td>
                {r.status === "confirmed" ? (
                  <button onClick={() => doCancel(r.booking_id)}>Cancel</button>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan="6">No bookings yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}