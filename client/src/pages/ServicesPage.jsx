// client/src/pages/ServicesPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchServices } from "../api";

function toGBP(cents) {
  const n = Number(cents) || 0;
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n / 100);
}

const LABELS = {
  BOTULINUM_TOXIN: "Botulinum Toxin",
  CHEMICAL_PEELS: "Chemical Peels",
  DERMAL_FILLER: "Dermal Filler",
  SKIN_CARE: "Skin care",
  OTHER_SERVICES: "Other services",
};

const GROUP_ORDER = [
  "BOTULINUM_TOXIN",
  "CHEMICAL_PEELS",
  "DERMAL_FILLER",
  "SKIN_CARE",
  "OTHER_SERVICES",
];

// --- Your existing card markup extracted so styles remain identical ---
function ServiceCard({ s }) {
  return (
    <div className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)] flex flex-col">
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
  );
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

  const grouped = useMemo(() => {
    const map = Object.fromEntries(GROUP_ORDER.map(k => [k, []]));
    for (const s of services) {
      const key = s.treatment_type ?? "OTHER_SERVICES";
      if (map[key]) map[key].push(s);
    }
    return GROUP_ORDER.map(key => ({ key, label: LABELS[key], items: map[key] }));
  }, [services]);

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

        {/* Services */}
        <section>
          {err && (
            <p className="text-red-600 text-center mb-4">
              Failed to load services: {err}
            </p>
          )}

          {/* Loading skeleton (unchanged) */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
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
            </div>
          )}

          {/* Grouped lists */}
          {!loading && services.length > 0 && (
            <div className="space-y-6">
              {grouped.map(({ key, label, items }) => (
                <details key={key} open className="rounded-xl border border-[color:var(--silver)] bg-white/40 backdrop-blur-sm">
                  <summary className="px-4 py-3 cursor-pointer flex items-center justify-between bg-white/60">
                    <span className="text-lg font-semibold text-[color:var(--rose)]">{label}</span>
                    <span className="text-sm text-slate-600">({items.length})</span>
                  </summary>

                  {/* Use the SAME grid + gap as your original flat list */}
                  <div className="p-4">
                    {items.length === 0 ? (
                      <p className="text-slate-600">No services in this group.</p>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((s) => (
                          <ServiceCard key={s.service_id} s={s} />
                        ))}
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          )}

          {!loading && !err && services.length === 0 && (
            <p className="text-center">
              No services available at the moment.
            </p>
          )}
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