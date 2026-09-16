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

  app.post("/api/analyze", async (req, res) => {
    try {
      const { imageBase64, mimeType, marketplace, isAiGenerated, tier, assetType, language } = req.body;
    const aiModel = tier === "pro" ? "gemini-1.5-pro" : "gemini-2.5-flash";
      const clientApiKey = req.headers['x-api-key'] as string;
      const apiKeyToUse = clientApiKey || process.env.GEMINI_API_KEY;

      if (!apiKeyToUse) {
        return res.status(401).json({ error: "No API key provided. Please add your Gemini API key in Settings." });
      }

      if (!imageBase64 || !mimeType) {
        return res.status(400).json({ error: "Missing image data or mime type." });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKeyToUse,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `
      You are an Elite Stock Photography SEO Specialist, Metadata Expert, and Quality Inspector.
      Your ultimate goal is to generate metadata that maximizes downloads and sales for the contributor.
      Target Marketplace Platform: ${marketplace?.toUpperCase() || 'ADOBE_STOCK'}.
      Is AI Generated Asset: ${isAiGenerated}.

      CRITICAL: You MUST write the Title, Description, and ALL Keywords in ${language || "English"}.
      PRO-LEVEL SEO PRO-LEVEL SEO & METADATA RULES: METADATA RULES:
      1. TITLE OPTIMIZATION (${assetType ? `Make sure to start the title by identifying it as a ${assetType} (e.g., Vector illustration of..., 3D render of...)` : `Identify the asset type naturally`}): Write a highly descriptive, commercial SEO title (5 to 15 words). 
         Structure: [Main Subject] + [Action/Emotion] + [Environment/Setting]. 
         Make it sound exactly like what a buyer (designer/marketer) would type in a search bar.
      2. KEYWORD STRATEGY (Generate the maximum allowed for ${marketplace}, usually 45-49):
         - Literal: Exact objects, age, ethnicity, colors, locations.
         - Conceptual/Emotional (Buyer Intent): What does this represent? (e.g., success, leadership, freedom, joy, innovation, teamwork, abstract concepts).
         - Composition/Framing: Include terms designers look for (e.g., copy space, flat lay, top view, negative space, macro, blurred background, bokeh, wide angle, isolated).
      3. ANTI-SPAM: Strictly include ONLY 100% relevant keywords. Irrelevant keywords penalize the image. Do not hallucinate elements not present.
      4. PRIORITY KEYWORDS: Carefully select the top 10 most commercially valuable and relevant keywords as priority.
      5. QUALITY INSPECTION: Strictly perform copyright, trademark, and AI defect inspection (e.g., extra fingers, deformed anatomy, artifacts, noise). Provide an honest "riskLabel".

      Return ONLY a single valid JSON object matching this schema.
      `;

      const response = await ai.models.generateContent({
        model: aiModel,
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: imageBase64,
                  mimeType: mimeType,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              technicalQualityScore: { type: Type.INTEGER },
              metadataQualityScore: { type: Type.INTEGER },
              copyrightRiskScore: { type: Type.INTEGER },
              overallSubmissionRiskScore: { type: Type.INTEGER },
              riskLabel: { type: Type.STRING, description: "Low risk | Medium risk | High risk | Do not submit before fixing" },
              explanation: { type: Type.STRING },
              detectedDefects: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedTitle: { type: Type.STRING, description: "SEO title 5 to 15 words" },
              shortDescription: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              priorityKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
        },
      });

      let responseText = response.text;
      if (!responseText) {
        return res.status(500).json({ error: "No response text from Gemini." });
      }
      
      // Clean markdown JSON formatting if AI includes it
      responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      
      const data = JSON.parse(responseText);
      res.json(data);
    } catch (error: any) {
      console.error("Error analyzing image:", error);
      
      const errorMessage = error?.message || "";
      
      // Hard Quota Limit Reached
      if (errorMessage.includes("exceeded your current quota") || errorMessage.includes("limit: 20")) {
        return res.status(403).json({ error: "System API Quota Exceeded. To continue bulk processing, please click 'Settings' and enter your own FREE Gemini API Key." });
      }
      
      // Temporary Rate limit error (429) or server overload (503)
      if (error.status === 429 || error.status === 503 || errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE")) {
        return res.status(503).json({ error: errorMessage || "Gemini API is currently experiencing high demand. Please wait." });
      }

      res.status(500).json({ error: errorMessage || "Failed to analyze image." });
    }
  });

  // Fallback data if Gemini is overloaded
  const FALLBACK_TRENDS = {
    currentTrends: [
      { topic: "Autumn & Fall Transitions", description: "Warm cozy vibes, fall leaves, seasonal transitions, and autumn lifestyle.", keywords: ["autumn", "fall", "leaves", "cozy", "season", "nature", "lifestyle"] },
      { topic: "Business & Remote Work", description: "People working from home, video calls, modern office setups, hybrid work.", keywords: ["business", "work from home", "remote", "office", "technology", "meeting", "professional"] },
      { topic: "AI & Future Tech", description: "Abstract data, artificial intelligence concepts, futuristic interfaces, networks.", keywords: ["ai", "technology", "artificial intelligence", "data", "future", "network", "digital"] },
      { topic: "Health & Mental Wellness", description: "Meditation, healthy eating, active lifestyle, mental health awareness.", keywords: ["health", "wellness", "mental health", "meditation", "lifestyle", "care", "fitness"] }
    ],
    upcomingTrends: [
      { topic: "End of Year Holidays", targetMonth: "Next 2-3 Months", description: "Holiday shopping, family gatherings, festive decorations, winter celebrations.", keywords: ["holiday", "celebration", "family", "festive", "shopping", "gift", "winter"] },
      { topic: "New Year Resolutions", targetMonth: "Next 3-4 Months", description: "Fitness goals, planners, fresh starts, healthy habits, business planning.", keywords: ["new year", "resolution", "fitness", "planning", "goals", "health", "start"] },
      { topic: "Winter Activities", targetMonth: "Next 3 Months", description: "Snow sports, cozy indoor scenes, winter landscapes, warm drinks.", keywords: ["winter", "snow", "cold", "sports", "cozy", "indoor", "landscape"] },
      { topic: "Valentine's Day & Romance", targetMonth: "Next 4-5 Months", description: "Couples, romance, gifts, red and pink aesthetics, dating.", keywords: ["valentines", "love", "romance", "couple", "heart", "gift", "dating"] }
    ]
  };

  let cachedGeneralTrends: any = null;
  let lastTrendFetchTime = 0;
  const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours cache for general trends

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, tier } = req.body;
      const clientApiKey = req.headers["x-api-key"] as string;
      const apiKeyToUse = clientApiKey || process.env.GEMINI_API_KEY;
      if (!apiKeyToUse) return res.status(401).json({ error: "No API key provided." });
      // Allowed for all, limits enforced on client
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
  app.post("/api/trends", async (req, res) => {
    try {
      const { searchQuery, date } = req.body;
      const isGeneral = !searchQuery || searchQuery.trim() === '';
      
      const clientApiKey = req.headers['x-api-key'] as string;
      const apiKeyToUse = clientApiKey || process.env.GEMINI_API_KEY;

      if (!apiKeyToUse && !isGeneral) {
        return res.status(401).json({ error: "No API key provided. Please add your Gemini API key in Settings." });
      }

      // 1. Return cached general trends if available and fresh
      if (isGeneral && cachedGeneralTrends && (Date.now() - lastTrendFetchTime < CACHE_DURATION)) {
        return res.json(cachedGeneralTrends);
      }

      if (!apiKeyToUse && isGeneral) {
        // Force fallback if no API key is provided and it's a general request
        return res.json(FALLBACK_TRENDS);
      }

      const ai = new GoogleGenAI({
        apiKey: apiKeyToUse!,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `
      You are a stock photography trends analyst specializing in Adobe Stock.
      Today's date is: ${date}.
      ${searchQuery ? `The user is specifically searching for trends related to: "${searchQuery}". Tailor your response to this niche if possible.` : `Provide general top trends across all of Adobe Stock.`}

      If the user searches for a specific month (e.g., "October"), list the key seasonal events, holidays, and stock photography opportunities for that month, and BOLD the most crucial/high-selling events in the description using markdown (**event**).
      Return exactly 4 current trends (what's selling right now for the running month) and exactly 4 upcoming trends (what contributors should shoot/create now for the upcoming 3 to 4 months).
      For each, provide a specific topic, a brief visual description of what sells, and 5-8 SEO keywords.
      `;

      const response = await ai.models.generateContent({
        model: aiModel,
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
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
                    targetMonth: { type: Type.STRING, description: "E.g., Next 2 Months, December, Winter" },
                    description: { type: Type.STRING },
                    keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  }
                }
              }
            }
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text from Gemini.");
      }
      
      const data = JSON.parse(responseText);

      // 2. Cache general trends
      if (isGeneral) {
        cachedGeneralTrends = data;
        lastTrendFetchTime = Date.now();
      }

      res.json(data);
    } catch (error: any) {
      console.error("Error generating trends:", error);
      const isRateLimit = error.status === 429 || error?.message?.includes("exceeded your current quota") || error?.message?.includes("RESOURCE_EXHAUSTED");
      const isGeneral = !req.body.searchQuery || req.body.searchQuery.trim() === '';

      // 3. Fallback for general queries on error to ensure users always see trends
      if (isGeneral) {
        console.log("Serving fallback trends due to AI API error.");
        return res.json(FALLBACK_TRENDS);
      }

      if (isRateLimit) {
        return res.status(429).json({ error: "The AI is currently overloaded with requests (Rate Limit). Please wait a few moments and try your search again." });
      }
      res.status(500).json({ error: error.message || "Failed to fetch trends." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
