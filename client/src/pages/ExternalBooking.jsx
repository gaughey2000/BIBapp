import { useEffect } from "react";
import { BOOKING_URL } from "../data";

export default function ExternalBooking() {
  useEffect(() => {
    document.title = "Book Your Appointment | BIB Beauty";
    window.location.replace(BOOKING_URL);
  }, []);

  return (
    <div className="min-h-screen bg-[color:var(--cream)] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="card-elevated p-6 sm:p-8 text-center animate-fade-in-up">
        <h1 className="text-lg sm:text-xl font-semibold text-[color:var(--ink)]">
          Redirecting to booking…
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          If you are not redirected,{" "}
          <a
            href={BOOKING_URL}
            className="text-[color:var(--rose)] hover:underline"
          >
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
