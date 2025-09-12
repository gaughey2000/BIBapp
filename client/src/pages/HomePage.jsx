// client/src/pages/HomePage.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const sync = () => setMuted(v.muted);
    v.addEventListener("volumechange", sync);
    return () => v.removeEventListener("volumechange", sync);
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const togglePause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <main id="main" className="bg-[color:var(--cream)]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-[color:var(--cream)]">
        <div
          className="container-narrow grid items-center gap-12 md:grid-cols-2"
          style={{ minHeight: "calc(100svh - 64px)" }}
        >
          {/* Left: Copy */}
          <div className="py-10 md:py-0">
            <img
              src="/logo-full-rose.png"
              alt="BIB Clinic logo"
              className="h-10 w-auto mb-6"
              loading="eager"
              decoding="async"
            />
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-slate-900">
              Natural, nurse-led aesthetics
              <span className="block mt-2 text-[color:var(--rose)]">
                book online with ease
              </span>
            </h1>

            <p className="mt-6 text-base text-slate-700 max-w-lg">
              Evidence-based treatments with flexible appointments, delivered
              with care and professionalism.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/book" className="btn btn-primary text-base px-6 py-3">
                Book an appointment
              </Link>
              <Link to="/services" className="btn btn-ghost text-base px-6 py-3">
                View services
              </Link>
            </div>
          </div>

          {/* Right: Video */}
          <div className="relative w-full max-w-2xl mx-auto md:ml-auto overflow-hidden rounded-2xl border border-[color:var(--silver)] shadow-xl bg-white/60 backdrop-blur-sm aspect-video">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/WelcomeVideo.mp4"
              autoPlay
              loop
              playsInline
              muted={muted}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

            {/* Controls (mute + pause) */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={toggleMute}
                className="rounded-md px-3 py-1 text-sm text-white shadow
                           bg-white/25 backdrop-blur-md ring-1 ring-white/40 hover:bg-white/35
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label={muted ? "Unmute video" : "Mute video"}
              >
                {muted ? "🔇" : "🔊"}
              </button>
              <button
                onClick={togglePause}
                className="rounded-md px-3 py-1 text-sm text-white shadow
                           bg-white/25 backdrop-blur-md ring-1 ring-white/40 hover:bg-white/35
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label={paused ? "Play video" : "Pause video"}
              >
                {paused ? "▶️" : "⏸"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}