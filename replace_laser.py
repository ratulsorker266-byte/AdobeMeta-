import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_code = '''<img src={image} className="w-full h-full object-cover" alt="Competitor" />
                 {isAnalyzing && (
                   <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center backdrop-blur-sm">
                      <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mb-3" />
                      <p className="text-purple-300 font-bold text-sm animate-pulse">Reverse engineering...</p>
                   </div>
                 )}'''

new_code = '''<img src={image} className="w-full h-full object-cover" alt="Competitor" />
                 {isAnalyzing && (
                   <div className="absolute inset-0 overflow-hidden">
                     <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center backdrop-blur-[2px] z-20">
                        <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mb-3" />
                        <p className="text-purple-300 font-bold text-sm animate-pulse">Reverse engineering...</p>
                     </div>
                     <motion.div
                       initial={{ top: "-10%" }}
                       animate={{ top: "110%" }}
                       transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                       className="absolute left-0 w-full h-[4px] bg-cyan-400 shadow-[0_0_20px_8px_rgba(34,211,238,0.8)] z-10"
                     />
                   </div>
                 )}'''

content = content.replace(old_code, new_code)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Laser updated")
