import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchServices } from "../api";

function toGBP(cents) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" })
    .format((cents ?? 0) / 100);
}

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    let ok = true;
    fetchServices()
      .then((list) => ok && setServices(Array.isArray(list) ? list : []))
      .catch(() => ok && setError("Failed to load services."))
      .finally(() => ok && setLoading(false));
    return () => { ok = false; };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-white to-[color:var(--cream)]">
        <div className="container-narrow py-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Our services
          </h1>
          <p className="mt-2 text-slate-600">
            Evidence-based treatments delivered by a nurse-led clinic.
          </p>
        </div>
      </section>

      <section className="container-narrow py-10">
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            [...Array(6)].map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-6 w-2/3 rounded" style={{background:"color-mix(in oklab, var(--silver) 30%, transparent)"}}/>
                <div className="mt-3 h-4 w-1/3 rounded" style={{background:"color-mix(in oklab, var(--silver) 30%, transparent)"}}/>
                <div className="mt-5 h-10 w-full rounded" style={{background:"color-mix(in oklab, var(--silver) 30%, transparent)"}}/>
              </div>
            ))}

          {!loading && services.map((s) => (
            <article key={s.service_id} className="card p-5 hover:shadow transition">
              <h3 className="text-lg font-medium">{s.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.description}</p>
              <p className="mt-1 text-sm text-slate-600">
                Duration: {s.duration_min} min{ s.buffer_min ? ` (+${s.buffer_min})` : "" }
              </p>
              <p className="mt-1 font-semibold">{toGBP(s.price_cents)}</p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link to={`/services/${s.service_id}`} className="btn btn-ghost w-full">
                  More info
                </Link>
                <Link to={`/book?serviceId=${s.service_id}`} className="btn btn-primary w-full">
                  Book
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}