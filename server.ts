import express from "express";
import path from "path";
import fs from "fs";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { findMonthlyTrends, MONTHLY_TRENDS_KNOWLEDGE } from "./monthlyTrends.js";

const execFileAsync = promisify(execFile);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Secure, bounded limit for base64 image uploads (50MB is safe and prevents OOM attacks)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Enterprise Cyber-Security & Defensive Headers (allowing AI Studio iframe embedding)
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(self), geolocation=()");
    // Rate limit header signaling
    res.setHeader("X-RateLimit-Policy", "stockmeta-anti-abuse-v1");
    next();
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Google AdSense Authorized Digital Sellers crawler endpoint
  app.get("/ads.txt", (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send("google.com, pub-4920194820194820, DIRECT, f08c47fec0942fa0\n");
  });

  // Crawler directives & sitemap
  app.get("/robots.txt", (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send("User-agent: *\nAllow: /\nSitemap: https://ais-pre-doigpfihkslqf5mv7i6suv-339605403270.asia-southeast1.run.app/sitemap.xml\n");
  });

  // Dynamic 5-Star XML Sitemap for Google search indexing and AdSense compliance
  app.get("/sitemap.xml", (req, res) => {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    const today = new Date().toISOString().split("T")[0];
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ais-pre-doigpfihkslqf5mv7i6suv-339605403270.asia-southeast1.run.app/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ais-pre-doigpfihkslqf5mv7i6suv-339605403270.asia-southeast1.run.app/ads.txt</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
    res.send(sitemapXml);
  });

  // High-Performance Vector EPS / AI to JPEG Server-Side Visual Rendering Engine
  // Renders PostScript vector files into true JPEG images with 100% visual fidelity for preview and Gemini vision analysis
  app.post("/api/render-eps", async (req, res) => {
    let tmpEps = "";
    let tmpJpg = "";
    let tmpTiff = "";
    let tmpWmf = "";
    let tmpPdf = "";
    try {
      const { epsBase64, fileName } = req.body;
      if (!epsBase64 || typeof epsBase64 !== "string") {
        return res.status(400).json({ error: "Missing EPS base64 data" });
      }

      const rawBase64 = (epsBase64.includes(",") ? epsBase64.split(",")[1] : epsBase64).replace(/\s+/g, "");
      const buffer = Buffer.from(rawBase64, "base64");

      if (buffer.length === 0) {
        return res.status(400).json({ error: "Empty EPS buffer" });
      }

      // Check for DOS binary EPS header (0xC5 0xD0 0xD3 0xC6)
      let psBuffer = buffer;

      const isDosBinary =
        buffer.length >= 30 &&
        buffer[0] === 0xc5 &&
        buffer[1] === 0xd0 &&
        buffer[2] === 0xd3 &&
        buffer[3] === 0xc6;

      if (isDosBinary) {
        const psStart = buffer.readUInt32LE(4);
        const psLength = buffer.readUInt32LE(8);
        if (psStart < buffer.length) {
          psBuffer = buffer.subarray(psStart, Math.min(buffer.length, psStart + psLength));
        }
      }

      const uid = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      tmpEps = path.join(os.tmpdir(), `vector_${uid}.eps`);
      tmpJpg = path.join(os.tmpdir(), `vector_${uid}.jpg`);
      tmpTiff = path.join(os.tmpdir(), `vector_${uid}.tiff`);
      tmpWmf = path.join(os.tmpdir(), `vector_${uid}.wmf`);
      tmpPdf = path.join(os.tmpdir(), `vector_${uid}.pdf`);

      fs.writeFileSync(tmpEps, psBuffer);

      let renderSuccess = false;

      // STAGE 1: Embedded TIFF Thumbnail Extraction from DOS EPS Binary Header
      // Almost all Adobe Illustrator EPS files (EPS 10, CS6, CC) store an authentic, pixel-perfect TIFF preview here!
      if (isDosBinary && !renderSuccess) {
        try {
          const tiffStart = buffer.readUInt32LE(20);
          const tiffLength = buffer.readUInt32LE(24);
          if (tiffStart > 0 && tiffLength > 0 && tiffStart + tiffLength <= buffer.length) {
            const tiffBytes = buffer.subarray(tiffStart, tiffStart + tiffLength);
            // Verify TIFF header (0x49 0x49 'II' or 0x4D 0x4D 'MM')
            if ((tiffBytes[0] === 0x49 && tiffBytes[1] === 0x49) || (tiffBytes[0] === 0x4d && tiffBytes[1] === 0x4d)) {
              fs.writeFileSync(tmpTiff, tiffBytes);
              await execFileAsync("convert", [tmpTiff, "-quality", "95", tmpJpg]);
              if (fs.existsSync(tmpJpg) && fs.statSync(tmpJpg).size > 100) {
                renderSuccess = true;
              }
            }
          }
        } catch (tiffErr: any) {
          // Fall through to next stage
        }
      }

      // STAGE 2: Embedded WMF Thumbnail Extraction from DOS EPS Binary Header
      if (isDosBinary && !renderSuccess) {
        try {
          const wmfStart = buffer.readUInt32LE(12);
          const wmfLength = buffer.readUInt32LE(16);
          if (wmfStart > 0 && wmfLength > 0 && wmfStart + wmfLength <= buffer.length) {
            const wmfBytes = buffer.subarray(wmfStart, wmfStart + wmfLength);
            fs.writeFileSync(tmpWmf, wmfBytes);
            await execFileAsync("convert", [tmpWmf, "-quality", "95", tmpJpg]);
            if (fs.existsSync(tmpJpg) && fs.statSync(tmpJpg).size > 100) {
              renderSuccess = true;
            }
          }
        } catch (wmfErr: any) {
          // Fall through to next stage
        }
      }

      // STAGE 3: ps2pdf + Ghostscript PDF-to-JPEG Pipeline
      // Converts PostScript vector streams reliably bypassing Illustrator-specific PostScript syntax quirks
      if (!renderSuccess) {
        try {
          await execFileAsync("ps2pdf", [tmpEps, tmpPdf]);
          if (fs.existsSync(tmpPdf) && fs.statSync(tmpPdf).size > 100) {
            await execFileAsync("gs", [
              "-q",
              "-dSAFER",
              "-dBATCH",
              "-dNOPAUSE",
              "-sDEVICE=jpeg",
              "-dJPEGQ=95",
              "-r150",
              "-dFirstPage=1",
              "-dLastPage=1",
              `-sOutputFile=${tmpJpg}`,
              tmpPdf
            ]);
            if (fs.existsSync(tmpJpg) && fs.statSync(tmpJpg).size > 100) {
              renderSuccess = true;
            }
          }
        } catch (ps2pdfErr: any) {
          // Fall through to Ghostscript direct
        }
      }

      // STAGE 4: Direct Ghostscript with -dEPSCrop and Alpha Smoothing
      if (!renderSuccess) {
        try {
          await execFileAsync("gs", [
            "-q",
            "-dSAFER",
            "-dBATCH",
            "-dNOPAUSE",
            "-sDEVICE=jpeg",
            "-dJPEGQ=95",
            "-r150",
            "-dALLOWPSTRANSPARENCY",
            "-dTextAlphaBits=4",
            "-dGraphicsAlphaBits=4",
            "-dEPSCrop",
            `-sOutputFile=${tmpJpg}`,
            tmpEps
          ]);
          if (fs.existsSync(tmpJpg) && fs.statSync(tmpJpg).size > 100) {
            renderSuccess = true;
          }
        } catch (gsErr1: any) {
          // Try fixed media
          try {
            await execFileAsync("gs", [
              "-q",
              "-dSAFER",
              "-dBATCH",
              "-dNOPAUSE",
              "-sDEVICE=jpeg",
              "-dJPEGQ=95",
              "-r150",
              "-dALLOWPSTRANSPARENCY",
              "-dDEVICEWIDTHPOINTS=1024",
              "-dDEVICEHEIGHTPOINTS=1024",
              "-dFIXEDMEDIA",
              `-sOutputFile=${tmpJpg}`,
              tmpEps
            ]);
            if (fs.existsSync(tmpJpg) && fs.statSync(tmpJpg).size > 100) {
              renderSuccess = true;
            }
          } catch (gsErr2: any) {}
        }
      }

      // STAGE 5: Embedded Raw JPEG Stream Scanner in PostScript / PDF Stream
      if (!renderSuccess) {
        try {
          for (let i = 0; i < buffer.length - 200; i++) {
            if (buffer[i] === 0xff && buffer[i + 1] === 0xd8 && buffer[i + 2] === 0xff) {
              let lastEoi = -1;
              const maxSearch = Math.min(buffer.length - 1, i + 8000000);
              for (let j = i + 100; j < maxSearch; j++) {
                if (buffer[j] === 0xff && buffer[j + 1] === 0xd9) {
                  lastEoi = j + 2;
                }
              }
              if (lastEoi > i + 200) {
                const candidateJpg = buffer.subarray(i, lastEoi);
                fs.writeFileSync(tmpJpg, candidateJpg);
                try {
                  await execFileAsync("convert", [tmpJpg, "-quality", "95", tmpJpg]);
                  if (fs.existsSync(tmpJpg) && fs.statSync(tmpJpg).size > 100) {
                    renderSuccess = true;
                    break;
                  }
                } catch (_) {}
              }
            }
          }
        } catch (rawJpegErr: any) {}
      }

      // Metadata extraction from PostScript text
      const sampleText = psBuffer.toString("latin1", 0, Math.min(psBuffer.length, 120000));
      const titleMatch = sampleText.match(/%%Title:\s*([^\r\n]+)/i);
      const creatorMatch = sampleText.match(/%%Creator:\s*([^\r\n]+)/i);
      const bboxMatch = sampleText.match(/%%BoundingBox:\s*(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)/i);
      const kwMatch = sampleText.match(/%%Keywords:\s*([^\r\n]+)/i);
      const subjectMatch = sampleText.match(/%%Subject:\s*([^\r\n]+)/i);

      let extractedTitle = titleMatch ? titleMatch[1].trim().replace(/^\(+|\)+$/g, "") : "";
      if (extractedTitle.startsWith("Untitled") || extractedTitle.length < 2) extractedTitle = "";

      let extractedKeywords: string[] = [];
      if (kwMatch && kwMatch[1]) {
        extractedKeywords = kwMatch[1]
          .split(/[,;]+/)
          .map((k) => k.trim())
          .filter((k) => k.length > 1);
      }

      let extractedBbox: any = null;
      if (bboxMatch) {
        const x1 = parseInt(bboxMatch[1], 10);
        const y1 = parseInt(bboxMatch[2], 10);
        const x2 = parseInt(bboxMatch[3], 10);
        const y2 = parseInt(bboxMatch[4], 10);
        extractedBbox = { x1, y1, x2, y2, width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) };
      }

      // XMP Metadata Extraction
      const xmpMatch = sampleText.match(/<x:xmpmeta[\s\S]*?<\/x:xmpmeta>/i);
      if (xmpMatch) {
        const xmpText = xmpMatch[0];
        const dcTitle = xmpText.match(/<dc:title>[\s\S]*?<rdf:li[^>]*>([^<]+)<\/rdf:li>/i);
        if (dcTitle && dcTitle[1] && !extractedTitle) {
          extractedTitle = dcTitle[1].trim();
        }
        const dcSubject = xmpText.match(/<dc:subject>[\s\S]*?<\/dc:subject>/i);
        if (dcSubject && extractedKeywords.length === 0) {
          const tagRegex = /<rdf:li>([^<]+)<\/rdf:li>/gi;
          let m;
          while ((m = tagRegex.exec(dcSubject[0])) !== null) {
            if (m[1]) extractedKeywords.push(m[1].trim());
          }
        }
      }

      if (renderSuccess && fs.existsSync(tmpJpg)) {
        const jpgBytes = fs.readFileSync(tmpJpg);
        const base64Jpg = jpgBytes.toString("base64");
        return res.json({
          success: true,
          previewUrl: `data:image/jpeg;base64,${base64Jpg}`,
          base64ForAi: base64Jpg,
          hasRealVisualPreview: true,
          fileSize: buffer.length,
          metadata: {
            title: extractedTitle || undefined,
            keywords: extractedKeywords.length > 0 ? extractedKeywords : undefined,
            description: subjectMatch ? subjectMatch[1].trim() : undefined,
            creator: creatorMatch ? creatorMatch[1].trim() : undefined,
            boundingBox: extractedBbox
          }
        });
      }

      return res.json({
        success: false,
        error: "Ghostscript rendering incomplete",
        metadata: {
          title: extractedTitle || undefined,
          keywords: extractedKeywords.length > 0 ? extractedKeywords : undefined,
          creator: creatorMatch ? creatorMatch[1].trim() : undefined,
          boundingBox: extractedBbox
        }
      });
    } catch (e: any) {
      console.error("render-eps API error:", e);
      return res.status(500).json({ error: e?.message || "Failed to render EPS" });
    } finally {
      const toClean = [tmpEps, tmpJpg, tmpTiff, tmpWmf, tmpPdf];
      for (const p of toClean) {
        if (p && fs.existsSync(p)) {
          try { fs.unlinkSync(p); } catch (_) {}
        }
      }
    }
  });

  let cachedGeneralTrends: any = null;
  let lastTrendFetchTime = 0;
  const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

  const exhaustedDailyModels = new Set<string>();

  // Helper function to call Gemini with automatic fallback across reliable models
  // Prioritizes gemini-3.8-flash, gemini-flash-latest, and gemini-3.1-flash-lite
  async function generateWithFallback(ai: GoogleGenAI, options: any, fastFirst: boolean = false) {
    const candidateModels = [
      "gemini-3.8-flash",
      "gemini-flash-latest",
      "gemini-3.1-flash-lite"
    ];

    // Filter out models that have already exhausted their daily free tier quota in this process
    const activeCandidates = candidateModels.filter(m => !exhaustedDailyModels.has(m));
    const modelsToTry = activeCandidates.length > 0 ? activeCandidates : candidateModels;

    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        return await ai.models.generateContent({
          ...options,
          model
        });
      } catch (err: any) {
        lastError = err;
        const errMsg = (err?.message || String(err)).toLowerCase();

        // If daily limit or token quota exceeded for this model, mark it so subsequent calls bypass it
        if (
          errMsg.includes("generaterequestsperday") || 
          errMsg.includes("limit: 20") || 
          errMsg.includes("resource_exhausted") || 
          errMsg.includes("quota exceeded") ||
          errMsg.includes("tokens_per_model") ||
          errMsg.includes("429")
        ) {
          exhaustedDailyModels.add(model);
        }

        // If a short retry-in delay is specified (e.g. milliseconds), pause briefly before fallback
        if (errMsg.includes("retry in")) {
          await new Promise(r => setTimeout(r, 200));
        }

        console.warn(`Model ${model} attempt failed: ${err?.message}. Trying next fallback...`);
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
      const { messages, tier, userName, preferredName, userEmail } = req.body;
      const clientApiKey = typeof req.headers["x-api-key"] === "string" ? req.headers["x-api-key"].trim() : "";
      const contentsToUse = sanitizeChatMessages(messages);
      
      const friendName = (preferredName || userName || (userEmail ? userEmail.split('@')[0] : "Ratul Sorker")).trim();

      const systemInstruction = `You are "AdobeMeta AI Assistant" — an expert, friendly, and reliable microstock contributor assistant and Google ranking/monetization advisor.
The user is ${friendName}${userEmail ? ` (Email: ${userEmail})` : ""}.

Key Directives:
1. Core Mission:
   - Provide world-class advice on stock photo/vector/illustration metadata, titles, descriptions, keyword ranking algorithms (Adobe Stock, Shutterstock, Freepik, Getty/iStock), and Google AdSense/monetization strategies.
   - Be helpful, practical, encouraging, and clear.

2. Tone and Style:
   - Professional, concise, friendly, and direct. Keep normal answers to 2-4 structured, easily readable sentences or bullet points unless the user asks for a comprehensive guide.
   - Never sound robotic or repetitive.

3. Language:
   - Fluently mirror the user's language. If they ask in English, answer in English. If they ask in Bengali or Banglish, answer in natural Bengali. If they ask in Hindi, Spanish, or other languages, respond in that language.`;

      let replyText = "";
      try {
        const response = await callGeminiUnified(clientApiKey, async (ai) => {
          return await generateWithFallback(ai, {
            contents: contentsToUse,
            config: { systemInstruction }
          }, true);
        });
        replyText = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } catch (geminiErr: any) {
        console.warn("/api/chat primary AI call failed, using intelligent stock fallback:", geminiErr?.message);
        // Extract latest user prompt
        const lastUserMsg = [...contentsToUse].reverse().find(m => m.role === "user");
        const userQuery = (lastUserMsg?.parts?.[0]?.text || "").toLowerCase();

        if (userQuery.includes("google") || userQuery.includes("monetiz") || userQuery.includes("adsense") || userQuery.includes("আয়") || userQuery.includes("টাকা")) {
          replyText = `Here are the top 3 proven strategies to maximize Google AdSense & stock monetization:
1. High CPC Niche Targeting: Focus on Business, FinTech, Clean Energy, Healthcare, and Cloud AI concepts which command 3x–5x higher buyer bidding.
2. Search Intent Matching: Use 3–5 word long-tail titles containing the exact commercial intent (e.g. "small business owner reviewing quarterly financial statements on tablet").
3. Multi-Agency Synergy: Cross-publish your approved assets across Adobe Stock, Freepik, and Shutterstock with compliant IPTC metadata to multiply daily impressions.`;
        } else if (userQuery.includes("rank") || userQuery.includes("adobe stock") || userQuery.includes("shutterstock") || userQuery.includes("freepik") || userQuery.includes("সেল")) {
          replyText = `To boost your stock asset ranking right now:
1. First 10 Keywords Rule: Adobe Stock weights your first 5-10 tags heaviest in search. Put your primary subject and action directly at tags 1 to 5.
2. Title & Tag Correlation: Ensure the main 2-3 words from your title are mirrored in your top 10 keywords.
3. Conceptual Diversity: Include both literal terms ("laptop", "office") and commercial concepts ("collaboration", "startup growth", "productivity").`;
        } else if (userQuery.includes("trend") || userQuery.includes("topic") || userQuery.includes("টপিক") || userQuery.includes("আজকের")) {
          replyText = `Today's highest-converting microstock themes:
1. Authentic Workplace & Hybrid Culture: Unstaged, candid moments of diverse professionals collaborating.
2. Sustainable Tech & Clean Energy: Solar panel installations, electric mobility, zero-waste lifestyle.
3. Real Human Emotions: Relatable moments of mindfulness, family connection, and mental wellness.`;
        } else {
          replyText = `Hello ${friendName}! I am here to assist you with your stock metadata, SEO algorithm ranking, and portfolio monetization strategies. What specific topic or stock asset can I help you optimize today?`;
        }
      }

      if (!replyText) {
        replyText = `Hello ${friendName}! How can I help you optimize your stock metadata or earnings today?`;
      }
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
        return res.json(MONTHLY_TRENDS_KNOWLEDGE[nowMonth] || MONTHLY_TRENDS_KNOWLEDGE['october']);
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
      const defaultMonthData = MONTHLY_TRENDS_KNOWLEDGE[new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase()] || MONTHLY_TRENDS_KNOWLEDGE['october'];
      if (!data.currentTrends || !Array.isArray(data.currentTrends) || data.currentTrends.length === 0) {
        data.currentTrends = matchedMonth?.currentTrends || defaultMonthData.currentTrends;
      }
      if (!data.upcomingTrends || !Array.isArray(data.upcomingTrends) || data.upcomingTrends.length === 0) {
        data.upcomingTrends = matchedMonth?.upcomingTrends || defaultMonthData.upcomingTrends;
      }
      if (!data.whatToCreate || !Array.isArray(data.whatToCreate) || data.whatToCreate.length === 0) {
        data.whatToCreate = matchedMonth?.whatToCreate || defaultMonthData.whatToCreate;
      }
      if (!data.monthOverview && (matchedMonth?.monthOverview || defaultMonthData.monthOverview)) {
        data.monthOverview = matchedMonth?.monthOverview || defaultMonthData.monthOverview;
      }
      if (!data.monthName && (matchedMonth?.monthName || defaultMonthData.monthName)) {
        data.monthName = matchedMonth?.monthName || defaultMonthData.monthName;
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
        return res.json(MONTHLY_TRENDS_KNOWLEDGE[nowMonth] || MONTHLY_TRENDS_KNOWLEDGE['october']);
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
          targetKeywordCount: '35 to 49',
          maxKeywords: 49,
          minKeywords: 25,
          titleDirectives: `
          - OFFICIAL ADOBE STOCK TITLE GUIDELINES (Aug 2026):
            * Write a brief, clear title that accurately describes the content.
            * Keep it short, ideally under 70 characters (5 to 12 words).
            * Focus strictly on what's most visually important in the content (Subject + Action + Setting).
            * Avoid overly technical or gear-heavy terms (no camera brands, lens specs).
            * Do NOT refer to anything involving IP, trademarks, artist names, or real people.
            * Capitalize the first letter naturally, NO trailing period, NO keyword stuffing.
            * Official Adobe examples: "Gay couple hugging in the park", "Women in laboratory with face masks and gloves", "Senior woman flexing her muscles on beach".`,
          keywordDirectives: `
          - OFFICIAL ADOBE STOCK KEYWORD GUIDELINES (Aug 2026):
            * Include up to 49 keywords (min 25, max 49).
            * KEYWORD ORDER IS ESSENTIAL: The FIRST 10 KEYWORDS MUST BE THE ABSOLUTE MOST IMPORTANT AND RELEVANT TERMS (they have the greatest influence on Adobe search ranking!).
            * Separate descriptive elements (e.g., "White, fluffy, young animal, pup").
            * Balance general and specific keywords (e.g., "Animal, mammal, carnivore").
            * Include:
              - Number of people ("one person", "two people", "alone", "three people")
              - Setting ("indoors", "outdoors", "day", "night", "sunny", "cloudy")
              - Viewpoint/angle ("high-angle view", "aerial view", "portrait", "close-up")
              - Model demographics if people present ("senior adult", "Caucasian", "Black woman", "Latinx teen")
              - Conceptual themes ("collaboration", "wellness", "lifestyle", "success")
            * NO trademarks, NO brand names.
            * Exactly one language, each keyword used once.`,
          descriptionDirectives: `
          - Natural, accurate 1-sentence commercial summary matching the title.`
        };
    }
  }

  function getAssetTypeSEOConfig(assetType: string = 'Photo') {
    const norm = (assetType || '').toLowerCase().trim();
    if (norm.includes('psd') || norm.includes('template') || norm.includes('photoshop') || norm.includes('spd')) {
      return {
        name: 'Photoshop PSD / Template',
        directive: `
        - ASSET TYPE: Layered Photoshop Document (PSD / PSB / Graphic Template / Mockup).
        - TITLE: High-value commercial title denoting template utility (e.g., "...PSD mockup template", "...layered flyer PSD template", "...social media post Photoshop template").
        - KEYWORDS: MUST include top-ranked template keywords: "psd, photoshop, mockup, template, layered, editable, smart object, graphic template, design layout, flyer, branding, customizable".
        - FORBIDDEN: Do not claim it is an unlayered flat photo.`
      };
    } else if (norm.includes('vector') || norm.includes('eps')) {
      return {
        name: 'Vector / EPS (Scalable Graphic)',
        directive: `
        - ASSET TYPE: Scalable Vector Artwork / Illustration (EPS / AI / SVG).
        - DOWNLOAD-WINNING TITLE FORMULA: [Primary Buyer Search Query] + [Exact Visual Subject] + [Art Style / Usage] (5 to 10 words, under 70 characters for Adobe Stock).
          * Example 1: "Ramadan Kareem Golden Crescent Lantern Banner Vector Illustration"
          * Example 2: "Vintage Coffee Shop Emblem Logo Badge Vector Design"
          * Example 3: "Isometric Delivery Van Truck with Cargo Boxes Vector Graphic"
          * NEVER use vague or poetic fluff ("stunning design", "beautiful art", "creative background").
        - CRITICAL SEARCH RANKING RULE FOR KEYWORD SLOTS 1 TO 5 (ADOBE STOCK 75% SEARCH WEIGHT):
          * Slots 1 to 5 MUST BE RESERVED EXCLUSIVELY for the specific visual subject, primary buyer search phrase, and high-demand commercial intent!
          * NEVER put generic format words ("vector", "eps", "illustration", "graphic", "background") in slots 1 to 5!
          * Put format tags ("vector, eps, scalable, editable, design element, flat design") in slots 25 to 49 so they do not steal the top 75% ranking power from the primary search terms.
        - FORBIDDEN: NEVER include camera or photo terms (no "dslr, shot, photo, camera, lens, bokeh, depth of field, real life").`
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
      const { 
        imageBase64, 
        mimeType, 
        marketplace, 
        isAiGenerated, 
        tier, 
        assetType, 
        language, 
        fastMode, 
        vectorMetadataHint, 
        psdMetadataHint, 
        fileName,
        regenerationMode,
        previousTitle,
        previousKeywords,
        targetSearchQuery
      } = req.body;
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
      if (psdMetadataHint && typeof psdMetadataHint === "object") {
        extraContextDirectives += `\nPHOTOSHOP PSD / TEMPLATE METADATA EXTRACTED FROM PSD HEADER:
- Clean Title Theme: ${psdMetadataHint.title || "Template"}
- Canvas Dimensions: ${psdMetadataHint.width && psdMetadataHint.height ? `${psdMetadataHint.width}x${psdMetadataHint.height} px` : "High resolution"}
- Color Mode: ${psdMetadataHint.colorMode || "RGB"}
- Layer Count: ${psdMetadataHint.layerCount || "Multi-layer editable"}
DIRECTIVE FOR PHOTOSHOP PSD: Generate high-ranking commercial microstock title and keywords tailored to graphic designers seeking Photoshop templates, mockups, social media kits, or print-ready layouts on ${marketConfig.name}. Highlight editable layers, smart objects, and commercial utility.`;
      }

      let regenDirectives = "";
      if (regenerationMode === 'rank_one_guarantee' || targetSearchQuery) {
        const customTarget = targetSearchQuery && typeof targetSearchQuery === 'string' ? targetSearchQuery.trim() : '';
        regenDirectives = `\nREGENERATION DIRECTIVE (⚡ RANK #1 SEARCH DOMINANCE):
- OBJECTIVE: Engineer this metadata so that when a commercial buyer searches for this visual, THIS IMAGE APPEARS IN RANK #1!
${customTarget ? `- TARGET BUYER QUERY TO RANK #1 FOR: "${customTarget}".` : "- Identify the exact #1 commercial search phrase paying buyers type to purchase this specific visual."}
- TITLE REQUIREMENT: The first 4 to 8 words of the Title MUST directly contain this exact primary search phrase.
- KEYWORD SLOTS 1 TO 5: Slot 1 MUST be the exact primary search query phrase. Slots 2-5 MUST be the most critical constituent nouns, dynamic verbs, and commercial intent tokens. This ensures a 100% relevance score on Adobe Stock (which weights slots 1-10 with 75% search influence) and Google Images vector search.`;
      } else if (regenerationMode === 'more_precise') {
        regenDirectives = `\nREGENERATION DIRECTIVE (PRECISION FOCUS): The user requested hyper-specific technical precision. Focus meticulously on granular anatomical/object features, specific technical attributes, material finishes, and precision industry nomenclature.`;
      } else if (regenerationMode === 'more_commercial') {
        regenDirectives = `\nREGENERATION DIRECTIVE (COMMERCIAL FOCUS): Focus deeply on enterprise monetization, corporate ROI, business problems solved, marketing utility, and commercial buyer intent (e.g. B2B software, corporate communication, editorial cover).`;
      } else if (regenerationMode === 'more_search_focused') {
        regenDirectives = `\nREGENERATION DIRECTIVE (SEO & SEARCH FOCUS): Maximize organic search discoverability. Generate high-volume search queries and 3-5 word high-intent long-tail phrases that commercial art directors actively type into stock search engines.`;
      } else if (regenerationMode === 'alternative_vocabulary') {
        const prevTags = Array.isArray(previousKeywords) ? previousKeywords.slice(0, 15).join(', ') : '';
        regenDirectives = `\nREGENERATION DIRECTIVE (ALTERNATIVE VOCABULARY): Provide a fresh, distinct vocabulary spectrum. Avoid simply repeating these previous keywords: [${prevTags}]. Use sophisticated alternative synonyms and fresh editorial phrasing while remaining 100% faithful to the visual truth.`;
      }

      // Unified Gemini analysis call tailored strictly to target marketplace, buyer intent, and asset format
      const prompt = `
      You are an Elite Commercial Creative Intelligence & Stock SEO Director.
      Target Marketplace: ${marketConfig.name.toUpperCase()} (Strict adherence to ${marketConfig.name} guidelines).
      Asset Type: ${assetConfig.name}.
      AI Generated: ${isAiGenerated ? 'Yes' : 'No'}.
      Language Requirement: MUST write Title, Description, and Keywords strictly in ${language || "English"}.
      ${extraContextDirectives}
      ${regenDirectives}
      
      CORE PRINCIPLES OF COMMERCIAL METADATA INTELLIGENCE:
      Buyers do not search solely for what an image literally contains. They search for:
      - WHAT IT REPRESENTS (Symbolism, metaphor, conceptual meaning)
      - WHAT IT COMMUNICATES (Message, tone, corporate values, emotion)
      - WHERE IT CAN BE USED (Hero banner, brochure, editorial, app screen, social ad)
      - WHAT BUSINESS PROBLEM IT VISUALIZES (e.g., cloud security bottleneck, remote team burnout, clean energy transition)
      - WHAT CONCEPT IT SUPPORTS (Innovation, resilience, growth, sustainability)
      
      STRICT DIRECTIVES:
      1. VISUAL GROUND-TRUTH (Never hallucinate or invent objects not reasonably supported by the visual):
         - "visualSubject": Primary subject visible in the image.
         - "visualAction": Specific action, motion, or state.
         - "visualEnvironment": Setting (indoors, outdoors, urban, studio, landscape).
         - "visualLighting": Lighting style (natural light, golden hour, softbox, ambient, bright).
         - "visualComposition": Perspective / camera framing (close-up, aerial, wide angle, eye level).
      
      2. COMMERCIAL REASONING & SEARCH INTENT:
         - "primarySearchIntent": The exact 3-5 word phrase a commercial buyer would type to discover this asset.
         - "secondarySearchIntent": Supporting commercial search phrase.
         - "commercialProblemSolved": 1 sentence summarizing the business/conceptual problem this image visualizes.
         - "commercialUseCases": 3 to 5 realistic commercial applications (e.g. "Corporate Website Hero", "B2B Marketing Banner", "Annual Sustainability Report", "Healthcare Social Campaign").
         - "targetBuyer": Specific industry buyer (e.g. "Fintech Marketing Directors, Healthcare Publishers, Creative Agencies").
      
      3. LONG-TAIL SEARCH INTELLIGENCE:
         - "longTailKeywords": 5 to 8 high-converting, commercially meaningful 3-5 word search phrases supported directly by the asset (e.g. "small business owner reviewing quarterly budget", "clean energy solar power station", "sustainable remote team collaboration").
      
      4. KEYWORD TAXONOMY CLASSIFICATION:
         Classify the vocabulary into internal roles:
         - primarySubject: 4-8 literal nouns describing the main subject.
         - secondarySubject: 3-6 supporting objects, materials, or props.
         - action: 3-5 specific dynamic verbs or physical states.
         - environment: 3-5 location, background, and lighting terms.
         - commercialConcept: 4-6 business/abstract themes (e.g. "digital transformation", "financial stability", "environmental stewardship").
         - useCases: 3-5 placement formats ("hero header", "editorial", "website banner").
         - styleAndComposition: 3-5 visual attributes ("aerial view", "minimalist", "copy space", "selective focus").
         - industry: 2-4 economic verticals ("Technology", "Healthcare", "Finance", "Renewable Energy").
         - longTailPhrases: 4-6 multi-word search phrases.
      
      5. TITLE REQUIREMENTS FOR ${marketConfig.name.toUpperCase()}:
         ${marketConfig.titleDirectives}
         - Must sound like professional stock metadata written by someone who understands commercial photography & visual communication.
         - Under 70 characters for Adobe Stock. Concise, descriptive, natural, searchable, commercial.
         - NO keyword spamming in title. NO poetic fluff. NO robotic repetitive phrases.
      
      6. KEYWORD HIERARCHY & ORDERING FOR ${marketConfig.name.toUpperCase()} (${marketConfig.targetKeywordCount} unique keywords):
         ${marketConfig.keywordDirectives}
         - SLOTS 1 TO 10 MUST BE THE STRONGEST SEARCH CONCEPTS (Primary subject + dynamic action + highest-intent long-tail phrases). Adobe Stock weights these heaviest.
         - Slots 11 to 25: Secondary subject, environment, industry context, and commercial use cases.
         - Slots 26+: Conceptual themes, visual composition, and emotional relevance.
         - NO trademarked brands (e.g. no iPhone, Sony, Nike, MacBook).
         - NO duplicate keywords or plural/singular duplicates.
      
      7. ADOBE STOCK CATEGORY:
         Select the most accurate category from:
         "Business", "People", "Technology", "Graphic Resources", "The Environment", "Food", "Drinks", "Landscapes", "Buildings and Architecture", "Animals", "Lifestyle", "Industry", "Plants and Flowers", "Culture and Religion", "Science", "Social Issues", "Sports", "Transport", "Travel", "States of Mind", "Hobbies and Leisure".
      
      8. QUALITY CONTROL & LEGAL SHIELD:
         - "metadataQualityScore": 0-100 internal quality score based on visual accuracy and search optimization.
         - "salesPotentialScore": 0-100 buyer demand score.
         - "technicalQualityScore": 0-100 technical quality evaluation.
         - "acceptanceProbability": 0-100 percentage.
         - "detectedTrademarks": list any detected logos/trademarks or ["None detected"].
         - "trademarkRisk": "none" | "low" | "medium" | "high".
         - "modelReleaseRequired": true if recognizable people are present.
         - "propertyReleaseRequired": true if private property/landmarks present.
         - "releaseExplanation": Clear legal advice.
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
                recommendedTitle: { type: Type.STRING },
                shortDescription: { type: Type.STRING },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                priorityKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                longTailKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                commercialProblemSolved: { type: Type.STRING },
                category: { type: Type.STRING, description: "Adobe Stock category" },
                visualSubject: { type: Type.STRING },
                visualAction: { type: Type.STRING },
                visualEnvironment: { type: Type.STRING },
                visualLighting: { type: Type.STRING },
                visualComposition: { type: Type.STRING },
                primarySearchIntent: { type: Type.STRING },
                secondarySearchIntent: { type: Type.STRING },
                commercialUseCases: { type: Type.ARRAY, items: { type: Type.STRING } },
                targetBuyer: { type: Type.STRING },
                keywordTaxonomy: {
                  type: Type.OBJECT,
                  properties: {
                    primarySubject: { type: Type.ARRAY, items: { type: Type.STRING } },
                    secondarySubject: { type: Type.ARRAY, items: { type: Type.STRING } },
                    action: { type: Type.ARRAY, items: { type: Type.STRING } },
                    environment: { type: Type.ARRAY, items: { type: Type.STRING } },
                    commercialConcept: { type: Type.ARRAY, items: { type: Type.STRING } },
                    useCases: { type: Type.ARRAY, items: { type: Type.STRING } },
                    styleAndComposition: { type: Type.ARRAY, items: { type: Type.STRING } },
                    industry: { type: Type.ARRAY, items: { type: Type.STRING } },
                    longTailPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
                  }
                },
                visualTruthConfidence: { type: Type.STRING, description: "HIGH CONFIDENCE | MEDIUM CONFIDENCE | REVIEW NEEDED" },
                metadataQualityScore: { type: Type.INTEGER },
                salesPotentialScore: { type: Type.INTEGER, description: "Score from 0 to 100 indicating viral/sales potential" },
                technicalQualityScore: { type: Type.INTEGER },
                copyrightRiskScore: { type: Type.INTEGER },
                overallSubmissionRiskScore: { type: Type.INTEGER },
                acceptanceProbability: { type: Type.INTEGER, description: "0-100 percentage of being accepted by Adobe Stock" },
                rejectionFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
                riskLabel: { type: Type.STRING, description: "Low risk | Medium risk | High risk | Do not submit before fixing" },
                explanation: { type: Type.STRING },
                detectedDefects: { type: Type.ARRAY, items: { type: Type.STRING } },
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
      } else if (marketConfig.id === 'adobe_stock') {
        // Adobe Stock: "Keep it short, ideally under 70 characters"
        if (cleanTitle.length > 70) {
          const firstClause = cleanTitle.split(/[,;-]/)[0]?.trim();
          if (firstClause && firstClause.length >= 25 && firstClause.length <= 70) {
            cleanTitle = firstClause;
          }
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

      // Adobe Stock: Place the most important keywords in the first 10 positions
      if (sanitizedPriority.length > 0) {
        const remaining = parsed.keywords.filter((k: string) => !sanitizedPriority.includes(k));
        parsed.keywords = [...sanitizedPriority, ...remaining].slice(0, marketConfig.maxKeywords);
      }

      // Adobe Stock Category
      parsed.category = parsed.category || "Business";

      // Long-tail search intelligence layer post-processing
      const rawLongTail = Array.isArray(parsed.longTailKeywords) ? parsed.longTailKeywords : [];
      const sanitizedLongTail: string[] = [];
      const seenLongTail = new Set<string>();
      for (const lt of rawLongTail) {
        if (!lt) continue;
        const norm = String(lt).toLowerCase().replace(/[^\w\s-]/g, '').trim();
        if (norm.length > 5 && !seenLongTail.has(norm)) {
          seenLongTail.add(norm);
          sanitizedLongTail.push(norm);
        }
      }
      parsed.longTailKeywords = sanitizedLongTail.slice(0, 8);

      // Commercial Problem / Concept Solved
      parsed.commercialProblemSolved = typeof parsed.commercialProblemSolved === 'string' && parsed.commercialProblemSolved.trim().length > 0
        ? parsed.commercialProblemSolved.trim()
        : `Illustrates commercial ${parsed.category || 'Business'} workflow with authentic visual communication for marketing and editorial publications.`;

      // Keyword Taxonomy Classification Post-Processing & Validation
      const rawTaxonomy = parsed.keywordTaxonomy && typeof parsed.keywordTaxonomy === 'object' ? parsed.keywordTaxonomy : {};
      const cleanTaxList = (arr: any) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(x => String(x || '').toLowerCase().replace(/[^\w\s-]/g, '').trim()).filter(x => x.length > 1);
      };

      parsed.keywordTaxonomy = {
        primarySubject: cleanTaxList(rawTaxonomy.primarySubject).slice(0, 8),
        secondarySubject: cleanTaxList(rawTaxonomy.secondarySubject).slice(0, 6),
        action: cleanTaxList(rawTaxonomy.action).slice(0, 5),
        environment: cleanTaxList(rawTaxonomy.environment).slice(0, 5),
        commercialConcept: cleanTaxList(rawTaxonomy.commercialConcept).slice(0, 6),
        useCases: cleanTaxList(rawTaxonomy.useCases).slice(0, 5),
        styleAndComposition: cleanTaxList(rawTaxonomy.styleAndComposition).slice(0, 5),
        industry: cleanTaxList(rawTaxonomy.industry).slice(0, 4),
        longTailPhrases: (cleanTaxList(rawTaxonomy.longTailPhrases).length > 0 ? cleanTaxList(rawTaxonomy.longTailPhrases) : parsed.longTailKeywords).slice(0, 6)
      };

      // Quality Control: Re-order keywords placing primary subject, dynamic action, and top long-tail intent at slots 1-10
      const eliteFirstTen: string[] = [];
      const usedTokens = new Set<string>();
      const addElite = (term: string) => {
        const norm = term.toLowerCase().trim();
        if (norm.length > 1 && !usedTokens.has(norm)) {
          usedTokens.add(norm);
          eliteFirstTen.push(norm);
        }
      };

      // 0. Rank #1 Search Locking: The exact search query MUST be locked at Slot #1 for maximum search ranking influence
      if (targetSearchQuery && typeof targetSearchQuery === 'string' && targetSearchQuery.trim()) {
        addElite(targetSearchQuery.trim());
      } else if (parsed.primarySearchIntent && typeof parsed.primarySearchIntent === 'string' && parsed.primarySearchIntent.trim()) {
        addElite(parsed.primarySearchIntent.trim());
      }

      // 1. Primary Subject
      for (const ps of parsed.keywordTaxonomy.primarySubject) {
        if (eliteFirstTen.length < 4) addElite(ps);
      }
      // 2. Dynamic Action
      for (const act of parsed.keywordTaxonomy.action) {
        if (eliteFirstTen.length < 6) addElite(act);
      }
      // 3. High-Intent Long Tail
      for (const lt of parsed.longTailKeywords) {
        if (eliteFirstTen.length < 8) addElite(lt);
      }
      // 4. Fill to 10 from priority or main keywords
      for (const pk of sanitizedPriority) {
        if (eliteFirstTen.length < 10) addElite(pk);
      }
      for (const kw of parsed.keywords) {
        if (eliteFirstTen.length < 10) addElite(kw);
      }

      // Re-stitch entire keyword list: elite first 10 + remaining distinct keywords
      const finalKeywords: string[] = [...eliteFirstTen];
      for (const kw of parsed.keywords) {
        if (!usedTokens.has(kw.toLowerCase().trim())) {
          usedTokens.add(kw.toLowerCase().trim());
          finalKeywords.push(kw);
        }
      }
      parsed.keywords = finalKeywords.slice(0, marketConfig.maxKeywords);
      parsed.priorityKeywords = eliteFirstTen.slice(0, 10);

      // Metadata Versioning Initialization
      parsed.versions = [
        {
          versionNumber: 1,
          timestamp: Date.now(),
          title: parsed.recommendedTitle,
          keywords: parsed.keywords,
          category: parsed.category,
          mode: regenerationMode || 'initial',
          qualityScore: parsed.metadataQualityScore
        }
      ];
      parsed.activeVersionIndex = 0;

      // Visual Analysis Data
      parsed.visualAnalysis = {
        subject: parsed.visualSubject || cleanTitle,
        action: parsed.visualAction || "Authentic subject in composition",
        environment: parsed.visualEnvironment || "Professional studio / authentic environment",
        lightingMood: parsed.visualLighting || "Balanced natural lighting",
        composition: parsed.visualComposition || "Clean focal framing"
      };

      // Search Intent Data
      const primaryIntent = parsed.primarySearchIntent || cleanTitle;
      const commercialUseCases = Array.isArray(parsed.commercialUseCases) && parsed.commercialUseCases.length > 0
        ? parsed.commercialUseCases.slice(0, 5)
        : ["Corporate Website Hero", "B2B Marketing Banner", "Editorial Publication", "Social Media Campaign"];
      
      parsed.searchIntent = {
        primaryIntent,
        secondaryIntent: parsed.secondarySearchIntent || "Commercial stock visual asset",
        commercialUseCases,
        targetBuyer: parsed.targetBuyer || "Creative Directors, Marketing Teams & Commercial Publishers"
      };

      // Visual Truth & Metadata Quality Score
      parsed.visualTruthConfidence = parsed.visualTruthConfidence && ["HIGH CONFIDENCE", "MEDIUM CONFIDENCE", "REVIEW NEEDED"].includes(parsed.visualTruthConfidence)
        ? parsed.visualTruthConfidence
        : "HIGH CONFIDENCE";

      parsed.metadataQualityScore = typeof parsed.metadataQualityScore === "number" 
        ? Math.min(100, Math.max(0, parsed.metadataQualityScore)) 
        : Math.round(((parsed.salesPotentialScore || 85) + (parsed.technicalQualityScore || 85) + (parsed.acceptanceProbability || 90)) / 3);

      // Smart Warnings Generator
      const smartWarnings: { type: 'info' | 'suggestion' | 'warning' | 'critical'; message: string }[] = [];
      if (cleanTitle.length > 70) {
        smartWarnings.push({
          type: "suggestion",
          message: `Title length (${cleanTitle.length} chars) exceeds 70 characters. Adobe Stock recommends concise titles under 70 characters.`
        });
      } else {
        smartWarnings.push({
          type: "info",
          message: `Title length (${cleanTitle.length} chars) is concise and fully compliant with Adobe Stock guidelines.`
        });
      }

      if (sanitizedPriority.length >= 8) {
        smartWarnings.push({
          type: "info",
          message: "Top 10 slots contain your most important search terms to maximize initial search algorithm relevance."
        });
      }

      if (parsed.detectedTrademarks && parsed.detectedTrademarks.length > 0 && !parsed.detectedTrademarks.includes("None detected")) {
        smartWarnings.push({
          type: "warning",
          message: `Potential trademark detected (${parsed.detectedTrademarks.join(", ")}). Verify commercial clearance before submission.`
        });
      }

      parsed.smartWarnings = smartWarnings;

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
