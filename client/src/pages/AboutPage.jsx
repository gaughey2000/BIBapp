export default function AboutPage() {
  const credentials = [
    "Registered nurse",
    "Independent prescriber",
    "Advanced nurse practitioner",
    "Level 7 qualified in aesthetic medicine",
    "Medical director",
  ];

  return (
    <div className="min-h-screen bg-[color:var(--cream)] text-slate-800">
      <main className="container-narrow py-8 sm:py-12 md:py-16 space-y-8 sm:space-y-12">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-[color:var(--rose)] mb-3">
            Meet the Team
          </h2>
        </div>

        <section className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
          <div className="animate-fade-in-up order-2 md:order-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-[color:var(--rose)] mb-2 sm:mb-3">
              Rachel McGaughey
            </h2>
            <ul className="mt-1 space-y-1.5 text-sm sm:text-base text-slate-700">
              {credentials.map((credential) => (
                <li
                  key={credential}
                  className="relative pl-6 py-1 leading-relaxed tracking-[0.01em] before:content-[''] before:absolute before:left-0 before:top-[0.78rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[color:var(--rose)]/80"
                >
                  {credential}
                </li>
              ))}
            </ul>
            <br />
            <p className="leading-relaxed text-sm sm:text-base text-slate-700">
              With over 25 years of nursing experience, including a background
              in critical care and community nursing, Rachel brings exceptional
              expertise and clinical excellence to every treatment. Her passion
              for aesthetics has seen her working within the field for over 15
              years, combining advanced medical knowledge with a refined
              aesthetic eye. Trained by leading experts on Harley Street,
              London, Rachel continues to advance her skills and expertise
              through ongoing education across the UK and Europe, ensuring the
              highest standards of safety, innovation, and patient care. A
              respected member of BAMAN and ACE (Aesthetics Complication
              Experts), Rachel’s approach is centred on enhancing natural beauty
              and helping each client feel confident, refreshed, and the very
              best version of themselves.
            </p>
          </div>
          <img
            src="/NurseWorking2.jpg"
            alt="Nurse consultation with client at BIB Clinic"
            className="rounded-2xl shadow-md border border-[color:var(--silver)] object-cover w-full h-64 sm:h-80 md:h-full animate-fade-in-up order-1 md:order-2"
          />

          <img
            src="/ReceptionistSmiling.jpg"
            alt="Receptionist smiling at BIB Clinic"
            className="rounded-2xl shadow-md border border-[color:var(--silver)] object-cover w-full h-64 sm:h-80 md:h-full animate-fade-in-up order-3"
          />
          <div className="animate-fade-in-up order-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-[color:var(--rose)] mb-2 sm:mb-3">
              Diane
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-700">
              From your initial enquiry to the moment you arrive at BIB
              Aesthetic Clinic, Diane is dedicated to ensuring every aspect of
              your experience runs smoothly. Her friendly, attentive approach
              helps create a calm and welcoming environment, allowing you to
              feel relaxed and well cared for throughout your visit.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-[color:var(--rose)] mb-6 text-center">
            Our Mission
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="p-4 sm:p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)] animate-fade-in-up hover:shadow-lg transition-all duration-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[color:var(--rose)] mb-2">
                Enhance your natural confidence
              </h3>
              <p className="text-sm sm:text-base">
                Helping you feel like the very best version of yourself through
                subtle, natural-looking results.
              </p>
            </div>
            <div className="p-4 sm:p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)] animate-fade-in-up hover:shadow-lg transition-all duration-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6.5C4 4.6 5.6 3 7.5 3c1.4 0 2.6.7 3.2 1.8C11.3 3.7 12.5 3 13.9 3 15.8 3 17.4 4.6 17.4 6.5c0 4-5.7 7.4-7.4 8.5C8.3 13.9 4 10.5 4 6.5z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[color:var(--rose)] mb-2">
                Put you first
              </h3>
              <p className="text-sm sm:text-base">
                Your comfort, wellbeing, and experience are our priority — both
                physically and psychologically — within a calm, relaxing, and
                clinical environment.
              </p>
            </div>
            <div className="p-4 sm:p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)] animate-fade-in-up hover:shadow-lg transition-all duration-200 sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3l7 4v5c0 4.4-3 8.4-7 9-4-0.6-7-4.6-7-9V7l7-4z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[color:var(--rose)] mb-2">
                Lead with safety
              </h3>
              <p className="text-sm sm:text-base">
                We use only the highest quality, strictly regulated products,
                sourced from UK-registered pharmacies to ensure the highest
                standards of safety and care.
              </p>
            </div>
            <div className="p-4 sm:p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)] animate-fade-in-up hover:shadow-lg transition-all duration-200 sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2l7 7-7 7-7-7 7-7zm0 5v3.5M12 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[color:var(--rose)] mb-2">
                Offer honest, expert guidance
              </h3>
              <p className="text-sm sm:text-base">
                Treatments are always recommended with integrity. If a treatment
                is unsuitable or could result in facial imbalance, we will
                advise against it and guide you towards the most appropriate
                options.
              </p>
            </div>
            <div className="p-4 sm:p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)] animate-fade-in-up hover:shadow-lg transition-all duration-200 sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11V9a5 5 0 0110 0v2m1 0H6a2 2 0 00-2 2v5a2 2 0 002 2h12a2 2 0 002-2v-5a2 2 0 00-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[color:var(--rose)] mb-2">
                Respect your confidentiality
              </h3>
              <p className="text-sm sm:text-base">
                Discretion and privacy are fundamental. All treatments are
                carried out with complete confidentiality.
              </p>
            </div>
            <div className="p-4 sm:p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)] animate-fade-in-up hover:shadow-lg transition-all duration-200 sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2m6-6a4 4 0 100-8 4 4 0 000 8z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[color:var(--rose)] mb-2">
                Deliver truly individual care
              </h3>
              <p className="text-sm sm:text-base">
                Every treatment plan is tailored to you. Following a
                comprehensive consultation, Rachel takes the time to understand
                your goals and create a personalised approach to achieve them.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
