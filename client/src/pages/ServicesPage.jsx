import { useState } from "react";
import { useBookingModal } from "../ui";

function Expandable({ children, collapsedHeight = 140 }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className={expanded ? "relative" : "relative overflow-hidden"}
        style={expanded ? undefined : { maxHeight: collapsedHeight }}
      >
        <div className="space-y-3">{children}</div>
        {!expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent" />
        )}
      </div>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-3 text-sm font-medium text-[color:var(--rose)] hover:underline"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}

export default function ServicesPage() {
  const { setOpen: setBookingOpen } = useBookingModal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[color:var(--cream)] to-slate-50">
      <main className="container-narrow section-padding">
        <section className="text-center mb-10 sm:mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[color:var(--rose)]/10 rounded-full text-xs sm:text-sm font-medium text-[color:var(--rose)] mb-4 sm:mb-6">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Treatments
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-3 sm:mb-4 px-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--rose)] to-[color:var(--rose-dark)]">
              Our Treatments
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            A simple overview of our most popular treatments and what to expect.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <img
              src="/NurseInjectingClient.jpg"
              alt="Treatment in progress"
              className="h-28 sm:h-32 md:h-36 w-full object-cover rounded-2xl shadow-sm border border-slate-200/60"
            />
            <img
              src="/ClientSmillingAtResults.jpg"
              alt="Client results"
              className="h-28 sm:h-32 md:h-36 w-full object-cover rounded-2xl shadow-sm border border-slate-200/60"
            />
          </div>
        </section>

        <section className="space-y-6 sm:space-y-8">
          <article className="card-elevated p-5 sm:p-7 animate-fade-in-up">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">
              Anti-Wrinkle Treatment
            </h2>
            <Expandable>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Anti-wrinkle treatments work by relaxing targeted facial muscles
                to soften the appearance of lines and wrinkles caused by
                repeated facial movement. This safe and effective treatment is
                suitable for both men and women seeking a refreshed,
                natural-looking appearance.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                As this is a prescription-only treatment, a face-to-face medical
                consultation is required prior to treatment to ensure
                suitability and safety.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Following treatment, the targeted muscles will begin to relax
                within 3–5 days, with optimal results visible after 2–3 weeks.
                Results typically last approximately 3–4 months, depending on
                individual factors.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                All anti-wrinkle treatments include a complimentary review
                appointment at 2–3 weeks, allowing results to be assessed and
                optimised where necessary.
              </p>
            </Expandable>
          </article>

          <article className="card-elevated p-5 sm:p-7 animate-fade-in-up">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">
              Dermal Filler
            </h2>
            <Expandable>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Dermal fillers are designed to restore skin fullness and
                suppleness, helping to achieve a more youthful appearance with
                noticeable yet natural-looking results. This treatment can
                enhance facial contours and create a refreshed, rejuvenated
                look.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Dermal fillers contain hyaluronic acid, a naturally occurring
                substance found within the skin that helps maintain hydration,
                volume, and elasticity. As we age, changes to the skin, fat,
                muscle, and bone can lead to a gradual loss of volume, resulting
                in sagging and the formation of lines.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Dermal fillers offer a safe, effective, and predictable method
                of restoring lost volume, softening signs of ageing, and
                enhancing facial features, while maintaining balance and
                harmony.
              </p>
            </Expandable>
          </article>

          <article className="card-elevated p-5 sm:p-7 animate-fade-in-up">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">
              Chemical Peels
            </h2>
            <Expandable>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                At BIB Aesthetics, we offer a carefully selected range of
                professional chemical peels designed to refresh and rejuvenate
                the skin. Expertly applied peel solutions gently exfoliate dead
                skin cells, encouraging healthy new skin cells to rise to the
                surface and revealing fresher, more radiant skin beneath.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Chemical peels can help to even skin tone, reduce acne flare-ups,
                improve the appearance of ageing, and restore brightness to dull
                or tired complexions.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                A consultation and full skin assessment is recommended prior to
                treatment, allowing us to advise on the most suitable peel for
                your skin type, concerns, and desired results.
              </p>
            </Expandable>
          </article>

          <article className="card-elevated p-5 sm:p-7 animate-fade-in-up">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">
              Skin Treatments
            </h2>
            <Expandable>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Profhilo
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Profhilo is an injectable skin treatment designed to improve
                  skin hydration and support skin quality. It contains
                  hyaluronic acid, which is gradually released to help improve
                  skin firmness and elasticity.
                </p>
                <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">
                  Profhilo may help improve the appearance of skin tone, texture,
                  and hydration. It is commonly used on the face, neck, and body
                  following an appropriate consultation to assess suitability.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Polynucleotides
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Polynucleotide treatments are injectable skin treatments used
                  to support skin quality and skin regeneration processes. They
                  are designed to help improve the appearance of skin firmness
                  and elasticity and support overall skin health.
                </p>
                <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">
                  A course of three treatments is usually recommended, following
                  a consultation and skin assessment, to determine suitability
                  and treatment planning.
                </p>
              </div>
            </Expandable>
          </article>

          <article className="card-elevated p-5 sm:p-7 animate-fade-in-up">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">
              Hyperhidrosis (Excessive Sweating)
            </h2>
            <Expandable>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Hyperhidrosis can be treated using prescription-only injectable
                treatments, which work by temporarily reducing nerve signals to
                sweat glands in the treated area.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                This treatment may help reduce excessive sweating following a
                face-to-face consultation to assess suitability and discuss
                expected outcomes.
              </p>
            </Expandable>
          </article>

          <div className="card-elevated p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                Ready to book?
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Choose a time that works for you in our booking portal.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="btn btn-primary w-full sm:w-auto justify-center"
            >
              Book now
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
