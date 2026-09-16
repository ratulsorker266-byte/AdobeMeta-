sed -i 's/let csv = '\''Filename,Title,Keywords\\n'\'';/let csv = '\''Filename,Title,Description,Keywords\\n'\'';/g' src/App.tsx
sed -i 's/const title = `"${item.result.recommendedTitle.replace(\/"\/g, '\'\"\"\'')}"`;/const title = `"${item.result.recommendedTitle.replace(\/"\/g, '\'\"\"\'')}"`;\n        const desc = `"${(item.result.shortDescription || item.result.recommendedTitle).replace(\/"\/g, '\'\"\"\'')}"`;/g' src/App.tsx
sed -i 's/csv += `"${item.file.name}",${title},${keywords}\\n`;/csv += `"${item.file.name}",${title},${desc},${keywords}\\n`;/g' src/App.tsx
