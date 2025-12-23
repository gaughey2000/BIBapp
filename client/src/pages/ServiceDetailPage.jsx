import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchService } from "../api";
import TreatmentDetailSection from "../components/TreatmentDetailSection";

function toGBP(cents) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" })
    .format((cents ?? 0) / 100);
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    let ok = true;
    fetchService(id)
      .then((s) => ok && setService(s))
      .catch(() => ok && setError("Service not found"))
      .finally(() => ok && setLoading(false));
    return () => { ok = false; };
  }, [id]);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-white to-[color:var(--cream)]">
        <div className="container-narrow py-8 sm:py-12">
          <Link to="/services" className="inline-flex items-center gap-2 text-xs sm:text-sm hover:underline group" style={{color:"var(--rose)"}}>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to services
          </Link>
          <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            {loading ? "Loading…" : (service?.name ?? "Service")}
          </h1>
          {error && <p className="mt-2 text-xs sm:text-sm text-red-600">{error}</p>}
        </div>
      </section>

      <section className="container-narrow py-6 sm:py-10">
        {loading && (
          <div className="card p-4 sm:p-6 animate-pulse">
            <div className="h-5 sm:h-6 w-1/2 rounded bg-slate-200"/>
            <div className="mt-3 h-4 w-1/3 rounded bg-slate-100"/>
            <div className="mt-6 h-20 sm:h-24 w-full rounded bg-slate-100"/>
          </div>
        )}

        {!loading && service && (
          <article className="card p-4 sm:p-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">{service.name}</h2>
                <p className="text-slate-600 mt-1.5 sm:mt-2 text-sm sm:text-base">{service.description}</p>
              </div>
              <div className="flex-shrink-0 md:text-right">
                <div className="inline-flex items-baseline gap-2 bg-slate-50 px-4 py-2 rounded-lg md:flex-col md:items-end md:px-0 md:py-0 md:bg-transparent">
                  <div className="text-2xl sm:text-3xl font-semibold text-[color:var(--rose)]">{toGBP(service.price_cents)}</div>
                  <div className="text-xs sm:text-sm text-slate-600">
                    {service.duration_min} min{service.buffer_min ? ` (+${service.buffer_min})` : ""}
                  </div>
                </div>
              </div>
            </div>

            {service.more_info && (
              <div className="mt-6 sm:mt-8 prose max-w-none">
                <div className="p-4 sm:p-6 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">Additional Information</h3>
                  <p className="whitespace-pre-line text-sm sm:text-base text-slate-700 leading-relaxed">{service.more_info}</p>
                </div>
              </div>
            )}

            {/* Authoritative Treatment Content */}
            <TreatmentDetailSection 
              serviceName={service.name} 
              serviceSlug={service.slug || id} 
            />

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <Link to={`/book?serviceId=${service.service_id}`} className="btn btn-primary flex-1 sm:flex-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book this service
              </Link>
              <Link to="/services" className="btn btn-secondary flex-1 sm:flex-none">
                View all treatments
              </Link>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}