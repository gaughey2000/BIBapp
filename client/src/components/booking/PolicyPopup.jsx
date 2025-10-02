// PolicyPopup.jsx - Booking policy popup component
export default function PolicyPopup({ onAccept }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-title"
        aria-describedby="policy-desc"
        className="w-[min(90vw,28rem)] rounded-2xl border border-[color:var(--rose)]/40
                   bg-white/55 backdrop-blur-md shadow-xl p-5"
      >
        <h2 id="policy-title" className="text-base font-semibold text-[color:var(--rose)]">
          Booking Policy
        </h2>
        <p id="policy-desc" className="mt-2 text-sm text-slate-700">
          Deposits are <strong>non-refundable</strong> if you cancel or reschedule within
          <strong> 48 hours</strong>. Short-notice changes don't give us time to offer your slot to someone else.
        </p>
        <button
          onClick={onAccept}
          className="mt-4 inline-flex items-center justify-center rounded-xl
                     bg-[color:var(--rose)] px-4 py-2 text-sm font-medium text-white
                     hover:opacity-90 focus:outline-none focus:ring-2
                     focus:ring-[color:var(--rose)] focus:ring-offset-2"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}