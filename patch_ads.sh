sed -i '/<\/motion.header>/a \
        {/* AdSense Placeholder */}\
        <motion.div variants={itemVariants} className="bg-slate-900/40 border border-dashed border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-inner min-h-[90px]">\
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 opacity-70">Advertisement</span>\
           <p className="text-xs text-slate-600 font-medium">Google AdSense Space (728x90) / Affiliate Banner</p>\
        </motion.div>' src/App.tsx
