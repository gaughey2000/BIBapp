import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BOOKING_URL } from "../data";
import { ReviewsCarousel, useBookingModal } from "../ui";

export default function HomePage() {
  const assetBase = import.meta.env.BASE_URL;
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const { setOpen: setBookingOpen } = useBookingModal();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => setMuted(video.muted);
    video.addEventListener("volumechange", sync);
    return () => video.removeEventListener("volumechange", sync);
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const togglePause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  return (
    <main
      id="main"
      className="min-h-screen bg-gradient-to-br from-white via-[color:var(--cream)] to-slate-50"
    >
      <section className="w-full">
        <div className="relative w-full animate-fade-in-up">
          <div className="relative overflow-hidden aspect-video lg:aspect-[21/9] lg:max-h-[70vh] w-full video-container">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={`${assetBase}WelcomeVideo.mp4`}
              autoPlay
              loop
              playsInline
              muted={muted}
            />
            <div className="video-overlay absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            <div className="video-overlay absolute inset-0 bg-gradient-to-br from-[color:var(--rose)]/5 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-100 transition-opacity duration-300">
              <button
                onClick={toggleMute}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/25 backdrop-blur-md border border-white/40 text-white shadow-lg hover:bg-white/35 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label={muted ? "Unmute video" : "Mute video"}
              >
                {muted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={togglePause}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/25 backdrop-blur-md border border-white/40 text-white shadow-lg hover:bg-white/35 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label={paused ? "Play video" : "Pause video"}
              >
                {paused ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-narrow">
          <div className="py-2 sm:py-4 md:py-6 lg:py-0 animate-fade-in-up">
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
              Welcome to BIB{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--rose)] to-[color:var(--rose-dark)]">
                <br />
                Aesthetic Clinic.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mb-5 sm:mb-6 leading-relaxed">
              Our aim is to provide individual, tailored treatments that deliver
              natural-looking results. All aesthetic treatments are carried out
              by Rachel McGaughey, an experienced registered nurse and
              independent prescriber. Rachel is dedicated to the highest ethical
              standards and is committed to delivering safe, effective, and
              personalised care. We use the latest innovative treatments and
              premium products to help you look and feel refreshed, boost your
              confidence, and enhance your natural appearance and overall
              wellbeing.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5 sm:mb-6">
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
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
              </button>
              <Link
                to="/services"
                className="btn btn-secondary btn-lg group w-full sm:w-auto"
              >
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
              <a
                href="https://www.instagram.com/bibaesthetics/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-lg group w-full sm:w-auto"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM17.5 6a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
                </svg>
                Follow on Instagram
              </a>
            </div>

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
        </div>
      </section>

      <ReviewsCarousel />
    </main>
  );
}
