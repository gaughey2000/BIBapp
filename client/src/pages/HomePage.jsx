import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api"; // ⬅️ use the api helper you already have

function toGBP(cents) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format((Number(cents) || 0) / 100);
}

export default function HomePage() {
  const [services, setServices] = useState([]);  // always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => setMuted((m) => !m);

  // Try to autoplay the video when ready (browsers only allow autoplay when muted)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const p = v.play?.();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, []);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/services");
        const data = res?.data;

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.services)
          ? data.services
          : [];

        if (!cancel) setServices(list);

        if (!Array.isArray(data) && !Array.isArray(data?.services)) {
          console.warn("Unexpected /services shape:", data);
        }
      } catch (e) {
        if (!cancel) setError(e.message || "Failed to load services");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-[color:var(--cream)]">
        <div className="container-narrow py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src="/logo-full-rose.png"
              alt="BIB Clinic logo"
              className="h-10 w-auto mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              Natural, nurse-led aesthetics
              <span className="block mt-1">book online with ease</span>
            </h1>
            <p className="mt-4 text-slate-600">
              Evidence-based treatments with flexible appointments.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/book" className="btn btn-primary">
                Book an appointment
              </Link>
              <Link to="/services" className="btn btn-ghost">
                View services
              </Link>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Mon–Sat · Europe/London
            </p>
          </div>

          {/* Hero video with mute toggle */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg border border-[color:var(--silver)]">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/WelcomeVideo.mp4"
              autoPlay
              loop
              playsInline
              muted={muted}
            />
            <button
              onClick={toggleMute}
              className="absolute bottom-3 right-3 bg-black/50 text-white px-3 py-1 rounded-md text-sm"
              style={{ backdropFilter: "blur(4px)" }}
            >
              {muted ? "🔇 Unmute" : "🔊 Mute"}
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section id="services" className="py-14">
        <div className="container-narrow">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Popular services
            </h2>
            <Link
              to="/services"
              className="text-sm hover:underline"
              style={{ color: "var(--rose)" }}
            >
              See all →
            </Link>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading &&
              [...Array(3)].map((_, i) => (
                <div key={i} className="card p-5 animate-pulse">
                  <div
                    className="h-6 w-2/3 rounded"
                    style={{ background: "color-mix(in oklab, var(--silver) 30%, transparent)" }}
                  />
                  <div
                    className="mt-3 h-4 w-1/3 rounded"
                    style={{ background: "color-mix(in oklab, var(--silver) 30%, transparent)" }}
                  />
                  <div
                    className="mt-5 h-10 w-full rounded"
                    style={{ background: "color-mix(in oklab, var(--silver) 30%, transparent)" }}
                  />
                </div>
              ))}

            {!loading &&
              (Array.isArray(services) ? services : []).map((s) => (
                <article key={s.service_id} className="card p-5 hover:shadow transition">
                  <h3 className="text-lg font-medium">{s.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Duration: {s.duration_min} min
                    {s.buffer_min ? ` (+${s.buffer_min})` : ""}
                  </p>
                  <p className="mt-1 font-semibold">{toGBP(s.price_cents)}</p>
                  <Link
                    to={`/services/${s.service_id}`}
                    className="mt-2 inline-block btn btn-ghost w-full"
                  >
                    More info
                  </Link>
                  <Link to="/book" className="mt-4 btn btn-primary w-full">
                    Book this
                  </Link>
                </article>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}