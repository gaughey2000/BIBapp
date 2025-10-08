// client/src/utils/analytics.js
// Simple analytics tracking helper

/**
 * Track an event to Google Analytics (if configured)
 * @param {string} eventName - Name of the event (e.g., 'booking_completed')
 * @param {object} properties - Additional event properties
 */
export function trackEvent(eventName, properties = {}) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
  
  // Console log in development for debugging
  if (import.meta.env.DEV) {
    console.log('📊 Analytics Event:', eventName, properties);
  }
}

/**
 * Track page views (usually called in route changes)
 * @param {string} path - Page path
 * @param {string} title - Page title
 */
export function trackPageView(path, title) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  }
  
  if (import.meta.env.DEV) {
    console.log('📊 Page View:', path, title);
  }
}

/**
 * Track errors for monitoring
 * @param {string} errorMessage - Error message
 * @param {string} errorSource - Where the error occurred
 */
export function trackError(errorMessage, errorSource = 'unknown') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: errorMessage,
      fatal: false,
      source: errorSource,
    });
  }
  
  if (import.meta.env.DEV) {
    console.log('📊 Error Tracked:', errorMessage, 'from', errorSource);
  }
}

/**
 * Initialize Google Analytics (call this in main.jsx)
 * @param {string} measurementId - GA4 Measurement ID (e.g., 'G-XXXXXXXXXX')
 */
export function initAnalytics(measurementId) {
  if (!measurementId || typeof window === 'undefined') return;
  
  // Load GA4 script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);
  
  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false, // We'll track page views manually
  });
  
  console.log('✅ Analytics initialized:', measurementId);
}

// Usage examples:
// 
// In main.jsx:
//   import { initAnalytics } from './utils/analytics';
//   if (import.meta.env.VITE_GA_ID) {
//     initAnalytics(import.meta.env.VITE_GA_ID);
//   }
//
// In components:
//   import { trackEvent } from '../utils/analytics';
//   trackEvent('booking_completed', {
//     service_id: serviceId,
//     service_name: serviceName,
//     price: price_cents / 100,
//   });
