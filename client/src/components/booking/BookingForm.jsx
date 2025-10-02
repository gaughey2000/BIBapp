// BookingForm.jsx - Customer details form component
export default function BookingForm({
  step,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  startsAt,
  loading,
  onSubmit
}) {
  return (
    <section className="mb-8 card-elevated p-8 animate-fade-in-up">
      <div className="flex items-start gap-4 mb-6">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 3 ? 'bg-[color:var(--rose)] text-white' : 'bg-slate-100 text-slate-400'
        }`}>
          <span className="text-sm font-semibold">3</span>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-slate-900">Your details</h2>
          <p className="text-slate-600 mt-1">We'll use this information to confirm your booking</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full name *
            </label>
            <input
              required
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email address *
            </label>
            <input
              required
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone number (optional)
          </label>
          <input
            type="tel"
            placeholder="+44 7xxx xxxxxx"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="input"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!name || !email || !startsAt || loading}
            className="btn btn-success btn-lg group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Confirming booking...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm booking
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}