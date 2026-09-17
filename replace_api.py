import re

with open('server.ts', 'r') as f:
    content = f.read()

regex = re.compile(r'app\.post\("/api/analyze", async \(req, res\) => \{.*?const responseText = response\.text;', re.DOTALL)

replacement = """app.post("/api/analyze", async (req, res) => {
  try {
    const { imageBase64, mimeType, marketplace, isAiGenerated, tier, assetType, language } = req.body;
    
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
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });

    const isProTier = tier && tier !== "free";
    
    let rawImageAnalysis = "";

    if (isProTier) {
      // Step 1: Gemini 2.5 Flash acts as Vision Analyst
      const visionPrompt = `
      You are an Expert Visual Analyst for Stock Photography.
      Analyze this image meticulously and provide a highly detailed raw data report covering:
      1. Main subjects (objects, people, demographics, expressions)
      2. Environment/Setting (location, weather, time of day, indoor/outdoor)
      3. Artistic/Technical Composition (camera angle, lighting, depth of field, colors, style, framing)
      4. Conceptual Themes (emotions, concepts, abstract ideas represented)
      5. Potential Defects (noise, artifacts, AI deformation, logos/trademarks)
      Do not format it as JSON, just provide a dense, descriptive text report.
      `;
      
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

    // Step 2: Gemini 1.5 Pro acts as Senior SEO Director
    const prompt = `
    You are an Elite Stock Photography SEO Specialist, Metadata Expert, and Quality Inspector.
    Your ultimate goal is to generate metadata that maximizes downloads and sales for the contributor.
    Target Marketplace Platform: ${marketplace?.toUpperCase() || 'ADOBE_STOCK'}.
    Is AI Generated Asset: ${isAiGenerated}.
    CRITICAL: You MUST write the Title, Description, and ALL Keywords in ${language || "English"}.

    ${isProTier ? `I have already run this image through our AI Vision Analyst (Gemini 2.5 Flash). Here is their raw visual report:\\n\\n<vision_report>\\n${rawImageAnalysis}\\n</vision_report>\\n\\nUse this report AND your own visual analysis of the image to synthesize the perfect metadata. You are the Senior SEO Director (Gemini 1.5 Pro).` : ''}

    PRO-LEVEL SEO & METADATA RULES:
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

    const responseText = response.text;"""

new_content = regex.sub(replacement, content)

with open('server.ts', 'w') as f:
    f.write(new_content)

print('Replaced Python')
