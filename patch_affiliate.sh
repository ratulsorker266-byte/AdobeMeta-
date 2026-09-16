sed -i '/<\/motion.header>/a \
        {/* Affiliate Banner */}\
        <motion.div variants={itemVariants} className="bg-slate-900/80 backdrop-blur-md border border-indigo-500/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">\
          <div className="flex items-center gap-3">\
             <div className="w-10 h-10 bg-indigo-900/50 rounded-full flex items-center justify-center border border-indigo-500/50">\
               <TrendingUp className="w-5 h-5 text-indigo-400" />\
             </div>\
             <div>\
               <h4 className="text-sm font-bold text-white">Recommended Platforms</h4>\
               <p className="text-xs text-slate-400">Maximize your earnings by joining our top partnered stock marketplaces.</p>\
             </div>\
          </div>\
          <div className="flex flex-wrap gap-3">\
             <a href="https://submit.shutterstock.com" target="_blank" rel="noreferrer" className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-2 rounded-lg transition">Join Shutterstock</a>\
             <a href="https://contributor.stock.adobe.com" target="_blank" rel="noreferrer" className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-xs font-bold px-4 py-2 rounded-lg transition">Join Adobe Stock</a>\
             <a href="https://www.freepik.com/contributor" target="_blank" rel="noreferrer" className="bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-2 rounded-lg transition">Join Freepik</a>\
          </div>\
        </motion.div>' src/App.tsx
