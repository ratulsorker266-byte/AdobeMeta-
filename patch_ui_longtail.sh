sed -i '/<form onSubmit={handleAddKeyword} className="flex gap-2">/i \
                <div className="flex justify-between items-center mt-2">\
                  <label className="text-xs text-slate-400 font-medium">Keywords ({editingKeywords.length})</label>\
                  <button onClick={async () => {\
                    try {\
                      showToast("Generating long-tail keywords...");\
                      const res = await fetch("/api/longtail", {\
                        method: "POST",\
                        headers: { "Content-Type": "application/json", ...(customApiKey ? { "x-api-key": customApiKey } : {}) },\
                        body: JSON.stringify({ title: editingTitle, description: "", keywords: editingKeywords, marketplace: targetMarketplace, language })\
                      });\
                      const data = await res.json();\
                      if (data.keywords) {\
                         const uniqueNew = data.keywords.filter((k: string) => !editingKeywords.includes(k));\
                         setEditingKeywords([...editingKeywords, ...uniqueNew]);\
                         showToast(`Added ${uniqueNew.length} long-tail keywords!`);\
                      }\
                    } catch (e) { showToast("Failed to generate long-tail keywords"); }\
                  }} className="text-xs bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/40 px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5">\
                    <Sparkles className="w-3.5 h-3.5" /> Auto-Generate Long-tail SEO\
                  </button>\
                </div>' src/App.tsx
