sed -i '1071,1099c\
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
                </div>\
                <div>\
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Marketplace</label>\
                  <select\
                    value={targetMarketplace}\
                    onChange={(e) => setTargetMarketplace(e.target.value as TargetMarketplace)}\
                    className="bg-slate-900/50 backdrop-blur border border-slate-700 text-sm rounded-lg px-3 py-2.5 text-white font-medium focus:ring-1 focus:ring-indigo-500 transition-shadow"\
                  >\
                    <option value="adobe_stock">Adobe Stock (Max 49 KW)</option>\
                    <option value="shutterstock">Shutterstock (Warning Rules)</option>\
                    <option value="freepik">Freepik (AI Tags)</option>\
                    <option value="123rf">123RF</option>\
                    <option value="dreamstime">Dreamstime</option>\
                    <option value="vecteezy">Vecteezy</option>\
                  </select>\
                </div>\
              </div>' src/App.tsx
