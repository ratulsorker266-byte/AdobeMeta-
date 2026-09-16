sed -i 's/onClick={() => setCurrentView('\''trends'\'')}/onClick={() => {\
                      if (planType === "free") {\
                        showToast("Trends is a Pro feature.");\
                        setShowProModal(true);\
                        return;\
                      }\
                      if (planType === "pro_1m" && trendsUsage >= 1) {\
                        showToast("1-Month Pro limit: 1 Trend search per day.");\
                        return;\
                      }\
                      if (planType === "pro_3m" && trendsUsage >= 3) {\
                        showToast("3-Month Pro limit: 3 Trend searches per day.");\
                        return;\
                      }\
                      setCurrentView("trends");\
                    }}/g' src/App.tsx
