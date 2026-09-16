sed -i '/const now = Date.now();/d' src/App.tsx 
sed -i 's/const isFounder = currentUser.email === '\''ratulsorker266@gmail.com'\'';/const isFounder = currentUser.email === '\''ratulsorker266@gmail.com'\'';\n          const now = Date.now();/g' src/App.tsx

sed -i 's/credits: isFounder ? 999999 : 5,/credits: isFounder ? 999999 : 5,\n              dailyUsage: 0,\n              lastResetDate: now,/g' src/App.tsx

sed -i 's/setCredits(isFounder ? 999999 : 5);/setCredits(isFounder ? 999999 : 5);\n            setDailyUsage(0);/g' src/App.tsx

sed -i 's/const currentPro = isFounder || data.isPro === true;/const currentPro = isFounder || data.isPro === true;\n            let currentDailyUsage = data.dailyUsage || 0;\n            let lastReset = data.lastResetDate || now;\n            if (now - lastReset > 86400000) {\n               currentDailyUsage = 0;\n               lastReset = now;\n               await updateDoc(userDocRef, { dailyUsage: 0, lastResetDate: now });\n            }/g' src/App.tsx

sed -i 's/setIsPro(currentPro);/setIsPro(currentPro);\n               setDailyUsage(currentDailyUsage);/g' src/App.tsx

sed -i 's/setIsPro(true);/setIsPro(true);\n               setDailyUsage(0);/g' src/App.tsx
