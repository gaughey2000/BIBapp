import { Link } from "react-router-dom";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            to="/"
            className="text-rose-600 hover:text-rose-700 text-sm mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="prose prose-rose max-w-none bg-white rounded-xl shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              BIB Beauty ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our booking services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We are registered in the United Kingdom and comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">2.1 Personal Information</h3>
            <p className="text-gray-700 leading-relaxed">When you book an appointment, we collect:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Name:</strong> To identify you and your booking</li>
              <li><strong>Email address:</strong> To send booking confirmations and updates</li>
              <li><strong>Phone number:</strong> To contact you about your appointment</li>
              <li><strong>Appointment details:</strong> Service type, date, time, and any special requirements</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">2.2 Technical Information</h3>
            <p className="text-gray-700 leading-relaxed">We automatically collect:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and time spent</li>
              <li>Referring website addresses</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">2.3 Cookies</h3>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to enhance your experience. See our{" "}
              <Link to="/cookie-policy" className="text-rose-600 hover:text-rose-700">Cookie Policy</Link> for details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Provide services:</strong> Process and manage your bookings</li>
              <li><strong>Communicate:</strong> Send appointment confirmations, reminders, and updates</li>
              <li><strong>Improve services:</strong> Analyze usage patterns to enhance our website and services</li>
              <li><strong>Legal compliance:</strong> Comply with legal obligations and resolve disputes</li>
              <li><strong>Security:</strong> Detect and prevent fraud or unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Legal Basis for Processing (UK GDPR)</h2>
            <p className="text-gray-700 leading-relaxed">We process your personal data based on:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Contract:</strong> To fulfill our booking agreement with you</li>
              <li><strong>Consent:</strong> Where you have given explicit consent (e.g., marketing emails)</li>
              <li><strong>Legitimate interests:</strong> To improve our services and website functionality</li>
              <li><strong>Legal obligation:</strong> To comply with tax, accounting, and other legal requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Service providers:</strong> Hosting, email, and analytics services (e.g., Render, SendGrid)</li>
              <li><strong>Legal authorities:</strong> When required by law or to protect our rights</li>
              <li><strong>Business transfers:</strong> In the event of a merger, sale, or acquisition</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              All third-party service providers are required to protect your data in accordance with UK GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide our services to you</li>
              <li>Comply with legal obligations (typically 7 years for financial records)</li>
              <li>Resolve disputes and enforce our agreements</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              After this period, we will securely delete or anonymize your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights Under UK GDPR</h2>
            <p className="text-gray-700 leading-relaxed">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Restrict processing:</strong> Limit how we use your data</li>
              <li><strong>Data portability:</strong> Receive your data in a structured format</li>
              <li><strong>Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Withdraw consent:</strong> Withdraw consent at any time (where applicable)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, contact us at: <a href="mailto:privacy@bibbeauty.co.uk" className="text-rose-600 hover:text-rose-700">privacy@bibbeauty.co.uk</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>Regular security updates and monitoring</li>
              <li>Access controls and authentication</li>
              <li>Regular backups</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are intended for adults aged 18 and over. We do not knowingly collect information from children under 18. If you believe we have collected such information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your data may be transferred to and processed in countries outside the UK. We ensure appropriate safeguards are in place, such as:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Adequacy decisions by the UK government</li>
              <li>Service providers certified under appropriate data protection frameworks</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. For significant changes, we will notify you by email or prominent notice on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy or wish to exercise your rights:
            </p>
            <div className="bg-rose-50 p-6 rounded-lg mt-4">
              <p className="text-gray-800"><strong>BIB Beauty</strong></p>
              <p className="text-gray-700">Email: <a href="mailto:privacy@bibbeauty.co.uk" className="text-rose-600 hover:text-rose-700">privacy@bibbeauty.co.uk</a></p>
              <p className="text-gray-700">Address: BiB Clinic, 9 Maryland Avenue, Bolton</p>
              <p className="text-gray-700">Phone: 07880658042</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Complaints</h2>
            <p className="text-gray-700 leading-relaxed">
              If you believe we have not handled your data properly, you have the right to lodge a complaint with the Information Commissioner's Office (ICO):
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p className="text-gray-800"><strong>Information Commissioner's Office</strong></p>
              <p className="text-gray-700">Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:text-rose-700">ico.org.uk</a></p>
              <p className="text-gray-700">Helpline: 0303 123 1113</p>
              <p className="text-gray-700">Address: Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF</p>
            </div>
          </section>
        </div>

        <div className="mt-8 text-center space-x-4 text-sm">
          <Link to="/terms" className="text-rose-600 hover:text-rose-700">Terms & Conditions</Link>
          <span className="text-gray-400">•</span>
          <Link to="/cookie-policy" className="text-rose-600 hover:text-rose-700">Cookie Policy</Link>
          <span className="text-gray-400">•</span>
          <Link to="/contact" className="text-rose-600 hover:text-rose-700">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
