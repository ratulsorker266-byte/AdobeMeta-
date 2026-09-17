import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase the limit for image uploads to support exceptionally large payloads
  app.use(express.json({ limit: "50gb" }));
  app.use(express.urlencoded({ limit: "50gb", extended: true }));

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

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, tier } = req.body;
      const clientApiKey = req.headers["x-api-key"] as string;
      const apiKeyToUse = clientApiKey || process.env.GEMINI_API_KEY;
      if (!apiKeyToUse) return res.status(401).json({ error: "No API key provided." });
      
      const ai = new GoogleGenAI({ apiKey: apiKeyToUse });
      const response = await ai.models.generateContent({
        model: "gemini-1.5-pro",
        contents: messages
      });
      res.json({ text: response.text });
    } catch(e: any) {
      res.status(500).json({ error: e.message || "Chat failed" });
    }
  });

  app.post("/api/longtail", async (req, res) => {
    try {
      const { title, description, keywords, marketplace, language } = req.body;
      const clientApiKey = req.headers["x-api-key"] as string;
      const apiKeyToUse = clientApiKey || process.env.GEMINI_API_KEY;
      if (!apiKeyToUse) return res.status(401).json({ error: "No API key provided." });
      
      const ai = new GoogleGenAI({ apiKey: apiKeyToUse });
      const prompt = `You are an elite Stock Photography SEO specialist. The user needs 5 to 8 HIGHLY SPECIFIC, long-tail search phrases (3-5 words each) for ${marketplace || "stock photography"} in ${language || "English"}.\n\nTitle: ${title}\nDescription: ${description}\nCurrent Keywords: ${keywords.slice(0, 15).join(", ")}...\n\nRules:\n1. Generate phrases a buyer would actually search for.\n2. Output purely as a JSON array of strings.\n3. MUST be in ${language || "English"}.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-1.5-pro",
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
      res.status(500).json({ error: e.message || "Failed to generate long-tail keywords" });
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
      
      const ai = new GoogleGenAI({ apiKey: apiKeyToUse! });
      const prompt = `You are a stock photography trends analyst specializing in Adobe Stock. Today's date is: ${date}. ${searchQuery ? `Trends for: "${searchQuery}".` : `General top trends.`} Return exactly 4 current trends and 4 upcoming trends.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-1.5-pro",
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
      res.status(500).json({ error: "Failed to fetch trends." });
    }
  });

  app.post("/api/analyze", async (req, res) => {
    try {
      const { imageBase64, mimeType, marketplace, isAiGenerated, tier, assetType, language } = req.body;
      const clientApiKey = req.headers['x-api-key'] as string;
      const apiKeyToUse = clientApiKey || process.env.GEMINI_API_KEY;
      
      if (!apiKeyToUse) {
        return res.status(401).json({ error: "No API key provided." });
      }
      if (!imageBase64 || !mimeType) {
        return res.status(400).json({ error: "Missing image data or mime type." });
      }

      const ai = new GoogleGenAI({ apiKey: apiKeyToUse });
      const isProTier = tier && tier !== "free";
      let rawImageAnalysis = "";

      if (isProTier) {
        const visionPrompt = `You are an Expert Visual Analyst for Stock Photography. Analyze this image meticulously and provide a highly detailed raw data report covering: 1. Main subjects 2. Environment 3. Composition 4. Conceptual Themes 5. Potential Defects. Do not format it as JSON.`;
        const visionResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              parts: [
                { inlineData: { data: imageBase64, mimeType: mimeType } },
                { text: visionPrompt }
              ]
            }
          ]
        });
        rawImageAnalysis = visionResponse.text || "";
      }

      const prompt = `
      You are an Elite Stock Photography SEO Specialist. Target: ${marketplace?.toUpperCase() || 'ADOBE_STOCK'}. Is AI: ${isAiGenerated}.
      MUST write Title, Description, and Keywords in ${language || "English"}.
      ${isProTier ? `I ran this image through our AI Vision Analyst. Raw report: ${rawImageAnalysis}. Use this AND your own analysis.` : ''}
      
      PRO-LEVEL SEO & METADATA RULES:
      1. TITLE: Highly descriptive, commercial SEO title (5 to 15 words). ${assetType ? `Start by identifying it as a ${assetType}` : ''}
      2. KEYWORDS: Maximum allowed (45-49). Literal, conceptual, framing.
      3. ANTI-SPAM: Strictly 100% relevant keywords.
      4. PRIORITY: Top 10 priority keywords.
      5. STRICT ADOBE STOCK MODERATOR SIMULATION: Act as a ruthless stock photo reviewer. Calculate the "acceptanceProbability" (0-100%). Identify specific "rejectionFlags" (e.g., Intellectual Property, Artifacts, Out of Focus, Similar Content). Give it a highly realistic and strict ratio.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-pro",
        contents: [
          {
            parts: [
              { inlineData: { data: imageBase64, mimeType: mimeType } },
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

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to analyze image" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
}

startServer();
