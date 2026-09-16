sed -i '991,996c\
            <div className="text-right flex flex-col justify-center bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800/80 shadow-inner">\
              <div className="flex items-center justify-end gap-2 mb-0.5">\
                <span className="text-[9px] uppercase tracking-[0.2em] text-indigo-400 font-bold">\
                  {user?.email === "ratulsorker266@gmail.com" ? "Founder" : isPro ? "Pro Plan" : "Free Plan"}\
                </span>\
                {!isPro && (\
                  <button onClick={() => setShowProModal(true)} className="text-[9px] uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-0.5 rounded transition">Upgrade</button>\
                )}\
              </div>\
              <div className="flex items-center justify-end gap-2">\
                 <span className="text-sm font-black tracking-wide bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">\
                   {user?.displayName || user?.email?.split("@")[0] || "User"}\
                 </span>\
                 {isPro ? (\
                    <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded" title="Unlimited AI Processing">PRO</span>\
                 ) : (\
                    <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 rounded-md">{credits} Credits</span>\
                 )}\
              </div>\
            </div>\
            <div className="hidden sm:block w-px h-10 bg-slate-800"></div>' src/App.tsx
