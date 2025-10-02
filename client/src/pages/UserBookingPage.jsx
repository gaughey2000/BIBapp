import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchServices, fetchAvailability, createBooking } from "../api";

// Import component pieces
import BookingProgress from "../components/booking/BookingProgress";
import ServiceSelector from "../components/booking/ServiceSelector";
import DateTimeSelector from "../components/booking/DateTimeSelector";
import BookingForm from "../components/booking/BookingForm";
import PolicyPopup from "../components/booking/PolicyPopup";

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
        <BookingProgress currentStep={step} />

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
        <ServiceSelector 
          services={services}
          serviceId={serviceId}
          setServiceId={setServiceId}
          onContinue={() => setStep(2)}
          step={step}
        />

        {/* Step 2: date → time */}
        {step >= 2 && (
          <DateTimeSelector 
            step={step}
            date={date}
            setDate={setDate}
            slots={slots}
            startsAt={startsAt}
            setStartsAt={setStartsAt}
            loading={loading}
            loadAvailability={loadAvailability}
            onContinue={() => setStep(3)}
          />
        )}

        {/* Step 3: details */}
        {step >= 3 && (
          <BookingForm 
            step={step}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            startsAt={startsAt}
            loading={loading}
            onSubmit={submitBooking}
          />
        )}

        {/* policy popup */}
        {!policyAccepted && (
          <PolicyPopup onAccept={acceptPolicy} />
        )}
      </div>
    </div>
  );
}