sed -i 's/if (tier !== "pro") return res.status(403).json({ error: "Chat is a Pro feature." });/\/\/ Allowed for all, limits enforced on client/g' server.ts

sed -i 's/Return exactly 4 current trends/If the user searches for a specific month (e.g., "October"), list the key seasonal events, holidays, and stock photography opportunities for that month, and BOLD the most crucial\/high-selling events in the description using markdown (**event**).\n      Return exactly 4 current trends/g' server.ts
