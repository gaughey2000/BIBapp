export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[color:var(--cream)] text-slate-800">
      <main className="container-narrow py-16 space-y-12">
        {/* Header */}
        <section className="text-center">
          <h1 className="text-4xl font-bold text-[color:var(--rose)]">
            About BIB Clinic
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Here at <span className="font-semibold">BIB Clinic</span>, we believe true
            beauty and wellness come from love and care. Thats why we do 
            what we do. We provide a personal experience in a professional 
            environment.
          </p>
        </section>
          <div>
            <h2 className="text-2xl text-center font-semibold text-[color:var(--rose)] mb-3">The Team</h2>
          </div>
        {/* The Team */}
        <section className="grid md:grid-cols-2 gap-10 items-center">

          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--rose)] mb-3">
              Rachel
            </h2>
            <p className="leading-relaxed">
            Rachel is the practicioner here at BIB Clinic. With more
            than 15 years of experience in asethtics and 20+ years as a
            a registered nurse, you can be confident in your treatment.
            "quote from rachel"
            </p>
          </div>
          <img
            src="/NurseWorking2.jpg"
            alt="Nurse consultation with client at BIB Clinic"
            className="rounded-2xl shadow-md border border-[color:var(--silver)] object-cover w-full h-full"
          />
          <img
            src="/ReceptionistSmiling.jpg"
            alt="Nurse consultation with client at BIB Clinic"
            className="rounded-2xl shadow-md border border-[color:var(--silver)] object-cover w-full h-full"
          />          
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--rose)] mb-3">
              Diane
            </h2>
            <p className="leading-relaxed">
              From booking your next appointment to
              welcoming you when first enter BIB Clinic Diane
              is here to make everything around your treatment fantastic. 
            </p>
          </div>

        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-semibold text-[color:var(--rose)] mb-6 text-center">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)]">
              <h3 className="text-lg font-bold text-[color:var(--rose)] mb-2">
                Luxury
              </h3>
              <p>
                We only use the best products and brands for our treatment to 
                ensure you are getting the quality you deserve.
              </p>
            </div>
            <div className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)]">
              <h3 className="text-lg font-bold text-[color:var(--rose)] mb-2">
                Care
              </h3>
              <p>
                We pride ourselves on creating a welcoming environment where you
                feel valued, listened to, and supported on your journey.
              </p>
            </div>
            <div className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)]">
              <h3 className="text-lg font-bold text-[color:var(--rose)] mb-2">
                Elegance
              </h3>
              <p>
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