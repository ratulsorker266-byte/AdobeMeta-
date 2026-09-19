import React from 'react';
import { motion } from 'motion/react';
import { X, Command, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '?', desc: 'Toggle keyboard shortcuts reference' },
    { key: 'Space', desc: 'Quick enlarge image preview for inspecting quality' },
    { key: 'M', desc: 'Open Live Marketplace Buyer Mockup' },
    { key: 'E', desc: 'Open metadata & keyword order editor' },
    { key: 'C', desc: 'Copy all 40+ keywords to clipboard' },
    { key: 'J', desc: 'Directly download in-browser EXIF-embedded JPEG' },
    { key: 'Esc', desc: 'Close any active modal or return to gallery' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Keyboard className="w-4 h-4 text-indigo-400" />
            <span>Pro Contributor Keyboard Shortcuts</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
            >
              <span className="text-slate-300 font-medium">{s.desc}</span>
              <kbd className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 font-mono text-[11px] font-bold text-indigo-300 shadow-inner">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-[11px] text-slate-500 text-center">
          Press <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-400">Esc</kbd> anytime to dismiss
        </div>
      </motion.div>
    </div>
  );
};
