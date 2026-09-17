sed -i '/app.post("\/api\/trends"/i \
  app.post("/api/longtail", async (req, res) => {\
    try {\
      const { title, description, keywords, marketplace, language } = req.body;\
      const clientApiKey = req.headers["x-api-key"] as string;\
      const apiKeyToUse = clientApiKey || process.env.GEMINI_API_KEY;\
      if (!apiKeyToUse) return res.status(401).json({ error: "No API key provided." });\
      const ai = new GoogleGenAI({ apiKey: apiKeyToUse });\
      const prompt = `You are an elite Stock Photography SEO specialist. The user needs 5 to 8 HIGHLY SPECIFIC, long-tail search phrases (3-5 words each) for ${marketplace || "stock photography"} in ${language || "English"}.\\n\\nTitle: ${title}\\nDescription: ${description}\\nCurrent Keywords: ${keywords.slice(0, 15).join(", ")}...\\n\\nRules:\\n1. Generate phrases a buyer would actually search for (e.g., "young woman drinking coffee outdoors", "modern abstract tech background").\\n2. Output purely as a JSON array of strings.\\n3. MUST be in ${language || "English"}.`;\
      const response = await ai.models.generateContent({\
        model: "gemini-1.5-pro",\
        contents: prompt,\
        config: {\
          responseMimeType: "application/json",\
          responseSchema: {\
            type: Type.ARRAY,\
            items: { type: Type.STRING }\
          }\
        }\
      });\
      let text = response.text || "[]";\
      text = text.replace(/^```json\\s*/, "").replace(/\\s*```$/, "").trim();\
      const newKeywords = JSON.parse(text);\
      res.json({ keywords: newKeywords });\
    } catch(e: any) {\
      res.status(500).json({ error: e.message || "Failed to generate long-tail keywords" });\
    }\
  });' server.ts
