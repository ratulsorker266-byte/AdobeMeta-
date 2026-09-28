import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, Shield, Check, X } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPrivacy: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('adobemeta_cookie_consent');
    if (!consent) {
      // Small timeout so it doesn't flicker immediately upon page render
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('adobemeta_cookie_consent', 'accepted');
    setIsVisible(false);
    // Notify Google AdSense adsbygoogle if present
    if (typeof window !== 'undefined' && (window as any).gtag) {
      try {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'granted',
          analytics_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      } catch (_) {}
    }
  };

  const handleDecline = () => {
    localStorage.setItem('adobemeta_cookie_consent', 'essential_only');
    setIsVisible(false);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      try {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      } catch (_) {}
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[140] bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 shadow-2xl rounded-2xl p-4 sm:p-5 text-slate-200"
      >
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Cookie & Ad Preferences
              </h4>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                Google AdSense & GDPR
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              We use essential cookies for application preferences and partner cookies to serve relevant contributor ads and keep our free tier accessible.{' '}
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Privacy Policy
              </button>
              .
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleAccept}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Accept All
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs px-3 py-2 rounded-xl transition"
              >
                Essential Only
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
