sed -i '1589,1590c\
                    checked={isAiGenerated}\
                    onChange={(e) => setIsAiGenerated(e.target.checked)}' src/App.tsx
