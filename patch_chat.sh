sed -i '/import { Upload, /s/Upload/Upload, MessageSquare, Send/' src/App.tsx

sed -i '/{showApiKeyCartoon && (/i \
      {/* Pro Chatbot Widget */}\
      <AnimatePresence>\
        {isPro && (\
          <>\
            <motion.button\
              whileHover={{ scale: 1.05 }}\
              whileTap={{ scale: 0.95 }}\
              onClick={() => setIsChatOpen(!isChatOpen)}\
              className="fixed bottom-6 right-6 z-[110] bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-[0_10px_40px_rgba(79,70,229,0.5)] border-2 border-indigo-400/30 flex items-center justify-center"\
            >\
              {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}\
            </motion.button>\
            {isChatOpen && (\
              <motion.div\
                initial={{ opacity: 0, y: 50, scale: 0.9 }}\
                animate={{ opacity: 1, y: 0, scale: 1 }}\
                exit={{ opacity: 0, y: 50, scale: 0.9 }}\
                className="fixed bottom-24 right-6 z-[110] w-[350px] h-[450px] bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl flex flex-col overflow-hidden"\
              >\
                <div className="bg-indigo-600 p-4 flex items-center justify-between">\
                  <h3 className="text-white font-bold flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-300"/> Pro Support Bot</h3>\
                </div>\
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">\
                  {chatMessages.map((msg, idx) => (\
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>\
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm"}`}>\
                        {msg.parts[0].text}\
                      </div>\
                    </div>\
                  ))}\
                  {isChatLoading && (\
                    <div className="flex justify-start">\
                      <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-tl-sm text-sm text-slate-400 flex gap-1">\
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>\
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>\
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>\
                      </div>\
                    </div>\
                  )}\
                </div>\
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">\
                  <input\
                    type="text"\
                    value={chatInput}\
                    onChange={(e) => setChatInput(e.target.value)}\
                    onKeyDown={(e) => {\
                      if (e.key === "Enter" && chatInput.trim()) {\
                        handleSendChat();\
                      }\
                    }}\
                    placeholder="Ask anything in any language..."\
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-indigo-500"\
                  />\
                  <button onClick={() => chatInput.trim() && handleSendChat()} disabled={!chatInput.trim() || isChatLoading} className="bg-indigo-600 disabled:bg-slate-700 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition">\
                    <Send className="w-4 h-4" />\
                  </button>\
                </div>\
              </motion.div>\
            )}\
          </>\
        )}\
      </AnimatePresence>' src/App.tsx
