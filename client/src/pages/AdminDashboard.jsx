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
    <div className="container-narrow py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Admin — Bookings</h1>
        <div className="flex items-center gap-3">
          {me && (
            <span className="text-slate-600">
              Signed in as <b>{me.email}</b>
            </span>
          )}
          <button onClick={doLogout} className="btn btn-ghost">Logout</button>
        </div>
      </div>

      {err && (
        <div className="mt-3 card p-3 text-sm text-red-700 bg-red-50/70">
          {err}
        </div>
      )}

      {/* Bookings table */}
      <div className="card p-4 mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-600">
            <tr className="[&_th]:py-2 [&_th]:pr-3">
              <th>Service</th>
              <th>Client</th>
              <th>Starts</th>
              <th>Ends</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="[&_td]:py-2 [&_td]:pr-3">
            {rows.map((r) => (
              <tr key={r.booking_id} className="border-t" style={{ borderColor: "var(--silver)" }}>
                <td>{r.service?.name}</td>
                <td>
                  <div>{r.client_name}</div>
                  <div className="text-xs text-slate-600">
                    {r.client_email}
                    {r.client_phone ? ` • ${r.client_phone}` : ""}
                  </div>
                </td>
                <td>{fmt(r.starts_at)}</td>
                <td>{fmt(r.ends_at)}</td>
                <td className="capitalize">{r.status}</td>
                <td>
                  {r.status === "confirmed" ? (
                    <button onClick={() => doCancel(r.booking_id)} className="btn btn-ghost">
                      Cancel
                    </button>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan="6" className="py-3 text-slate-600">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Calendar */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold tracking-tight">Calendar</h2>
        <p className="mt-1 text-sm text-slate-600">
          <span className="inline-block w-3 h-3 align-middle mr-1" style={{ background: "#0b82f0" }} /> Bookings
          <span className="inline-block w-3 h-3 align-middle mx-4" style={{ background: "#c62828" }} /> Blackouts
        </p>

        <div className="card p-3 mt-2">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            selectable={true}
            selectMirror={true}
            longPressDelay={0}
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
            select={async (info) => {
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
            selectAllow={(selectInfo) => selectInfo.start >= new Date(new Date().toDateString())}
            eventDisplay="block"
          />
        </div>
      </section>

      {/* Blackouts manager */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold tracking-tight">Schedule — Blackouts</h2>
        {bErr && (
          <div className="mt-2 card p-3 text-sm text-red-700 bg-red-50/70">
            {bErr}
          </div>
        )}

        <form onSubmit={createBlackout} className="mt-3 card p-4 grid gap-3 max-w-xl">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={wholeDay}
              onChange={(e) => {
                const chk = e.target.checked;
                setWholeDay(chk);
                if (chk && startDate) setEndDate(startDate);
              }}
            />
            <span>Block whole day</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-sm text-slate-700">Start date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (wholeDay) setEndDate(e.target.value);
                }}
                className="rounded-lg px-3 py-2 bg-white/70 outline-none focus:ring-2 ring-rose-300"
                style={{ border: "1px solid var(--silver)" }}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-slate-700">Start time</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={wholeDay}
                className="rounded-lg px-3 py-2 bg-white/70 outline-none disabled:opacity-60 focus:ring-2 ring-rose-300"
                style={{ border: "1px solid var(--silver)" }}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-slate-700">End date</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={wholeDay}
                className="rounded-lg px-3 py-2 bg-white/70 outline-none disabled:opacity-60 focus:ring-2 ring-rose-300"
                style={{ border: "1px solid var(--silver)" }}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-slate-700">End time</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={wholeDay}
                className="rounded-lg px-3 py-2 bg-white/70 outline-none disabled:opacity-60 focus:ring-2 ring-rose-300"
                style={{ border: "1px solid var(--silver)" }}
              />
            </label>
          </div>

          <input
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="rounded-lg px-3 py-2 bg-white/70 outline-none focus:ring-2 ring-rose-300"
            style={{ border: "1px solid var(--silver)" }}
          />
          <div>
            <button type="submit" disabled={bLoading} className="btn btn-primary">
              {bLoading ? "Saving…" : "Add blackout"}
            </button>
          </div>
        </form>

        <div className="card p-4 mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-600">
              <tr className="[&_th]:py-2 [&_th]:pr-3">
                <th>ID</th>
                <th>Starts</th>
                <th>Ends</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="[&_td]:py-2 [&_td]:pr-3">
              {bos.map((b) => (
                <tr key={b.id} className="border-t" style={{ borderColor: "var(--silver)" }}>
                  <td>{b.id}</td>
                  <td>{fmt(b.starts_at)}</td>
                  <td>{fmt(b.ends_at)}</td>
                  <td>{b.reason || "-"}</td>
                  <td>
                    <button onClick={() => deleteBlackout(b.id)} className="btn btn-ghost">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {bos.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-3 text-slate-600">No blackouts</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}