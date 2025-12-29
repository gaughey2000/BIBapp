export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[color:var(--cream)] py-6 sm:py-8 md:py-12">
      <div className="container-narrow grid md:grid-cols-2 gap-6 sm:gap-8 items-start">
        {/* Left: clinic info */}
        <div className="animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Contact us</h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-600">
            Have a question or want to book? We'd love to hear from you.
          </p>

          <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">
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
                    BIB Aesthetics<br />
                    9 Maryland Avenue<br />
                    Bolton<br />
                    BL2 6DL
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
                  <a href="tel:07880658042" className="text-sm sm:text-base text-[color:var(--rose)] hover:underline mt-1 block">
                    07880658042
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right: email link */}
        <div className="card p-4 sm:p-6 shadow-sm animate-fade-in-up">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Email us</h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Click below to open a new email draft. We normally reply within 24 hours.
          </p>
          <a
            href="mailto:info@bibclinic.co.uk"
            className="btn btn-primary w-full mt-5 inline-flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email info@bibclinic.co.uk
          </a>
        </div>
      </div>
    </div>
  );
}
