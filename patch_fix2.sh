sed -i '1014d' src/App.tsx
sed -i '1590,1591c\
                      checked={isAiGenerated}' src/App.tsx
