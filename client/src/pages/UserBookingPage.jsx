import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { fetchServices, fetchAvailability, createBooking } from "../api";

export default function UserBookingPage() {
  const [params, setParams] = useSearchParams();

  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState(() => {
    const initial = Number(params.get("serviceId"));
    return Number.isInteger(initial) ? initial : 0;
  });

  const [date, setDate] = useState(() => {
    const d = params.get("date");
    return d ? new Date(d) : undefined;
  });

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");

  // load services
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await fetchServices();
        if (mounted) setServices(rows);
      } catch {
        setError("Failed to load services");
      }
    })();
    return () => { mounted = false; };
  }, []);

  // update URL
  useEffect(() => {
    const u = new URLSearchParams(params);
    if (serviceId) u.set("serviceId", String(serviceId)); else u.delete("serviceId");
    if (date) u.set("date", date.toISOString().slice(0,10)); else u.delete("date");
    setParams(u, { replace: true });
  }, [serviceId, date]); // eslint-disable-line react-hooks/exhaustive-deps

  // fetch slots
  useEffect(() => {
    if (!serviceId || !date) { setSlots([]); return; }
    let mounted = true;
    (async () => {
      setLoadingSlots(true);
      setError("");
      try {
        const isoDate = date.toISOString().slice(0,10); // yyyy-mm-dd
        const times = await fetchAvailability(serviceId, isoDate);
        if (!mounted) return;
        setSlots(times);
      } catch {
        setError("Failed to fetch availability");
      } finally {
        if (mounted) setLoadingSlots(false);
      }
    })();
    return () => { mounted = false; };
  }, [serviceId, date]);

  async function handleCreate(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name  = fd.get("name");
    const email = fd.get("email");
    const phone = fd.get("phone");
    const starts_at = fd.get("starts_at"); // UTC ISO from select

    if (!serviceId || !starts_at) { setError("Pick a service, date & time"); return; }
    try {
      await createBooking({
        service_id: serviceId,
        client_name: name,
        client_email: email,
        client_phone: phone || undefined,
        starts_at
      });
      alert("Booking created! Check your email.");
      setSlots([]);
    } catch (e) {
      setError(e?.response?.data?.error || "Booking failed");
    }
  }

  const timesByLocal = useMemo(() => {
    return slots.map(iso => {
      // show user’s local time nicely
      const d = new Date(iso);
      const label = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return { iso, label };
    });
  }, [slots]);

  return (
    <div className="container">
      <h1>Book an appointment</h1>

      {error && <p className="error">{error}</p>}

      <div className="row gap">
        <div className="card">
          <label>
            Service
            <select value={serviceId} onChange={e => setServiceId(Number(e.target.value))}>
              <option value={0}>Select…</option>
              {services.map(s => (
                <option key={s.service_id} value={s.service_id}>{s.name}</option>
              ))}
            </select>
          </label>

          <div className="mt">
            <DayPicker mode="single" selected={date} onSelect={setDate} />
          </div>

          <div className="mt">
            <h3>Available times</h3>
            {loadingSlots && <p>Loading…</p>}
            {!loadingSlots && !timesByLocal.length && <p>No times for that day.</p>}
            <ul className="list">
              {timesByLocal.map(t => (
                <li key={t.iso}>
                  <button type="button" onClick={() => setParams(p => { p.set("starts_at", t.iso); return p; })}>
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form className="card" onSubmit={handleCreate}>
          <h3>Your details</h3>
          <div className="grid-2">
            <label>Name<input name="name" required /></label>
            <label>Email<input name="email" type="email" required /></label>
            <label>Phone<input name="phone" /></label>
          </div>

          <input type="hidden" name="starts_at" value={params.get("starts_at") || ""} />

          <button className="btn btn-primary" disabled={!params.get("starts_at") || !serviceId}>
            Confirm booking
          </button>
        </form>
      </div>
    </div>
  );
}