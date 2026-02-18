import { Link } from "react-router-dom";

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            to="/"
            className="text-rose-600 hover:text-rose-700 text-sm mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cancellation & Appointment Policy
          </h1>
        </div>

        <div className="prose prose-rose max-w-none bg-white rounded-xl shadow-sm p-8 space-y-6">
          <p className="text-gray-700 leading-relaxed">
            At BIB Aesthetic Clinic, we value your time and ours. To ensure
            availability for all clients and to maintain the highest level of
            care, the following cancellation policy applies:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              A £20 deposit is required at the time of booking to secure your
              appointment.
            </li>
            <li>
              Appointments may be cancelled or rescheduled with a minimum of 24
              hours’ notice.
            </li>
            <li>
              Cancellations or changes made with less than 24 hours’ notice, or
              failure to attend an appointment, will result in the deposit being
              retained.
            </li>
            <li>
              Deposits are deducted from the total cost of your treatment on the
              day of your appointment.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            We appreciate your understanding and cooperation, which allows us to
            provide a seamless and professional service to all clients.
          </p>
        </div>
      </div>
    </div>
  );
}
