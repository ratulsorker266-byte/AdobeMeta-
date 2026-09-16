sed -i 's/body: JSON.stringify({ messages: newMessages, tier: "pro" })/body: JSON.stringify({ messages: newMessages, tier: planType })/g' src/App.tsx

sed -i '/if (!chatInput.trim()) return;/a \
    if (planType === "free" && chatUsage >= 6) {\
      showToast("Free trial limit reached (6 messages). Please upgrade to Pro.");\
      setShowProModal(true);\
      return;\
    }' src/App.tsx

sed -i '/const data = await res.json();/a \
      if (planType === "free" && user) {\
        const userRef = doc(db, "users", user.uid);\
        await updateDoc(userRef, { chatUsage: increment(1) });\
        setChatUsage(prev => prev + 1);\
      }' src/App.tsx
