sed -i '/if (!isPro && credits < queue.length) {/,/}/c\
    if (!customApiKey) {\
      setShowApiKeyCartoon(true);\
      setIsProcessing(false);\
      return;\
    }\
    if (!isPro) {\
      if (queue.length > 10) {\
        showToast("Free users can only process 10 images at a time.");\
        queue = queue.slice(0, 10);\
      }\
      if (dailyUsage + queue.length > 100) {\
        const allowed = 100 - dailyUsage;\
        if (allowed <= 0) {\
          showToast("Daily limit of 100 images reached. Come back tomorrow!");\
          setIsProcessing(false);\
          return;\
        }\
        showToast(`Daily limit approaching. Processing ${allowed} images.`);\
        queue = queue.slice(0, allowed);\
      }\
    }' src/App.tsx
