import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[color:var(--cream)] py-8 sm:py-12 md:py-16">
      <div className="container-narrow grid md:grid-cols-2 gap-8 sm:gap-12 items-start">
        {/* Left: clinic info */}
        <div className="animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Contact us</h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-600">
            Have a question or want to book? We'd love to hear from you.
          </p>

          <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            <div className="card-flat p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <strong className="block font-medium text-slate-900 text-sm sm:text-base">Address</strong>
                  <p className="text-sm sm:text-base text-slate-600 mt-1">
                    123 High Street<br />
                    Bolton, UK
                  </p>
                </div>
              </div>
            </div>

            <div className="card-flat p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <strong className="block font-medium text-slate-900 text-sm sm:text-base">Email</strong>
                  <a href="mailto:info@bibclinic.co.uk" className="text-sm sm:text-base text-[color:var(--rose)] hover:underline mt-1 block break-all">
                    info@bibclinic.co.uk
                  </a>
                </div>
              </div>
            </div>

            <div className="card-flat p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <strong className="block font-medium text-slate-900 text-sm sm:text-base">Phone</strong>
                  <a href="tel:+441234567890" className="text-sm sm:text-base text-[color:var(--rose)] hover:underline mt-1 block">
                    +44 1234 567 890
                  </a>
                </div>
              </div>
            </div>

            <div className="card-flat p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <strong className="block font-medium text-slate-900 text-sm sm:text-base">Hours</strong>
                  <p className="text-sm sm:text-base text-slate-600 mt-1">
                    Mon–Sat: 9am – 6pm<br />
                    Sun: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: contact form */}
        <div className="card p-4 sm:p-6 shadow-sm animate-fade-in-up">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Send us a message</h2>

          {submitted ? (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm sm:text-base text-green-700">Thank you — we'll be in touch soon.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Your name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Your email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">Your message</label>
                <textarea
                  id="message"
                  placeholder="Tell us how we can help..."
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="textarea"
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
