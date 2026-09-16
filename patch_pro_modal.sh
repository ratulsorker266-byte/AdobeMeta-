sed -i 's/<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">/<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">/g' src/App.tsx

sed -i 's/<h3 className="text-indigo-400 font-bold mb-1">Pro Subscription<\/h3>/<h3 className="text-indigo-400 font-bold mb-1">1-Month Pro<\/h3>/g' src/App.tsx
sed -i 's/<div className="text-3xl font-black text-white mb-2">$9<span className="text-lg text-slate-400 font-normal">\/mo<\/span><\/div>/<div className="text-3xl font-black text-white mb-2">$10<span className="text-lg text-slate-400 font-normal">\/mo<\/span><\/div>/g' src/App.tsx
sed -i 's/<li>✓ Unlimited AI Generations<\/li>/<li>✓ Unlimited AI Generations<\/li>\n                    <li>✓ 1 Trend Search\/Day<\/li>\n                    <li>✓ Unlimited Pro Chat<\/li>/g' src/App.tsx
sed -i 's/<li>✓ Export to CSV & ZIP<\/li>//g' src/App.tsx
sed -i 's/<li>✓ Priority Support<\/li>//g' src/App.tsx


sed -i 's/<h3 className="text-emerald-400 font-bold mb-1">Credit Pack<\/h3>/<h3 className="text-emerald-400 font-bold mb-1">3-Month Pro<\/h3>/g' src/App.tsx
sed -i 's/<div className="text-3xl font-black text-white mb-2">$5<span className="text-lg text-slate-400 font-normal">\/50cr<\/span><\/div>/<div className="text-3xl font-black text-white mb-2">$25<span className="text-lg text-slate-400 font-normal">\/3mo<\/span><\/div>/g' src/App.tsx
sed -i 's/<li>✓ 50 Image Generations<\/li>/<li>✓ Unlimited AI Generations<\/li>\n                    <li>✓ 3 Trend Searches\/Day<\/li>\n                    <li>✓ Unlimited Pro Chat<\/li>/g' src/App.tsx
sed -i 's/<li>✓ Pay as you go<\/li>//g' src/App.tsx
sed -i 's/<li>✓ Never expires<\/li>//g' src/App.tsx
sed -i 's/<button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl transition text-sm">Buy Credits<\/button>/<button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl transition text-sm">Subscribe<\/button>/g' src/App.tsx

sed -i '/<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">/a \
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-center hover:border-amber-500 transition cursor-pointer"\
                     onClick={() => showToast("Stripe Integration Pending: Founder setup required for subscriptions.")}>\
                  <h3 className="text-amber-400 font-bold mb-1">1-Year Pro (Best)</h3>\
                  <div className="text-3xl font-black text-white mb-2">$80<span className="text-lg text-slate-400 font-normal">/yr</span></div>\
                  <ul className="text-xs text-slate-400 text-left space-y-2 mb-4">\
                    <li>✓ Unlimited AI Generations</li>\
                    <li>✓ Unlimited Trend Searches</li>\
                    <li>✓ Unlimited Pro Chat</li>\
                  </ul>\
                  <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded-xl transition text-sm">Subscribe</button>\
                </div>' src/App.tsx
