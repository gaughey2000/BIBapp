import { Routes, Route } from "react-router-dom";
import {
  AboutPage,
  ContactPage,
  CancellationPolicyPage,
  CookiePolicyPage,
  ExternalBooking,
  HomePage,
  PrivacyPolicyPage,
  ServiceDetailPage,
  ServicesPage,
  TermsPage,
} from "./pages";
import { BookingModalProvider, CookieConsent, ErrorBoundary, Footer, Navbar, ThemeProvider } from "./ui";

function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Page not found</h2>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BookingModalProvider>
        <ErrorBoundary>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/book" element={<ExternalBooking />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <CookieConsent />
        </ErrorBoundary>
      </BookingModalProvider>
    </ThemeProvider>
  );
}
