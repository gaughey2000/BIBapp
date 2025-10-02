// DateTimeSelector.jsx - Date and time selection component
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function toYMDLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function ymdToLocalDate(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export default function DateTimeSelector({
  step,
  date,
  setDate,
  slots,
  startsAt,
  setStartsAt,
  loading,
  loadAvailability,
  onContinue
}) {
  return (
    <section className="mb-8 card-elevated p-8 animate-fade-in-up">
      <div className="flex items-start gap-4 mb-6">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 2 ? 'bg-[color:var(--rose)] text-white' : 'bg-slate-100 text-slate-400'
        }`}>
          <span className="text-sm font-semibold">2</span>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-slate-900">Pick date & time</h2>
          <p className="text-slate-600 mt-1">Choose your preferred appointment slot</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Select date</h3>
          <DayPicker
            mode="single"
            selected={date ? ymdToLocalDate(date) : undefined}
            onSelect={(d) => {
              const ymd = d ? toYMDLocal(d) : "";
              setDate(ymd);
              setStartsAt("");
            }}
            disabled={{ dayOfWeek: [0] }}
            fromDate={new Date()}
            className="mx-auto"
          />
        </div>

        {/* Time slots */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-900">Available times</h3>
            {date && (
              <button
                onClick={loadAvailability}
                disabled={loading}
                className="btn btn-secondary btn-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </>
                )}
              </button>
            )}
          </div>

          {!date && (
            <div className="flex items-center justify-center h-32 text-slate-500">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Select a date to view available times</p>
              </div>
            </div>
          )}

          {date && slots.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {slots.map(iso => (
                <button
                  key={iso}
                  onClick={() => setStartsAt(iso)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    startsAt === iso
                      ? 'bg-[color:var(--rose)] text-white border-[color:var(--rose)] shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-[color:var(--rose)] hover:bg-[color:var(--rose)]/5'
                  }`}
                >
                  {formatTime(iso)}
                </button>
              ))}
            </div>
          )}

          {date && !loading && slots.length === 0 && (
            <div className="flex items-center justify-center h-32 text-slate-500">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">No available slots for this date</p>
                <p className="text-xs text-slate-400">Try selecting another date</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {startsAt && (
        <div className="flex justify-end mt-6">
          <button
            onClick={onContinue}
            className="btn btn-primary group"
          >
            Continue to details
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}