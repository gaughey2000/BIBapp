import { useState, useEffect, useCallback } from 'react';

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    text: "Absolutely amazing experience! The team at BIB is so professional and knowledgeable. My skin has never looked better after the chemical peel treatment.",
    date: "2024-01-15",
    treatment: "Chemical Peel",
    verified: true
  },
  {
    id: 2,
    name: "Emma Williams", 
    rating: 5,
    text: "I was nervous about botulinum toxin but the consultation was thorough and the results are natural and beautiful. Highly recommend!",
    date: "2024-01-20",
    treatment: "Botulinum Toxin",
    verified: true
  },
  {
    id: 3,
    name: "Lisa Chen",
    rating: 5,
    text: "The clinic is spotless and the staff are incredibly welcoming. My dermal filler results exceeded my expectations. Will definitely be back!",
    date: "2024-01-28",
    treatment: "Dermal Filler",
    verified: true
  },
  {
    id: 4,
    name: "Rebecca Thompson",
    rating: 5,
    text: "Professional, clean, and such great results! The skincare advice I received has transformed my daily routine. Thank you BIB team!",
    date: "2024-02-05",
    treatment: "Skin Care Consultation",
    verified: true
  },
  {
    id: 5,
    name: "Victoria Adams",
    rating: 5,
    text: "I've tried several clinics but BIB is by far the best. The attention to detail and aftercare support is exceptional. Couldn't be happier!",
    date: "2024-02-12",
    treatment: "Botulinum Toxin & Dermal Filler",
    verified: true
  }
];

export default function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextReview = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, []);

  const prevReview = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, []);

  const goToReview = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(nextReview, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextReview]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-slate-200'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[color:var(--rose)]/10 rounded-full text-xs sm:text-sm font-medium text-[color:var(--rose)] mb-4 sm:mb-6">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Client reviews
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-3 sm:mb-4">
            What our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--rose)] to-[color:var(--rose-dark)]">clients</span> say
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Real experiences from real clients who've transformed their confidence with BIB treatments.
          </p>
        </div>

        {/* Reviews Carousel */}
        <div 
          className="relative max-w-4xl mx-auto px-4"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Review Card */}
          <div className="card-elevated p-6 sm:p-8 md:p-12 text-center overflow-hidden">
            <div className="relative">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`transition-all duration-500 ease-in-out ${
                    index === currentIndex 
                      ? 'opacity-100 transform translate-x-0' 
                      : 'opacity-0 transform translate-x-full absolute inset-0'
                  }`}
                >
                  {/* Stars */}
                  <div className="flex justify-center gap-0.5 sm:gap-1 mb-4 sm:mb-6">
                    {renderStars(review.rating)}
                  </div>

                  {/* Review Text */}
                  <blockquote className="text-lg sm:text-xl md:text-2xl text-slate-700 font-medium leading-relaxed mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
                    "{review.text}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[color:var(--rose)] to-[color:var(--rose-dark)] flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900 text-sm sm:text-base">{review.name}</h4>
                        {review.verified && (
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500">
                        {review.treatment} • {formatDate(review.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Hidden on mobile, shown on hover on desktop */}
          <button
            onClick={prevReview}
            className="hidden sm:flex absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-200 shadow-lg items-center justify-center text-slate-600 hover:text-[color:var(--rose)] hover:border-[color:var(--rose)] transition-all duration-200 hover:shadow-xl group"
            aria-label="Previous review"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextReview}
            className="hidden sm:flex absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-200 shadow-lg items-center justify-center text-slate-600 hover:text-[color:var(--rose)] hover:border-[color:var(--rose)] transition-all duration-200 hover:shadow-xl group"
            aria-label="Next review"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToReview(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-[color:var(--rose)] shadow-lg scale-110'
                  : 'bg-slate-200 hover:bg-slate-300'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        {/* Google Reviews Link */}
        <div className="text-center mt-8 sm:mt-12">
          <a
            href="https://www.google.com/search?q=BIB+Beauty+Clinic+reviews" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 bg-white border border-slate-200 rounded-full text-sm sm:text-base text-slate-700 hover:border-[color:var(--rose)] hover:text-[color:var(--rose)] transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-medium">Read more reviews on Google</span>
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}