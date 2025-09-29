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

// --- Enhanced ServiceCard with better Tailwind styling ---
function ServiceCard({ s }) {
  return (
    <div className="card group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in-up">
      <div className="p-6 h-full flex flex-col">
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-slate-900 group-hover:text-[color:var(--rose)] transition-colors duration-200">
              {s.name}
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{toGBP(s.price_cents)}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">from</div>
            </div>
          </div>
          
          {s.description && (
            <p className="text-slate-600 leading-relaxed line-clamp-3">{s.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{s.duration_min} mins</span>
            </div>
            {s.buffer_min && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>+{s.buffer_min} buffer</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link 
            to={`/services/${s.service_id}`} 
            className="btn btn-secondary flex-1 group/btn"
          >
            <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Details
          </Link>
          <Link 
            to={`/book?serviceId=${s.service_id}`} 
            className="btn btn-primary flex-1 group/btn"
          >
            <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book now
          </Link>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-white via-[color:var(--cream)] to-slate-50">
      <main className="container-narrow section-padding">
        {/* Header */}
        <section className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[color:var(--rose)]/10 rounded-full text-sm font-medium text-[color:var(--rose)] mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Premium Treatments
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--rose)] to-[color:var(--rose-dark)]">Treatments</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore our curated range of treatments, designed to blend expertise, science,
            and care for naturally elegant results that enhance your natural beauty.
          </p>
        </section>

        {/* Services */}
        <section>
          {err && (
            <div className="card p-6 mb-8 bg-red-50 border-red-200 animate-fade-in-up">
              <div className="flex items-center gap-3 text-red-700">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Failed to load treatments</p>
                  <p className="text-sm">{err}</p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced skeleton loading */}
          {loading && (
            <div className="space-y-8">
              {[...Array(3)].map((_, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, cardIndex) => (
                      <div key={cardIndex} className="card p-6 space-y-4">
                        <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                          <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
                        </div>
                        <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse" />
                        <div className="flex gap-3 pt-2">
                          <div className="h-10 w-full bg-slate-100 rounded-lg animate-pulse" />
                          <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced treatment groups */}
          {!loading && services.length > 0 && (
            <div className="space-y-8">
              {grouped.map(({ key, label, meta, items }, index) => (
                <details key={key} className="group card-elevated overflow-hidden animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  {/* Enhanced header */}
                  <summary className="list-none cursor-pointer select-none p-6 hover:bg-slate-50/50 transition-colors duration-200 [&::-webkit-details-marker]:hidden">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      {/* Image */}
                      {meta?.img && (
                        <div className="flex-shrink-0">
                          <img
                            src={meta.img}
                            alt={label}
                            className="w-full md:w-24 md:h-24 h-48 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-200"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-2xl font-semibold text-slate-900 group-hover:text-[color:var(--rose)] transition-colors duration-200">
                              {label}
                            </h2>
                            {meta?.blurb && (
                              <p className="text-slate-600 mt-2 leading-relaxed">{meta.blurb}</p>
                            )}
                            <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                </svg>
                                {items.length} treatment{items.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0 ml-4">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 group-hover:bg-[color:var(--rose)]/10 transition-colors duration-200">
                              <svg className="w-4 h-4 text-slate-600 group-hover:text-[color:var(--rose)] group-open:rotate-180 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </summary>

                  {/* Services grid */}
                  {items.length > 0 && (
                    <div className="px-6 pb-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                        {items.map((s) => (
                          <ServiceCard key={s.service_id} s={s} />
                        ))}
                      </div>
                    </div>
                  )}
                </details>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && services.length === 0 && !err && (
            <div className="card-elevated p-12 text-center animate-fade-in-up">
              <div className="max-w-md mx-auto">
                <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No treatments available</h3>
                <p className="text-slate-600">Check back soon for our latest treatment options.</p>
                <Link to="/contact" className="btn btn-primary mt-4">
                  Contact us
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}