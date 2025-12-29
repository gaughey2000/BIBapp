// client/src/pages/TermsPage.jsx
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-rose-600 hover:text-rose-700 text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        {/* Content */}
        <div className="prose prose-rose max-w-none bg-white rounded-xl shadow-sm p-8 space-y-6">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using the BIB Beauty website and services ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our Service.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              These Terms apply to all visitors, users, and others who access or use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              BIB Beauty provides aesthetic treatment services including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Botulinum Toxin (Anti-wrinkle) treatments</li>
              <li>Dermal filler treatments</li>
              <li>Chemical peels</li>
              <li>Skin care treatments</li>
              <li>Other aesthetic services as advertised</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              All treatments are performed by qualified practitioners in accordance with UK healthcare standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Booking and Appointments</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.1 Making a Booking</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Bookings can be made through our online booking system or by phone</li>
              <li>You must provide accurate contact information</li>
              <li>You must be 18 years or older to book treatments</li>
              <li>A booking is confirmed once you receive a confirmation email or message</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.2 Cancellation Policy</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>24 hours or more notice:</strong> Full refund or free rescheduling</li>
              <li><strong>Less than 24 hours notice:</strong> 50% cancellation fee may apply</li>
              <li><strong>No-show:</strong> Full treatment cost may be charged</li>
              <li>Emergency cancellations will be considered on a case-by-case basis</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.3 Rescheduling</h3>
            <p className="text-gray-700 leading-relaxed">
              You may reschedule your appointment up to 24 hours before the scheduled time without penalty. Please contact us as soon as possible if you need to change your appointment.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.4 Late Arrivals</h3>
            <p className="text-gray-700 leading-relaxed">
              If you arrive late, we will try to accommodate you but cannot guarantee the full treatment time. Appointments may need to be shortened or rescheduled. Full charges apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Terms</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Prices are displayed in GBP (£) and include VAT where applicable</li>
              <li>Payment is required at the time of treatment unless other arrangements are made</li>
              <li>We accept [list payment methods: cash, card, bank transfer]</li>
              <li>Prices are subject to change but will be honored for confirmed bookings</li>
              <li>Deposits may be required for certain treatments (will be specified at booking)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Medical Information and Consent</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">5.1 Medical History</h3>
            <p className="text-gray-700 leading-relaxed">
              You must provide accurate medical history and disclose:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Any medical conditions</li>
              <li>Current medications and supplements</li>
              <li>Previous aesthetic treatments</li>
              <li>Allergies or sensitivities</li>
              <li>Pregnancy or breastfeeding status</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">5.2 Consultation</h3>
            <p className="text-gray-700 leading-relaxed">
              A consultation will be conducted before treatment to assess suitability. We reserve the right to refuse treatment if it is deemed unsafe or inappropriate.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">5.3 Informed Consent</h3>
            <p className="text-gray-700 leading-relaxed">
              You will be asked to sign a consent form acknowledging that you understand:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>The nature of the treatment</li>
              <li>Potential risks and side effects</li>
              <li>Expected results and limitations</li>
              <li>Aftercare requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Treatment Results and Limitations</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Results vary between individuals and cannot be guaranteed</li>
              <li>Multiple sessions may be required for optimal results</li>
              <li>Before and after photos may be taken for medical records (with consent)</li>
              <li>Touch-up treatments may be necessary and may incur additional costs</li>
              <li>Results are temporary and will require maintenance treatments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Aftercare and Follow-up</h2>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Following aftercare instructions provided</li>
              <li>Reporting any adverse reactions promptly</li>
              <li>Attending follow-up appointments if required</li>
              <li>Avoiding certain activities as advised (e.g., exercise, sun exposure)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Liability and Insurance</h2>
            <p className="text-gray-700 leading-relaxed">
              BIB Beauty maintains professional indemnity insurance in accordance with UK requirements.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              We are not liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Results that do not meet your expectations (when treatment was performed correctly)</li>
              <li>Complications arising from failure to follow aftercare instructions</li>
              <li>Reactions due to undisclosed medical conditions or medications</li>
              <li>Natural variations in treatment response</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              In the unlikely event of complications from proper treatment, we will provide appropriate follow-up care.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the property of BIB Beauty and protected by UK and international copyright laws.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              You may not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Reproduce, distribute, or create derivative works</li>
              <li>Use our content for commercial purposes without permission</li>
              <li>Remove copyright or proprietary notices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Website Use</h2>
            <p className="text-gray-700 leading-relaxed">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Use the website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the website</li>
              <li>Upload viruses or malicious code</li>
              <li>Collect information about other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the content or practices of these websites. We encourage you to review their terms and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Complaints and Disputes</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have a complaint about our services:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>Contact us directly at <a href="mailto:complaints@bibbeauty.co.uk" className="text-rose-600 hover:text-rose-700">complaints@bibbeauty.co.uk</a></li>
              <li>We will investigate and respond within 14 working days</li>
              <li>If unsatisfied, you may escalate to relevant regulatory bodies</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service constitutes acceptance of revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Contact Information</h2>
            <div className="bg-rose-50 p-6 rounded-lg mt-4">
              <p className="text-gray-800"><strong>BIB Beauty</strong></p>
              <p className="text-gray-700">Email: <a href="mailto:info@bibbeauty.co.uk" className="text-rose-600 hover:text-rose-700">info@bibbeauty.co.uk</a></p>
              <p className="text-gray-700">Address: [Your Business Address]</p>
              <p className="text-gray-700">Phone: [Your Phone Number]</p>
            </div>
          </section>

          <section className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-500">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Important Notice</h2>
            <p className="text-amber-800">
              By booking an appointment or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </section>

        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-x-4 text-sm">
          <Link to="/privacy" className="text-rose-600 hover:text-rose-700">Privacy Policy</Link>
          <span className="text-gray-400">•</span>
          <Link to="/cookie-policy" className="text-rose-600 hover:text-rose-700">Cookie Policy</Link>
          <span className="text-gray-400">•</span>
          <Link to="/contact" className="text-rose-600 hover:text-rose-700">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
