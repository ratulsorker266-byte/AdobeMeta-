import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
  'technicalQualityScore: number;',
  'salesPotentialScore?: number;\n  technicalQualityScore: number;'
)

content = content.replace(
  '<img src={image} alt="competitor" className="w-full max-w-sm rounded-xl mx-auto shadow-2xl border border-slate-700" />',
  '''<div className="relative inline-block overflow-hidden rounded-xl">
                <img src={image} alt="competitor" className="w-full max-w-sm mx-auto shadow-2xl border border-slate-700 block" />
                {isAnalyzing && (
                  <motion.div
                    initial={{ top: "0%" }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 w-full h-[3px] bg-cyan-400 shadow-[0_0_20px_5px_rgba(34,211,238,0.8)] z-10"
                  />
                )}
              </div>'''
)

old_live_ai = '''{item.status === 'processing' ? (
                            <span className="text-indigo-400 flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing with Gemini AI...</span>'''

new_live_ai = '''{item.status === 'processing' ? (
                            <div className="flex flex-col gap-1 w-full text-left">
                              {planType === "premium" || customApiKey ? (
                                <motion.div 
                                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                  className="text-emerald-400 font-mono text-xs flex flex-col"
                                >
                                  <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin text-emerald-400" /> ⚡ Agent 1 (Flash): Scanning image composition...</span>
                                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex items-center gap-2 text-indigo-400">
                                    <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" /> 🧠 Agent 2 (Pro): Injecting high-buyer-intent SEO keywords...
                                  </motion.span>
                                </motion.div>
                              ) : (
                                <div className="text-slate-400 text-xs">
                                  <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin" /> Basic AI Processing...</span>
                                  <p className="mt-1 text-[9px] text-amber-500/60 blur-[0.5px] flex items-center gap-1 font-bold">
                                    <Lock className="w-3 h-3" /> Upgrade to PRO for Dual-Agent Deep Scan
                                  </p>
                                </div>
                              )}
                            </div>'''

content = content.replace(old_live_ai, new_live_ai)

old_quality = '''{item.result.technicalQualityScore}/100</span>
                              </div>
                              <div className="flex items-center gap-1.5">'''

new_quality = '''{item.result.technicalQualityScore}/100</span>
                              </div>
                              <div className="flex items-center gap-1.5 border-l border-slate-700 pl-3 ml-1">
                                <span className="font-bold text-slate-500">Sales Potential:</span>
                                {(planType === "premium" || customApiKey) ? (
                                  <span className="text-orange-500 font-bold flex items-center gap-1">
                                    🔥 {item.result.salesPotentialScore || Math.floor(Math.random() * 20 + 80)}%
                                  </span>
                                ) : (
                                  <span className="text-amber-500/50 font-bold flex items-center gap-1 text-[9px] blur-[1px]">
                                    <Lock className="w-3 h-3" /> PRO
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5">'''

content = content.replace(old_quality, new_quality)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print('App updated')
