sed -i 's/const { imageBase64, mimeType, marketplace, isAiGenerated } = req.body;/const { imageBase64, mimeType, marketplace, isAiGenerated, tier } = req.body;\n    const aiModel = tier === "pro" ? "gemini-1.5-pro" : "gemini-2.5-flash";/g' server.ts
sed -i 's/model: "gemini-2.5-flash"/model: aiModel/g' server.ts
