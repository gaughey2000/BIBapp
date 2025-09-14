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
  SKIN_CARE: "Skin Care",
  OTHER_SERVICES: "Other Services",
};

const GROUP_ORDER = [
  "BOTULINUM_TOXIN",
  "CHEMICAL_PEELS",
  "DERMAL_FILLER",
  "SKIN_CARE",
  "OTHER_SERVICES",
];

// Use your placeholders from /client/public
const CATEGORY_META = {
  BOTULINUM_TOXIN: {
    img: "/NurseInjectingClient.jpg",
    blurb: "Target lines with precise botulinum toxin treatments for a smoother, refreshed look.",
  },
  CHEMICAL_PEELS: {
    img: "/ClientWaitingFillingForm.jpg",
    blurb: "Refine texture and brighten tone with tailored peels for clearer, radiant skin.",
  },
  DERMAL_FILLER: {
    img: "/ClientSmillingAtResults.jpg",
    blurb: "Restore volume and enhance contours using premium dermal fillers.",
  },
  SKIN_CARE: {
    img: "/NurseInjectingClient2.jpg",
    blurb: "From microneedling to boosters—advanced care to strengthen and rejuvenate skin.",
  },
  OTHER_SERVICES: {
    img: "/ClientWaitingFillingForm.jpg",
    blurb: "Consultations, reviews, vitamin injections and more to support your journey.",
  },
};

// --- Your existing card UI preserved ---
function ServiceCard({ s }) {
  return (
    <div className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)] flex flex-col">
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-[color:var(--rose)] mb-2">
          {s.name}
        </h3>
        {s.description && <p className="text-slate-600 mb-4">{s.description}</p>}
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
    return GROUP_ORDER.map(key => ({ key, label: LABELS[key], meta: CATEGORY_META[key], items: map[key] }));
  }, [services]);

  return (
    <div className="min-h-screen bg-[color:var(--cream)] text-slate-800">
      <main className="container-narrow py-16 space-y-12">
        {/* Header */}
        <section className="text-center">
          <h1 className="text-4xl font-bold text-[color:var(--rose)]">Our Treatments</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our curated range of treatments, designed to blend expertise, science,
            and care for naturally elegant results.
          </p>
        </section>

        {/* Services */}
        <section>
          {err && <p className="text-red-600 text-center mb-4">Failed to load services: {err}</p>}

          {/* Skeleton */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)]">
                  <div className="h-6 w-2/3 rounded animate-pulse" style={{ background: "color-mix(in oklab, var(--silver) 30%, transparent)" }} />
                  <div className="mt-3 h-4 w-full rounded animate-pulse" style={{ background: "color-mix(in oklab, var(--silver) 25%, transparent)" }} />
                  <div className="mt-2 h-4 w-5/6 rounded animate-pulse" style={{ background: "color-mix(in oklab, var(--silver) 20%, transparent)" }} />
                  <div className="mt-6 h-10 w-full rounded animate-pulse" style={{ background: "color-mix(in oklab, var(--silver) 30%, transparent)" }} />
                </div>
              ))}
            </div>
          )}

          {/* Collapsible groups (default CLOSED) */}
          {!loading && services.length > 0 && (
            <div className="space-y-6">
              {grouped.map(({ key, label, meta, items }) => (
                <details key={key} className="group rounded-xl border border-[color:var(--silver)] bg-white/50 backdrop-blur-sm shadow">
                  {/* Header as clickable <summary> (image + title + blurb + chevron) */}
                  <summary className="list-none cursor-pointer select-none p-6 flex flex-col md:flex-row md:items-center gap-5 [&::-webkit-details-marker]:hidden">
                    {/* Image */}
                    {meta?.img && (
                      <img
                        src={meta.img}
                        alt={label}
                        className="w-full md:w-40 h-40 object-cover rounded-lg border border-[color:var(--silver)] bg-white/70"
                      />
                    )}

                    {/* Title + Blurb */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h2 className="text-2xl font-bold text-[color:var(--rose)]">{label}</h2>
                        {/* Count pill (hidden on very small screens to avoid wrap) */}
                        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full border border-[color:var(--silver)] text-sm text-slate-700 bg-white/70">
                          {items.length} {items.length === 1 ? "treatment" : "treatments"}
                        </span>
                      </div>
                      {meta?.blurb && <p className="mt-2 text-slate-700">{meta.blurb}</p>}
                    </div>

                    {/* Chevron */}
                    <svg
                      className="w-5 h-5 shrink-0 text-slate-600 transition-transform duration-200 md:ml-2
                                 group-open:rotate-180"
                      viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                    >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.14l3.71-2.91a.75.75 0 11.92 1.18l-4.17 3.27a.75.75 0 01-.92 0L5.21 8.41a.75.75 0 01.02-1.2z" clipRule="evenodd" />
                    </svg>
                  </summary>

                  {/* Count pill for xs screens */}
                  <div className="sm:hidden px-6 -mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full border border-[color:var(--silver)] text-sm text-slate-700 bg-white/70">
                      {items.length} {items.length === 1 ? "treatment" : "treatments"}
                    </span>
                  </div>

                  {/* Content (hidden until open) */}
                  <div className="p-6 pt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.length === 0 ? (
                      <p className="text-slate-600">No services available in this category.</p>
                    ) : (
                      items.map((s) => <ServiceCard key={s.service_id} s={s} />)
                    )}
                  </div>
                </details>
              ))}
            </div>
          )}

          {!loading && !err && services.length === 0 && (
            <p className="text-center">No services available at the moment.</p>
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