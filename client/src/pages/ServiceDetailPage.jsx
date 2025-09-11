import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchService } from "../api";

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
        <div className="container-narrow py-12">
          <Link to="/services" className="text-sm hover:underline" style={{color:"var(--rose)"}}>
            ← Back to services
          </Link>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
            {loading ? "Loading…" : (service?.name ?? "Service")}
          </h1>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </section>

      <section className="container-narrow py-10">
        {loading && (
          <div className="card p-6 animate-pulse">
            <div className="h-6 w-1/2 rounded" style={{background:"color-mix(in oklab, var(--silver) 30%, transparent)"}}/>
            <div className="mt-3 h-4 w-1/3 rounded" style={{background:"color-mix(in oklab, var(--silver) 30%, transparent)"}}/>
            <div className="mt-6 h-24 w-full rounded" style={{background:"color-mix(in oklab, var(--silver) 30%, transparent)"}}/>
          </div>
        )}

        {!loading && service && (
          <article className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{service.name}</h2>
                <p className="text-slate-600 mt-1">{service.description}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold">{toGBP(service.price_cents)}</div>
                <div className="text-sm text-slate-600">
                  {service.duration_min} min{service.buffer_min ? ` (+${service.buffer_min})` : ""}
                </div>
              </div>
            </div>

            {service.more_info && (
              <div className="mt-6 prose max-w-none">
                <p className="whitespace-pre-line">{service.more_info}</p>
              </div>
            )}

            <div className="mt-6">
              <Link to={`/book?serviceId=${service.service_id}`} className="btn btn-primary">
                Book this service
              </Link>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}