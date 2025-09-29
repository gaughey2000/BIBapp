import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchServices, fetchAvailability, createBooking } from "../api";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

// ---- helpers ----
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

const STORAGE_KEY = "policyAcceptedV1";

export default function UserBookingPage() {
  const [searchParams] = useSearchParams();
  const initialServiceId = searchParams.get("serviceId") || "";

  // Policy popup state (remembered)
  const [policyAccepted, setPolicyAccepted] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "1"
  );

  // Booking flow state
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

  // Scroll lock while popup is open
  useEffect(() => {
    document.body.style.overflow = policyAccepted ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [policyAccepted]);

  const acceptPolicy = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setPolicyAccepted(true);
  };

  // Load services
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const list = await fetchServices();
        if (!cancel) {
          const safe = Array.isArray(list) ? list : [];
          setServices(safe);
          if (initialServiceId && safe.some(s => String(s.service_id) === String(initialServiceId))) {
            setServiceId(String(initialServiceId));
          }
        }
      } catch (e) {
        if (!cancel) setErr(e?.message || "Failed to load services");
      }
    })();
    return () => {
      cancel = true;
    };
  }, [initialServiceId]);

  async function loadAvailability() {
    setErr("");
    setSlots([]);
    setStartsAt("");
    if (!serviceId || !date) return;
    setLoading(true);
    try {
      const data = await fetchAvailability({ serviceId: Number(serviceId), date });
      setSlots(Array.isArray(data) ? data : []);
    } catch {
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

  // Success screen
  if (step === 4 && result) {
    return (
      <div className="container-narrow py-10">
        <div className="max-w-xl mx-auto card p-6">
          <h1 className="text-2xl font-semibold tracking-tight">Booking confirmed ✅</h1>
          <p className="mt-3">
            <b>Starts:</b> {new Date(result.starts_at).toLocaleString("en-GB")}
          </p>
          <p className="mt-1">
            <b>Ends:</b> {new Date(result.ends_at).toLocaleString("en-GB")}
          </p>
          <p className="mt-4 text-sm text-slate-600">
            <b>Your cancel token (save this):</b>
          </p>
          <code
            className="mt-2 block rounded-lg bg-white/70 px-3 py-2 overflow-x-auto"
            style={{ border: "1px solid var(--silver)" }}
          >
            {result.cancel_token}
          </code>
        </div>
      </div>
    );
  }

  const serviceList = Array.isArray(services) ? services : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[color:var(--cream)] to-slate-50">
      <div className="container-narrow section-padding">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[color:var(--rose)]/10 rounded-full text-sm font-medium text-[color:var(--rose)] mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Online booking
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Book your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--rose)] to-[color:var(--rose-dark)]">appointment</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose your preferred treatment and time slot. We'll confirm your booking within 24 hours.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  step >= stepNumber 
                    ? 'bg-[color:var(--rose)] border-[color:var(--rose)] text-white shadow-lg' 
                    : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {step > stepNumber ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  )}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-0.5 mx-2 transition-colors duration-300 ${
                    step > stepNumber ? 'bg-[color:var(--rose)]' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-slate-500">
            {step === 1 && "Choose your treatment"}
            {step === 2 && "Select date and time"}
            {step === 3 && "Enter your details"}
          </div>
        </div>

        {err && (
          <div className="mb-8 animate-fade-in-up">
            <div className="card p-6 bg-red-50 border-red-200">
              <div className="flex items-center gap-3 text-red-700">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Booking Error</p>
                  <p className="text-sm">{err}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: pick service */}
        <section className="mb-8 card-elevated p-8 animate-fade-in-up">
          <div className="flex items-start gap-4 mb-6">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-[color:var(--rose)] text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              <span className="text-sm font-semibold">1</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-slate-900">Choose your treatment</h2>
              <p className="text-slate-600 mt-1">Select the service you'd like to book</p>
            </div>
          </div>

          <div className="space-y-4">
            <select
              className="select text-base"
              value={serviceId}
              onChange={e => setServiceId(e.target.value)}
            >
              <option value="">-- Select a treatment --</option>
              {serviceList.map(s => (
                <option key={s.service_id} value={s.service_id}>
                  {s.name} — {toGBP(s.price_cents)} — {s.duration_min} minutes
                </option>
              ))}
            </select>

            {serviceId && (
              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="btn btn-primary group"
                >
                  Continue to date selection
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Step 2: date → time */}
        {step >= 2 && (
          <section className="mb-8 card-elevated p-8 animate-fade-in-up">
            <div className="flex items-start gap-4 mb-6">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 2 ? 'bg-[color:var(--rose)] text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                <span className="text-sm font-semibold">2</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-slate-900">Pick date & time</h2>
                <p className="text-slate-600 mt-1">Choose your preferred appointment slot</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calendar */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Select date</h3>
                <DayPicker
                  mode="single"
                  selected={date ? ymdToLocalDate(date) : undefined}
                  onSelect={(d) => {
                    const ymd = d ? toYMDLocal(d) : "";
                    setDate(ymd);
                    setStartsAt("");
                    setSlots([]);
                  }}
                  disabled={{ dayOfWeek: [0] }}
                  fromDate={new Date()}
                  className="mx-auto"
                />
              </div>

              {/* Time slots */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-900">Available times</h3>
                  {date && (
                    <button
                      onClick={loadAvailability}
                      disabled={loading}
                      className="btn btn-secondary btn-sm"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Refresh
                        </>
                      )}
                    </button>
                  )}
                </div>

                {!date && (
                  <div className="flex items-center justify-center h-32 text-slate-500">
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Select a date to view available times</p>
                    </div>
                  </div>
                )}

                {date && slots.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {slots.map(iso => (
                      <button
                        key={iso}
                        onClick={() => setStartsAt(iso)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                          startsAt === iso
                            ? 'bg-[color:var(--rose)] text-white border-[color:var(--rose)] shadow-md'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-[color:var(--rose)] hover:bg-[color:var(--rose)]/5'
                        }`}
                      >
                        {formatTime(iso)}
                      </button>
                    ))}
                  </div>
                )}

                {date && !loading && slots.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-slate-500">
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm">No available slots for this date</p>
                      <p className="text-xs text-slate-400">Try selecting another date</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {startsAt && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setStep(3)}
                  className="btn btn-primary group"
                >
                  Continue to details
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </section>
        )}

        {/* Step 3: details */}
        {step >= 3 && (
          <section className="mb-8 card-elevated p-8 animate-fade-in-up">
            <div className="flex items-start gap-4 mb-6">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 3 ? 'bg-[color:var(--rose)] text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                <span className="text-sm font-semibold">3</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-slate-900">Your details</h2>
                <p className="text-slate-600 mt-1">We'll use this information to confirm your booking</p>
              </div>
            </div>

            <form onSubmit={submitBooking} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email address *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone number (optional)
                </label>
                <input
                  type="tel"
                  placeholder="+44 7xxx xxxxxx"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="input"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!name || !email || !startsAt || loading}
                  className="btn btn-success btn-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Confirming booking...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirm booking
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* policy popup */}
        {!policyAccepted && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="policy-title"
              aria-describedby="policy-desc"
              className="w-[min(90vw,28rem)] rounded-2xl border border-[color:var(--rose)]/40
                         bg-white/55 backdrop-blur-md shadow-xl p-5"
            >
              <h2 id="policy-title" className="text-base font-semibold text-[color:var(--rose)]">
                Booking Policy
              </h2>
              <p id="policy-desc" className="mt-2 text-sm text-slate-700">
                Deposits are <strong>non-refundable</strong> if you cancel or reschedule within
                <strong> 48 hours</strong>. Short-notice changes don't give us time to offer your slot to someone else.
              </p>
              <button
                onClick={acceptPolicy}
                className="mt-4 inline-flex items-center justify-center rounded-xl
                           bg-[color:var(--rose)] px-4 py-2 text-sm font-medium text-white
                           hover:opacity-90 focus:outline-none focus:ring-2
                           focus:ring-[color:var(--rose)] focus:ring-offset-2"
              >
                I Understand
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}