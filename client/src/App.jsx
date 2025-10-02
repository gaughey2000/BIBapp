import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import UserBookingPage from "./pages/UserBookingPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Fallback
function NotFound() {
  return <div style={{ padding: 24 }}><h2>Page not found</h2></div>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Navbar /> 
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/book" element={<UserBookingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}