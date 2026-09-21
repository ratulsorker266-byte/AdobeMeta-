import React, { useState } from 'react';
import { CloudUpload, Server, ShieldCheck, Key, ExternalLink, Check, Copy, AlertCircle, Info, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export const CloudFtpGuideModal = ({ isOpen, onClose, showToast }: { isOpen: boolean; onClose: () => void; showToast: (msg: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'adobe' | 'shutterstock' | 'freepik'>('adobe');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const agencyFtpInfo = {
    adobe: {
      name: 'Adobe Stock Contributor FTP/SFTP',
      host: 'ftp.contributor.adobestock.com',
      port: '21 / 22 (SFTP)',
      protocol: 'FTP with TLS / SFTP',
      instructions: [
        'Log in to your Adobe Stock Contributor portal (contributor.stock.adobe.com).',
        'Click on "Upload" and look for "Upload with SFTP/FTP" at the bottom.',
        'Adobe generates a dedicated username and temporary or personal password for your account.',
        'Use any FTP client (like FileZilla, Cyberduck, or WinSCP) or command line.',
        'Upload your renamed images and companion .XMP or embedded metadata files directly. Adobe Stock automatically parses titles and keywords from IPTC.'
      ],
      portalUrl: 'https://contributor.stock.adobe.com'
    },
    shutterstock: {
      name: 'Shutterstock Contributor FTPS',
      host: 'ftps.shutterstock.com',
      port: '21 (Explicit FTPS)',
      protocol: 'FTPS (FTP over TLS/SSL)',
      instructions: [
        'Log into submit.shutterstock.com.',
        'Your FTP username is your registered contributor email address or Contributor ID.',
        'Your FTP password is your Shutterstock contributor account password.',
        'Connect using Explicit FTPS (TLS/SSL).',
        'Drop all JPEG and vector EPS files. Once uploaded, Shutterstock automatically extracts your titles, categories, and CSV tags into your pending batch.'
      ],
      portalUrl: 'https://submit.shutterstock.com'
    },
    freepik: {
      name: 'Freepik Contributor FTP',
      host: 'ftp.freepik.com',
      port: '21',
      protocol: 'FTP / FTPS',
      instructions: [
        'Access your Freepik Contributor dashboard (contributor.freepik.com).',
        'Navigate to "Files" -> "Upload via FTP".',
        'Click "Generate Password" to receive your unique Freepik FTP credentials.',
        'Upload your preview JPGs and EPS files alongside your Freepik CSV file exported from AdobeMeta Pro.',
        'Files will be grouped automatically and ready for synchronization review in minutes.'
      ],
      portalUrl: 'https://contributor.freepik.com'
    }
  };

  const current = agencyFtpInfo[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-3xl w-full p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                <CloudUpload className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                Cloud & FTP Direct Submission Guide
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Connect your batch uploads directly to Adobe Stock, Shutterstock, and Freepik server pipelines for 100+ files simultaneous transfer.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold"
          >
            ✕
          </button>
        </div>

        {/* Agency Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('adobe')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'adobe' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>Adobe Stock SFTP</span>
          </button>
          <button
            onClick={() => setActiveTab('shutterstock')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'shutterstock' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>Shutterstock FTPS</span>
          </button>
          <button
            onClick={() => setActiveTab('freepik')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'freepik' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>Freepik FTP</span>
          </button>
        </div>

        {/* Credentials & Details Card */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Host Server</span>
              <div className="flex items-center justify-between">
                <code className="text-xs font-bold text-cyan-400 font-mono truncate">{current.host}</code>
                <button
                  onClick={() => copyText(current.host, 'host')}
                  className="text-slate-400 hover:text-white p-1"
                >
                  {copiedKey === 'host' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Port & Protocol</span>
              <div className="text-xs font-bold text-slate-200 font-mono">{current.port}</div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Portal Link</span>
              <a
                href={current.portalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Open Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" /> Step-by-Step Submission Procedure
            </h4>
            <ol className="space-y-2.5 text-xs text-slate-300">
              {current.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>AdobeMeta Pro Auto-Embedding:</strong> When you download assets via our "1-Click Renamed ZIP + EXIF", your titles and keywords are already embedded inside each image binary, allowing instantaneous metadata detection upon FTP arrival.
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
