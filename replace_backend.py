import re

with open('server.ts', 'r') as f:
    content = f.read()

# Update the prompt
old_prompt = '5. QUALITY INSPECTION: Strictly perform copyright, trademark, and AI defect inspection (e.g., extra fingers, deformed anatomy, artifacts, noise). Provide an honest "riskLabel".'
new_prompt = '5. STRICT ADOBE STOCK MODERATOR SIMULATION: Act as a ruthless stock photo reviewer. Calculate the "acceptanceProbability" (0-100%). Identify specific "rejectionFlags" (e.g., Intellectual Property, Artifacts, Out of Focus, Similar Content). Give it a highly realistic and strict ratio.'
content = content.replace(old_prompt, new_prompt)

# Update the schema
old_schema = 'overallSubmissionRiskScore: { type: Type.INTEGER },'
new_schema = 'overallSubmissionRiskScore: { type: Type.INTEGER },\n            acceptanceProbability: { type: Type.INTEGER, description: "0-100 percentage of being accepted by Adobe Stock" },\n            rejectionFlags: { type: Type.ARRAY, items: { type: Type.STRING } },'
content = content.replace(old_schema, new_schema)

with open('server.ts', 'w') as f:
    f.write(content)

print("Backend updated")
