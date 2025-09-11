import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchServices } from "../api";

function toGBP(cents) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(cents / 100);
}

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await fetchServices();
        if (!mounted) return;
        setServices(rows.slice(0, 4)); // “popular” = first 4
      } catch (e) {
        setError("Failed to load services");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="container">
      <h1>Welcome to BIB</h1>
      <p>Safe, professional aesthetics. Book a consultation today.</p>

      <h2 className="mt">Popular services</h2>
      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {services.map(s => (
          <div key={s.service_id} className="card">
            <h3>{s.name}</h3>
            {s.description && <p>{s.description}</p>}
            <p><strong>{toGBP(s.price_cents)}</strong> · {s.duration_min} min</p>
            <div className="row">
              <Link className="btn" to={`/services/${s.service_id}`}>Details</Link>
              <Link className="btn btn-primary" to={`/book?serviceId=${s.service_id}`}>Book</Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt">
        <Link className="btn" to="/services">View all services</Link>
      </div>
    </div>
  );
}