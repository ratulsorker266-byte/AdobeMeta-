import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Secure, bounded limit for base64 image uploads (50MB is safe and prevents OOM attacks)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Basic security headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  const FALLBACK_TRENDS = {
    currentTrends: [
      { topic: "Authentic Work from Home", description: "Real people working from home, imperfect setups, diverse ages.", keywords: ["wfh", "remote work", "home office", "authentic", "real people", "laptop", "casual"] },
      { topic: "Sustainable Living", description: "Eco-friendly practices, reusable items, solar panels, green energy.", keywords: ["sustainability", "eco friendly", "green", "solar", "renewable", "environment", "nature"] },
      { topic: "Mental Health & Wellness", description: "Meditation, therapy, self-care routines, peaceful moments.", keywords: ["mental health", "wellness", "meditation", "self care", "therapy", "peace", "calm"] },
      { topic: "Technology Integration", description: "AI concepts, smart home devices, virtual reality, modern tech.", keywords: ["technology", "ai", "smart home", "vr", "future", "digital", "innovation"] }
    ],
    upcomingTrends: [
      { topic: "Seasonal Changes", targetMonth: "Next 2 Months", description: "Transition of seasons, weather changes, seasonal activities.", keywords: ["season", "weather", "transition", "nature", "outdoor", "change", "landscape"] },
      { topic: "Holiday Prep", targetMonth: "Next 3-4 Months", description: "Preparing for major holidays, shopping, family gatherings.", keywords: ["holiday", "preparation", "shopping", "family", "gathering", "celebration", "festive"] },
      { topic: "New Year Goals", targetMonth: "Next 3-4 Months", description: "Fitness, planning, healthy habits, fresh starts.", keywords: ["new year", "goals", "planning", "fitness", "health", "start", "resolution"] },
      { topic: "Winter Activities", targetMonth: "Next 3 Months", description: "Snow sports, cozy indoor scenes, warm drinks.", keywords: ["winter", "snow", "cozy", "indoor", "warm", "cold", "sports"] }
    ]
  };

  let cachedGeneralTrends: any = null;
  let lastTrendFetchTime = 0;
  const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

  // Helper function to call Gemini with automatic fallback across reliable models
  async function generateWithFallback(ai: GoogleGenAI, options: any) {
    // gemini-3.1-flash-lite is the freshest and has higher available quota, with fallbacks
    const candidateModels = ["gemini-3.1-flash-lite", "gemini-2.5-flash-lite", "gemini-2.5-flash"];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        return await ai.models.generateContent({
          ...options,
          model
        });
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} attempt failed: ${err?.message || err}. Trying next fallback...`);
      }
    }
    throw lastError || new Error("All AI models failed to respond.");
  }

  function sanitizeChatMessages(rawMessages: any[]): any[] {
    if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
      return [{ role: "user", parts: [{ text: "Hello" }] }];
    }

    const formatted: { role: "user" | "model"; parts: { text: string }[] }[] = [];
    
    for (const m of rawMessages) {
      if (!m) continue;
      const role: "user" | "model" = m.role === "model" ? "model" : "user";
      let text = "";
      if (typeof m === "string") {
        text = m;
      } else if (Array.isArray(m.parts)) {
        text = m.parts
          .map((p: any) => (typeof p === "string" ? p : p?.text || ""))
          .filter(Boolean)
          .join("\n")
          .trim();
      } else if (typeof m.content === "string") {
        text = m.content.trim();
      } else if (typeof m.text === "string") {
        text = m.text.trim();
      }
      
      // Skip system error badges or empty messages
      if (text && !text.startsWith("⚠️ Error:")) {
        formatted.push({ role, parts: [{ text }] });
      }
    }

    // Ensure the conversation begins with a 'user' turn (Gemini requirement)
    const firstUserIdx = formatted.findIndex(m => m.role === "user");
    if (firstUserIdx === -1) {
      return [{ role: "user", parts: [{ text: "Hello" }] }];
    }
    const fromFirstUser = formatted.slice(firstUserIdx);

    // Ensure strictly alternating roles (user, model, user, model)
    const alternating: { role: "user" | "model"; parts: { text: string }[] }[] = [];
    for (const item of fromFirstUser) {
      if (alternating.length === 0) {
        alternating.push(item);
      } else {
        const prev = alternating[alternating.length - 1];
        if (prev.role === item.role) {
          prev.parts[0].text += "\n\n" + item.parts[0].text;
        } else {
          alternating.push(item);
        }
      }
    }

    return alternating.length > 0 ? alternating : [{ role: "user", parts: [{ text: "Hello" }] }];
  }

  function cleanErrorMessage(err: any): string {
    if (!err) return "Unknown error occurred";
    let msg = err.message || String(err);
    try {
      if (msg.startsWith("{") && msg.endsWith("}")) {
        const parsed = JSON.parse(msg);
        if (parsed.error && parsed.error.message) {
          msg = parsed.error.message;
        }
      }
    } catch (_) {}

    // Convert raw Google API rate limit errors into helpful user messages
    if (msg.includes("Quota exceeded") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("rate-limits")) {
      const retryMatch = msg.match(/retry in ([\d\.]+)s/i);
      const retrySec = retryMatch ? Math.round(parseFloat(retryMatch[1])) : 30;
      return `Gemini API Free Tier rate limit reached. Auto-pausing; please wait ${retrySec}s or add your own free API Key in Settings (⚙️) for unlimited speed.`;
    }

    return msg;
  }

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, tier } = req.body;
      const clientApiKey = typeof req.headers["x-api-key"] === "string" ? req.headers["x-api-key"].trim() : "";
      const primaryKey = clientApiKey || process.env.GEMINI_API_KEY;

      if (!primaryKey) {
        return res.status(401).json({ error: "No API key configured on server." });
      }

      const contentsToUse = sanitizeChatMessages(messages);
      const systemInstruction = "You are StockMeta Pro AI Assistant, an expert consultant in commercial stock photography, microstock SEO (Adobe Stock, Shutterstock, Getty/iStock, Freepik, Vecteezy), keywording, titles, metadata standards, and stock portfolio growth. Always provide direct, helpful, and actionable responses. Answer in the same language as the user's message.";

      let ai = new GoogleGenAI({
        apiKey: primaryKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } }
      });

      let response: any;
      try {
        response = await generateWithFallback(ai, {
          contents: contentsToUse,
          config: { systemInstruction }
        });
      } catch (firstErr: any) {
        // If client provided a custom key that failed, fallback automatically to server key
        if (clientApiKey && process.env.GEMINI_API_KEY && clientApiKey !== process.env.GEMINI_API_KEY) {
          console.warn("Client custom key failed in /api/chat. Falling back to server key:", firstErr?.message);
          ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: { headers: { "User-Agent": "aistudio-build" } }
          });
          response = await generateWithFallback(ai, {
            contents: contentsToUse,
            config: { systemInstruction }
          });
        } else {
          throw firstErr;
        }
      }

      const replyText = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || "I am ready to help with your stock photography and metadata questions.";
      res.json({ text: replyText });
    } catch(e: any) {
      console.error("/api/chat error:", e);
      res.status(500).json({ error: cleanErrorMessage(e) });
    }
  });

  app.post("/api/longtail", async (req, res) => {
    try {
      const { title, description, keywords, marketplace, language } = req.body;
      const clientApiKey = req.headers["x-api-key"] as string;
      const apiKeyToUse = clientApiKey || process.env.GEMINI_API_KEY;
      if (!apiKeyToUse) return res.status(401).json({ error: "No API key provided." });
      
      const ai = new GoogleGenAI({
        apiKey: apiKeyToUse,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } }
      });
      const safeKeywords = Array.isArray(keywords) ? keywords : (typeof keywords === "string" ? keywords.split(",") : []);
      const safeTitle = (title || "").trim();
      const safeDesc = (description || "").trim();

      const prompt = `You are an elite Stock Photography SEO specialist. The user needs 5 to 8 HIGHLY SPECIFIC, long-tail search phrases (3-5 words each) for ${marketplace || "stock photography"} in ${language || "English"}.\n\nTitle: ${safeTitle}\nDescription: ${safeDesc}\nCurrent Keywords: ${safeKeywords.slice(0, 15).join(", ")}...\n\nRules:\n1. Generate phrases a buyer would actually search for.\n2. Output purely as a JSON array of strings.\n3. MUST be in ${language || "English"}.`;
      
      const response = await generateWithFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      let text = response.text || "[]";
      text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
      const newKeywords = JSON.parse(text);
      res.json({ keywords: newKeywords });
    } catch(e: any) {
      res.status(500).json({ error: cleanErrorMessage(e) });
    }
  });

  app.post("/api/trends", async (req, res) => {
    try {
      const { searchQuery, date } = req.body;
      const isGeneral = !searchQuery || searchQuery.trim() === '';
      const clientApiKey = req.headers['x-api-key'] as string;
      const apiKeyToUse = clientApiKey || process.env.GEMINI_API_KEY;
      
      if (!apiKeyToUse && !isGeneral) {
        return res.status(401).json({ error: "No API key provided." });
      }
      
      if (isGeneral && cachedGeneralTrends && (Date.now() - lastTrendFetchTime < CACHE_DURATION)) {
        return res.json(cachedGeneralTrends);
      }
      if (!apiKeyToUse && isGeneral) {
        return res.json(FALLBACK_TRENDS);
      }
      
      const ai = new GoogleGenAI({
        apiKey: apiKeyToUse!,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } }
      });
      const prompt = `You are a stock photography trends analyst specializing in Adobe Stock. Today's date is: ${date}. ${searchQuery ? `Trends for: "${searchQuery}".` : `General top trends.`} Return exactly 4 current trends and 4 upcoming trends.`;
      
      const response = await generateWithFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              currentTrends: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    topic: { type: Type.STRING },
                    description: { type: Type.STRING },
                    keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  }
                }
              },
              upcomingTrends: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    topic: { type: Type.STRING },
                    targetMonth: { type: Type.STRING },
                    description: { type: Type.STRING },
                    keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  }
                }
              }
            }
          }
        }
      });
      
      const data = JSON.parse(response.text || "{}");
      if (isGeneral) {
        cachedGeneralTrends = data;
        lastTrendFetchTime = Date.now();
      }
      res.json(data);
    } catch (error: any) {
      const isGeneral = !req.body.searchQuery || req.body.searchQuery.trim() === '';
      if (isGeneral) return res.json(FALLBACK_TRENDS);
      res.status(500).json({ error: cleanErrorMessage(error) });
    }
  });

  app.post("/api/analyze", async (req, res) => {
    try {
      const { imageBase64, mimeType, marketplace, isAiGenerated, tier, assetType, language } = req.body;
      const clientApiKey = req.headers['x-api-key'] as string;
      const apiKeyToUse = clientApiKey || process.env.GEMINI_API_KEY;
      
      if (!apiKeyToUse) {
        return res.status(401).json({ error: "No API key provided. Please add your Gemini API key in Settings." });
      }
      if (!imageBase64 || typeof imageBase64 !== "string" || !mimeType) {
        return res.status(400).json({ error: "Missing or invalid image data or mime type." });
      }

      // Strip data URL prefix if provided
      const rawBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
      const safeMimeType = String(mimeType || "image/jpeg").toLowerCase();

      const ai = new GoogleGenAI({
        apiKey: apiKeyToUse,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } }
      });
      // Single unified Gemini analysis call to avoid doubling quota consumption
      const prompt = `
      You are an Elite Stock Photography SEO Specialist and Visual Reviewer.
      Target Marketplace: ${marketplace?.toUpperCase() || 'ADOBE_STOCK'}.
      Asset Type: ${assetType || 'Photo'}.
      AI Generated: ${isAiGenerated ? 'Yes' : 'No'}.
      MUST write Title, Description, and Keywords in ${language || "English"}.
      
      PRO-LEVEL SEO & METADATA RULES:
      1. TITLE: Highly descriptive, commercially viable title (5 to 15 words) identifying subject, context, and mood.
      2. KEYWORDS: Generate 40 to 48 highly relevant, high-volume search keywords (mixture of specific subjects, actions, concepts, and styles).
      3. PRIORITY KEYWORDS: Top 10 most critical search terms.
      4. STRICT ADOBE STOCK MODERATOR SIMULATION: Calculate "acceptanceProbability" (0-100%). Identify realistic "rejectionFlags" (e.g. Intellectual Property, Artifacts, Out of Focus, Noise, or Clean).
      `;

      const response = await generateWithFallback(ai, {
        contents: [
          {
            parts: [
              { inlineData: { data: rawBase64, mimeType: safeMimeType } },
              { text: prompt },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              salesPotentialScore: { type: Type.INTEGER, description: "Score from 0 to 100 indicating viral/sales potential" },
              technicalQualityScore: { type: Type.INTEGER },
              metadataQualityScore: { type: Type.INTEGER },
              copyrightRiskScore: { type: Type.INTEGER },
              overallSubmissionRiskScore: { type: Type.INTEGER },
              acceptanceProbability: { type: Type.INTEGER, description: "0-100 percentage of being accepted by Adobe Stock" },
              rejectionFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
              riskLabel: { type: Type.STRING, description: "Low risk | Medium risk | High risk | Do not submit before fixing" },
              explanation: { type: Type.STRING },
              detectedDefects: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedTitle: { type: Type.STRING },
              shortDescription: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              priorityKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: cleanErrorMessage(error) });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
}

startServer();
