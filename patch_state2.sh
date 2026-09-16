sed -i '/const \[isPro/a \  const [planType, setPlanType] = useState<string>("free");\n  const [chatUsage, setChatUsage] = useState<number>(0);\n  const [trendsUsage, setTrendsUsage] = useState<number>(0);' src/App.tsx

sed -i 's/Hello Pro User!/Hello! I am your advanced AI assistant./g' src/App.tsx
