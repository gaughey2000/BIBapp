// client/src/pages/HomePage.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BOOKING_URL } from "../constants/links";
import ReviewsCarousel from "../components/ReviewsCarousel";

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
    <main
      id="main"
      className="min-h-screen bg-gradient-to-br from-white via-[color:var(--cream)] to-slate-50"
    >
      {/* Hero */}
      <section className="py-2 sm:py-4 lg:py-8">
        <div
          className="container-narrow grid items-center gap-4 lg:gap-16 lg:grid-cols-2"
          style={{ minHeight: "calc(100svh - 160px)" }}
        >
          {/* Left: Copy */}
          <div className="py-2 sm:py-4 md:py-6 lg:py-0 animate-fade-in-up order-2 lg:order-1">
            <div className="mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[color:var(--rose)]/10 rounded-full text-xs sm:text-sm font-medium text-[color:var(--rose)] mb-3 sm:mb-4">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Nurse-led aesthetics
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-slate-900 mb-3 sm:mb-4">
              Natural beauty,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--rose)] to-[color:var(--rose-dark)]">
                enhanced with care
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mb-5 sm:mb-6 leading-relaxed">
              Evidence-based treatments with flexible appointments, delivered
              with professionalism and a personal touch that makes all the
              difference.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5 sm:mb-6">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-lg group w-full sm:w-auto"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Book appointment
              </a>
              <Link to="/services" className="btn btn-secondary btn-lg group w-full sm:w-auto">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                View treatments
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[color:var(--rose)] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Qualified nurses</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[color:var(--rose)] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Evidence-based</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[color:var(--rose)] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Flexible bookings</span>
              </div>
            </div>
          </div>

          {/* Right: Video */}
          <div className="order-1 lg:order-2">
            {/* Mobile: Full width video breaking out of container */}
            <div className="lg:hidden relative animate-fade-in-up -mx-4 sm:-mx-6 lg:mx-0">
              <div className="relative overflow-hidden aspect-video group video-container" style={{
                width: '100vw'
              }}>
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="/WelcomeVideo.mp4"
                  autoPlay
                  loop
                  playsInline
                  muted={muted}
                />

                {/* Gradient overlays */}
                <div className="video-overlay absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                <div className="video-overlay absolute inset-0 bg-gradient-to-br from-[color:var(--rose)]/5 to-transparent pointer-events-none" />

                {/* Controls - Mobile */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-100 transition-opacity duration-300">
                  <button
                    onClick={toggleMute}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/25 backdrop-blur-md 
                             border border-white/40 text-white shadow-lg hover:bg-white/35 
                             focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200
                             hover:scale-110 active:scale-95"
                    aria-label={muted ? "Unmute video" : "Mute video"}
                  >
                    {muted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={togglePause}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/25 backdrop-blur-md 
                             border border-white/40 text-white shadow-lg hover:bg-white/35 
                             focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200
                             hover:scale-110 active:scale-95"
                    aria-label={paused ? "Play video" : "Pause video"}
                  >
                    {paused ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop: Styled video with container */}
            <div className="hidden lg:block relative w-full max-w-2xl ml-auto animate-fade-in-up lg:animate-slide-in-right">
              <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl border border-slate-200/50 shadow-xl lg:shadow-2xl bg-white/10 backdrop-blur-sm aspect-video group video-container">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="/WelcomeVideo.mp4"
                  autoPlay
                  loop
                  playsInline
                  muted={muted}
                />

                {/* Gradient overlays */}
                <div className="video-overlay absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                <div className="video-overlay absolute inset-0 bg-gradient-to-br from-[color:var(--rose)]/5 to-transparent pointer-events-none" />

                {/* Controls - Desktop */}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={toggleMute}
                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/25 backdrop-blur-md 
                             border border-white/40 text-white shadow-lg hover:bg-white/35 
                             focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200
                             hover:scale-110 active:scale-95"
                    aria-label={muted ? "Unmute video" : "Mute video"}
                  >
                    {muted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={togglePause}
                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/25 backdrop-blur-md 
                             border border-white/40 text-white shadow-lg hover:bg-white/35 
                             focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200
                             hover:scale-110 active:scale-95"
                    aria-label={paused ? "Play video" : "Pause video"}
                  >
                    {paused ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Reviews Section */}
      <ReviewsCarousel />
    </main>
  );
}
