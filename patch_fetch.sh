sed -i 's/isAiGenerated/isAiGenerated,\n            tier: isPro ? "pro" : "free"/g' src/App.tsx
