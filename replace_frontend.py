import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Add states for referral
state_hook = "const [showSettings, setShowSettings] = useState(false);"
new_states = """const [showSettings, setShowSettings] = useState(false);
  const [showReferModal, setShowReferModal] = useState(false);
  const [referralCount, setReferralCount] = useState(parseInt(localStorage.getItem('referral_count') || '14'));"""
content = content.replace(state_hook, new_states)

# 2. Add Referral Button in Header
header_hook = '<button onClick={() => setShowSettings(true)} className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 md:px-4 md:py-2 rounded-xl transition flex items-center gap-2 border border-slate-700 shadow-sm">'
new_header_btn = """<button onClick={() => setShowReferModal(true)} className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white p-2 md:px-4 md:py-2 rounded-xl transition flex items-center gap-2 shadow-[0_0_15px_rgba(219,39,119,0.5)] border border-pink-500/50">
                    <Gift className="w-4 h-4" /> <span className="hidden sm:inline font-bold">Refer & Earn</span>
                  </button>
                  <button onClick={() => setShowSettings(true)} className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 md:px-4 md:py-2 rounded-xl transition flex items-center gap-2 border border-slate-700 shadow-sm">"""
content = content.replace(header_hook, new_header_btn)
if 'Gift' not in content:
    content = content.replace('import { ', 'import { Gift, Copy, CheckCircle, ')

# 3. Add predictor to the result card UI
old_quality_ui = """<div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-500">Quality:</span> 
                                <span className={item.result.technicalQualityScore >= 80 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{item.result.technicalQualityScore}/100</span>
                              </div>"""

new_quality_ui = """<div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-500">Stock Acceptance:</span> 
                                {(planType === "premium" || customApiKey) ? (
                                  <span className={(item.result.acceptanceProbability || 85) >= 70 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold flex items-center gap-1'}>
                                    {(item.result.acceptanceProbability || 85)}%
                                    {(item.result.acceptanceProbability || 85) < 70 && <AlertCircle className="w-3 h-3" />}
                                  </span>
                                ) : (
                                  <span className="text-amber-500/50 font-bold flex items-center gap-1 text-[9px] blur-[1px]">
                                    <Lock className="w-3 h-3" /> PRO
                                  </span>
                                )}
                              </div>"""
content = content.replace(old_quality_ui, new_quality_ui)

old_defects_ui = """<div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-500">Defects:</span> 
                                <span className={item.result.detectedDefects?.length === 0 ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                                  {item.result.detectedDefects?.length === 0 ? "None detected" : item.result.detectedDefects?.join(', ')}
                                </span>
                              </div>"""

new_defects_ui = """<div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-500">Rejection Flags:</span> 
                                {(planType === "premium" || customApiKey) ? (
                                  <span className={(!item.result.rejectionFlags || item.result.rejectionFlags.length === 0) ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                                    {(!item.result.rejectionFlags || item.result.rejectionFlags.length === 0) ? "Clean" : item.result.rejectionFlags.join(', ')}
                                  </span>
                                ) : (
                                  <span className="text-amber-500/50 font-bold flex items-center gap-1 text-[9px] blur-[1px]">
                                    <Lock className="w-3 h-3" /> PRO
                                  </span>
                                )}
                              </div>"""
content = content.replace(old_defects_ui, new_defects_ui)

# 4. Inject Modal
modal_code = """
        <AnimatePresence>
          {showReferModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 p-6 border-b border-slate-800 flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <Gift className="w-6 h-6 text-pink-500" /> Refer & Earn PRO
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                      Invite 100 creators to Stock AI and get <strong className="text-pink-400">3 Months of Premium</strong> absolutely FREE!
                    </p>
                  </div>
                  <button onClick={() => setShowReferModal(false)} className="text-slate-400 hover:text-white transition p-1 bg-slate-800 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-300">Your Progress</span>
                      <span className="text-pink-400">{referralCount} / 100 Invited</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 border border-slate-700 overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${(referralCount / 100) * 100}%` }} 
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Your Unique Invite Link</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value="https://stock-ai.com/ref/user_992x" 
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-slate-300 font-mono text-sm focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText("https://stock-ai.com/ref/user_992x");
                          showToast("Referral link copied!");
                        }}
                        className="bg-pink-600 hover:bg-pink-500 text-white p-2.5 rounded-lg transition"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center mt-6">
                    <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-2 text-indigo-400"><Copy className="w-4 h-4" /></div>
                      <p className="text-xs font-semibold text-slate-300">1. Share Link</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-2 text-emerald-400"><CheckCircle className="w-4 h-4" /></div>
                      <p className="text-xs font-semibold text-slate-300">2. Friends Join</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 border-pink-500/30">
                      <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-2 text-pink-400"><Gift className="w-4 h-4" /></div>
                      <p className="text-xs font-semibold text-slate-300">3. Get PRO!</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
"""

# Insert before final AnimatePresence in App.tsx
final_presence = '<AnimatePresence mode="wait">'
content = content.replace(final_presence, modal_code + '\n        ' + final_presence)


with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Frontend updated")
