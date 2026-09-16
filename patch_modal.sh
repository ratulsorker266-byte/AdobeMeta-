sed -i '/{\/\* Toast Notification \*\/}/i \
      {/* Pro Upgrade Modal */}\
      <AnimatePresence>\
        {showProModal && (\
          <motion.div\
            initial={{ opacity: 0 }}\
            animate={{ opacity: 1 }}\
            exit={{ opacity: 0 }}\
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"\
          >\
            <motion.div\
              initial={{ scale: 0.95, opacity: 0 }}\
              animate={{ scale: 1, opacity: 1 }}\
              exit={{ scale: 0.95, opacity: 0 }}\
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative"\
            >\
              <button onClick={() => setShowProModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition">\
                <X className="w-5 h-5" />\
              </button>\
              <div className="text-center mb-8">\
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">\
                  <Sparkles className="w-8 h-8 text-white" />\
                </div>\
                <h2 className="text-3xl font-bold text-white mb-2">Upgrade to Pro</h2>\
                <p className="text-slate-400">You ran out of free credits. Upgrade your account or buy a credit pack to continue analyzing your images.</p>\
              </div>\
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">\
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-center hover:border-indigo-500 transition cursor-pointer"\
                     onClick={() => showToast("Stripe Integration Pending: Founder setup required for subscriptions.")}>\
                  <h3 className="text-indigo-400 font-bold mb-1">Pro Subscription</h3>\
                  <div className="text-3xl font-black text-white mb-2">$9<span className="text-lg text-slate-400 font-normal">/mo</span></div>\
                  <ul className="text-xs text-slate-400 text-left space-y-2 mb-4">\
                    <li>✓ Unlimited AI Generations</li>\
                    <li>✓ Export to CSV & ZIP</li>\
                    <li>✓ Priority Support</li>\
                  </ul>\
                  <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl transition text-sm">Subscribe Now</button>\
                </div>\
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-center hover:border-emerald-500 transition cursor-pointer"\
                     onClick={() => showToast("Stripe Integration Pending: Founder setup required for one-time payments.")}>\
                  <h3 className="text-emerald-400 font-bold mb-1">Credit Pack</h3>\
                  <div className="text-3xl font-black text-white mb-2">$5<span className="text-lg text-slate-400 font-normal">/50cr</span></div>\
                  <ul className="text-xs text-slate-400 text-left space-y-2 mb-4">\
                    <li>✓ 50 Image Generations</li>\
                    <li>✓ Pay as you go</li>\
                    <li>✓ Never expires</li>\
                  </ul>\
                  <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl transition text-sm">Buy Credits</button>\
                </div>\
              </div>\
            </motion.div>\
          </motion.div>\
        )}\
      </AnimatePresence>' src/App.tsx
