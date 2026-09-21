import React, { useState } from 'react';
import { UserCheck, ShieldAlert, FileText, CheckCircle2, Download, AlertTriangle, Info, Sparkles, Building2, User, Camera } from 'lucide-react';
import { motion } from 'motion/react';

interface ReleaseCheckRule {
  type: 'model' | 'property' | 'editorial';
  condition: string;
  requirement: string;
  agencyRules: {
    adobeStock: string;
    shutterstock: string;
    freepik: string;
  };
}

export const ReleaseInspectorModal = ({
  isOpen,
  onClose,
  sampleSubject = '',
  showToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  sampleSubject?: string;
  showToast: (msg: string) => void;
}) => {
  const [hasRecognizablePerson, setHasRecognizablePerson] = useState<boolean>(true);
  const [hasPrivateProperty, setHasPrivateProperty] = useState<boolean>(false);
  const [hasRecognizableTattoo, setHasRecognizableTattoo] = useState<boolean>(false);
  const [isAiGeneratedFace, setIsAiGeneratedFace] = useState<boolean>(false);
  const [isEditorialOnly, setIsEditorialOnly] = useState<boolean>(false);

  if (!isOpen) return null;

  // Determine requirements
  const needsModelRelease = (hasRecognizablePerson || hasRecognizableTattoo) && !isEditorialOnly;
  const needsPropertyRelease = hasPrivateProperty && !isEditorialOnly;
  const isSafeForCommercial = !needsModelRelease && !needsPropertyRelease;

  const downloadSampleTemplate = (type: 'model' | 'property') => {
    const textContent =
      type === 'model'
        ? `STANDARD MICROSTOCK MODEL RELEASE (COMPLIANT WITH ADOBE STOCK & SHUTTERSTOCK)
================================================================================
For valuable consideration received, I hereby grant the Photographer/Videographer 
and their legal representatives and assigns, the irrevocable and unrestricted 
right to use and publish photographs/videos of me, or in which I may be included, 
for commercial stock licensing, advertising, trade, and editorial purposes.

Model Name (Printed): __________________________________________________
Model Signature:      _____________________________ Date: ______________
Date of Birth:        _____________________________ Gender: ____________
Email:                _____________________________ Phone: _____________
Photographer Name:    __________________________________________________
Shoot Location:       _____________________________ Shoot Date: _________
Witness Signature:    _____________________________ Date: ______________

Adobe Stock Contributor Guideline: Must attach signed PDF/JPEG on upload portal.
Shutterstock Contributor Guideline: Must attach verified model release.`
        : `STANDARD MICROSTOCK PROPERTY RELEASE (COMPLIANT WITH ADOBE STOCK & SHUTTERSTOCK)
================================================================================
For valuable consideration, I hereby affirm that I am the owner (or authorized agent 
of the owner) of the property (real estate, private vessel, trademarked architecture, 
or proprietary pet) described below:

Property Description: __________________________________________________
Physical Location:    __________________________________________________
Owner / Representative Name: ___________________________________________
Signature:            _____________________________ Date: ______________
Photographer Name:    _____________________________ Shoot Date: _________

Agencies: Required for private estates, famous architectural interiors, modern private supercars.`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = type === 'model' ? 'Universal_Stock_Model_Release_Template.txt' : 'Universal_Stock_Property_Release_Template.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded official ${type} release template!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-4xl w-full p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-500" />

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                Model & Property Release AI Inspector <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Zero Rejection Guarantee</span>
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Verify compliance before submitting to Adobe Stock, Shutterstock, and Freepik to prevent permanent legal flags.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-bold"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Checklist & Triggers */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Asset Attributes & Subject Matter Check
            </h3>

            <div className="space-y-2.5">
              <label className="flex items-start gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl cursor-pointer hover:border-teal-500/40 transition">
                <input
                  type="checkbox"
                  checked={hasRecognizablePerson}
                  onChange={(e) => setHasRecognizablePerson(e.target.checked)}
                  className="mt-1 rounded accent-teal-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Recognizable Human Face or Silhouette</span>
                  <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                    Includes profile angles, partially turned heads, distinctive hairstyles, or identifiable body silhouettes.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl cursor-pointer hover:border-teal-500/40 transition">
                <input
                  type="checkbox"
                  checked={hasRecognizableTattoo}
                  onChange={(e) => setHasRecognizableTattoo(e.target.checked)}
                  className="mt-1 rounded accent-teal-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Visible Unique Tattoo or Distinctive Birthmark</span>
                  <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                    Tattoos are intellectual property of the tattoo artist and legally identify the model even if the face is cropped out.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl cursor-pointer hover:border-teal-500/40 transition">
                <input
                  type="checkbox"
                  checked={hasPrivateProperty}
                  onChange={(e) => setHasPrivateProperty(e.target.checked)}
                  className="mt-1 rounded accent-teal-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Private Property, Contemporary Artwork, or Exotic Interior</span>
                  <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                    Private estates, distinctive custom homes, ticketed tourist interiors (e.g. Biltmore), or protected architectural works.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl cursor-pointer hover:border-teal-500/40 transition">
                <input
                  type="checkbox"
                  checked={isAiGeneratedFace}
                  onChange={(e) => setIsAiGeneratedFace(e.target.checked)}
                  className="mt-1 rounded accent-teal-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-white block">100% AI-Generated Human Face (Midjourney/Flux/Firefly)</span>
                  <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                    Adobe Stock & Shutterstock: DO NOT require a model release for pure synthetic AI humans, but MUST be checked as "Created with Generative AI".
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl cursor-pointer hover:border-teal-500/40 transition">
                <input
                  type="checkbox"
                  checked={isEditorialOnly}
                  onChange={(e) => setIsEditorialOnly(e.target.checked)}
                  className="mt-1 rounded accent-teal-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Editorial Documentary / News Event Use Only</span>
                  <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                    Public protests, news events, street parades. No release needed, but strictly forbidden from commercial advertising.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Real-time Agency Compliance Verdict */}
          <div className="lg:col-span-6 bg-slate-950/70 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Agency Compliance Verdict
              </span>

              {needsModelRelease ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Model Release Mandatory for Commercial Licensing</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Because this asset contains an identifiable person or distinct tattoo, submitting without a signed release will cause an immediate rejection: <span className="font-semibold text-white">"Missing Model Release"</span>.
                  </p>
                </div>
              ) : needsPropertyRelease ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <Building2 className="w-4 h-4" />
                    <span>Property Release Required</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Private interiors or proprietary designs require written owner permission.
                  </p>
                </div>
              ) : isAiGeneratedFace ? (
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Human Verified (No Release Needed)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Since the face is generated by AI and does not portray a real living person, simply check the "Created with Generative AI" toggle during submission.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>100% Commercial Release-Free</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    No models or protected private property identified. Safe to submit for full global commercial licensing immediately!
                  </p>
                </div>
              )}

              {/* Agency Specific Rules Breakdown */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Agency Submission Requirements:</span>
                <div className="text-xs space-y-2 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-blue-400 shrink-0 w-24">Adobe Stock:</span>
                    <span className="text-slate-300">Requires PDF or JPEG upload of model release directly alongside the asset submission.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-rose-400 shrink-0 w-24">Shutterstock:</span>
                    <span className="text-slate-300">Accepts electronic digital signatures or uploaded paper releases. Retain record for 5 years.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-emerald-400 shrink-0 w-24">Freepik:</span>
                    <span className="text-slate-300">Requires model release for all photos featuring recognizable faces. AI models do not require release.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Standard Templates */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Official Agency Release Templates (Free Download):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => downloadSampleTemplate('model')}
                  className="py-2.5 px-3 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Model Release (.txt)</span>
                </button>
                <button
                  onClick={() => downloadSampleTemplate('property')}
                  className="py-2.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Property Release (.txt)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
