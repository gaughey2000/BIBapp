import { Link } from "react-router-dom";

export default function CookiePolicyPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              This Cookie Policy explains how BIB Beauty uses cookies and similar technologies on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-700 leading-relaxed">We use cookies to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our website</li>
              <li>Improve our website performance and user experience</li>
              <li>Provide relevant content and features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Types of Cookies We Use</h2>

            <div className="space-y-6 mt-6">
              <div className="border-l-4 border-rose-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.1 Essential Cookies (Strictly Necessary)</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies are necessary for the website to function and cannot be switched off.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-700">Cookie Name</th>
                        <th className="text-left py-2 text-gray-700">Purpose</th>
                        <th className="text-left py-2 text-gray-700">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr>
                        <td className="py-2 font-mono">cookie_consent</td>
                        <td className="py-2">Stores your cookie preferences</td>
                        <td className="py-2">1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.2 Functional Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies enable enhanced functionality and personalization.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-700">Cookie Name</th>
                        <th className="text-left py-2 text-gray-700">Purpose</th>
                        <th className="text-left py-2 text-gray-700">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr>
                        <td className="py-2 font-mono">language_pref</td>
                        <td className="py-2">Stores your language preference</td>
                        <td className="py-2">1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.3 Analytics Cookies (Optional)</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies help us understand how visitors interact with our website.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-700">Cookie Provider</th>
                        <th className="text-left py-2 text-gray-700">Purpose</th>
                        <th className="text-left py-2 text-gray-700">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr className="border-b">
                        <td className="py-2">Google Analytics</td>
                        <td className="py-2">Track website usage and traffic</td>
                        <td className="py-2">2 years</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">_ga, _gid</td>
                        <td className="py-2">Distinguish users and sessions</td>
                        <td className="py-2">2 years / 24 hours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  You can opt out of Google Analytics:{" "}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:text-rose-700">Google Analytics Opt-out</a>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Some cookies are placed by third-party services that appear on our pages:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li><strong>Google Analytics:</strong> Helps us understand website usage</li>
              <li><strong>Hosting providers:</strong> May set cookies for security and performance</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              These third parties have their own privacy policies. We recommend reviewing them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Managing Cookies</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">5.1 Browser Settings</h3>
            <p className="text-gray-700 leading-relaxed">
              Most web browsers allow you to control cookies through settings. You can:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li>View cookies stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block third-party cookies</li>
              <li>Block cookies from specific sites</li>
              <li>Accept cookies by default</li>
            </ul>

            <div className="bg-blue-50 p-6 rounded-lg mt-6 border-l-4 border-blue-500">
              <p className="text-blue-900 font-semibold mb-2">⚠️ Important:</p>
              <p className="text-blue-800">
                Blocking or deleting cookies may prevent some features of our website from working properly. Essential cookies cannot be disabled as they are required for the site to function.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5.2 How to Manage Cookies by Browser</h3>
            <div className="space-y-2 mt-3">
              <p className="text-gray-700">
                <strong>Chrome:</strong> <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:text-rose-700">Manage cookies in Chrome</a>
              </p>
              <p className="text-gray-700">
                <strong>Firefox:</strong> <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:text-rose-700">Manage cookies in Firefox</a>
              </p>
              <p className="text-gray-700">
                <strong>Safari:</strong> <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:text-rose-700">Manage cookies in Safari</a>
              </p>
              <p className="text-gray-700">
                <strong>Edge:</strong> <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:text-rose-700">Manage cookies in Edge</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Do Not Track (DNT)</h2>
            <p className="text-gray-700 leading-relaxed">
              Some browsers include a "Do Not Track" (DNT) feature that signals websites you don't want to be tracked. We respect DNT signals and will not track users who have enabled this feature.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookie Consent</h2>
            <p className="text-gray-700 leading-relaxed">
              When you first visit our website, we will ask for your consent to use non-essential cookies. You can change your preferences at any time by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li>Clicking the "Cookie Settings" link in the website footer</li>
              <li>Accessing your browser's cookie settings</li>
              <li>Contacting us directly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about our use of cookies:
            </p>
            <div className="bg-rose-50 p-6 rounded-lg mt-4">
              <p className="text-gray-800"><strong>BIB Beauty</strong></p>
              <p className="text-gray-700">Email: <a href="mailto:privacy@bibbeauty.co.uk" className="text-rose-600 hover:text-rose-700">privacy@bibbeauty.co.uk</a></p>
              <p className="text-gray-700">Address: [Your Business Address]</p>
            </div>
          </section>

          <section className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <h2 className="text-xl font-bold text-green-900 mb-2">✓ Your Privacy Matters</h2>
            <p className="text-green-800">
              We are committed to transparency about how we use cookies. You are always in control of your cookie preferences.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center space-x-4 text-sm">
          <Link to="/privacy" className="text-rose-600 hover:text-rose-700">Privacy Policy</Link>
          <span className="text-gray-400">•</span>
          <Link to="/terms" className="text-rose-600 hover:text-rose-700">Terms & Conditions</Link>
          <span className="text-gray-400">•</span>
          <Link to="/contact" className="text-rose-600 hover:text-rose-700">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
