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
            At <span className="font-semibold">BIB Clinic</span>, we believe true
            beauty and wellness come from care, expertise, and a personal touch.
            Our clinic offers modern treatments with timeless professionalism,
            giving every client a refined, elegant experience.
          </p>
        </section>

        {/* Story */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--rose)] mb-3">
              Our Story
            </h2>
            <p className="leading-relaxed">
              Founded with a passion for combining science, artistry, and care,
              BIB Clinic has grown into a trusted destination for those seeking
              professional treatments in a warm, welcoming space. We focus on
              tailored solutions that help you feel your best while maintaining
              natural, timeless results.
            </p>
          </div>
          <img
  src="/NurseClientConsultation.jpg"
  alt="Nurse consultation with client at BIB Clinic"
  className="rounded-2xl shadow-md border border-[color:var(--silver)] object-cover w-full h-full"
/>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-semibold text-[color:var(--rose)] mb-6 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-sm border border-[color:var(--silver)]">
              <h3 className="text-lg font-bold text-[color:var(--rose)] mb-2">
                Professionalism
              </h3>
              <p>
                Every treatment is performed with expertise, precision, and
                attention to detail, ensuring the highest quality care.
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
                From our clinic design to our results, we aim for timeless,
                natural elegance in every aspect of your experience.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}