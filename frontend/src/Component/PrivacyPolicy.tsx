import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, MapPin, Trash2, Mail, CheckCircle, FileText } from 'lucide-react';
import logo from '../assets/logo.png';
import { API_URL } from '../config/api';

export default function PrivacyPolicy() {
  const [dynamicPolicy, setDynamicPolicy] = useState<{ title?: string; content?: string; lastUpdated?: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPolicy = async () => {
      try {
        const res = await fetch(`${API_URL}/api/policies`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.content) {
            setDynamicPolicy(data);
          }
        }
      } catch (err) {
        // Fall back to built-in comprehensive policy
      }
    };
    fetchPolicy();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="ForeSpark Logo" className="w-8 h-8 object-contain transition-transform group-hover:scale-105" />
            <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-600">ForeSpark AI</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            Data Protection &amp; Terms
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            {dynamicPolicy?.title || 'Privacy Policy & Terms of Service'}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl">
            At ForeSpark AI, we are committed to protecting your privacy and ensuring the security of your personal information and telemetry data.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 font-medium">
            Last Updated: {dynamicPolicy?.lastUpdated ? new Date(dynamicPolicy.lastUpdated).toLocaleDateString() : 'September 6, 2026'}
          </div>
        </div>

        {/* Dynamic Admin Policy if custom text is configured */}
        {dynamicPolicy?.content && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Platform Guidelines &amp; Directives
            </h2>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-100">
              {dynamicPolicy.content}
            </div>
          </div>
        )}

        {/* Structured Sections (Compliant with Google Play & Web Standards) */}
        <div className="space-y-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
          {/* Section 1: Data Collection */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg">
                1
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Information We Collect</h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
              To deliver accurate wildfire prediction, satellite terrain analysis, and personalized safety reports, ForeSpark collects the following information:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-1 text-sm">
                  <CheckCircle className="w-4 h-4" /> Personal Profile
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Name, email address, and authentication provider credentials (such as Google OAuth) to manage your account.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-1 text-sm">
                  <MapPin className="w-4 h-4" /> Geolocation Telemetry
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Approximate and precise GPS coordinates when using the interactive map or scanning nearby forest terrain for fire risk.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2: How Data is Used */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg">
                2
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">How We Use Your Information</h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-3">
              We collect information strictly to provide and improve our environmental intelligence platform:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-slate-600 list-disc list-inside pl-2">
              <li>Generating machine-learning wildfire risk predictions across chosen geographical grid coordinates.</li>
              <li>Retrieving satellite telemetry, historical burn data, and weather metrics for your scan location.</li>
              <li>Maintaining your scan history for comparison and longitudinal environmental analysis.</li>
              <li>Account management, security verification, and administrative communications.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3: Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Security &amp; Encryption</h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              All communications between your device and our servers are encrypted in transit using industry-standard <strong>Transport Layer Security (HTTPS/TLS)</strong>. We implement strict database access controls and password hashing algorithms to safeguard all stored records. We never sell, lease, or monetize your personal or location data to third parties.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4: Account & Data Deletion (Google Play Mandate) */}
          <section id="deletion">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 font-bold text-lg">
                <Trash2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Account &amp; Data Deletion Request</h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
              You have the right to request the permanent deletion of your ForeSpark AI account, including your profile information, authentication records, and historical scans.
            </p>
            <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2">How to Request Deletion:</h3>
              <ol className="space-y-2 text-xs sm:text-sm text-slate-700 list-decimal list-inside">
                <li>Send an email to <a href="mailto:support@forespark.net" className="font-bold text-red-600 hover:underline">support@forespark.net</a> or <a href="mailto:mohamedgabel1@gmail.com" className="font-bold text-red-600 hover:underline">mohamedgabel1@gmail.com</a> from the email address registered with your account.</li>
                <li>State in the subject line: <strong>&ldquo;Account Deletion Request - ForeSpark AI&rdquo;</strong>.</li>
                <li>Our security team will verify your identity and permanently purge your account records, telemetry data, and credentials within 7 business days.</li>
              </ol>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 5: Third-Party Integrations */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg">
                5
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Third-Party Services</h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-3">
              ForeSpark utilizes trusted third-party providers strictly for core platform functionality:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside pl-2">
              <li><strong>Clerk &amp; Google OAuth</strong>: For secure, identity-verified sign-in and passwordless authentication.</li>
              <li><strong>Google Maps Platform</strong>: For rendering satellite maps and pinpointing terrain coordinates.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 6: Contact Us */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Contact Us</h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-2">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact our team:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 inline-block text-sm">
              <p className="font-semibold text-slate-900">ForeSpark AI Privacy &amp; Compliance</p>
              <p className="text-slate-600 mt-1">
                Email: <a href="mailto:support@forespark.net" className="text-emerald-600 font-medium hover:underline">support@forespark.net</a> / <a href="mailto:mohamedgabel1@gmail.com" className="text-emerald-600 font-medium hover:underline">mohamedgabel1@gmail.com</a>
              </p>
              <p className="text-slate-600 mt-1">Website: <a href="https://www.forespark.net" className="text-emerald-600 font-medium hover:underline">https://www.forespark.net</a></p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} ForeSpark AI. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/" className="hover:text-slate-600">Home</Link>
            <Link to="/documentation" className="hover:text-slate-600">Documentation</Link>
            <Link to="/privacy" className="text-emerald-600 font-semibold hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
