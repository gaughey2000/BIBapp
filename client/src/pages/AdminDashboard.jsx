import { useEffect, useState } from "react";
import {
  whoAmI,
  fetchAdminBookings,
  adminCancel,
  adminLogout,
  adminListBlackouts,
  adminCreateBlackout,
  adminDeleteBlackout,
} from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function fmt(dt) {
  return new Date(dt).toLocaleString("en-GB");
}

export default function AdminDashboard() {
  const nav = useNavigate();
  const { setAuthed } = useAuth();

  // Auth / status
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");

  // Bookings
  const [rows, setRows] = useState([]);

  // Blackouts
  const [bos, setBos] = useState([]);
  const [bErr, setBErr] = useState("");
  const [bLoading, setBLoading] = useState(false);

  // Blackout form
  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("17:00");
  const [reason, setReason] = useState("");
  const [wholeDay, setWholeDay] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const m = await whoAmI();
        setMe(m);
        const [bookings, blackouts] = await Promise.all([
          fetchAdminBookings(),
          adminListBlackouts(),
        ]);
        setRows(bookings);
        setBos(
          blackouts.slice().sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
        );
      } catch {
        nav("/admin/login");
      }
    })();
  }, [nav]);

  async function doCancel(id) {
    try {
      await adminCancel(id);
      setRows((r) =>
        r.map((x) => (x.booking_id === id ? { ...x, status: "cancelled" } : x))
      );
    } catch {
      setErr("Cancel failed");
    }
  }

  async function doLogout() {
    try {
      await adminLogout();
    } finally {
      setAuthed(false);
      nav("/admin/login", { replace: true });
    }
  }

  async function createBlackout(e) {
    e?.preventDefault?.();
    setBErr("");

    try {
      if (!startDate) throw new Error("Pick a start date");

      const sd = startDate;
      const ed = wholeDay ? startDate : endDate;
      const st = wholeDay ? "00:00" : (startTime || "00:00");
      const et = wholeDay ? "23:59" : (endTime || "23:59");

      if (!ed) throw new Error("Pick an end date");

      const starts_at = new Date(`${sd}T${st}:00`);
      const ends_at = new Date(`${ed}T${et}:00`);
      if (!(starts_at < ends_at)) throw new Error("End must be after start");

      setBLoading(true);
      const created = await adminCreateBlackout({
        starts_at: starts_at.toISOString(),
        ends_at: ends_at.toISOString(),
        reason: reason || undefined,
      });

      setBos((b) =>
        [...b, created].sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
      );
      // keep inputs so you can add multiple; clear reason
      setReason("");
      if (wholeDay) setEndDate(sd);
    } catch (e) {
      setBErr(e?.response?.data?.error || e.message || "Failed to create blackout");
    } finally {
      setBLoading(false);
    }
  }

  async function deleteBlackout(id) {
    try {
      await adminDeleteBlackout(id);
      setBos((b) => b.filter((x) => x.id !== id));
    } catch {
      setBErr("Delete failed");
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin — Bookings</h1>
        <div>
          {me && <span style={{ marginRight: 12 }}>Signed in as <b>{me.email}</b></span>}
          <button onClick={doLogout}>Logout</button>
        </div>
      </div>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {/* Bookings table */}
      <table border="1" cellPadding="6" style={{ marginTop: 12, width: "100%" }}>
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
          {rows.map((r) => (
            <tr key={r.booking_id}>
              <td>{r.service?.name}</td>
              <td>
                {r.client_name}
                <br />
                <small>
                  {r.client_email}
                  {r.client_phone ? ` • ${r.client_phone}` : ""}
                </small>
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
            <tr>
              <td colSpan="6">No bookings yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      <section style={{ marginTop: 24 }}>
  <h2>Calendar</h2>
  <p style={{ marginTop: 4 }}>
    <span style={{ display:"inline-block", width:12, height:12, background:"#0b82f0", marginRight:6 }} /> Bookings
    <span style={{ display:"inline-block", width:12, height:12, background:"#c62828", margin:"0 6px 0 16px" }} /> Blackouts
  </p>

  <div style={{ marginTop: 8 }}>
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      height="auto"
      selectable={true}
      selectMirror={true}
      longPressDelay={0}
      // convert your rows/bos to events
      events={[
        ...rows.map(r => ({
          id: r.booking_id,
          title: `${r.service?.name} — ${r.client_name}`,
          start: r.starts_at, end: r.ends_at,
          color: "#0b82f0"
        })),
        ...bos.map(b => ({
          id: `bo-${b.id}`,
          title: b.reason || "Blackout",
          start: b.starts_at, end: b.ends_at,
          color: "#c62828"
        }))
      ]}
      // Drag to select a range to create a blackout
      select={async (info) => {
        // info.start/ end are JS Dates in local time
        const ok = confirm(
          `Create blackout from ${info.start.toLocaleString("en-GB")} to ${info.end.toLocaleString("en-GB")}?`
        );
        if (!ok) return;
        try {
          const created = await adminCreateBlackout({
            starts_at: info.start.toISOString(),
            ends_at: info.end.toISOString(),
            reason: "Blocked from calendar"
          });
          setBos(b => [...b, created].sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at)));
        } catch (e) {
          alert("Failed to create blackout");
        }
      }}
      // Disable selecting past days
      selectAllow={(selectInfo) => selectInfo.start >= new Date(new Date().toDateString())}
      // Simple styling hook
      eventDisplay="block"
    />
  </div>
</section>

      <hr style={{ margin: "24px 0" }} />

      {/* Blackouts manager */}
      <section>
        <h2>Schedule — Blackouts</h2>
        {bErr && <p style={{ color: "crimson" }}>{bErr}</p>}

        <form
          onSubmit={createBlackout}
          style={{ display: "grid", gap: 8, maxWidth: 620, marginTop: 8 }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={wholeDay}
              onChange={(e) => {
                const chk = e.target.checked;
                setWholeDay(chk);
                if (chk && startDate) setEndDate(startDate);
              }}
            />
            Block whole day
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <label>
              Start date
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (wholeDay) setEndDate(e.target.value);
                }}
              />
            </label>
            <label>
              Start time
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={wholeDay}
              />
            </label>
            <label>
              End date
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={wholeDay}
              />
            </label>
            <label>
              End time
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={wholeDay}
              />
            </label>
          </div>

          <input
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div>
            <button type="submit" disabled={bLoading}>
              {bLoading ? "Saving…" : "Add blackout"}
            </button>
          </div>
        </form>

        <table border="1" cellPadding="6" style={{ marginTop: 12, width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Starts</th>
              <th>Ends</th>
              <th>Reason</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bos.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{fmt(b.starts_at)}</td>
                <td>{fmt(b.ends_at)}</td>
                <td>{b.reason || "-"}</td>
                <td>
                  <button onClick={() => deleteBlackout(b.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {bos.length === 0 && (
              <tr>
                <td colSpan="5">No blackouts</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}