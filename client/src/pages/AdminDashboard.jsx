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
import { useAuth } from "../auth/useAuth";
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
  const [loading, setLoading] = useState(true);

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
    let mounted = true;
    (async () => {
      try {
        const m = await whoAmI();
        if (!mounted) return;
        setMe(m);
        const [bookings, blackouts] = await Promise.all([
          fetchAdminBookings(),
          adminListBlackouts(),
        ]);
        if (!mounted) return;
        setRows(bookings);
        setBos(blackouts.slice().sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at)));
      } catch {
        nav("/admin/login");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [nav]);

  async function doLogout() {
    try {
      await adminLogout();
    } finally {
      setAuthed?.(false);
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

      setBos((b) => [...b, created].sort((a, bb) => new Date(a.starts_at) - new Date(bb.starts_at)));
      setReason("");
      if (wholeDay) setEndDate(sd);
    } catch (e2) {
      setBErr(e2?.response?.data?.error || e2.message || "Failed to create blackout");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-[color:var(--cream)]">
      <div className="container-narrow py-8">
        {/* Header */}
        <div className="card-elevated p-6 mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">Manage bookings and availability</p>
            </div>
            <div className="flex items-center gap-4">
              {me && (
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-700">Welcome back</div>
                  <div className="text-sm text-slate-500">{me.email}</div>
                </div>
              )}
              <button 
                onClick={doLogout} 
                className="btn btn-secondary group"
              >
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {err && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fade-in-up">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {err}
              </div>
            </div>
          )}
        </div>

        {/* Bookings table */}
        <div className="card-elevated p-6 mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Recent Bookings</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-slate-500">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-[color:var(--rose)] rounded-full animate-spin"></div>
                Loading bookings...
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Client</th>
                    <th>Schedule</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.booking_id}>
                      <td>
                        <div className="font-medium text-slate-900">{r.service?.name}</div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          <div className="font-medium text-slate-900">{r.client_name}</div>
                          <div className="text-xs text-slate-500">
                            {r.client_email}
                            {r.client_phone && (
                              <>
                                <span className="mx-1">•</span>
                                {r.client_phone}
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-slate-900">{fmt(r.starts_at)}</div>
                          <div className="text-xs text-slate-500">to {fmt(r.ends_at)}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge status-${r.status}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        {r.status === "confirmed" ? (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={async () => {
                              if (!confirm("Are you sure you want to cancel this booking?")) return;
                              try {
                                await adminCancel(r.booking_id);
                                setRows(rows => rows.map(row => 
                                  row.booking_id === r.booking_id 
                                    ? { ...row, status: "cancelled" }
                                    : row
                                ));
                              } catch (e) {
                                setErr(e.message || "Failed to cancel booking");
                              }
                            }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </button>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-12">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <svg className="w-12 h-12 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p>No bookings found</p>
                          <p className="text-sm">New bookings will appear here</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
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
            selectable
            selectMirror
            longPressDelay={0}
            events={[
              ...rows.map((r) => ({
                id: r.booking_id,
                title: `${r.service?.name} — ${r.client_name}`,
                start: r.starts_at,
                end: r.ends_at,
                color: "#0b82f0",
              })),
              ...bos.map((b) => ({
                id: `bo-${b.id}`,
                title: b.reason || "Blackout",
                start: b.starts_at,
                end: b.ends_at,
                color: "#c62828",
              })),
            ]}
            selectAllow={(info) => info.start >= new Date(new Date().toDateString())}
            select={async (info) => {
              const ok = confirm(
                `Create blackout from ${info.start.toLocaleString("en-GB")} to ${info.end.toLocaleString("en-GB")}?`
              );
              if (!ok) return;
              try {
                const created = await adminCreateBlackout({
                  starts_at: info.start.toISOString(),
                  ends_at: info.end.toISOString(),
                  reason: "Blocked from calendar",
                });
                setBos((b) =>
                  [...b, created].sort((a, bb) => new Date(a.starts_at) - new Date(bb.starts_at))
                );
              } catch {
                alert("Failed to create blackout");
              }
            }}
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