sed -i '/const handleDrop/i \
  const handleSendChat = async () => {\
    if (!chatInput.trim()) return;\
    const newMessage = { role: "user", parts: [{ text: chatInput }] };\
    const newMessages = [...chatMessages, newMessage];\
    setChatMessages(newMessages);\
    setChatInput("");\
    setIsChatLoading(true);\
    try {\
      const res = await fetch("/api/chat", {\
        method: "POST",\
        headers: {\
          "Content-Type": "application/json",\
          ...(customApiKey ? { "x-api-key": customApiKey } : {})\
        },\
        body: JSON.stringify({ messages: newMessages, tier: "pro" })\
      });\
      if (!res.ok) throw new Error("Chat error");\
      const data = await res.json();\
      setChatMessages([...newMessages, { role: "model", parts: [{ text: data.text }] }]);\
    } catch (e) {\
      showToast("Failed to send message. Please try again.");\
    } finally {\
      setIsChatLoading(false);\
    }\
  };' src/App.tsx
