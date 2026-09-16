sed -i 's/const { imageBase64, mimeType, marketplace, isAiGenerated, tier, assetType } = req.body;/const { imageBase64, mimeType, marketplace, isAiGenerated, tier, assetType, language } = req.body;/g' server.ts
sed -i 's/PRO-LEVEL SEO & METADATA RULES:/CRITICAL: You MUST write the Title, Description, and ALL Keywords in ${language || "English"}.\n      PRO-LEVEL SEO & METADATA RULES:/g' server.ts
