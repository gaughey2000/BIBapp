// client/src/pages/ServicesPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchServices } from "../api";

function toGBP(cents) {
  const n = Number(cents) || 0;
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n / 100);
}

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await fetchServices();
        if (!alive) return;
        setServices(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load services");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[color:var(--cream)] text-slate-800">
      <main className="container-narrow py-16 space-y-12">
        {/* Header */}
        <section className="text-center">
          <h1 className="text-4xl font-bold text-[color:var(--rose)]">
            Our Treatments
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our curated range of treatments, designed to blend expertise,
            science, and care for naturally elegant results.
          </p>
        </section>

        {/* Services list */}
        <section>
          {err && (
            <p className="text-red-600 text-center mb-4">
              Failed to load services: {err}
            </p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading &&
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)]"
                >
                  <div className="h-6 w-2/3 rounded animate-pulse" style={{ background: "color-mix(in oklab, var(--silver) 30%, transparent)" }} />
                  <div className="mt-3 h-4 w-full rounded animate-pulse" style={{ background: "color-mix(in oklab, var(--silver) 25%, transparent)" }} />
                  <div className="mt-2 h-4 w-5/6 rounded animate-pulse" style={{ background: "color-mix(in oklab, var(--silver) 20%, transparent)" }} />
                  <div className="mt-6 h-10 w-full rounded animate-pulse" style={{ background: "color-mix(in oklab, var(--silver) 30%, transparent)" }} />
                </div>
              ))}

            {!loading && services.map((s) => (
              <div
                key={s.service_id}
                className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)] flex flex-col"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[color:var(--rose)] mb-2">
                    {s.name}
                  </h3>
                  {s.description && (
                    <p className="text-slate-600 mb-4">{s.description}</p>
                  )}
                  <p className="font-medium text-slate-700">
                    Duration: {s.duration_min} mins
                    {s.buffer_min ? ` (+${s.buffer_min} buffer)` : ""}
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {toGBP(s.price_cents)}
                  </p>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link to={`/services/${s.service_id}`} className="btn btn-ghost">
                    More info
                  </Link>
                  <Link to={`/book?serviceId=${s.service_id}`} className="btn btn-primary">
                    Book
                  </Link>
                </div>
              </div>
            ))}

            {!loading && !err && services.length === 0 && (
              <p className="text-center col-span-full">
                No services available at the moment.
              </p>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Link to="/book" className="btn btn-primary text-lg px-6 py-3 rounded-lg">
            Book Your Appointment
          </Link>
        </section>
      </main>
    </div>
  );
}