// client/src/pages/ExternalBooking.jsx
import { useEffect } from 'react';

export default function ExternalBooking() {
  useEffect(() => {
    // In production, this would redirect to the actual external booking system
    // For now, we show a placeholder
    document.title = 'Book Your Appointment | BIB Beauty';
  }, []);

  return (
    <div className="min-h-screen bg-[color:var(--cream)] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-2xl w-full">
        <div className="card-elevated p-6 sm:p-8 md:p-12 text-center animate-fade-in-up">
          {/* Logo or Icon */}
          <div className="mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-[color:var(--rose)]/10 rounded-full flex items-center justify-center">
              <svg 
                className="w-8 h-8 sm:w-10 sm:h-10 text-[color:var(--rose)]" 
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
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[color:var(--ink)] mb-3 sm:mb-4">
            Book Your Appointment
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8">
            Our online booking system will be available here soon.
          </p>

          {/* Placeholder Content */}
          <div className="bg-slate-50 rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 border border-slate-200">
            <h2 className="text-lg sm:text-xl font-semibold text-[color:var(--ink)] mb-4 sm:mb-6">
              In the meantime, you can book by:
            </h2>
            
            <div className="space-y-4 sm:space-y-5 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[color:var(--ink)] text-sm sm:text-base">Phone</p>
                  <p className="text-slate-600 text-sm sm:text-base">Call us to schedule your appointment</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[color:var(--ink)] text-sm sm:text-base">Email</p>
                  <p className="text-slate-600 text-sm sm:text-base">Send us a message with your preferred time</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--rose)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--rose)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[color:var(--ink)] text-sm sm:text-base">Social Media</p>
                  <p className="text-slate-600 text-sm sm:text-base">Message us on Facebook or Instagram</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a 
              href="/contact" 
              className="btn btn-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </a>
            <a 
              href="/services" 
              className="btn btn-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              View Services
            </a>
          </div>

          {/* Note */}
          <p className="text-xs sm:text-sm text-slate-500 mt-6 sm:mt-8">
            This page will redirect to our booking system once configured.
          </p>
        </div>
      </div>
    </div>
  );
}
