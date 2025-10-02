// ServiceSelector.jsx - Service selection step component
function toGBP(cents) {
  const n = Number(cents) || 0;
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n / 100);
}

export default function ServiceSelector({ 
  services, 
  serviceId, 
  setServiceId, 
  onContinue, 
  step 
}) {
  const serviceList = Array.isArray(services) ? services : [];

  return (
    <section className="mb-8 card-elevated p-8 animate-fade-in-up">
      <div className="flex items-start gap-4 mb-6">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 1 ? 'bg-[color:var(--rose)] text-white' : 'bg-slate-100 text-slate-400'
        }`}>
          <span className="text-sm font-semibold">1</span>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-slate-900">Choose your treatment</h2>
          <p className="text-slate-600 mt-1">Select the service you'd like to book</p>
        </div>
      </div>

      <div className="space-y-4">
        <select
          className="select text-base"
          value={serviceId}
          onChange={e => setServiceId(e.target.value)}
        >
          <option value="">-- Select a treatment --</option>
          {serviceList.map(s => (
            <option key={s.service_id} value={s.service_id}>
              {s.name} — {toGBP(s.price_cents)} — {s.duration_min} minutes
            </option>
          ))}
        </select>

        {serviceId && (
          <div className="flex justify-end">
            <button
              onClick={onContinue}
              className="btn btn-primary group"
            >
              Continue to date selection
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}