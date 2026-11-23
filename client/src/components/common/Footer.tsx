import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscriberEmail) {
      setEmailSubscribed(true);
      setSubscriberEmail('');
    }
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#171B24] text-slate-400 transition-colors">
      <div className="container max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand, Fare Alerts & Contact Details (5 cols) */}
          <div className="space-y-4 lg:col-span-5">
            <Logo forceLightMode={true} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Precision-engineered flight reservation engine. Real-time GDS airline inventory, live fare guarantees, and instant e-ticket issuance.
            </p>

            {/* Fare Alerts Subscription */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 block mb-1">
                Get Secret Fare Drop Alerts
              </span>
              <p className="text-xs text-slate-500 mb-2.5">
                Subscribe for private airline sales and flash discounts.
              </p>
              {emailSubscribed ? (
                <div className="text-xs text-slate-300 bg-[#0f131a] border border-slate-800 px-3.5 py-2.5 rounded-xl max-w-md">
                  You are on the VIP fare alert list.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    value={subscriberEmail}
                    onChange={(e) => setSubscriberEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 bg-[#0f131a] border border-slate-700/70 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-5 py-2.5 rounded-xl transition-all shrink-0 border border-slate-700/60"
                  >
                    Join
                  </button>
                </form>
              )}

              {/* ── Contact Details in a single horizontal line directly under the form ── */}
              <div className="mt-4 pt-3.5 border-t border-slate-800/80 max-w-md">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  {/* Email in left bottom */}
                  <a
                    href="mailto:support@skybook.com"
                    className="text-slate-300 hover:text-white transition-colors shrink-0"
                  >
                    support@skybook.com
                  </a>

                  {/* Toll number in middle bottom */}
                  <a
                    href="tel:+911148997800"
                    className="text-slate-300 hover:text-white transition-colors text-center shrink-0"
                  >
                    Toll: +91 (011) 4899-7800
                  </a>

                  {/* Office address in right bottom */}
                  <span className="text-slate-400 text-right shrink-0">
                    Aerocity, New Delhi
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Flight Routes (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Trending Routes
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/flights?origin=DEL&destination=BOM" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>New Delhi (DEL) → Mumbai (BOM)</span>
                  <span className="text-[11px] text-slate-500">From ₹3,899</span>
                </Link>
              </li>
              <li>
                <Link to="/flights?origin=BOM&destination=GOI" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Mumbai (BOM) → Goa (GOI)</span>
                  <span className="text-[11px] text-slate-500">From ₹3,499</span>
                </Link>
              </li>
              <li>
                <Link to="/flights?origin=DEL&destination=SXR" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>New Delhi (DEL) → Srinagar (SXR)</span>
                  <span className="text-[11px] text-slate-500">From ₹4,899</span>
                </Link>
              </li>
              <li>
                <Link to="/flights?origin=BLR&destination=DEL" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Bengaluru (BLR) → Delhi (DEL)</span>
                  <span className="text-[11px] text-slate-500">From ₹3,999</span>
                </Link>
              </li>
              <li>
                <Link to="/flights?origin=DEL&destination=DXB" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>New Delhi (DEL) → Dubai (DXB)</span>
                  <span className="text-[11px] text-slate-500">From ₹18,999</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Passenger Services & Policies (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Passenger Care
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/bookings" className="hover:text-white transition-colors">
                  Web Check-in
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-white transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/terms#baggage-policy" className="hover:text-white transition-colors">
                  Baggage Allowances
                </Link>
              </li>
              <li>
                <Link to="/terms#refund-policy" className="hover:text-white transition-colors">
                  Instant Refunds
                </Link>
              </li>
              <li>
                <Link to="/terms#passenger-rights" className="hover:text-white transition-colors">
                  Passenger Rights
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Accreditations (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Security & Trust
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div>
                <span className="text-slate-200 font-medium block">IATA Accredited</span>
                <span className="text-[11px] text-slate-500">Agent #14-3 9281</span>
              </div>

              <div>
                <span className="text-slate-200 font-medium block">256-bit SSL</span>
                <span className="text-[11px] text-slate-500">Bank-Grade Encryption</span>
              </div>

              <div>
                <span className="text-slate-200 font-medium block">PCI-DSS Certified</span>
                <span className="text-[11px] text-slate-500">Level 1 Compliant</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Row: Payments, Copyright & Legal */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          {/* Copyright */}
          <div>
            <p>© {new Date().getFullYear()} SkyBook Technologies Pvt. Ltd. All rights reserved.</p>
          </div>

          {/* Payment Method Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-[#0f131a] text-[10px] font-medium text-slate-400 font-mono border border-slate-800">
              VISA
            </span>
            <span className="px-2 py-0.5 rounded bg-[#0f131a] text-[10px] font-medium text-slate-400 font-mono border border-slate-800">
              Mastercard
            </span>
            <span className="px-2 py-0.5 rounded bg-[#0f131a] text-[10px] font-medium text-slate-400 font-mono border border-slate-800">
              RuPay
            </span>
            <span className="px-2 py-0.5 rounded bg-[#0f131a] text-[10px] font-medium text-slate-400 font-mono border border-slate-800">
              UPI
            </span>
            <span className="px-2 py-0.5 rounded bg-[#0f131a] text-[10px] font-medium text-slate-400 font-mono border border-slate-800">
              Amex
            </span>
            <span className="px-2 py-0.5 rounded bg-[#0f131a] text-[10px] font-medium text-slate-400 font-mono border border-slate-800">
              Apple Pay
            </span>
            <span className="px-2 py-0.5 rounded bg-[#0f131a] text-[10px] font-medium text-slate-400 font-mono border border-slate-800">
              NetBanking
            </span>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-3">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link to="/cookies" className="hover:text-slate-300 transition-colors">
              Cookies
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
};
