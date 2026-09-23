import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { findMonthlyTrends, MONTHLY_TRENDS_KNOWLEDGE } from "./monthlyTrends.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Secure, bounded limit for base64 image uploads (50MB is safe and prevents OOM attacks)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Enterprise Cyber-Security & Defensive Headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    // Rate limit header signaling
    res.setHeader("X-RateLimit-Policy", "stockmeta-anti-abuse-v1");
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
  // Prioritizes high-quota, resilient models if quota limit or overload occurs
  async function generateWithFallback(ai: GoogleGenAI, options: any, fastFirst: boolean = false) {
    const candidateModels = fastFirst
      ? ["gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"]
      : ["gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
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

  // Unified executor that gracefully falls back to system key if custom key errors
  async function callGeminiUnified(
    clientApiKey: string | undefined | null,
    generateFn: (ai: GoogleGenAI) => Promise<any>
  ): Promise<any> {
    const serverKey = process.env.GEMINI_API_KEY || "";
    const cleanClientKey = clientApiKey ? clientApiKey.trim() : "";
    const primaryKey = cleanClientKey || serverKey;

    if (!primaryKey) {
      throw new Error("No Gemini API key configured. Please add your free key in Settings (⚙️).");
    }

    const primaryAi = new GoogleGenAI({
      apiKey: primaryKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } }
    });

    try {
      return await generateFn(primaryAi);
    } catch (firstErr: any) {
      // If user supplied a custom key that failed (quota, auth, invalid) and server key is available, fallback!
      if (cleanClientKey && serverKey && cleanClientKey !== serverKey) {
        console.warn("Client custom key failed, auto-falling back to server key:", firstErr?.message);
        const fallbackAi = new GoogleGenAI({
          apiKey: serverKey,
          httpOptions: { headers: { "User-Agent": "aistudio-build" } }
        });
        return await generateFn(fallbackAi);
      }
      throw firstErr;
    }
  }

  function safeParseJson(rawText: string | undefined | null, fallback: any = {}): any {
    if (!rawText || typeof rawText !== "string") return fallback;
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    }
    try {
      return JSON.parse(cleaned);
    } catch (err) {
      // Try to extract outermost JSON object or array cleanly
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        try {
          return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
        } catch (_) {}
      }
      const firstBracket = cleaned.indexOf('[');
      const lastBracket = cleaned.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket > firstBracket) {
        try {
          return JSON.parse(cleaned.substring(firstBracket, lastBracket + 1));
        } catch (_) {}
      }
      console.error("JSON parsing error on text:", rawText);
      return fallback;
    }
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
    if (!err) return "Service temporarily unavailable. Please retry.";
    let msg = "";
    if (typeof err === "string") {
      msg = err;
    } else if (err.message && typeof err.message === "string") {
      msg = err.message;
    } else if (err.error?.message && typeof err.error.message === "string") {
      msg = err.error.message;
    } else if (err.statusText && typeof err.statusText === "string") {
      msg = err.statusText;
    } else {
      try {
        msg = JSON.stringify(err);
      } catch (_) {
        msg = String(err);
      }
    }

    if (!msg || msg === "{}" || msg === "[object Object]") {
      msg = "Service temporarily unavailable or model busy. Please retry in a few moments.";
    }

    try {
      if (msg.startsWith("{") && msg.endsWith("}")) {
        const parsed = JSON.parse(msg);
        if (parsed.error?.message) {
          msg = parsed.error.message;
        }
      }
    } catch (_) {}

    // Convert raw Google API rate limit errors into helpful user messages
    if (msg.includes("Quota exceeded") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("rate-limits") || msg.includes("429")) {
      const retryMatch = msg.match(/retry in ([\d\.]+)s/i);
      const retrySec = retryMatch ? Math.round(parseFloat(retryMatch[1])) : 25;
      return `Gemini API Free Tier rate limit reached. Auto-pausing; please wait ${retrySec}s or add your own free API Key in Settings (⚙️) for unlimited speed.`;
    }

    if (msg.includes("overloaded") || msg.includes("503") || msg.includes("UNAVAILABLE")) {
      return "AI service temporarily busy or overloaded. Please click Retry.";
    }

    return msg;
  }

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, tier } = req.body;
      const clientApiKey = typeof req.headers["x-api-key"] === "string" ? req.headers["x-api-key"].trim() : "";
      const contentsToUse = sanitizeChatMessages(messages);
      const systemInstruction = "You are AdobeMeta Pro AI Assistant, an elite authority and consultant in microstock SEO (Adobe Stock, Shutterstock, Getty/iStock, Freepik, Vecteezy), keywording, titles, metadata standards, and stock portfolio growth. Always provide direct, helpful, and actionable responses. Answer in the same language as the user's message.";

      const response = await callGeminiUnified(clientApiKey, async (ai) => {
        return await generateWithFallback(ai, {
          contents: contentsToUse,
          config: { systemInstruction }
        });
      });

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
      const safeKeywords = Array.isArray(keywords) ? keywords : (typeof keywords === "string" ? keywords.split(",") : []);
      const safeTitle = (title || "").trim();
      const safeDesc = (description || "").trim();

      const prompt = `You are an elite Stock Photography SEO specialist. The user needs 5 to 8 HIGHLY SPECIFIC, long-tail search phrases (3-5 words each) for ${marketplace || "stock photography"} in ${language || "English"}.\n\nTitle: ${safeTitle}\nDescription: ${safeDesc}\nCurrent Keywords: ${safeKeywords.slice(0, 15).join(", ")}...\n\nRules:\n1. Generate phrases a buyer would actually search for.\n2. Output purely as a JSON array of strings.\n3. MUST be in ${language || "English"}.`;
      
      const response = await callGeminiUnified(clientApiKey, async (ai) => {
        return await generateWithFallback(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        });
      });

      const newKeywords = safeParseJson(response.text, []);
      res.json({ keywords: Array.isArray(newKeywords) ? newKeywords : [] });
    } catch(e: any) {
      res.status(500).json({ error: cleanErrorMessage(e) });
    }
  });

  app.post("/api/trends", async (req, res) => {
    try {
      const { searchQuery, date } = req.body;
      const isGeneral = !searchQuery || searchQuery.trim() === '';
      const matchedMonth = searchQuery ? findMonthlyTrends(searchQuery) : null;

      // If user searches for any calendar month (e.g. October, December, January), return verified rich trends immediately!
      if (matchedMonth) {
        return res.json(matchedMonth);
      }

      const clientApiKey = req.headers['x-api-key'] as string;
      const apiKeyToUse = clientApiKey || process.env.GEMINI_API_KEY;

      if (!apiKeyToUse && !isGeneral) {
        return res.status(401).json({ error: "No API key provided." });
      }
      
      if (isGeneral && cachedGeneralTrends && (Date.now() - lastTrendFetchTime < CACHE_DURATION)) {
        return res.json(cachedGeneralTrends);
      }
      if (!apiKeyToUse && isGeneral) {
        const nowMonth = new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase();
        return res.json(MONTHLY_TRENDS_KNOWLEDGE[nowMonth] || FALLBACK_TRENDS);
      }
      
      const prompt = `
      You are an elite Stock Market Photography and Creative Content Trend Forecaster for Adobe Stock, Shutterstock, Freepik, and Getty.
      Topic/Query: "${searchQuery || 'High-Demand Seasonal Stock Trends'}".
      Reference Period: "${date || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}".

      Analyze commercial buyer demand, seasonal purchasing cycles, and content gaps:
      1. Provide monthName and monthOverview summarizing market demand.
      2. whatToCreate: 5 concrete, actionable concepts commercial buyers actively purchase.
      3. currentTrends: 4 top trending topics right now with actionGuide, bestFor, and 6-8 search keywords each.
      4. upcomingTrends: 4 upcoming trends for the next 2-4 months with targetMonth, actionGuide, bestFor, and 6-8 search keywords each.
      `;

      const data = await callGeminiUnified(clientApiKey, async (ai) => {
        const response = await generateWithFallback(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                monthName: { type: Type.STRING },
                monthOverview: { type: Type.STRING },
                whatToCreate: { type: Type.ARRAY, items: { type: Type.STRING } },
                currentTrends: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      topic: { type: Type.STRING },
                      description: { type: Type.STRING },
                      actionGuide: { type: Type.STRING },
                      bestFor: { type: Type.STRING },
                      keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["topic", "description", "keywords"]
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
                      actionGuide: { type: Type.STRING },
                      bestFor: { type: Type.STRING },
                      keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["topic", "description", "keywords"]
                  }
                }
              },
              required: ["monthName", "monthOverview", "whatToCreate", "currentTrends", "upcomingTrends"]
            }
          }
        });
        return safeParseJson(response.text, {});
      });

      // Ensure all critical sections are present, merging with curated month DB if necessary
      if (!data.currentTrends || !Array.isArray(data.currentTrends) || data.currentTrends.length === 0) {
        data.currentTrends = matchedMonth?.currentTrends || FALLBACK_TRENDS.currentTrends;
      }
      if (!data.upcomingTrends || !Array.isArray(data.upcomingTrends) || data.upcomingTrends.length === 0) {
        data.upcomingTrends = matchedMonth?.upcomingTrends || FALLBACK_TRENDS.upcomingTrends;
      }
      if (!data.whatToCreate || !Array.isArray(data.whatToCreate) || data.whatToCreate.length === 0) {
        data.whatToCreate = matchedMonth?.whatToCreate || [];
      }
      if (!data.monthOverview && matchedMonth?.monthOverview) {
        data.monthOverview = matchedMonth.monthOverview;
      }
      if (!data.monthName && matchedMonth?.monthName) {
        data.monthName = matchedMonth.monthName;
      }
      if (isGeneral) {
        cachedGeneralTrends = data;
        lastTrendFetchTime = Date.now();
      }
      res.json(data);
    } catch (error: any) {
      console.warn("Trends API error, activating intelligent fallback:", error?.message);
      const matchedMonth = req.body.searchQuery ? findMonthlyTrends(req.body.searchQuery) : null;
      if (matchedMonth) {
        return res.json(matchedMonth);
      }
      const isGeneral = !req.body.searchQuery || req.body.searchQuery.trim() === '';
      if (isGeneral) {
        const nowMonth = new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase();
        return res.json(MONTHLY_TRENDS_KNOWLEDGE[nowMonth] || FALLBACK_TRENDS);
      }
      res.status(500).json({ error: cleanErrorMessage(error) });
    }
  });

  function getMarketplaceSEOConfig(marketplace: string = 'adobe_stock') {
    const norm = (marketplace || '').toLowerCase().trim();
    switch (norm) {
      case 'shutterstock':
        return {
          id: 'shutterstock',
          name: 'Shutterstock',
          targetKeywordCount: '35 to 49',
          maxKeywords: 50,
          minKeywords: 25,
          titleDirectives: `
          - SHUTTERSTOCK MANDATORY RULE: Title MUST be a detailed, descriptive narrative sentence of at least 5 words (ideally 8 to 15 words).
          - Must answer: Who is in it, what is happening, where is it located, and the conceptual environment.
          - Never use promotional buzzwords ("best", "amazing", "unique") or camera names.
          - Capitalize the first letter of the sentence, do not end with a period.`,
          keywordDirectives: `
          - Provide between 35 and 48 highly relevant keywords (Shutterstock max is 50, min is 7).
          - Include specific literal nouns, actions, broad categories, and emotional/business themes.
          - Include singular and plural forms for core subjects.`,
          descriptionDirectives: `
          - Detailed caption sentence (10-25 words) that tells the complete narrative of the scene for commercial/editorial buyers.`
        };
      case 'freepik':
        return {
          id: 'freepik',
          name: 'Freepik',
          targetKeywordCount: '20 to 30',
          maxKeywords: 30,
          minKeywords: 18,
          titleDirectives: `
          - FREEPIK MANDATORY RULE: Clean, succinct commercial title (4 to 8 words).
          - Focus on visual style, graphic utility, and theme (e.g., "Modern abstract geometric vector background" or "Minimalist corporate business team illustration").
          - Avoid long conversational narratives; keep it commercial and design-focused.`,
          keywordDirectives: `
          - FREEPIK STRICT RULE: Exactly 20 to 30 highly targeted tags. DO NOT exceed 30 tags (Freepik penalizes tag spam).
          - Focus on graphic design tags, layout, colors, format, and commercial application.
          - For vectors/graphics, prioritize tags like: vector, template, banner, background, graphic, flat, modern.`,
          descriptionDirectives: `
          - Brief 1-sentence design summary highlighting style, color palette, and format.`
        };
      case 'vecteezy':
        return {
          id: 'vecteezy',
          name: 'Vecteezy',
          targetKeywordCount: '25 to 35',
          maxKeywords: 35,
          minKeywords: 20,
          titleDirectives: `
          - VECTEEZY MANDATORY RULE: High-clarity title (5 to 10 words) explicitly stating the graphic medium, style, and theme.
          - Example: "Vintage hand drawn botanical floral pattern vector illustration".`,
          keywordDirectives: `
          - Provide 25 to 35 targeted keywords focusing on artistic style, vector/cutout properties, patterns, colors, and print utility.`,
          descriptionDirectives: `
          - Concise description stating the asset type, license suitability, and creative use cases.`
        };
      case 'getty':
      case 'istock':
        return {
          id: 'getty',
          name: 'Getty Images / iStock',
          targetKeywordCount: '20 to 35',
          maxKeywords: 35,
          minKeywords: 20,
          titleDirectives: `
          - GETTY / ISTOCK MANDATORY RULE: Factual, journalistic or commercial headline (6 to 12 words).
          - Clear, dignified, objective. No hyperbolic sales buzzwords or repetitive words.`,
          keywordDirectives: `
          - Use precise, vocabulary-controlled conceptual keywords (20 to 35 tags).
          - Group by: literal subject (age, gender, ethnicity if people), environment, conceptual emotion, and technical composition.
          - Avoid near-duplicate synonyms or keyword stuffing.`,
          descriptionDirectives: `
          - Clear journalistic caption stating who, what, where, and mood.`
        };
      case '123rf':
      case 'dreamstime':
        return {
          id: norm,
          name: norm.toUpperCase(),
          targetKeywordCount: '30 to 45',
          maxKeywords: 45,
          minKeywords: 25,
          titleDirectives: `
          - Clear commercial stock title (6 to 12 words) describing the main subject and setting naturally.`,
          keywordDirectives: `
          - Provide 30 to 45 keywords balancing primary objects, actions, background, and conceptual themes.`,
          descriptionDirectives: `
          - Complete descriptive caption detailing the scene.`
        };
      case 'adobe_stock':
      default:
        return {
          id: 'adobe_stock',
          name: 'Adobe Stock',
          targetKeywordCount: '45 to 49',
          maxKeywords: 49,
          minKeywords: 35,
          titleDirectives: `
          - ADOBE STOCK MANDATORY RULE: Natural, commercially compelling title (7 to 14 words).
          - Must describe: Main subject + specific action/state + environment/background + lighting/mood.
          - NO keyword stuffing in title. Capitalize first letter of sentence naturally. NO trailing period.
          - Avoid filler words like "image of", "photo of", "isolated on background".`,
          keywordDirectives: `
          - ADOBE STOCK ALGORITHM PRIORITY: Maximum 49 keywords.
          - CRITICAL: The first 10 keywords MUST be the absolute most critical search terms. Adobe's search algorithm heavily weights the top 10 keywords for search ranking!
          - Next keywords include secondary elements, lighting style, perspective, and conceptual emotions.`,
          descriptionDirectives: `
          - Natural 1-2 sentence commercial summary.`
        };
    }
  }

  function getAssetTypeSEOConfig(assetType: string = 'Photo') {
    const norm = (assetType || '').toLowerCase().trim();
    if (norm.includes('vector') || norm.includes('eps')) {
      return {
        name: 'Vector / EPS',
        directive: `
        - ASSET TYPE: Scalable Vector Graphic (EPS / AI / SVG).
        - TITLE: Must denote graphic or vector style (e.g., "...vector illustration", "...graphic template", "...vector banner").
        - KEYWORDS: MUST include vector terminology: "vector, eps, scalable, illustration, graphic, editable, design element, flat design, modern graphic".
        - FORBIDDEN: NEVER include camera or photo terms (e.g., no "dslr, shot, photo, camera, lens, bokeh, depth of field").`
      };
    } else if (norm.includes('png') || norm.includes('transparent')) {
      return {
        name: 'PNG (Transparent Background)',
        directive: `
        - ASSET TYPE: Transparent PNG cutout / Isolated object.
        - TITLE: Explicitly describe the isolated subject (e.g. "...isolated on transparent background").
        - KEYWORDS: MUST include: "transparent background, png, cutout, isolated, isolated on transparent, no background, alpha channel, clip art, graphic element, object".`
      };
    } else if (norm.includes('3d') || norm.includes('render')) {
      return {
        name: '3D Render / CGI',
        directive: `
        - ASSET TYPE: 3D Digital Render / CGI.
        - TITLE: Highlight the 3D aesthetic (e.g. "...3D render illustration", "...isometric 3D scene").
        - KEYWORDS: MUST include: "3d render, cgi, three dimensional, 3d illustration, digital render, isometric, 3d modeling, modern 3d, realistic 3d, digital art".`
      };
    } else if (norm.includes('generative') || norm.includes('ai')) {
      return {
        name: 'Generative AI Art',
        directive: `
        - ASSET TYPE: Generative AI Artwork.
        - TITLE: High-concept, imaginative description of the scene.
        - KEYWORDS: In compliance with microstock transparency policies (Adobe Stock, Freepik), MUST include: "generative ai, ai generated, digital concept, ai art, synthetic image, conceptual illustration".`
      };
    } else if (norm.includes('illustration') || norm.includes('clipart')) {
      return {
        name: 'Illustration / Clipart',
        directive: `
        - ASSET TYPE: Illustration / Digital Art.
        - TITLE: Characterize the illustration subject and artistic style (flat, hand drawn, watercolor, retro, minimalist).
        - KEYWORDS: MUST include: "illustration, digital art, graphic, drawing, artwork, creative, decorative, clip art" and specific artistic style terms.`
      };
    } else if (norm.includes('video') || norm.includes('footage') || norm.includes('motion') || norm.includes('mp4') || norm.includes('mov')) {
      return {
        name: 'Stock Video / Footage (4K / HD)',
        directive: `
        - ASSET TYPE: Stock Video Footage / Motion Clip (MP4 / MOV / ProRes).
        - TITLE: Action-oriented, cinematic description specifying camera motion, lighting, and scene action (e.g. "...slow motion panning shot of...", "...aerial drone view of...", "...cinematic 4K close-up of...").
        - KEYWORDS: MUST include cinematic & video keywords: "video footage, stock video, 4k, cinematic, slow motion, b-roll, motion clip, real time, camera movement, high definition" along with specific action verbs and pacing descriptors.
        - FORBIDDEN: Do NOT use static print terms like "poster, isolated on white, clipart".`
      };
    } else {
      return {
        name: 'Photo / JPG',
        directive: `
        - ASSET TYPE: Photography (JPG / RAW).
        - TITLE: Authentic photographic description of the real-world subject, moment, and environment.
        - KEYWORDS: Focus on authentic photography elements: lighting (natural light, golden hour, softbox), composition, focus, real people, authentic lifestyle.
        - FORBIDDEN: Do NOT include vector or clipart tags.`
      };
    }
  }

  app.post("/api/analyze", async (req, res) => {
    try {
      const { imageBase64, mimeType, marketplace, isAiGenerated, tier, assetType, language, fastMode, vectorMetadataHint, fileName } = req.body;
      const clientApiKey = req.headers['x-api-key'] as string;
      
      if (!imageBase64 || typeof imageBase64 !== "string" || !mimeType) {
        return res.status(400).json({ error: "Missing or invalid image data or mime type." });
      }

      // Strip data URL prefix if provided and clean whitespace
      const rawBase64 = (imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64).replace(/\s+/g, '');
      
      // Normalize MIME type - Google Gemini API rejects 'image/jpg' and requires 'image/jpeg'
      let safeMimeType = String(mimeType || "image/jpeg").toLowerCase().trim();
      if (safeMimeType === "image/jpg" || safeMimeType === "jpg") {
        safeMimeType = "image/jpeg";
      }

      const marketConfig = getMarketplaceSEOConfig(marketplace);
      const assetConfig = getAssetTypeSEOConfig(assetType);

      let extraContextDirectives = "";
      if (fileName) {
        extraContextDirectives += `\nFILE NAME: "${fileName}".`;
      }
      if (vectorMetadataHint && typeof vectorMetadataHint === "object") {
        extraContextDirectives += `\nVECTOR / EPS GROUND-TRUTH METADATA EXTRACTED FROM FILE HEADER:
- Original Title/Theme: ${vectorMetadataHint.title || "Not specified in header"}
- Pre-existing Tags: ${(vectorMetadataHint.keywords || []).slice(0, 20).join(", ") || "None"}
- Description: ${vectorMetadataHint.description || "None"}
- Bounding Box Dimensions: ${vectorMetadataHint.boundingBox ? `${vectorMetadataHint.boundingBox.width}x${vectorMetadataHint.boundingBox.height} pt` : "Standard vector"}
DIRECTIVE FOR VECTOR METADATA: Synthesize these hints with visual analysis to generate authentic, high-converting, strictly compliant commercial microstock metadata for ${marketConfig.name}. Upgrade and expand the keywords into high-ranking terms.`;
      }

      // Unified Gemini analysis call tailored strictly to target marketplace and asset format
      const prompt = `
      You are a World-Class Microstock Contributor SEO Director and Senior ${marketConfig.name} Inspector.
      Target Marketplace: ${marketConfig.name.toUpperCase()} (Strict adherence to ${marketConfig.name} rules required).
      Asset Type: ${assetConfig.name}.
      AI Generated: ${isAiGenerated ? 'Yes' : 'No'}.
      Language Requirement: MUST write Title, Description, and Keywords strictly in ${language || "English"}.
      ${extraContextDirectives}
      
      STRICT COMMERCIAL METADATA DIRECTIVES FOR ${marketConfig.name.toUpperCase()}:
      
      1. TITLE REQUIREMENTS FOR ${marketConfig.name.toUpperCase()}:
         ${marketConfig.titleDirectives}
         - Must explicitly describe: Main subject + specific action/state + environment/background + lighting/mood.
         - NO keyword spamming in title. NO repetitive words.
      
      2. KEYWORD PRECISION FOR ${marketConfig.name.toUpperCase()} (${marketConfig.targetKeywordCount} unique keywords):
         ${marketConfig.keywordDirectives}
         - Include:
           * Direct subject terms (singular and common plural)
           * Descriptive visual elements (color, composition, perspective, lighting style)
           * Conceptual & emotional business themes (e.g., success, serenity, technology, wellness, lifestyle)
           * Broad categorical tags (e.g., background, copyspace, modern, professional)
         - STRICT PROHIBITIONS:
           * NO trademarked brand names (e.g. no "iPhone", "Photoshop", "Instagram", "Sony", "Nike") unless explicitly historical/editorial.
           * NO duplicate or near-identical keyword spam.
           * NO camera equipment terms (e.g., no "Canon 5D", "iso 100", "f/1.8").
           * Each keyword must be clean lowercase single or 2-word phrase.
      
      3. ASSET TYPE SPECIFIC RULES (${assetConfig.name.toUpperCase()}):
         ${assetConfig.directive}

      4. SHORT DESCRIPTION FOR ${marketConfig.name.toUpperCase()}:
         ${marketConfig.descriptionDirectives}
      
      5. PRIORITY KEYWORDS:
         - Provide the top 10 core search terms from your list that a buyer on ${marketConfig.name} will actually type in the search bar.
      
      6. MODERATION SIMULATION FOR ${marketConfig.name.toUpperCase()}:
         - "acceptanceProbability": Realistic score (0-100%) based on composition, commercial appeal, sharpness, and clean background.
         - "rejectionFlags": Check for common microstock rejection reasons:
           "Quality Issues" | "Technical Problems (Noise/Blur)" | "Intellectual Property / Trademarks" | "Similar Submissions" | "Model/Property Release Needed" | "Clean (Ready to Submit)"
         - "salesPotentialScore": 0-100 commercial buyer demand score on ${marketConfig.name}.
         - "technicalQualityScore": 0-100 evaluation of focus, lighting balance, exposure, and clean artifact-free pixels.
      
      7. TRADEMARK & INTELLECTUAL PROPERTY SHIELD:
         - Check apparel, footwear, tech gadgets, car grills, recognizable building silhouettes.
         - "detectedTrademarks": list any detected logos/trademarks or ["None detected"].
         - "trademarkRisk": "none" | "low" | "medium" | "high".
      
      8. LEGAL RELEASE COMPLIANCE:
         - "modelReleaseRequired": true if any recognizable human face, profile, or distinctive body feature is present.
         - "propertyReleaseRequired": true if private property, modern architectural landmark, recognizable interior, or vehicle is present.
         - "releaseExplanation": Clear, actionable advice for contributor.
      `;

      const response = await callGeminiUnified(clientApiKey, async (ai) => {
        return await generateWithFallback(ai, {
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
                trademarkRisk: { type: Type.STRING, description: "none | low | medium | high" },
                detectedTrademarks: { type: Type.ARRAY, items: { type: Type.STRING } },
                modelReleaseRequired: { type: Type.BOOLEAN },
                propertyReleaseRequired: { type: Type.BOOLEAN },
                releaseExplanation: { type: Type.STRING },
              },
            },
          },
        }, Boolean(fastMode));
      });

      const parsed = safeParseJson(response.text, {});
      
      // Clean, filter and strictly deduplicate keywords preserving case-insensitive order
      const rawKeywords = Array.isArray(parsed.keywords) ? parsed.keywords : [];
      const seenKeywords = new Set<string>();
      const sanitizedKeywords: string[] = [];

      for (const k of rawKeywords) {
        if (!k) continue;
        const norm = String(k)
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // remove punctuations
          .trim();
        
        // Exclude empty, single-character, or banned strings
        if (norm.length > 1 && !seenKeywords.has(norm)) {
          seenKeywords.add(norm);
          sanitizedKeywords.push(norm);
        }
      }

      // Enforce target marketplace specific keyword limits (e.g. 30 for Freepik, 49 for Adobe Stock, 50 for Shutterstock)
      parsed.keywords = sanitizedKeywords.slice(0, marketConfig.maxKeywords);

      // Clean and sanitize Title
      let cleanTitle = String(parsed.recommendedTitle || "Commercial Stock Visual").trim();
      // Remove trailing periods and double spaces often rejected by stock agencies
      cleanTitle = cleanTitle.replace(/\.+$/, '').replace(/\s+/g, ' ');
      // Ensure Title case or clean capitalization
      if (cleanTitle.length > 0) {
        cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
      }

      // If Shutterstock is selected, enforce minimum 5 words rule strictly
      if (marketConfig.id === 'shutterstock') {
        const words = cleanTitle.split(/\s+/).filter(Boolean);
        if (words.length < 5 && sanitizedKeywords.length > 0) {
          const extraWords = sanitizedKeywords.slice(0, 5 - words.length).join(' ');
          cleanTitle = `${cleanTitle} with ${extraWords}`;
        }
      }
      parsed.recommendedTitle = cleanTitle;

      // Clean priority keywords
      const rawPriority = Array.isArray(parsed.priorityKeywords) && parsed.priorityKeywords.length > 0 
        ? parsed.priorityKeywords 
        : parsed.keywords.slice(0, 10);

      const seenPriority = new Set<string>();
      const sanitizedPriority: string[] = [];
      for (const pk of rawPriority) {
        if (!pk) continue;
        const norm = String(pk).toLowerCase().replace(/[^\w\s-]/g, '').trim();
        if (norm.length > 1 && !seenPriority.has(norm)) {
          seenPriority.add(norm);
          sanitizedPriority.push(norm);
        }
      }
      parsed.priorityKeywords = sanitizedPriority.slice(0, 10);

      parsed.shortDescription = parsed.shortDescription || parsed.recommendedTitle;
      parsed.acceptanceProbability = typeof parsed.acceptanceProbability === "number" ? Math.min(100, Math.max(0, parsed.acceptanceProbability)) : 85;
      parsed.salesPotentialScore = typeof parsed.salesPotentialScore === "number" ? Math.min(100, Math.max(0, parsed.salesPotentialScore)) : 80;
      parsed.technicalQualityScore = typeof parsed.technicalQualityScore === "number" ? Math.min(100, Math.max(0, parsed.technicalQualityScore)) : 85;
      parsed.overallSubmissionRiskScore = typeof parsed.overallSubmissionRiskScore === "number" ? Math.min(100, Math.max(0, parsed.overallSubmissionRiskScore)) : 15;
      parsed.riskLabel = parsed.riskLabel || (parsed.overallSubmissionRiskScore > 40 ? "Medium risk" : "Low risk");
      parsed.rejectionFlags = Array.isArray(parsed.rejectionFlags) ? parsed.rejectionFlags : [];
      parsed.detectedDefects = Array.isArray(parsed.detectedDefects) ? parsed.detectedDefects : [];
      parsed.detectedTrademarks = Array.isArray(parsed.detectedTrademarks) ? parsed.detectedTrademarks : [];
      parsed.trademarkRisk = (parsed.trademarkRisk && ["none", "low", "medium", "high"].includes(parsed.trademarkRisk)) ? parsed.trademarkRisk : "none";
      parsed.modelReleaseRequired = Boolean(parsed.modelReleaseRequired);
      parsed.propertyReleaseRequired = Boolean(parsed.propertyReleaseRequired);
      parsed.releaseExplanation = parsed.releaseExplanation || (parsed.modelReleaseRequired ? "Recognizable person detected. Model release signed by subject required for commercial licensing." : "No release required.");
      res.json(parsed);
    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: cleanErrorMessage(error) });
    }
  });

  app.post("/api/generate-stock-prompt", async (req, res) => {
    try {
      const { concept, style, aspectRatio, lighting, shotType } = req.body;
      const clientApiKey = req.headers['x-api-key'] as string;

      if (!concept || typeof concept !== "string" || !concept.trim()) {
        return res.status(400).json({ error: "Concept or idea description is required." });
      }

      const promptSystem = `
      You are an elite Commercial AI Stock Photography Prompt Specialist for Adobe Stock, Shutterstock, and Freepik.
      Concept: "${concept.trim()}".
      Style: ${style || "Commercial Stock Photography"}.
      Aspect Ratio: ${aspectRatio || "16:9"}.
      Lighting: ${lighting || "High-key clean commercial daylight"}.
      Shot Type: ${shotType || "Medium shot with copy space"}.

      Create hyper-effective commercial prompts that pass stock agency AI moderation:
      1. midjourneyPrompt: Midjourney v6.1 prompt with authentic natural pose, realistic skin textures, 8k resolution, copy space, and parameter flags (--ar ${aspectRatio || "16:9"} --style raw --v 6.1).
      2. fireflyPrompt: Clean, natural descriptive prompt optimized for Adobe Firefly Image 3 without forbidden modifier syntax.
      3. fluxPrompt: Highly detailed realistic prompt for Flux.1 / SDXL with precise camera lens focal length, lighting, and textures.
      4. negativePrompt: Stock rejection deterrent terms (e.g. extra fingers, distorted hands, brand logos, watermark, text, blur, oversaturated, plastic skin, bad anatomy).
      5. commercialTips: 2-3 sentences of advice for commercial buyers (copy space position, color grading, commercial viability).
      6. suggestedTitle: High-ranking stock title (8-12 words).
      7. suggestedKeywords: 16 top-converting search tags.
      `;

      const response = await callGeminiUnified(clientApiKey, async (ai) => {
        return await generateWithFallback(ai, {
          contents: [{ parts: [{ text: promptSystem }] }],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                midjourneyPrompt: { type: Type.STRING },
                fireflyPrompt: { type: Type.STRING },
                fluxPrompt: { type: Type.STRING },
                negativePrompt: { type: Type.STRING },
                commercialTips: { type: Type.STRING },
                suggestedTitle: { type: Type.STRING },
                suggestedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["midjourneyPrompt", "fireflyPrompt", "fluxPrompt", "negativePrompt", "commercialTips", "suggestedTitle", "suggestedKeywords"]
            }
          }
        });
      });

      const parsed = safeParseJson(response.text, {});
      parsed.midjourneyPrompt = parsed.midjourneyPrompt || "";
      parsed.fireflyPrompt = parsed.fireflyPrompt || "";
      parsed.fluxPrompt = parsed.fluxPrompt || "";
      parsed.negativePrompt = parsed.negativePrompt || "";
      parsed.commercialTips = parsed.commercialTips || "";
      parsed.suggestedTitle = parsed.suggestedTitle || "";
      parsed.suggestedKeywords = Array.isArray(parsed.suggestedKeywords) ? parsed.suggestedKeywords : [];
      res.json(parsed);
    } catch (error: any) {
      console.error("Stock prompt generation error:", error);
      res.status(500).json({ error: cleanErrorMessage(error) });
    }
  });

  app.post("/api/reverse-image-prompt", async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      const clientApiKey = req.headers['x-api-key'] as string;

      if (!imageBase64 || typeof imageBase64 !== "string" || !mimeType) {
        return res.status(400).json({ error: "Missing or invalid image base64 data." });
      }

      const rawBase64 = (imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64).replace(/\s+/g, '');
      let safeMimeType = String(mimeType || "image/jpeg").toLowerCase().trim();
      if (safeMimeType === "image/jpg" || safeMimeType === "jpg") {
        safeMimeType = "image/jpeg";
      }

      const reversePromptSystem = `
      You are an elite Computer Vision and Generative AI Prompt Engineer specializing in commercial stock image synthesis (Midjourney v6, Adobe Firefly Image 3, and Flux.1).
      Analyze this image meticulously:
      1. midjourneyPrompt: Midjourney v6.1 prompt that would recreate this aesthetic, composition, subject pose, and lighting. Include parameter flags (--ar 16:9 --style raw --v 6.1).
      2. fireflyPrompt: Clean, natural descriptive prompt for Adobe Firefly Image 3 describing the photographic or illustration quality.
      3. fluxPrompt: Hyper-detailed prompt for Flux.1 / SDXL specifying camera lens focal length, aperture, exact lighting setup, and materials.
      4. negativePrompt: Stock rejection deterrent terms (e.g. bad hands, extra digits, watermark, blur, brand logo, text, distorted anatomy).
      5. styleBreakdown: Summary of the artistic style (e.g., editorial portrait, high-key commercial, flat vector, 3D isometric).
      6. lightingAndLens: Exact lighting conditions and camera specs (e.g., 85mm f/1.4 lens, soft diffused studio strobe, golden hour rim light).
      7. commercialReplicationTips: 2-3 sentences on how to recreate similar high-selling stock assets while avoiding copyright infringement.
      `;

      const response = await callGeminiUnified(clientApiKey, async (ai) => {
        return await generateWithFallback(ai, {
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: safeMimeType,
                    data: rawBase64
                  }
                },
                {
                  text: reversePromptSystem
                }
              ]
            }
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                midjourneyPrompt: { type: Type.STRING },
                fireflyPrompt: { type: Type.STRING },
                fluxPrompt: { type: Type.STRING },
                negativePrompt: { type: Type.STRING },
                styleBreakdown: { type: Type.STRING },
                lightingAndLens: { type: Type.STRING },
                commercialReplicationTips: { type: Type.STRING }
              },
              required: ["midjourneyPrompt", "fireflyPrompt", "fluxPrompt", "negativePrompt", "styleBreakdown", "lightingAndLens", "commercialReplicationTips"]
            }
          }
        });
      });

      const parsed = safeParseJson(response.text, {});
      res.json(parsed);
    } catch (error: any) {
      console.error("Reverse prompt generation error:", error);
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
