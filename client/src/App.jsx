import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import { ThemeProvider } from "./contexts/ThemeContext";

// Public pages
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import ExternalBooking from "./pages/ExternalBooking";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";

// Admin pages

// Fallback
function NotFound() {
  return <div style={{ padding: 24 }}><h2>Page not found</h2></div>;
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Navbar /> 
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/book" element={<ExternalBooking />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
        
        {/* Cookie Consent Banner */}
        <CookieConsent />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
