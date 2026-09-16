sed -i 's/const { imageBase64, mimeType, marketplace, isAiGenerated, tier } = req.body;/const { imageBase64, mimeType, marketplace, isAiGenerated, tier, assetType } = req.body;/g' server.ts
sed -i 's/1. SEO TITLE/1. SEO TITLE (\${assetType ? "Explicitly mention it is a " + assetType + " in the title" : "Identify if it is a photo, illustration, or vector"}):/g' server.ts
sed -i 's/Return exactly 4 current trends/Return exactly 4 current trends/g' server.ts
