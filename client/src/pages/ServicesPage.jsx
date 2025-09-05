import { useEffect, useState } from "react";
import { fetchServices } from "../api";
import { Link } from "react-router-dom";

function toGBP(cents) {
  return (cents / 100).toFixed(2);
}

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetchServices().then(setServices).catch((e) => setErr(e.message));
  }, []);

  return (
    <div className="min-h-screen bg-[color:var(--cream)] text-slate-800">
      <main className="container-narrow py-16 space-y-12">
        {/* Header */}
        <section className="text-center">
          <h1 className="text-4xl font-bold text-[color:var(--rose)]">
            Our Services
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
            {services.map((s) => (
              <div
                key={s.service_id}
                className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)] flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-[color:var(--rose)] mb-2">
                    {s.name}
                  </h3>
                  <p className="text-slate-600 mb-4">{s.description}</p>
                </div>
                <div className="mt-auto">
                  <p className="font-medium text-slate-700">
                    Duration: {s.duration_min} mins
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    £{toGBP(s.price_cents)}
                  </p>
                </div>
                <Link to={`/services/${s.service_id}`}>More info</Link>
              </div>
            ))}
            {!err && services.length === 0 && (
              <p className="text-center col-span-full">
                No services available at the moment.
              </p>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <a
            href="/book"
            className="btn btn-primary text-lg px-6 py-3 rounded-lg"
          >
            Book Your Appointment
          </a>
        </section>
      </main>
    </div>
  );
}