import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; 
import { fetchServices, fetchAvailability, createBooking } from "../api";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function toGBP(cents) {
  const n = Number(cents) || 0;
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n / 100);
}
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Local date helpers
function toYMDLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function ymdToLocalDate(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export default function UserBookingPage() {
  const [searchParams] = useSearchParams();
  const initialServiceId = searchParams.get("serviceId") || "";

  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);    
  const [serviceId, setServiceId] = useState(initialServiceId);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [startsAt, setStartsAt] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const list = await fetchServices();
        if (!cancel) {
          setServices(Array.isArray(list) ? list : []);
          if (initialServiceId && list.some(s => String(s.service_id) === String(initialServiceId))) {
            setServiceId(String(initialServiceId));
          }
        }
      } catch (e) {
        if (!cancel) setErr(e.message || "Failed to load services");
      }
    })();
    return () => { cancel = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialServiceId]);

  async function loadAvailability() {
    setErr("");
    setSlots([]);
    setStartsAt("");
    if (!serviceId || !date) return;
    setLoading(true);
    try {
      // ✅ FIX: pass an object, not positional args
      const data = await fetchAvailability({ serviceId: Number(serviceId), date });
      setSlots(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr("Failed to load availability");
    } finally {
      setLoading(false);
    }
  }

  async function submitBooking(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const payload = {
        service_id: Number(serviceId),
        client_name: name,
        client_email: email,
        client_phone: phone,
        starts_at: startsAt, // UTC ISO from API
      };
      const data = await createBooking(payload);
      setResult(data);
      setStep(4);
    } catch (e) {
      const msg = e?.response?.data?.error || e.message || "Booking failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  if (step === 4 && result) {
    return (
      <div className="container-narrow py-10">
        <div className="max-w-xl mx-auto card p-6">
          <h1 className="text-2xl font-semibold tracking-tight">Booking confirmed ✅</h1>
          <p className="mt-3"><b>Starts:</b> {new Date(result.starts_at).toLocaleString("en-GB")}</p>
          <p className="mt-1"><b>Ends:</b> {new Date(result.ends_at).toLocaleString("en-GB")}</p>
          <p className="mt-4 text-sm text-slate-600"><b>Your cancel token (save this):</b></p>
          <code className="mt-2 block rounded-lg bg-white/70 px-3 py-2 overflow-x-auto" style={{ border: "1px solid var(--silver)" }}>
            {result.cancel_token}
          </code>
        </div>
      </div>
    );
  }

  const serviceList = Array.isArray(services) ? services : [];

  return (
    <div className="container-narrow py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Book an appointment</h1>
      {err && (
        <div className="mt-3 card p-3 text-sm text-red-700 bg-red-50/70">
          {err}
        </div>
      )}

      {/* Step 1: pick service */}
      <section className="mt-6 card p-5">
        <h2 className="text-xl font-semibold tracking-tight">1) Choose a service</h2>
        <div className="mt-3 flex items-center gap-3">
          <select
            className="w-full rounded-lg px-3 py-2 bg-white/70 outline-none focus:ring-2 ring-rose-300"
            style={{ border: "1px solid var(--silver)" }}
            value={serviceId}
            onChange={e => setServiceId(e.target.value)}
          >
            <option value="">-- select --</option>
            {serviceList.map(s => (
              <option key={s.service_id} value={s.service_id}>
                {s.name} — {toGBP(s.price_cents)} — {s.duration_min} min
              </option>
            ))}
          </select>
          <button
            disabled={!serviceId}
            onClick={() => setStep(2)}
            className="btn btn-primary disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </section>

      {/* Step 2: date → time */}
      {step >= 2 && (
        <section className="mt-6 card p-5">
          <h2 className="text-xl font-semibold tracking-tight">2) Pick date & time</h2>

          <div className="mt-3">
            <DayPicker
              mode="single"
              selected={date ? ymdToLocalDate(date) : undefined}
              onSelect={(d) => {
                const ymd = d ? toYMDLocal(d) : "";
                setDate(ymd);
                setStartsAt("");
                setSlots([]);
              }}
              disabled={{ dayOfWeek: [0] }} // Sunday closed
              fromDate={new Date()}
            />
          </div>

          <button
            onClick={loadAvailability}
            disabled={!date}
            className="mt-3 btn btn-ghost disabled:opacity-60"
          >
            Load times
          </button>

          {loading && <p className="mt-2 text-slate-600">Loading…</p>}

          {!!slots.length && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {slots.map(iso => (
                <button
                  key={iso}
                  onClick={() => setStartsAt(iso)}
                  className={`btn ${startsAt === iso ? "ring-2" : "btn-ghost"}`}
                  style={{ boxShadow: startsAt === iso ? "0 0 0 2px rgba(183,110,121,.4)" : undefined }}
                >
                  {formatTime(iso)}
                </button>
              ))}
            </div>
          )}

          {!loading && date && slots.length === 0 && (
            <p className="mt-2 text-slate-600">No slots for this date.</p>
          )}

          <div className="mt-3">
            <button
              disabled={!startsAt}
              onClick={() => setStep(3)}
              className="btn btn-primary disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </section>
      )}

      {/* Step 3: details */}
      {step >= 3 && (
        <section className="mt-6 card p-5">
          <h2 className="text-xl font-semibold tracking-tight">3) Your details</h2>
          <form onSubmit={submitBooking} className="mt-3">
            <div className="grid gap-3">
              <input
                required
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="rounded-lg px-3 py-2 bg-white/70 outline-none focus:ring-2 ring-rose-300"
                style={{ border: "1px solid var(--silver)" }}
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="rounded-lg px-3 py-2 bg-white/70 outline-none focus:ring-2 ring-rose-300"
                style={{ border: "1px solid var(--silver)" }}
              />
              <input
                placeholder="Phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="rounded-lg px-3 py-2 bg-white/70 outline-none focus:ring-2 ring-rose-300"
                style={{ border: "1px solid var(--silver)" }}
              />
            </div>
            <button
              type="submit"
              disabled={!name || !email || !startsAt || loading}
              className="mt-3 btn btn-primary disabled:opacity-60"
            >
              {loading ? "Submitting…" : "Confirm booking"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}