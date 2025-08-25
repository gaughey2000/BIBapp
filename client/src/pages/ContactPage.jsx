import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // For now, just simulate sending
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[color:var(--cream)] py-16">
      <div className="container-narrow grid md:grid-cols-2 gap-12 items-start">
        {/* Left: clinic info */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Contact us</h1>
          <p className="mt-3 text-slate-600">
            Have a question or want to book? We’d love to hear from you.
          </p>

          <div className="mt-6 space-y-4 text-slate-700">
            <p>
              <strong className="block font-medium">Address</strong>
              123 High Street<br />
              Bolton, UK
            </p>
            <p>
              <strong className="block font-medium">Email</strong>
              <a href="mailto:info@bibclinic.co.uk" className="text-[color:var(--rose)] hover:underline">
                info@bibclinic.co.uk
              </a>
            </p>
            <p>
              <strong className="block font-medium">Phone</strong>
              <a href="tel:+441234567890" className="text-[color:var(--rose)] hover:underline">
                +44 1234 567 890
              </a>
            </p>
            <p>
              <strong className="block font-medium">Hours</strong>
              Mon–Sat: 9am – 6pm<br />
              Sun: Closed
            </p>
          </div>
        </div>

        {/* Right: contact form */}
        <div className="card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Send us a message</h2>

          {submitted ? (
            <p className="mt-4 text-green-600">✅ Thank you — we’ll be in touch soon.</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-silver p-2"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-silver p-2"
              />
              <textarea
                placeholder="Your message"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full rounded-md border border-silver p-2"
              />
              <button type="submit" className="btn btn-primary w-full">
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}