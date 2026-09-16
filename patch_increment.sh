sed -i 's/await updateDoc(userRef, { credits: increment(-1) });/await updateDoc(userRef, { dailyUsage: increment(1) });/g' src/App.tsx
sed -i 's/setCredits(prev => prev - 1);/setDailyUsage(prev => prev + 1);/g' src/App.tsx
