export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[color:var(--cream)] text-slate-800">
      <main className="container-narrow py-8 sm:py-12 md:py-16 space-y-8 sm:space-y-12">
        {/* Header */}
        <section className="text-center animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--rose)]">
            About BIB Clinic
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            Here at <span className="font-semibold">BIB Clinic</span>, we believe true
            beauty and wellness come from love and care. Thats why we do 
            what we do. We provide a personal experience in a professional 
            environment.
          </p>
        </section>
        
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-[color:var(--rose)] mb-3">The Team</h2>
        </div>
        
        {/* The Team */}
        <section className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
          <div className="animate-fade-in-up order-2 md:order-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-[color:var(--rose)] mb-2 sm:mb-3">
              Rachel
            </h2>
            <p className="leading-relaxed text-sm sm:text-base">
            Rachel is the practicioner here at BIB Clinic. With more
            than 15 years of experience in asethtics and 20+ years as a
            a registered nurse, you can be confident in your treatment.
            "quote from rachel"
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
            <p className="leading-relaxed text-sm sm:text-base">
              From booking your next appointment to
              welcoming you when first enter BIB Clinic Diane
              is here to make everything around your treatment fantastic. 
            </p>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-[color:var(--rose)] mb-6 text-center">
            What We Offer
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="p-4 sm:p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)] animate-fade-in-up hover:shadow-lg transition-all duration-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[color:var(--rose)] mb-2">
                Luxury
              </h3>
              <p className="text-sm sm:text-base">
                We only use the best products and brands for our treatment to 
                ensure you are getting the quality you deserve.
              </p>
            </div>
            <div className="p-4 sm:p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)] animate-fade-in-up hover:shadow-lg transition-all duration-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[color:var(--rose)] mb-2">
                Care
              </h3>
              <p className="text-sm sm:text-base">
                We pride ourselves on creating a welcoming environment where you
                feel valued, listened to, and supported on your journey.
              </p>
            </div>
            <div className="p-4 sm:p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)] animate-fade-in-up hover:shadow-lg transition-all duration-200 sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[color:var(--rose)] mb-2">
                Elegance
              </h3>
              <p className="text-sm sm:text-base">
                We pride ourselves on the ability to enhance your
                own natural beautiy. Leaving you with elegant results.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}