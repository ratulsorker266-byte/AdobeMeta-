import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Fingerprint,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { AdobeMetaProLogo } from './AdobeMetaProLogo';

interface ArchitecturalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onGoogleLogin: () => Promise<void>;
  onEmailAuth: (mode: 'signin' | 'signup', email: string, password: string, fullName?: string) => Promise<void>;
  onLogout: () => Promise<void>;
  themeMode: 'light' | 'dark';
}

export const ArchitecturalAuthModal: React.FC<ArchitecturalAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onGoogleLogin,
  onEmailAuth,
  onLogout,
  themeMode
}) => {
  const isLight = themeMode === 'light';
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStage, setAuthStage] = useState<'idle' | 'scanning' | 'verified'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setAuthStage('idle');
      setIsSubmitting(false);
    }
  }, [isOpen, authMode]);

  if (!isOpen) return null;

  const isAuthenticated = Boolean(user && user.uid);

  const handleGoogleSubmit = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    setAuthStage('scanning');
    try {
      await onGoogleLogin();
      setAuthStage('verified');
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setAuthStage('idle');
      const code = String(err?.code || '');
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setErrorMsg('Google sign-in window was closed. Click "Continue with Google" again or sign in with your Email below.');
      } else if (code === 'auth/popup-blocked') {
        setErrorMsg('Popup was blocked by your browser. Please allow popups or sign in directly with your Email & Password below.');
      } else {
        setErrorMsg('Google popup could not complete in this preview window. Please use Email & Password below for instant sign-in.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMsg('Please enter a valid contributor email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (authMode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name or studio name.');
      return;
    }

    setIsSubmitting(true);
    setAuthStage('scanning');
    try {
      await onEmailAuth(authMode, trimmedEmail, password, fullName.trim());
      setAuthStage('verified');
      setTimeout(() => {
        onClose();
      }, 950);
    } catch (err: any) {
      setAuthStage('idle');
      const code = String(err?.code || '');
      if (code === 'auth/wrong-password') {
        setErrorMsg('Incorrect password for this contributor email. Please double-check your password.');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already registered. Switching to Sign In mode...');
        setAuthMode('signin');
      } else if (code === 'auth/weak-password') {
        setErrorMsg('Please choose a stronger password (at least 6 characters).');
      } else {
        setErrorMsg('Could not verify credentials. Please check your email and password (minimum 6 characters).');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOutClick = async () => {
    setIsSubmitting(true);
    try {
      await onLogout();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-[900px] rounded-3xl overflow-hidden border shadow-[0_32px_90px_rgba(0,0,0,0.55)] grid grid-cols-1 lg:grid-cols-12 ${
            isLight
              ? 'bg-[#faf8f5] border-neutral-200/90 text-neutral-900'
              : 'bg-[#090b10] border-white/15 text-neutral-100'
          }`}
        >
          {/* Left Column: 5D Optical Crystal Prism & Architectural Security Visualizer */}
          <div
            className={`lg:col-span-5 relative p-8 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r ${
              isLight
                ? 'bg-gradient-to-br from-[#f3efe8] via-[#ebe5da] to-[#faf8f5] border-neutral-200/80'
                : 'bg-gradient-to-br from-[#0d1017] via-[#07090e] to-[#111520] border-white/10'
            }`}
          >
            {/* Ambient Architectural Grid */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 ${
                isLight
                  ? 'bg-[linear-gradient(to_right,rgba(17,18,21,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,18,21,0.04)_1px,transparent_1px)] [background-size:32px_32px]'
                  : 'bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:32px_32px]'
              }`}
            />

            {/* Top Brand Header */}
            <div className="relative z-10">
              <AdobeMetaProLogo
                size="sm"
                showText={true}
                theme={isLight ? 'light' : 'dark'}
                subtitle="IDENTITY VAULT"
              />
              <p className={`mt-4 text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Encrypted contributor authentication with cloud metadata synchronization, custom API vault, and multi-agency export profiles.
              </p>
            </div>

            {/* Center 5D Geometric Orbital Prism Animation */}
            <div className="relative z-10 my-8 flex items-center justify-center py-6">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* Outer Slow Rotating Architectural Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: authStage === 'scanning' ? 4 : 24,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className={`absolute inset-0 rounded-full border border-dashed ${
                    authStage === 'verified'
                      ? 'border-emerald-500/60'
                      : authStage === 'scanning'
                      ? 'border-amber-500/70'
                      : isLight
                      ? 'border-neutral-400/50'
                      : 'border-white/20'
                  }`}
                />

                {/* Middle Counter-Rotating Specular Ring */}
                <motion.div
                  animate={{ rotate: -360, scale: authStage === 'scanning' ? [1, 1.06, 1] : 1 }}
                  transition={{
                    rotate: { duration: authStage === 'scanning' ? 3 : 16, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  className={`absolute inset-4 rounded-full border ${
                    authStage === 'verified'
                      ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                      : authStage === 'scanning'
                      ? 'border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
                      : isLight
                      ? 'border-neutral-300'
                      : 'border-white/15'
                  }`}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                </motion.div>

                {/* Inner Rotated Geometric Diamond */}
                <motion.div
                  animate={{
                    rotate: authStage === 'scanning' ? [45, 225, 405] : [45, 405]
                  }}
                  transition={{
                    duration: authStage === 'scanning' ? 2.5 : 18,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className={`w-24 h-24 rounded-2xl border backdrop-blur-md transition-colors duration-500 ${
                    authStage === 'verified'
                      ? 'bg-emerald-500/15 border-emerald-400/60'
                      : authStage === 'scanning'
                      ? 'bg-amber-500/15 border-amber-400/60'
                      : isLight
                      ? 'bg-white/80 border-neutral-300 shadow-lg'
                      : 'bg-white/5 border-white/20 shadow-2xl'
                  }`}
                />

                {/* Core Status Icon */}
                <div className="relative z-20 flex flex-col items-center justify-center text-center">
                  {authStage === 'verified' ? (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-emerald-500"
                    >
                      <CheckCircle2 className="w-9 h-9" />
                    </motion.div>
                  ) : authStage === 'scanning' ? (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-amber-500"
                    >
                      <Fingerprint className="w-9 h-9" />
                    </motion.div>
                  ) : (
                    <ShieldCheck className={`w-8 h-8 ${isLight ? 'text-neutral-800' : 'text-amber-400'}`} />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Security Telemetry Readout */}
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className={isLight ? 'text-neutral-500' : 'text-neutral-400'}>ENCRYPTION</span>
                <span className="font-semibold text-emerald-500">TLS 1.3 · OAUTH 2.0</span>
              </div>
              <div className={`h-px w-full ${isLight ? 'bg-neutral-200' : 'bg-white/10'}`} />
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className={isLight ? 'text-neutral-500' : 'text-neutral-400'}>SESSION STATE</span>
                <span className={isAuthenticated ? 'text-emerald-500 font-semibold' : 'text-amber-500 font-semibold'}>
                  {authStage === 'verified'
                    ? 'IDENTITY VERIFIED'
                    : authStage === 'scanning'
                    ? 'VERIFYING TOKEN...'
                    : isAuthenticated
                    ? 'AUTHENTICATED'
                    : 'AWAITING CREDENTIALS'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Executive Auth Controls */}
          <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-between relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-500 font-semibold block">
                  {isAuthenticated ? 'ACTIVE CONTRIBUTOR SESSION' : 'EXECUTIVE WORKSPACE ACCESS'}
                </span>
                <h2 className="text-2xl font-bold tracking-tight mt-0.5">
                  {isAuthenticated
                    ? 'Account & Session Security'
                    : authMode === 'signin'
                    ? 'Sign In to Studio'
                    : 'Create Contributor Account'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className={`p-2 rounded-full border transition cursor-pointer ${
                  isLight
                    ? 'bg-white border-neutral-200 text-neutral-500 hover:text-black hover:bg-neutral-100'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Close authentication modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isAuthenticated ? (
              <div className="space-y-6 my-auto">
                <div
                  className={`p-5 rounded-2xl border flex items-center gap-4 ${
                    isLight ? 'bg-white border-neutral-200/90' : 'bg-white/5 border-white/10'
                  }`}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-14 h-14 rounded-2xl object-cover border border-emerald-500/40"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold text-xl">
                      {(user.displayName || user.email || 'C')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold truncate">
                        {user.displayName || user.email?.split('@')[0] || 'Authenticated Contributor'}
                      </h3>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-bold">
                        PRO ACTIVE
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {user.email || 'Signed in via Firebase Auth'}
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-2xl border space-y-2 text-xs ${
                    isLight ? 'bg-[#f4f1ea] border-neutral-200 text-neutral-700' : 'bg-white/[0.03] border-white/10 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Cloud Metadata History Sync</span>
                    <span className="font-mono font-semibold text-emerald-500">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Multi-Agency CSV & IPTC Embedder</span>
                    <span className="font-mono font-semibold text-emerald-500">UNLOCKED</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      isLight
                        ? 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                        : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    Continue to Workspace
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOutClick}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-500/15 hover:bg-red-500/25 text-red-500 border border-red-500/30 flex items-center gap-2 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Mode Segmented Switcher (Sign In vs Create Account) */}
                <div
                  className={`grid grid-cols-2 p-1 rounded-xl border ${
                    isLight ? 'bg-[#f2efe9] border-neutral-200/80' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      authMode === 'signin'
                        ? isLight
                          ? 'bg-white text-neutral-950 shadow-xs'
                          : 'bg-white text-neutral-950 shadow-xs'
                        : isLight
                        ? 'text-neutral-600 hover:text-neutral-900'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      authMode === 'signup'
                        ? isLight
                          ? 'bg-white text-neutral-950 shadow-xs'
                          : 'bg-white text-neutral-950 shadow-xs'
                        : isLight
                        ? 'text-neutral-600 hover:text-neutral-900'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Official Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSubmit}
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition cursor-pointer shadow-xs ${
                    isLight
                      ? 'bg-white hover:bg-neutral-50 border-neutral-300 text-neutral-900'
                      : 'bg-white hover:bg-neutral-100 border-white text-neutral-950'
                  } disabled:opacity-50`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                  <span>{authMode === 'signin' ? 'Continue with Google' : 'Sign up with Google'}</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className={`border-t w-full ${isLight ? 'border-neutral-200' : 'border-white/10'}`} />
                  <span
                    className={`px-3 text-[10px] font-mono uppercase tracking-widest ${
                      isLight ? 'bg-[#faf8f5] text-neutral-400' : 'bg-[#090b10] text-neutral-500'
                    }`}
                  >
                    OR CONTINUE WITH EMAIL
                  </span>
                  <div className={`border-t w-full ${isLight ? 'border-neutral-200' : 'border-white/10'}`} />
                </div>

                {/* Email & Password Form */}
                <form onSubmit={handleEmailFormSubmit} className="space-y-3.5">
                  {authMode === 'signup' && (
                    <div>
                      <label className={`text-[11px] font-semibold block mb-1.5 ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
                        Full Name or Studio Name
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your name"
                          className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm border focus:outline-none transition ${
                            isLight
                              ? 'bg-white border-neutral-200 text-neutral-900 focus:border-neutral-900'
                              : 'bg-white/5 border-white/15 text-white focus:border-amber-400'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className={`text-[11px] font-semibold block mb-1.5 ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm border focus:outline-none transition ${
                          isLight
                            ? 'bg-white border-neutral-200 text-neutral-900 focus:border-neutral-900'
                            : 'bg-white/5 border-white/15 text-white focus:border-amber-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`text-[11px] font-semibold block mb-1.5 ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm border focus:outline-none transition ${
                          isLight
                            ? 'bg-white border-neutral-200 text-neutral-900 focus:border-neutral-900'
                            : 'bg-white/5 border-white/15 text-white focus:border-amber-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-500 text-xs font-medium flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                      isLight
                        ? 'bg-neutral-950 hover:bg-black text-white'
                        : 'bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 text-neutral-950 hover:brightness-105'
                    } disabled:opacity-50`}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Authenticating Session...</span>
                      </>
                    ) : (
                      <>
                        <span>{authMode === 'signin' ? 'Sign In with Email' : 'Create Contributor Account'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            <div className={`mt-6 pt-4 border-t flex items-center justify-between text-[11px] ${
              isLight ? 'border-neutral-200/80 text-neutral-500' : 'border-white/10 text-neutral-400'
            }`}>
              <span>Protected by Firebase Authentication</span>
              <span className="font-mono">ZERO-TRUST VAULT</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
