import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchService } from "../api";

function toGBP(cents) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(cents / 100);
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const row = await fetchService(Number(id));
        if (mounted) setService(row);
      } catch {
        setError("Service not found");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="container"><p>Loading…</p></div>;
  if (error)   return <div className="container"><p className="error">{error}</p></div>;
  if (!service) return <div className="container"><p>Not found.</p></div>;

  return (
    <div className="container">
      <h1>{service.name}</h1>
      {service.description && <p>{service.description}</p>}
      <p><strong>{toGBP(service.price_cents)}</strong> · {service.duration_min} min</p>
      {service.more_info && <p>{service.more_info}</p>}

      <Link className="btn btn-primary" to={`/book?serviceId=${service.service_id}`}>Book this service</Link>
    </div>
  );
}