sed -i '/<div className="absolute inset-0 bg-slate-950\/80 backdrop-blur-\[2px\] z-0 pointer-events-none" \/>/a \
      {showApiKeyCartoon && (\
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm overflow-hidden">\
          <motion.div\
             initial={{ x: "-100vw" }}\
             animate={{ x: "100vw" }}\
             transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}\
             className="absolute flex items-center gap-4 whitespace-nowrap"\
          >\
             <div className="text-8xl drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">🏃‍♂️</div>\
             <div className="bg-white text-red-600 font-black text-4xl p-6 border-8 border-red-600 rounded-3xl shadow-[10px_10px_0px_#dc2626] animate-pulse">\
                PLEASE SET API KEY! 🛑\
             </div>\
          </motion.div>\
          <div className="relative z-10 bg-slate-900 border-2 border-indigo-500 rounded-3xl p-8 max-w-md text-center shadow-[0_0_100px_rgba(99,102,241,0.5)]">\
             <h2 className="text-3xl font-bold text-white mb-4">API Key Required!</h2>\
             <p className="text-slate-400 mb-6">You must provide your own Gemini API key to generate metadata. Click below to add it in the settings.</p>\
             <div className="flex gap-4 justify-center">\
                <button onClick={() => setShowApiKeyCartoon(false)} className="px-6 py-2 rounded-xl text-slate-400 hover:text-white transition font-medium border border-slate-700">Cancel</button>\
                <button onClick={() => { setShowApiKeyCartoon(false); setShowSettings(true); }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2"><Key className="w-5 h-5"/> Set API Key</button>\
             </div>\
          </div>\
        </div>\
      )}' src/App.tsx
