import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, UserCheck, UserX, Building, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react';
import { BulkItem } from '../types';

interface RejectionShieldBadgeProps {
  item: BulkItem;
}

export const RejectionShieldBadge: React.FC<RejectionShieldBadgeProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const result = item.result;
  if (!result) return null;

  const acceptance = result.acceptanceProbability ?? (result.overallSubmissionRiskScore > 0 ? 100 - result.overallSubmissionRiskScore : 85);
  const trademarkRisk = result.trademarkRisk || (result.copyrightRiskScore > 50 ? 'high' : result.copyrightRiskScore > 20 ? 'medium' : 'none');
  const trademarks = result.detectedTrademarks && result.detectedTrademarks.length > 0 && !result.detectedTrademarks.includes('None detected')
    ? result.detectedTrademarks
    : [];

  const modelRequired = result.modelReleaseRequired;
  const propertyRequired = result.propertyReleaseRequired;
  const explanation = result.releaseExplanation;

  const hasIssues = trademarkRisk === 'high' || trademarkRisk === 'medium' || trademarks.length > 0 || acceptance < 70;

  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 space-y-2">
      {/* Top summary row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {/* Acceptance Probability */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Acceptance Rate:</span>
            <span
              className={`font-black text-xs px-2 py-0.5 rounded-full border ${
                acceptance >= 80
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : acceptance >= 60
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {acceptance}%
            </span>
          </div>

          {/* Trademark Status Pill */}
          <div className="flex items-center gap-1">
            {trademarks.length > 0 || trademarkRisk === 'high' ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                <span>Trademarks Detected ({trademarks.length || 'Warning'})</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Trademarks: Safe</span>
              </span>
            )}
          </div>

          {/* Release quick tags */}
          {modelRequired !== undefined && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                modelRequired
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>{modelRequired ? 'Model Release Required' : 'No Model Release'}</span>
            </span>
          )}
        </div>

        {/* Expand / Details toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 ml-auto"
        >
          <span>{expanded ? 'Hide Details' : 'View Rejection Shield'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Shield Details */}
      {expanded && (
        <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
          {/* Detected trademarks list */}
          {trademarks.length > 0 && (
            <div className="bg-rose-950/30 border border-rose-500/30 p-2.5 rounded-lg space-y-1">
              <div className="flex items-center gap-1.5 text-rose-300 font-bold text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Potential Copyright / Brand Infringement Detected:</span>
              </div>
              <p className="text-slate-300 pl-5 text-[11px]">
                {trademarks.join(', ')} — <strong className="text-rose-200">Remove, blur, or clone out in Photoshop before uploading</strong> to avoid instant rejection by Adobe Stock or Shutterstock.
              </p>
            </div>
          )}

          {/* Release Guidance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-start gap-2">
              <UserCheck className={`w-4 h-4 mt-0.5 ${modelRequired ? 'text-amber-400' : 'text-slate-500'}`} />
              <div>
                <span className="font-bold text-slate-200 block">Model Release</span>
                <span className="text-slate-400">
                  {modelRequired
                    ? 'Recognizable human subject detected. You must submit a signed standard model release.'
                    : 'No recognizable faces found. No model release required.'}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-start gap-2">
              <Building className={`w-4 h-4 mt-0.5 ${propertyRequired ? 'text-amber-400' : 'text-slate-500'}`} />
              <div>
                <span className="font-bold text-slate-200 block">Property Release</span>
                <span className="text-slate-400">
                  {propertyRequired
                    ? 'Private property, artwork, or distinct vehicle detected. Property release may be requested.'
                    : 'Standard public environment. No property release needed.'}
                </span>
              </div>
            </div>
          </div>

          {/* Explanation text */}
          {explanation && (
            <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <strong className="text-slate-300">Moderator Advice: </strong> {explanation}
            </p>
          )}

          {/* Rejection flags */}
          {result.rejectionFlags && result.rejectionFlags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Quality Flags:</span>
              {result.rejectionFlags.map((flag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-full"
                >
                  {flag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
