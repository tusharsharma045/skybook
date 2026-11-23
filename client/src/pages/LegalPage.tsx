import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  ShieldCheck,
  Cookie,
  Plane,
  Lock,
  Scale,
  Clock,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sliders,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type LegalTab = 'terms' | 'privacy' | 'cookies';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL path (/terms, /privacy, /cookies) or hash/query
  const getInitialTab = (): LegalTab => {
    const path = location.pathname.toLowerCase();
    if (path.includes('privacy')) return 'privacy';
    if (path.includes('cookie')) return 'cookies';
    return 'terms';
  };

  const [activeTab, setActiveTab] = useState<LegalTab>(getInitialTab());

  // Interactive Cookie Preferences State
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // Always true
    analytics: true,
    marketing: false,
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load existing cookie preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('skybook_cookie_preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCookieSettings((prev) => ({ ...prev, ...parsed, essential: true }));
      } catch (e) {
        // ignore parse error
      }
    }
  }, []);

  // Sync tab when route changes
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('privacy') && activeTab !== 'privacy') {
      setActiveTab('privacy');
    } else if (path.includes('cookie') && activeTab !== 'cookies') {
      setActiveTab('cookies');
    } else if (path.includes('terms') && activeTab !== 'terms') {
      setActiveTab('terms');
    }
    // Scroll to top on tab change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleTabChange = (tab: LegalTab) => {
    setActiveTab(tab);
    navigate(`/${tab}`, { replace: true });
  };

  const handleSaveCookiePreferences = () => {
    localStorage.setItem(
      'skybook_cookie_preferences',
      JSON.stringify(cookieSettings)
    );
    localStorage.setItem('skybook_cookie_consent', 'customized');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070e1c] text-slate-800 dark:text-slate-200 transition-colors py-10 sm:py-14">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 px-3 py-1 rounded-full mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Official Travel Policies & Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            SkyBook Legal & Trust Center
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Review our ticketing terms, passenger privacy commitments, and cookie disclosures in compliance with DGCA, IATA, and international aviation standards.
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Last revised: November 16, 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              IATA Accredited Passenger Charter
            </span>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex p-1.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm mb-10 overflow-x-auto">
          <button
            onClick={() => handleTabChange('terms')}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'terms'
                ? 'bg-primary text-white shadow-md shadow-sky-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => handleTabChange('privacy')}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'privacy'
                ? 'bg-primary text-white shadow-md shadow-sky-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => handleTabChange('cookies')}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'cookies'
                ? 'bg-primary text-white shadow-md shadow-sky-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Cookie className="w-4 h-4 shrink-0" />
            <span>Cookie Policy</span>
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm backdrop-blur-md">
          <AnimatePresence mode="wait">
            
            {/* ══════════════════════════════════════════════════════
                TAB 1: TERMS OF SERVICE
            ══════════════════════════════════════════════════════ */}
            {activeTab === 'terms' && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center gap-2.5 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Plane className="w-4 h-4" />
                    <span>Flight Reservation & Carriage Agreement</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    SkyBook Terms of Service
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Please read these terms carefully before booking any scheduled air travel through the SkyBook portal. By accessing, searching, reserving, or purchasing flights on SkyBook, you agree to be bound by these Terms and Conditions.
                  </p>
                </div>

                {/* Important Notice Callout */}
                <div className="rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 p-4 sm:p-5 flex gap-3.5">
                  <AlertCircle className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-sky-900 dark:text-sky-200 leading-relaxed">
                    <strong className="font-semibold block mb-0.5">Role of SkyBook as an Accredited Intermediary:</strong>
                    SkyBook Technologies Pvt. Ltd. acts solely as an authorized booking facilitator connecting passengers with scheduled passenger air carriers (e.g. IndiGo, Air India, Vistara, SpiceJet, Emirates, Qatar Airways). The contract of air carriage is directly between you (the passenger) and the operating airline, subject to the airline’s own Conditions of Carriage and DGCA guidelines.
                  </div>
                </div>

                {/* Section 1 */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-primary font-bold text-xs flex items-center justify-center shrink-0">1</span>
                    <span>Ticketing, PNR Generation & Name Accuracy</span>
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-2 pl-8">
                    <p>
                      <strong>Electronic Ticket Delivery:</strong> Upon successful transaction authorization, your electronic ticket (E-ticket) with an official 6-character Passenger Name Record (PNR) is generated instantly via Global Distribution Systems (GDS) and dispatched to your registered email and SMS.
                    </p>
                    <p>
                      <strong>Name Matching Requirement:</strong> The passenger’s full legal name entered at booking must match their government-issued photo identification (Aadhaar Card, Passport, Voter ID, or Driver’s License) exactly. Airlines strictly prohibit ticket transfers to third parties. Name changes are subject to operating airline fees and DGCA rules.
                    </p>
                  </div>
                </div>

                {/* Section 2 */}
                <div id="refund-policy" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-primary font-bold text-xs flex items-center justify-center shrink-0">2</span>
                    <span>Cancellations, Refunds & 24-Hour Look-in Window</span>
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-2 pl-8">
                    <p>
                      <strong>24-Hour Zero-Fee Cancellation Window:</strong> In accordance with DGCA Passenger Charter (CAR Section 3, Series M, Part IV), bookings made for travel commencing beyond 7 days from the booking date may be cancelled or modified within 24 hours of booking without any airline cancellation penalty.
                    </p>
                    <p>
                      <strong>Refund Processing Timelines:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                      <li>Credit / Debit Card transactions: Refund initiated to your original bank within <strong>3 to 7 working days</strong> from airline authorization.</li>
                      <li>UPI & NetBanking: Refund credited within <strong>24 to 48 hours</strong>.</li>
                      <li>Statutory taxes (Passenger Service Fee / User Development Fee) are <strong>100% refundable</strong> even on non-refundable tickets.</li>
                    </ul>
                  </div>
                </div>

                {/* Section 3 */}
                <div id="baggage-policy" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-primary font-bold text-xs flex items-center justify-center shrink-0">3</span>
                    <span>Baggage Allowances & Dangerous Goods</span>
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-2 pl-8">
                    <p>
                      Standard domestic baggage includes <strong>7 kg of hand baggage</strong> and <strong>15 kg of check-in baggage</strong> per passenger in Economy (unless booked under a "Hand Baggage Only" special saver fare). Extra baggage charges apply at airport check-in if limits are exceeded.
                    </p>
                    <p>
                      <strong>Restricted Articles:</strong> Power banks, loose lithium batteries, e-cigarettes, and flammable aerosols must strictly be carried in cabin baggage and are strictly prohibited in checked baggage under Bureau of Civil Aviation Security (BCAS) regulations.
                    </p>
                  </div>
                </div>

                {/* Section 4 */}
                <div id="passenger-rights" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-primary font-bold text-xs flex items-center justify-center shrink-0">4</span>
                    <span>Flight Schedule Changes, Delays & Denied Boarding</span>
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-2 pl-8">
                    <p>
                      Airlines reserve the right to alter flight schedules, equipment, or routes due to adverse weather, air traffic control directives, or operational safety constraints. SkyBook delivers real-time notifications via email and SMS whenever schedule change advisories are received.
                    </p>
                    <p>
                      In cases of severe delays exceeding 4 hours or involuntary denied boarding, passengers are entitled to meals, refreshments, alternate flights, or compensation per the <strong>DGCA Passenger Charter</strong>.
                    </p>
                  </div>
                </div>

                {/* Section 5 */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-primary font-bold text-xs flex items-center justify-center shrink-0">5</span>
                    <span>Governing Law & Legal Jurisdiction</span>
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
                    These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising out of bookings through SkyBook shall be subject to the exclusive jurisdiction of the competent courts in New Delhi, India.
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════
                TAB 2: PRIVACY POLICY
            ══════════════════════════════════════════════════════ */}
            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Lock className="w-4 h-4" />
                    <span>Passenger Data Protection & Encryption</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    SkyBook Privacy Policy
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    At SkyBook, your travel privacy is paramount. This policy explains what passenger data we collect, how it is processed for aviation compliance, and the bank-grade security protocols safeguarding your information.
                  </p>
                </div>

                {/* Security Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">256-Bit SSL/TLS</h4>
                      <p className="text-xs text-slate-500 mt-1">All data transmitted through military-grade encryption.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">PCI-DSS Level 1</h4>
                      <p className="text-xs text-slate-500 mt-1">Zero raw card storage; tokenized gateway transactions.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                    <Scale className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">DPDP & GDPR Ready</h4>
                      <p className="text-xs text-slate-500 mt-1">Full compliance with India's DPDP Act & international privacy rights.</p>
                    </div>
                  </div>
                </div>

                {/* Section 1 */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-500 font-bold text-xs flex items-center justify-center shrink-0">1</span>
                    <span>Personal Information We Collect</span>
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-2 pl-8">
                    <p>To confirm air travel reservations and issue legitimate airline boarding passes, we collect:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Identity Data:</strong> Full name (first, middle, last), date of birth, gender, nationality, and passport number/expiry date (for international travel).</li>
                      <li><strong>Contact Information:</strong> Valid email address, mobile phone number, and billing address for e-ticket delivery and security verification.</li>
                      <li><strong>Booking Records:</strong> Flight itineraries, PNR codes, seat preferences, frequent flyer numbers, and special meal requests.</li>
                      <li><strong>Payment Tokens:</strong> Encrypted payment identifiers generated by certified gateways (Razorpay, Stripe, UPI). SkyBook <em>never</em> captures or stores full credit card numbers or CVV codes.</li>
                    </ul>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-500 font-bold text-xs flex items-center justify-center shrink-0">2</span>
                    <span>How We Share Your Information</span>
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-2 pl-8">
                    <p>We do <strong>not</strong> sell or rent your personal data to marketing brokers. We disclose your data strictly to authorized aviation entities necessary to fulfill your journey:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Operating Airlines:</strong> To issue tickets, manage seat allocations, and handle check-in.</li>
                      <li><strong>Global Distribution Systems (GDS):</strong> Certified reservation engines (Amadeus, Sabre) that manage global airline inventories.</li>
                      <li><strong>Aviation & Immigration Authorities:</strong> Bureau of Immigration, CISF, and DGCA as required under aviation security statutes.</li>
                    </ul>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-500 font-bold text-xs flex items-center justify-center shrink-0">3</span>
                    <span>Passenger Data Rights & Data Retention</span>
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-2 pl-8">
                    <p>
                      Under applicable data protection laws, you have the right to request a copy of your personal data, rectify inaccuracies, or request account erasure. Note that booking transaction records must be retained for up to 7 years in compliance with financial auditing and Indian tax regulations.
                    </p>
                  </div>
                </div>

                {/* Section 4 */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-500 font-bold text-xs flex items-center justify-center shrink-0">4</span>
                    <span>Grievance Redressal & Data Protection Officer</span>
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-8 space-y-2">
                    <p>For any privacy concerns or data access requests, please contact our designated Grievance Officer:</p>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                      <div><strong>Officer:</strong> Rahul Sharma, Data Protection Officer</div>
                      <div><strong>Email:</strong> <a href="mailto:privacy@skybook.com" className="text-sky-600 dark:text-sky-400 hover:underline">privacy@skybook.com</a></div>
                      <div><strong>Address:</strong> SkyBook Technologies Pvt. Ltd., Level 4, Worldmark 2, Aerocity, New Delhi 110037, India</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════
                TAB 3: COOKIE POLICY & PREFERENCES
            ══════════════════════════════════════════════════════ */}
            {activeTab === 'cookies' && (
              <motion.div
                key="cookies"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Cookie className="w-4 h-4" />
                    <span>Browser Storage & Transparency</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    SkyBook Cookie Policy
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Cookies and local storage allow SkyBook to hold your flight search parameters, authenticate your login session, and present real-time fare drop alerts. You have full granular control over non-essential cookies below.
                  </p>
                </div>

                {/* ── Interactive Cookie Preference Center ── */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6 space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-500" />
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Cookie Preferences Center
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500">Settings save to your browser</span>
                  </div>

                  {savedSuccess && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Your cookie preferences have been successfully updated!</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* 1. Essential Cookies */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Strictly Necessary Cookies</h4>
                          <Badge variant="outline" className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold border-none">
                            Always Active
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          Essential for secure login authentication, CSRF fraud prevention, temporary hold of selected flight seats, and secure checkout. Cannot be switched off.
                        </p>
                      </div>
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled={true}
                          className="w-4 h-4 rounded text-primary focus:ring-primary opacity-60 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* 2. Analytical & Performance Cookies */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Performance & Flight Speed Diagnostics</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          Collects anonymous statistics on flight search response times, API latencies, and browser rendering to help us optimize server capacity during peak holiday seasons.
                        </p>
                      </div>
                      <div className="pt-1">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cookieSettings.analytics}
                            onChange={(e) =>
                              setCookieSettings((prev) => ({
                                ...prev,
                                analytics: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>

                    {/* 3. Personalization & Fare Drop Cookies */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Fare Drop Alerts & Personalization</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          Remembers your recently searched flight routes (e.g. DEL to BOM) to display instant price reductions, seasonal airline sales, and customized travel packages.
                        </p>
                      </div>
                      <div className="pt-1">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cookieSettings.marketing}
                            onChange={(e) =>
                              setCookieSettings((prev) => ({
                                ...prev,
                                marketing: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      onClick={handleSaveCookiePreferences}
                      className="bg-primary hover:bg-sky-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Preferences</span>
                    </Button>
                  </div>
                </div>

                {/* Explanatory Sections */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Frequently Asked Questions about Cookies
                  </h3>
                  
                  <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">How can I clear cookies in my web browser?</h4>
                      <p className="text-xs leading-relaxed">
                        You can delete or block cookies at any time via your browser settings (Chrome, Safari, Firefox, Edge). Please note that disabling essential cookies may prevent you from completing flight reservations or accessing your saved tickets.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">Does SkyBook track my browsing across third-party websites?</h4>
                      <p className="text-xs leading-relaxed">
                        No. SkyBook does not utilize invasive cross-site tracking cookies. We only track flight searches conducted within the SkyBook domain to verify fare accuracy and prevent malicious automated bot scraping.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Support Help Strip */}
        <div className="mt-8 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-3">
          <span>Need legal clarification or custom invoice copies?</span>
          <a
            href="mailto:support@skybook.com"
            className="text-sky-600 dark:text-sky-400 hover:underline font-semibold flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Legal Team</span>
          </a>
          <span>•</span>
          <a
            href="tel:+911148997800"
            className="text-sky-600 dark:text-sky-400 hover:underline font-semibold flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>+91 (011) 4899-7800</span>
          </a>
        </div>

      </div>
    </div>
  );
};
