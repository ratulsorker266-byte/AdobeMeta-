with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'technicalQualityScore: number;',
    'salesPotentialScore?: number;\n    acceptanceProbability?: number;\n    rejectionFlags?: string[];\n    technicalQualityScore: number;'
)

with open('src/types.ts', 'w') as f:
    f.write(content)

print("types.ts updated")
