sed -i 's/dailyUsage: 0,/dailyUsage: 0,\n              chatUsage: 0,\n              trendsUsage: 0,\n              planType: isFounder ? "premium" : "free",/g' src/App.tsx

sed -i 's/setDailyUsage(0);/setDailyUsage(0);\n            setChatUsage(0);\n            setTrendsUsage(0);\n            setPlanType(isFounder ? "premium" : "free");/g' src/App.tsx

sed -i 's/let currentDailyUsage = data.dailyUsage || 0;/let currentDailyUsage = data.dailyUsage || 0;\n            let currentChatUsage = data.chatUsage || 0;\n            let currentTrendsUsage = data.trendsUsage || 0;\n            let currentPlanType = isFounder ? "premium" : (data.planType || (currentPro ? "premium" : "free"));/g' src/App.tsx

sed -i 's/await updateDoc(userDocRef, { dailyUsage: 0, lastResetDate: now });/currentChatUsage = 0;\n               currentTrendsUsage = 0;\n               await updateDoc(userDocRef, { dailyUsage: 0, chatUsage: 0, trendsUsage: 0, lastResetDate: now });/g' src/App.tsx

sed -i 's/await updateDoc(userDocRef, { isPro: true, credits: 999999 });/await updateDoc(userDocRef, { isPro: true, credits: 999999, planType: "premium" });/g' src/App.tsx

sed -i 's/setDailyUsage(0);/setDailyUsage(0);\n               setChatUsage(0);\n               setTrendsUsage(0);\n               setPlanType("premium");/g' src/App.tsx

sed -i 's/setDailyUsage(currentDailyUsage);/setDailyUsage(currentDailyUsage);\n               setChatUsage(currentChatUsage);\n               setTrendsUsage(currentTrendsUsage);\n               setPlanType(currentPlanType);/g' src/App.tsx
