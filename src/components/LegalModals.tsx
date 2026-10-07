import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, FileText, DollarSign, Mail, CheckCircle2, Lock, AlertCircle, HelpCircle } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 relative max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Privacy Policy</h2>
              <p className="text-xs text-slate-400">Effective Date: January 2026 • Compliant with Google AdSense & GDPR/CCPA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 py-4 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-indigo-400">
              1. Overview & Commitment to Privacy
            </h3>
            <p>
              AdobeMeta Pro (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the website and suite of microstock optimization tools. We respect your digital privacy. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service, and your privacy rights under applicable data protection laws.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-indigo-400">
              2. Data We Process (Local-First Image Security)
            </h3>
            <p>
              <strong>Image Content:</strong> When you upload images, vectors, or videos for metadata generation, files are processed dynamically for computer-vision analysis. We do not sell, store for third-party model training, or publicly redistribute your creative visual assets.
            </p>
            <p>
              <strong>API Keys:</strong> If you supply a custom Gemini API key, it is stored strictly inside your browser&apos;s local storage (<code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">localStorage</code>) and transmitted securely via HTTPS solely to process your requests.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-indigo-400">
              3. Google AdSense & Third-Party Advertising Cookies
            </h3>
            <p>
              We use Google AdSense to serve advertisements on our website. Google, as a third-party vendor, uses cookies to serve ads on our site based on users&apos; prior visits to our website or other websites on the Internet:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-indigo-400 underline">Google Ads Settings</a> or through <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="text-indigo-400 underline">aboutads.info</a>.
              </li>
              <li>
                We do not share any personal identifying contributor metadata with advertising networks.
              </li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-indigo-400">
              4. Cookies and Web Beacons
            </h3>
            <p>
              Like any other website, AdobeMeta Pro uses cookies to store information including visitors&apos; preferences (e.g. dark mode, chosen stock marketplace, excluded keyword lists), and the pages on the website that the visitor accessed. The information is used to optimize the user experience.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-indigo-400">
              5. GDPR & CCPA Contributor Privacy Rights
            </h3>
            <p>
              Under European General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you have the right to access, rectify, or request deletion of any personal data stored in connection with your account. You can purge all browser-stored metadata at any time using the &quot;Clear All&quot; tool.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-indigo-400">
              6. Contact Us
            </h3>
            <p>
              If you have any questions about this Privacy Policy, please reach out through our official <strong>Contact Support</strong> modal in the footer.
            </p>
          </section>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-xl transition text-sm shadow-md"
          >
            Understood & Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const TermsOfServiceModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 relative max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Terms of Service</h2>
              <p className="text-xs text-slate-400">Last Updated: 2026 • Acceptable Use & Contributor Guidelines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 py-4 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing and using AdobeMeta Pro, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue using our suite and services.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
              2. Intellectual Property & Marketplace Compliance
            </h3>
            <p>
              As a stock contributor, you maintain sole responsibility for the assets you submit to microstock agencies (including Adobe Stock, Shutterstock, Freepik, Getty Images, and Vecteezy).
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                You represent and warrant that you own or have obtained all necessary commercial property releases and model releases for people, private landmarks, and logos appearing in your submitted content.
              </li>
              <li>
                AdobeMeta Pro provides trademark and keyword recommendations as an algorithmic assistant. The contributor is responsible for final review before submission to agencies.
              </li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
              3. Independent Operation & Disclaimers
            </h3>
            <p>
              AdobeMeta Pro is an independent commercial optimization suite. Adobe Stock®, Shutterstock®, Freepik®, and Getty Images® are registered trademarks of their respective owners. AdobeMeta Pro is not affiliated with, sponsored by, or endorsed by Adobe Systems Inc. or Shutterstock Inc.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
              4. Prohibited Uses
            </h3>
            <p>
              You agree not to use the service to generate deceptive, defamatory, pornographic, or infringing metadata, or attempt to overwhelm or disrupt the service infrastructure.
            </p>
          </section>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2 rounded-xl transition text-sm shadow-md"
          >
            I Agree
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const EarningsDisclaimerModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 relative max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Earnings & Affiliate Disclaimer</h2>
              <p className="text-xs text-slate-400">FTC & Google Monetization Compliance Disclosure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 py-4 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
              1. Microstock Earnings Are Estimates, Not Guarantees
            </h3>
            <p>
              Any income statements, calculator projections (such as the Microstock Earnings & ROI Calculator), or potential earning scenarios presented on this website are hypothetical estimates based on historical contributor benchmark averages (Return Per Download, Download Per Asset ratios).
            </p>
            <p>
              There is <strong>no guarantee</strong> that you will earn any specific amount of money using the metadata, SEO strategies, or software tools on AdobeMeta Pro. Your actual results depend on numerous factors outside our control, including portfolio size, technical aesthetic quality, market demand, seasonal shifts, and individual marketplace curation decisions.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
              2. Affiliate & Advertising Disclosure
            </h3>
            <p>
              To keep our core metadata generator and research tools accessible, this site participates in affiliate partner programs (e.g. Wirestock, Topaz Labs) and displays contextual advertising via Google AdSense.
            </p>
            <p>
              When you click on sponsored links or partner banners, we may earn a small referral commission at no additional cost to you. We only recommend tools and services that we believe provide genuine value to professional microstock creators.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
              3. Objective SEO Optimization
            </h3>
            <p>
              Our algorithmic title and keyword engine is designed to optimize content relevance and buyer discoverability according to public marketplace guidelines (e.g. Adobe Stock&apos;s August 2026 title under 70 chars, top 10 keyword weight rule). We do not manipulate or guarantee algorithmic placement.
            </p>
          </section>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 rounded-xl transition text-sm shadow-md"
          >
            I Acknowledge
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const ContactSupportModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [copiedType, setCopiedType] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopiedType(label);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
      setMessage('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Direct Contact &amp; WhatsApp</h2>
              <p className="text-xs text-slate-400">Founder &amp; Lead Architect · Ratul Sorker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direct Instant Contact Cards (Gmail & WhatsApp) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              OFFICIAL GMAIL
            </div>
            <div className="text-xs font-bold text-white truncate">
              ratulsorker266@gmail.com
            </div>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="mailto:ratulsorker266@gmail.com"
                className="flex-1 text-center py-1.5 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition"
              >
                Send Email
              </a>
              <button
                type="button"
                onClick={() => handleCopy('ratulsorker266@gmail.com', 'gmail')}
                className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition cursor-pointer"
              >
                {copiedType === 'gmail' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
              DIRECT WHATSAPP
            </div>
            <div className="text-xs font-bold text-white">
              01317103754
            </div>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://wa.me/8801317103754"
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center py-1.5 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition"
              >
                Open WhatsApp
              </a>
              <button
                type="button"
                onClick={() => handleCopy('01317103754', 'wa')}
                className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition cursor-pointer"
              >
                {copiedType === 'wa' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Message Received!</h3>
            <p className="text-xs text-slate-300">
              Thank you for reaching out. For instant response, message directly on WhatsApp at 01317103754.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-4 space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Your Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contributor@example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Message / Details</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message or click WhatsApp above for instant chat..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="pt-1 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2 rounded-xl transition text-xs cursor-pointer shadow-md"
              >
                Send Message
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
