sed -i '/assetType: assetType,/a \
            language: language,' src/App.tsx

sed -i '/<option value="Illustration">Illustration<\/option>/a \
                  </select>\
                </div>\
                <div>\
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Language</label>\
                  <select\
                    value={language}\
                    onChange={(e) => setLanguage(e.target.value)}\
                    className="bg-slate-900/50 backdrop-blur border border-slate-700 text-sm rounded-lg px-3 py-2.5 text-white font-medium focus:ring-1 focus:ring-indigo-500 transition-shadow"\
                  >\
                    <option value="English">English</option>\
                    <option value="Spanish">Spanish</option>\
                    <option value="French">French</option>\
                    <option value="German">German</option>\
                    <option value="Italian">Italian</option>' src/App.tsx
