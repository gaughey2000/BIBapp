import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchService } from "../api";

function toGBP(cents) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" })
    .format(cents / 100);
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [svc, setSvc] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchService(id);
        setSvc(data);
      } catch (e) {
        setErr(e?.response?.data?.error || "Failed to load service");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="container-narrow py-12">
        <div className="card p-6 animate-pulse">
          <div className="h-6 w-1/3 rounded" style={{ background: "color-mix(in oklab, var(--silver) 30%, transparent)" }} />
          <div className="mt-3 h-4 w-2/3 rounded" style={{ background: "color-mix(in oklab, var(--silver) 30%, transparent)" }} />
          <div className="mt-6 h-10 w-40 rounded" style={{ background: "color-mix(in oklab, var(--silver) 30%, transparent)" }} />
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container-narrow py-12">
        <div className="card p-6 text-red-700 bg-red-50/70">{err}</div>
        <button className="mt-4 btn btn-ghost" onClick={() => nav(-1)}>← Back</button>
      </div>
    );
  }

  if (!svc) return null;

  return (
    <div className="container-narrow py-12 grid md:grid-cols-2 gap-10 items-start">
      <div className="order-2 md:order-1">
        <h1 className="text-3xl font-semibold tracking-tight">{svc.name}</h1>
        <p className="mt-2 text-slate-700">
          {svc.description || "This treatment provides natural, elegant results by a qualified aesthetics nurse."}
        </p>

        <div className="mt-6 grid gap-2 text-slate-800">
          <div><span className="font-medium">Duration:</span> {svc.duration_min} min{svc.buffer_min ? ` (+${svc.buffer_min} buffer)` : ""}</div>
          <div><span className="font-medium">Price:</span> {toGBP(svc.price_cents)}</div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            to={`/book?serviceId=${svc.service_id}`}
            className="btn btn-primary"
          >
            Book this service
          </Link>
          <Link to="/services" className="btn btn-ghost">All services</Link>
        </div>
      </div>

      {/* Visual (swap for a specific photo per service later if you like) */}
      <div className="order-1 md:order-2">
        <img
          src="/NurseClientConsultation.jpg"
          alt={`${svc.name} at BIB Clinic`}
          className="rounded-2xl shadow-md border border-[color:var(--silver)] object-cover w-full aspect-[4/3]"
        />
      </div>
    </div>
  );
}