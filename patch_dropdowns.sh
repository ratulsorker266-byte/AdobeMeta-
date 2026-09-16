sed -i '/<select/i \
              <div className="flex gap-4">\
                <div>\
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Asset Type</label>\
                  <select\
                    value={assetType}\
                    onChange={(e) => setAssetType(e.target.value)}\
                    className="bg-slate-900/50 backdrop-blur border border-slate-700 text-sm rounded-lg px-3 py-2.5 text-white font-medium focus:ring-1 focus:ring-indigo-500 transition-shadow"\
                  >\
                    <option value="Photo">Photo</option>\
                    <option value="Illustration">Illustration</option>\
                    <option value="Vector / EPS">Vector / EPS</option>\
                    <option value="3D Render">3D Render</option>\
                  </select>\
                </div>' src/App.tsx

sed -i '/<\/select>/a \
              </div>' src/App.tsx

