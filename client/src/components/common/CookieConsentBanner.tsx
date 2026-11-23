import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Check, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('skybook_cookie_consent');
    if (!consent) {
      // Small timeout for smooth appearance after initial page load
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('skybook_cookie_consent', 'accepted_all');
    localStorage.setItem(
      'skybook_cookie_preferences',
      JSON.stringify({ essential: true, analytics: true, marketing: true })
    );
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('skybook_cookie_consent', 'essential_only');
    localStorage.setItem(
      'skybook_cookie_preferences',
      JSON.stringify({ essential: true, analytics: false, marketing: false })
    );
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          aria-label="Cookie consent"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 pointer-events-auto"
        >
          <div className="bg-slate-900/95 dark:bg-[#0c1833]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span>Cookie Transparency</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  We use cookies to maintain your booking session, ensure payment encryption, and personalize fare alerts. See our{' '}
                  <Link
                    to="/cookies"
                    onClick={() => setIsVisible(false)}
                    className="text-sky-400 hover:underline font-semibold"
                  >
                    Cookie Policy
                  </Link>.
                </p>
              </div>
              <button
                onClick={handleEssentialOnly}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              <Link
                to="/cookies"
                onClick={() => setIsVisible(false)}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Preferences
              </Link>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleEssentialOnly}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-semibold transition-colors"
                >
                  Essential Only
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept All</span>
                </button>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
