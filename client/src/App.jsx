import { useEffect, useState } from "react";
import { fetchServices, fetchAvailability, createBooking } from "./api";

function toGBP(cents) {
  return (cents / 100).toFixed(2);
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function App() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [startsAt, setStartsAt] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // load services
  useEffect(() => {
    fetchServices().then(setServices).catch(e => setErr(e.message));
  }, []);

  async function loadAvailability() {
    setErr("");
    setSlots([]);
    setStartsAt("");
    if (!serviceId || !date) return;
    setLoading(true);
    try {
      const data = await fetchAvailability(serviceId, date);
      setSlots(data);
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
        starts_at: startsAt // already UTC ISO from API
      };
      const data = await createBooking(payload);
      setResult(data);
      setStep(4);
    } catch (e) {
      const msg = e?.response?.data?.error || "Booking failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  if (step === 4 && result) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Booking confirmed ✅</h1>
        <p><b>Starts:</b> {new Date(result.starts_at).toLocaleString("en-GB")}</p>
        <p><b>Ends:</b> {new Date(result.ends_at).toLocaleString("en-GB")}</p>
        <p><b>Your cancel token (save this):</b></p>
        <code>{result.cancel_token}</code>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h1>BIB — Book an appointment</h1>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {/* Step 1: pick service */}
      <section style={{ marginTop: 16, border: "1px solid #eee", padding: 12 }}>
        <h2>1) Choose a service</h2>
        <select value={serviceId} onChange={e => setServiceId(e.target.value)}>
          <option value="">-- select --</option>
          {services.map(s => (
            <option key={s.service_id} value={s.service_id}>
              {s.name} — £{toGBP(s.price_cents)} — {s.duration_min} min
            </option>
          ))}
        </select>
        <button disabled={!serviceId} style={{ marginLeft: 8 }} onClick={() => setStep(2)}>Next</button>
      </section>

      {/* Step 2: date → time */}
      {step >= 2 && (
        <section style={{ marginTop: 16, border: "1px solid #eee", padding: 12 }}>
          <h2>2) Pick date & time</h2>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <button onClick={loadAvailability} style={{ marginLeft: 8 }}>Load times</button>
          {loading && <p>Loading…</p>}
          {!!slots.length && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
              {slots.map(iso => (
                <button
                  key={iso}
                  onClick={() => setStartsAt(iso)}
                  style={{
                    padding: 8,
                    border: startsAt === iso ? "2px solid #000" : "1px solid #ccc",
                    borderRadius: 6
                  }}
                >
                  {formatTime(iso)}
                </button>
              ))}
            </div>
          )}
          {!loading && slots.length === 0 && date && <p>No slots for this date.</p>}
          <div style={{ marginTop: 8 }}>
            <button disabled={!startsAt} onClick={() => setStep(3)}>Next</button>
          </div>
        </section>
      )}

      {/* Step 3: details */}
      {step >= 3 && (
        <section style={{ marginTop: 16, border: "1px solid #eee", padding: 12 }}>
          <h2>3) Your details</h2>
          <form onSubmit={submitBooking}>
            <div style={{ display: "grid", gap: 8 }}>
              <input required placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
              <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <button type="submit" disabled={!name || !email || !startsAt} style={{ marginTop: 12 }}>
              {loading ? "Submitting…" : "Confirm booking"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}