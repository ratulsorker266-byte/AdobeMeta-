export interface MonthTrendDetail {
  monthName: string;
  bengaliName: string;
  monthOverview: string;
  whatToCreate: string[];
  currentTrends: {
    topic: string;
    description: string;
    actionGuide: string;
    bestFor: string;
    keywords: string[];
  }[];
  upcomingTrends: {
    topic: string;
    targetMonth: string;
    description: string;
    actionGuide: string;
    bestFor: string;
    keywords: string[];
  }[];
}

export const MONTHLY_TRENDS_KNOWLEDGE: Record<string, MonthTrendDetail> = {
  january: {
    monthName: "January",
    bengaliName: "জানুয়ারি",
    monthOverview: "January is defined by New Year resolutions, fitness overhauls, healthy eating, corporate goal setting, and tax season preparation. Commercial buyers actively search for clean, inspiring visuals representing fresh starts and organized lifestyles.",
    whatToCreate: [
      "Fitness & Wellness: Real people working out at home, gym workouts, yoga, wearable smartwatch tracking, and clean meal prep bowls.",
      "Corporate Strategy & Goals: Diverse business teams strategizing around glass whiteboards, business growth graphs, and hybrid remote meetings.",
      "Financial Planning: Personal budgeting, calculating savings, tax forms, piggy banks, investment mobile apps, and retirement plans.",
      "Cozy Winter Comfort: Warm drinks (hot chocolate, herbal tea), reading by the fireplace, wool blankets, and rainy/snowy window views.",
      "Habit Tracking & Organization: Minimalist planner flat-lays, goal checklists, desktop organizers, and digital productivity devices."
    ],
    currentTrends: [
      {
        topic: "New Year Health & Fitness Reset",
        description: "Surge in demand for authentic exercise routines, athletic apparel, smart fitness trackers, and clean nutrition.",
        actionGuide: "Shoot high-key, energizing lighting with authentic fitness models of diverse body types. Avoid overly posed stock looks; emphasize sweat, focus, and realistic workouts.",
        bestFor: "Photos, Video Clips & Generative AI",
        keywords: ["new year fitness", "healthy lifestyle", "workout motivation", "weight loss", "gym workout", "meal prep", "activewear", "wellness"]
      },
      {
        topic: "Q1 Business Goals & Team Vision",
        description: "Corporate clients buying visuals for annual reports, quarterly kickoff decks, leadership training, and digital transformation.",
        actionGuide: "Capture candid collaboration: employees pointing to charts, smiling discussions, collaborative laptop sessions with plenty of copy space.",
        bestFor: "Photos & Vector Illustrations",
        keywords: ["business strategy", "corporate goals", "team meeting", "q1 planning", "leadership", "office collaboration", "financial growth"]
      },
      {
        topic: "Personal Budgeting & Tax Prep",
        description: "Rising searches for personal finance management, tax calculations, digital accounting, and financial security.",
        actionGuide: "Flat-lays featuring calculators, receipts, tax forms, digital tablet spreadsheets, and hands writing in budget notebooks.",
        bestFor: "Photos & Infographic Vectors",
        keywords: ["tax season", "budgeting", "financial planning", "accounting", "savings", "calculator", "receipts", "expense tracker"]
      },
      {
        topic: "Mindful Living & Digital Detox",
        description: "Buyers looking for soothing concepts representing mental peace, journaling, meditation, and calm indoor aesthetics.",
        actionGuide: "Use muted earth tones, soft morning sunlight, peaceful facial expressions, and minimalist clutter-free spaces.",
        bestFor: "Photos & Aesthetic Vectors",
        keywords: ["mindfulness", "meditation", "journaling", "digital detox", "self care", "calm morning", "peaceful", "mental health"]
      }
    ],
    upcomingTrends: [
      {
        topic: "Valentine's Day Romance & Gifting",
        targetMonth: "Target: February",
        description: "Stock buyers purchase Valentine content 4-6 weeks in advance for advertising and packaging.",
        actionGuide: "Create modern love concepts: diverse couples, handcrafted gifts, heart confectionery, flowers, and romantic dinner settings.",
        bestFor: "Photos, Vectors & Patterns",
        keywords: ["valentines day", "romance", "gift box", "love couple", "red roses", "greeting card", "sweethearts"]
      },
      {
        topic: "Spring Fashion & Early Home Refresh",
        targetMonth: "Target: March",
        description: "Brands prepping for spring collections, seasonal home decluttering, and gardening supplies.",
        actionGuide: "Capture pastel color palettes, organized wardrobe racks, light jackets, and indoor houseplant care.",
        bestFor: "Photos & Lifestyle Vectors",
        keywords: ["spring fashion", "wardrobe organization", "decluttering", "houseplants", "home decor", "fresh start"]
      },
      {
        topic: "International Women's Day Leadership",
        targetMonth: "Target: March",
        description: "Global corporate demand for female empowerment, women in STEM, trades, and executive leadership.",
        actionGuide: "Authentic portraits of determined women at work: engineers with hard hats, female scientists, tech founders, and craftswomen.",
        bestFor: "Portraits & Banner Vectors",
        keywords: ["womens day", "female empowerment", "women in business", "leadership", "diversity", "female engineer"]
      },
      {
        topic: "Spring Cleaning & Eco Living",
        targetMonth: "Target: March-April",
        description: "Surge in downloads for eco-friendly cleaning supplies, spray bottles, and gleaming clean interiors.",
        actionGuide: "Focus on non-toxic cleaning, reusable cloths, natural spray bottles, and sunny living rooms with open windows.",
        bestFor: "Photos & Icon Sets",
        keywords: ["spring cleaning", "eco cleaning", "tidy home", "natural spray", "declutter", "clean house"]
      }
    ]
  },
  february: {
    monthName: "February",
    bengaliName: "ফেব্রুয়ারি",
    monthOverview: "February revolves around Valentine's Day romance, Heart Health Month, Black History Month, romantic getaways, and early preparations for Spring Equinox and outdoor lifestyles.",
    whatToCreate: [
      "Love & Relationships: Genuine couples holding hands, anniversary dinners, creative gift wrapping, LGBTQ+ love, and chocolate sweets.",
      "Cardiovascular Health & Medicine: Doctor stethoscope on chest, healthy heart diet illustrations, blood pressure monitoring, and aerobic cardio.",
      "Spring Cleaning & Organization: Deep cleaning routines, closet storage bins, kitchen pantry labeling, and sparkling countertops.",
      "Super Bowl & Sports Gatherings: Friends on couch cheering, game day pizza, chicken wings, chips and dip, and high-fives.",
      "Early Gardening & Seed Starting: Hands holding seedlings in potting soil, gardening tools, green sprouts, and indoor greenhouses."
    ],
    currentTrends: [
      {
        topic: "Authentic Modern Romance & Valentine's",
        description: "High volume of downloads for romantic moments, romantic dinner dates, personalized gifts, and emotional connection.",
        actionGuide: "Focus on candid, heartfelt moments. Natural smiles, genuine hugs, hand-holding with wedding or engagement rings.",
        bestFor: "Photos & Vector Card Templates",
        keywords: ["valentines day", "romantic couple", "love", "gift giving", "romantic dinner", "date night", "candlelight"]
      },
      {
        topic: "Heart Health & Cardio Wellness",
        description: "Medical clinics and health publications demand cardiovascular health visuals throughout February.",
        actionGuide: "Doctor consultations with mature patients, 3D medical heart illustrations, healthy berry breakfasts, and blood pressure checks.",
        bestFor: "Photos, 3D Renders & Vectors",
        keywords: ["heart health", "cardiology", "blood pressure", "healthy diet", "stethoscope", "cardio workout", "doctor patient"]
      },
      {
        topic: "Sports Fan Gatherings & Game Day Parties",
        description: "Celebratory party scenes for major sports championships, snacks, beer toasts, and ecstatic cheering fans.",
        actionGuide: "Capture dynamic group energy in living rooms or sports bars, jerseys, nachos, dips, and expressive high-fives.",
        bestFor: "Photos & Food Photography",
        keywords: ["game day", "sports fans", "watching tv", "party snacks", "cheering", "football party", "beer and pizza"]
      },
      {
        topic: "Black History Month & Cultural Heritage",
        description: "Educational institutions and editorial media source portraits and cultural heritage celebrations.",
        actionGuide: "Dignified portraits of Black artists, leaders, entrepreneurs, students, and community cultural events.",
        bestFor: "Portraits, Editorial & Vectors",
        keywords: ["black history month", "african american culture", "diversity", "black entrepreneur", "unity", "community"]
      }
    ],
    upcomingTrends: [
      {
        topic: "Easter Celebrations & Family Feasts",
        targetMonth: "Target: April",
        description: "Easter bunny graphics, egg hunts, pastel decorations, and festive spring baking.",
        actionGuide: "Pastel Easter eggs in woven baskets, families baking hot cross buns, kids searching for eggs in green grass.",
        bestFor: "Photos, Vectors & Patterns",
        keywords: ["easter", "easter eggs", "spring basket", "bunny", "family dinner", "easter baking", "pastel"]
      },
      {
        topic: "Earth Day & Sustainability Action",
        targetMonth: "Target: April",
        description: "Corporate green initiatives, solar panel installations, zero-waste lifestyle, and tree planting.",
        actionGuide: "Volunteers planting saplings, clean energy wind turbines, reusable bamboo coffee cups, electric car charging.",
        bestFor: "Photos & Environmental Vectors",
        keywords: ["earth day", "sustainability", "renewable energy", "tree planting", "zero waste", "green economy"]
      },
      {
        topic: "Spring Travel & Road Trips",
        targetMonth: "Target: April-May",
        description: "Travel agencies buying content for spring break, weekend camping, scenic highway drives, and flights.",
        actionGuide: "Scenic mountain roads, convertible cars, vintage camper vans, travelers checking GPS maps, and luggage.",
        bestFor: "Landscape & Travel Photos",
        keywords: ["road trip", "spring vacation", "travel adventure", "scenic drive", "camping", "wanderlust"]
      },
      {
        topic: "Mother's Day Early Commercial Prep",
        targetMonth: "Target: May",
        description: "E-commerce retailers beginning campaign asset procurement for Mother's Day sales.",
        actionGuide: "Tender moments between mother and daughter, breakfast in bed surprises, flower gift boxes, and maternal hugs.",
        bestFor: "Portraits & Banner Templates",
        keywords: ["mothers day", "mother and child", "gift for mom", "breakfast in bed", "family love", "flower bouquet"]
      }
    ]
  },
  march: {
    monthName: "March",
    bengaliName: "মার্চ",
    monthOverview: "March welcomes Spring, International Women's Day, Saint Patrick's Day, and preparations for Easter and Ramadan/Eid. Stock buyers focus on blooming nature, renewal, outdoor sports, and home improvement.",
    whatToCreate: [
      "Women Empowerment: Female entrepreneurs, women in engineering and construction, female coders, and senior women mentors.",
      "Spring Renewal & Gardening: Seedlings, flower beds, blooming cherry blossoms, pruning shears, soil potting, and botanical greenhouses.",
      "Home Renovation & Painting: DIY painting walls with paint rollers, installing floorboards, interior design moodboards, and tools.",
      "Outdoor Fitness & Running: Runners on city trails, road cyclists in cycling kits, trail hiking, and morning stretches in parks.",
      "Easter & Spring Holidays: Pastel decorated eggs, chocolate rabbits, family dinner spreads, and floral centerpieces."
    ],
    currentTrends: [
      {
        topic: "International Women's Day (IWD)",
        description: "Global corporate campaign surge celebrating female achievement, diversity, and leadership.",
        actionGuide: "Shoot authentic working portraits: women in hardhats, female doctors, executive boardrooms, and artistic creators.",
        bestFor: "Portraits & Banner Vectors",
        keywords: ["international womens day", "female leadership", "women empowerment", "equality", "women in tech", "diverse women"]
      },
      {
        topic: "Spring Flora & Agricultural Awakening",
        description: "High demand for fresh flowers, blooming branches, farm cultivation, and vibrant green landscapes.",
        actionGuide: "Macro shots of dew drops on petals, colorful tulips, cherry blossoms, and hands planting seeds in rich organic soil.",
        bestFor: "Photos & Botanical Illustrations",
        keywords: ["spring blooms", "cherry blossom", "gardening", "fresh sprouts", "agriculture", "spring flowers", "nature renewal"]
      },
      {
        topic: "St. Patrick's Day Celebrations",
        description: "Festive Irish holiday graphics, green clover shamrocks, pints of stout, and parade crowds.",
        actionGuide: "Green beer toasts, four-leaf clover vector patterns, leprechaun hat badges, and lively pub gathering photos.",
        bestFor: "Vectors, Patterns & Event Photos",
        keywords: ["st patricks day", "shamrock", "four leaf clover", "irish celebration", "green beer", "pub party"]
      },
      {
        topic: "DIY Home Renovation & Spring Refresh",
        description: "Homeowners refreshing their interiors, DIY carpentry, painting accent walls, and remodeling kitchens.",
        actionGuide: "Show action: paint rollers spreading pastel tones, measuring tapes, tool belts, and stylish modern living spaces.",
        bestFor: "Photos & How-to Vectors",
        keywords: ["home renovation", "diy painting", "interior remodel", "home improvement", "painting wall", "contractor", "decor"]
      }
    ],
    upcomingTrends: [
      {
        topic: "Mother's Day & Multigenerational Family",
        targetMonth: "Target: May",
        description: "Retail and advertising peak for Mother's Day campaigns across digital and print media.",
        actionGuide: "Three generations of women laughing together (grandmother, mother, daughter), handmade cards, and spa day gifts.",
        bestFor: "Portraits & Card Designs",
        keywords: ["mothers day", "grandmother", "mom love", "family generations", "spa day", "happy mothers day"]
      },
      {
        topic: "Graduation & Academic Success",
        targetMonth: "Target: May-June",
        description: "Academic institutions, greeting cards, and gift platforms sourcing caps, diplomas, and cheering graduates.",
        actionGuide: "Graduates tossing mortarboards in the air, graduation robes, proud parents hugging graduate, and diploma scrolls.",
        bestFor: "Photos & Vector Badges",
        keywords: ["graduation", "diploma", "graduate ceremony", "college degree", "graduation cap", "academic success"]
      },
      {
        topic: "Summer Beach Vacations & Travel",
        targetMonth: "Target: June-July",
        description: "Airlines, resorts, and travel websites buying summer leisure, swimming, and tropical island imagery.",
        actionGuide: "Sunlit turquoise beaches, sunscreen bottles, sunglasses on sandy towel, coconut drinks, and infinity pools.",
        bestFor: "Travel Photos & Flat-lays",
        keywords: ["summer vacation", "beach resort", "tropical island", "swimming pool", "sunscreen", "summer travel"]
      },
      {
        topic: "Father's Day Tributes",
        targetMonth: "Target: June",
        description: "Campaigns spotlighting modern, hands-on fathers, outdoor adventures, and thoughtful gifts for dad.",
        actionGuide: "Father teaching child to ride a bike, cooking together in kitchen, camping, and DIY woodworking projects.",
        bestFor: "Photos & Graphic Templates",
        keywords: ["fathers day", "father and son", "dad and daughter", "parenting", "family bond", "fathers love"]
      }
    ]
  },
  april: {
    monthName: "April",
    bengaliName: "এপ্রিল",
    monthOverview: "April highlights Earth Day and sustainability, Easter family gatherings, tax filing deadlines, spring sports, and early wedding season bookings.",
    whatToCreate: [
      "Earth Day & Green Tech: Solar panels on rooftops, wind farms, electric vehicles charging, recycling bins, and zero-waste shopping.",
      "Outdoor Recreation: Mountain hiking, jogging through blossom-lined avenues, outdoor fitness classes, and family bike rides.",
      "Graduation Prep: Students studying in library, cap and gown fittings, college campus life, and resume reviews.",
      "Wedding Season Preparations: Bridal gown fitting, ring selections, wedding invitations calligraphy, and floral arrangements.",
      "Outdoor Dining & Spring Cafes: People dining at street cafes, outdoor brunch, coffee with croissants, and sunny patio seating."
    ],
    currentTrends: [
      {
        topic: "Earth Day & Climate Solutions",
        description: "Huge demand for renewable energy, eco-responsible lifestyles, circular economy, and community tree planting.",
        actionGuide: "Focus on solutions rather than doom: clean solar panels, smiling volunteers, reusable shopping tote bags, electric scooters.",
        bestFor: "Photos & Sustainability Icons",
        keywords: ["earth day", "green energy", "solar power", "recycling", "sustainability", "climate action", "zero waste"]
      },
      {
        topic: "Easter Celebrations & Spring Baking",
        description: "Final rush of easter egg hunts, festive desserts, brunch buffets, and pastel home decor.",
        actionGuide: "Top-down food photography of glazed ham, hot cross buns, carrot cake, and colorful pastel tabletop settings.",
        bestFor: "Food Photography & Vector Cards",
        keywords: ["easter sunday", "easter brunch", "easter cake", "colored eggs", "spring holiday", "family gathering"]
      },
      {
        topic: "Spring Sports & Marathon Training",
        description: "Fitness brands buying imagery of outdoor running, marathon preparations, tennis, and cycling.",
        actionGuide: "Action shots of runners tying shoelaces, hydration with water bottles, sports GPS watches, and motion blur sprints.",
        bestFor: "Sports Photos & Action Shots",
        keywords: ["outdoor running", "marathon training", "cycling", "fitness motivation", "jogging in park", "sports watch"]
      },
      {
        topic: "Tax Filing Deadline & Financial Audits",
        description: "Editorial, banking, and accounting agencies sourcing tax calculators, stress with receipts, and online filing.",
        actionGuide: "Stressed and relieved taxpayers, calculator, neatly stacked documents, signing forms, and laptop screen showing graphs.",
        bestFor: "Business Photos & Icons",
        keywords: ["tax deadline", "tax return", "financial audit", "accounting", "irs forms", "calculating tax"]
      }
    ],
    upcomingTrends: [
      {
        topic: "Summer Solstice & Festival Season",
        targetMonth: "Target: June-July",
        description: "Music festivals, outdoor concerts, boho fashion, food trucks, and lively youth crowds.",
        actionGuide: "Festival crowds with hands in the air, outdoor stage lighting, boho glitter makeup, and food truck lines.",
        bestFor: "Photos & Vibrant Posters",
        keywords: ["summer festival", "music concert", "outdoor event", "youth lifestyle", "food truck", "summer party"]
      },
      {
        topic: "Father's Day Celebrations",
        targetMonth: "Target: June",
        description: "Commercial rush for Father's Day e-commerce, greeting cards, and social media campaigns.",
        actionGuide: "Warm fatherly hugs, grilling together, playing catch in backyard, and handcrafted cards with child scribbles.",
        bestFor: "Photos & Card Vectors",
        keywords: ["fathers day", "best dad", "dad love", "parenting", "bonding", "happy fathers day"]
      },
      {
        topic: "Independence Day / 4th of July",
        targetMonth: "Target: July",
        description: "US market heavily purchases patriotic red-white-and-blue, fireworks, and outdoor grilling imagery.",
        actionGuide: "Sparklers in dusk lighting, patriotic barbecue platters, flag decorations, and picnic blankets on green grass.",
        bestFor: "Photos & Patriotic Vectors",
        keywords: ["fourth of july", "independence day", "patriotic", "fireworks", "bbq grill", "american flag"]
      },
      {
        topic: "Back-to-School Early Sourcing",
        targetMonth: "Target: July-August",
        description: "Publishers and major retailers begin buying school supplies and classroom visuals starting in May/June.",
        actionGuide: "Bright flat-lays with backpacks, crayons, rulers, pencil cases, and modern classroom desks.",
        bestFor: "Flat-lays, Vectors & Icons",
        keywords: ["back to school", "school supplies", "stationery", "classroom", "student backpack", "education"]
      }
    ]
  },
  may: {
    monthName: "May",
    bengaliName: "মে",
    monthOverview: "May is centered around Mother's Day, Memorial Day weekend, kickoff to summer vacation, wedding season celebrations, and college graduations.",
    whatToCreate: [
      "Mother's Day Tributes: Emotional portraits of mothers, pampering breakfasts, gift shopping, hugs, and generational family bonds.",
      "Memorial Day & Summer Kickoff BBQ: Grilling hotdogs and steaks on open charcoal grill, cold drinks in ice cooler, and backyard games.",
      "Graduation Ceremonies: Proud graduates holding diplomas, caps thrown in air, congratulations banners, and celebratory parties.",
      "Wedding Elegance: Outdoor garden weddings, bridal bouquets, cutting tiered wedding cake, and champagne flutes toast.",
      "Summer Travel Preparation: Packing suitcases, boarding pass and passport flat-lays, beach towels, sunglasses, and cameras."
    ],
    currentTrends: [
      {
        topic: "Mother's Day Appreciation & Gifting",
        description: "Massive commercial demand for heartfelt maternal relationships, gifts, floral bouquets, and Mother's Day cards.",
        actionGuide: "Tender, authentic moments: child presenting handmade breakfast or flowers to smiling mom, multi-generational portraits.",
        bestFor: "Photos, Vectors & Social Banners",
        keywords: ["mothers day", "mom gift", "motherhood", "family love", "flower bouquet", "happy mothers day"]
      },
      {
        topic: "Backyard BBQ & Outdoor Entertaining",
        description: "Summer entertaining kicks off: charcoal grills, burgers, patio furniture, string lights, and cheerful dinner parties.",
        actionGuide: "Appetizing sizzle shots of burgers on grill grates, smoke rising, friends laughing around a rustic wooden picnic table.",
        bestFor: "Food & Lifestyle Photos",
        keywords: ["barbecue", "bbq grill", "cookout", "summer party", "patio dining", "grilling burgers", "outdoor dinner"]
      },
      {
        topic: "Graduation Milestones & Academic Celebrations",
        description: "Schools, universities, and families sourcing cap and gown portraits, diploma presentations, and celebration parties.",
        actionGuide: "Dynamic motion shots of smiling grads tossing caps into blue sky, close-up of ribbon-tied diploma, proud family embraces.",
        bestFor: "Photos & Vector Templates",
        keywords: ["graduation", "college graduate", "mortarboard", "diploma", "class of 2026", "graduation party"]
      },
      {
        topic: "Wedding Season & Bridal Beauty",
        description: "Surge in wedding invitations, bridal fashion, rings, luxury table settings, and destination wedding imagery.",
        actionGuide: "Intimate details: bride putting on veil, rings on velvet box, elegant flower centerpieces, and romantic sunset couples.",
        bestFor: "Wedding Photos & Elegant Vectors",
        keywords: ["wedding", "bride and groom", "wedding rings", "bridal bouquet", "wedding reception", "marriage"]
      }
    ],
    upcomingTrends: [
      {
        topic: "Pride Month & LGBTQ+ Diversity",
        targetMonth: "Target: June",
        description: "High corporate demand for inclusive LGBTQ+ community visuals, rainbow flags, pride parades, and authentic representation.",
        actionGuide: "Joyful, authentic portraits of LGBTQ+ individuals and couples, rainbow accents, pride festivals, and community love.",
        bestFor: "Photos, Vectors & Social Banners",
        keywords: ["pride month", "lgbtq", "rainbow flag", "diversity", "inclusion", "love is love", "pride parade"]
      },
      {
        topic: "Summer Vacations & Water Recreation",
        targetMonth: "Target: July",
        description: "Peak summer travel searches: watersports, paddleboarding, swimming, beach cabanas, and sunbathing.",
        actionGuide: "Vibrant blue tones, water splashes, stand-up paddleboarding, kids diving into clear pool water, sunscreen lotion.",
        bestFor: "Action Photos & Travel Video",
        keywords: ["summer vacation", "water sports", "paddleboarding", "beach day", "swimming pool", "summer sun"]
      },
      {
        topic: "Back to School Mega Campaign Assets",
        targetMonth: "Target: August",
        description: "Stock buyers download millions of school, college, and stationery assets ahead of August/September.",
        actionGuide: "Color-coordinated flat-lays of backpacks, pencils, stationery, calculators, and kids smiling with school bags.",
        bestFor: "Photos, Flat-lays & Vectors",
        keywords: ["back to school", "school supplies", "stationery set", "elementary school", "student life", "education"]
      },
      {
        topic: "Autumn Harvest & Fall Preview",
        targetMonth: "Target: September",
        description: "Editorial magazines and food brands prepare autumn editorial shoots 3 months in advance.",
        actionGuide: "Warm golden tones, rustic baskets with apples and pumpkins, cozy knit blankets, and early autumn leaves.",
        bestFor: "Photos & Seasonal Patterns",
        keywords: ["autumn harvest", "fall leaves", "pumpkin", "apple picking", "autumn preview", "cozy autumn"]
      }
    ]
  },
  june: {
    monthName: "June",
    bengaliName: "জুন",
    monthOverview: "June brings Father's Day, Pride Month celebrations, Summer Solstice, school vacation, and beach travel. Buyers are hungry for vibrant outdoor, sunny, and joyful human connections.",
    whatToCreate: [
      "Modern Fatherhood: Hands-on fathers playing with kids, teaching life skills, cooking, piggyback rides, and emotional hugs.",
      "Pride & Inclusivity: Rainbow flags, diverse couples, queer artists, pride marches, and corporate diversity campaigns.",
      "Summer Solstice & Beach Life: Sunbathing on tropical sand, ocean waves, sunglasses, beach umbrellas, and refreshing cocktails.",
      "Kids Summer Camps: Campfires, roasting marshmallows, pitching tents in woods, stargazing, and outdoor nature exploration.",
      "Summer Food & Refreshments: Watermelon slices, ice cream cones dripping in sun, lemonade pitchers, and fruit popsicles."
    ],
    currentTrends: [
      {
        topic: "Father's Day Love & Everyday Dads",
        description: "Celebration of involved, loving fathers across different cultures, parenting styles, and family structures.",
        actionGuide: "Show genuine warmth: dad helping child with bicycle, laughing on shoulders, reading bedtime story, or baking in kitchen.",
        bestFor: "Lifestyle Photos & Card Vectors",
        keywords: ["fathers day", "dad and child", "fatherhood", "family love", "happy fathers day", "parenting", "dad"]
      },
      {
        topic: "Pride Month & Authentic Equality",
        description: "Major corporate and media demand for authentic LGBTQ+ representation, celebrations, and advocacy.",
        actionGuide: "Avoid stereotypical props; emphasize real couples, joy, friendship, pride banners, and genuine community togetherness.",
        bestFor: "Photos, Vectors & Badges",
        keywords: ["pride month", "lgbtq pride", "rainbow flag", "equality", "diversity", "pride celebration", "authentic"]
      },
      {
        topic: "Summer Beach Holidays & Tropical Travel",
        description: "Travel brands and airlines buying imagery of turquoise oceans, white sand, resort pools, and palm trees.",
        actionGuide: "Bright sunny lighting, high-contrast blues and golds, aerial drone views of coastlines, and beachgoers relaxing.",
        bestFor: "Photos, Drone Shots & Vectors",
        keywords: ["summer beach", "tropical paradise", "ocean vacation", "sunbathing", "resort pool", "palm trees", "summer vibe"]
      },
      {
        topic: "Summer Treats & Frozen Refreshments",
        description: "High demand for food and beverage stock: popsicles, gourmet ice cream, iced coffee, and cold watermelon.",
        actionGuide: "Macro shots of condensation on cold glass bottles, dripping colorful ice cream scoops, and fresh citrus slices.",
        bestFor: "Food Photography & Vectors",
        keywords: ["ice cream", "cold lemonade", "watermelon", "summer food", "frozen treat", "fruit popsicle", "refreshing drink"]
      }
    ],
    upcomingTrends: [
      {
        topic: "Back to School Peak Campaign",
        targetMonth: "Target: August-September",
        description: "Retail and advertising buyers enter peak buying cycle for classroom scenes, tech in education, and school gear.",
        actionGuide: "Children walking into school building, diverse students using laptops, teachers interacting, and neat desk arrangements.",
        bestFor: "Photos, Vectors & Icon Packs",
        keywords: ["back to school", "school bus", "classroom learning", "education tech", "teacher student", "schoolbag"]
      },
      {
        topic: "Autumn Cozy Lifestyle & Fall Foliage",
        targetMonth: "Target: September-October",
        description: "Commercial campaigns preparing for fall fashion, pumpkin spice, wool sweaters, and autumn leaves.",
        actionGuide: "Warm golden palettes, walking on trails covered in red-orange leaves, holding steaming mugs with warm knit sleeves.",
        bestFor: "Photos & Autumn Patterns",
        keywords: ["autumn foliage", "fall fashion", "cozy knit", "pumpkin spice", "golden hour", "autumn walk"]
      },
      {
        topic: "Halloween Spooky & Fun Concepts",
        targetMonth: "Target: October",
        description: "Major upload window! Contributors must upload Halloween designs by June/July to rank in top search results by October.",
        actionGuide: "Carved jack-o'-lanterns, spooky silhouettes, haunted castles, trick-or-treat candy flat-lays, and costume parties.",
        bestFor: "Vectors, AI Art & Photos",
        keywords: ["halloween", "jack o lantern", "pumpkin", "spooky", "trick or treat", "halloween party", "costume"]
      },
      {
        topic: "Black Friday & E-Commerce Mega Sales",
        targetMonth: "Target: November",
        description: "Global retailers begin compiling e-commerce sale banners, shopping carts, discount tags, and mobile checkout visuals.",
        actionGuide: "3D render discount percentage tags (50% OFF, Black Friday), hands holding shopping bags, credit card payment terminal.",
        bestFor: "3D Renders, Vectors & Photos",
        keywords: ["black friday", "cyber monday", "online shopping", "sale banner", "discount tag", "shopping bags"]
      }
    ]
  },
  july: {
    monthName: "July",
    bengaliName: "জুলাই",
    monthOverview: "July is mid-summer peak: 4th of July celebrations, water sports, outdoor cookouts, and intense advance buying for Back-to-School and early Autumn.",
    whatToCreate: [
      "Independence Day (4th of July): Sparklers at twilight, American flag decor, red-white-blue cupcakes, and fireworks in night sky.",
      "Water Sports & Swimming: Surfboarding, paddleboarding, kids jumping into lake, snorkeling, and refreshing poolside relaxation.",
      "Back to School Production: Clean school backpacks, colored pencils, notebooks, school lockers, and children excited for first day.",
      "Hydration & Summer Produce: Cold sliced watermelon, iced matcha latte, berry smoothies, and local farmer's market stalls.",
      "Early Halloween & Autumn Vectors: Pumpkin patches, spooky graphics, autumn leaf borders, and cozy sweater illustrations."
    ],
    currentTrends: [
      {
        topic: "4th of July / American Independence Day",
        description: "Heavy US market buying of patriotic cookouts, fireworks displays, sparklers, and star-spangled decorations.",
        actionGuide: "Long exposure shots of sparklers writing in air, patriotic bunting on porch, picnic tables with barbecue platters.",
        bestFor: "Photos & Patriotic Vector Art",
        keywords: ["4th of july", "independence day", "sparkler", "fireworks", "patriotic", "american flag", "summer bbq"]
      },
      {
        topic: "Peak Water Recreation & Swimming Pools",
        description: "Inflatable pool toys (flamingos, donuts), clear blue water ripples, swimming goggles, and underwater photography.",
        actionGuide: "Overhead drone angles of turquoise swimming pools, splashes frozen with fast shutter speed, and children laughing.",
        bestFor: "Photos & Drone Video",
        keywords: ["swimming pool", "pool float", "water splash", "swimming", "summer fun", "diving", "pool party"]
      },
      {
        topic: "Farmer's Market & Fresh Summer Harvest",
        description: "Consumers buying local: organic heirloom tomatoes, fresh peaches, berries, rustic wooden crates, and artisan bread.",
        actionGuide: "Shoppers interacting with farm stall vendors, burlap bags filled with colorful fresh veggies, warm natural sunlight.",
        bestFor: "Photos & Food Vectors",
        keywords: ["farmers market", "organic vegetables", "fresh fruit", "local produce", "healthy food", "market stall"]
      },
      {
        topic: "Camping, Hiking & Wilderness Adventures",
        description: "Surge in downloads for outdoor recreation, campfires, tents under starry skies, and backpacking along scenic ridgelines.",
        actionGuide: "Campers roasting marshmallows over golden flames, silhouettes of hikers at sunrise, compass on topographic map.",
        bestFor: "Adventure Photos & Badges",
        keywords: ["camping", "backpacking", "tent camping", "campfire", "hiking trail", "wilderness", "outdoor adventure"]
      }
    ],
    upcomingTrends: [
      {
        topic: "Back to School Classroom Realities",
        targetMonth: "Target: August-September",
        description: "Highest demand season for education imagery: STEM labs, arts and crafts, school buses, and campus socialization.",
        actionGuide: "Authentic multi-ethnic classrooms, hands raising in answer, teacher helping at desk, digital tablet learning.",
        bestFor: "Photos, Flat-lays & Vectors",
        keywords: ["back to school", "classroom learning", "education", "student life", "elementary student", "school desk"]
      },
      {
        topic: "Halloween & Fall Harvest Themes",
        targetMonth: "Target: October",
        description: "Peak submission period! Upload Halloween assets now to allow search indexing before buyers make final purchases.",
        actionGuide: "Carved jack-o'-lanterns on rustic porches, spider web patterns, trick-or-treat buckets, haunted forest backgrounds.",
        bestFor: "Vectors, AI Art & Photos",
        keywords: ["halloween", "pumpkin carving", "jack o lantern", "haunted house", "trick or treat", "autumn harvest"]
      },
      {
        topic: "Thanksgiving & Autumn Family Dinners",
        targetMonth: "Target: November",
        description: "Commercial food and lifestyle brands sourcing roasted turkey, autumn tablescapes, and family gratitude scenes.",
        actionGuide: "Golden roasted turkey on platter, cranberry sauce, pumpkin pies, hands passing dishes around a candlelit table.",
        bestFor: "Food Photography & Vectors",
        keywords: ["thanksgiving", "roast turkey", "thanksgiving dinner", "family feast", "autumn table", "grateful"]
      },
      {
        topic: "Winter Holidays & Christmas Preview",
        targetMonth: "Target: December",
        description: "Agencies begin buying Christmas and holiday assets starting in August/September. Start designing holiday content now!",
        actionGuide: "Evergreen fir branches, golden Christmas balls, warm twinkling fairy lights, wrapped gift boxes with ribbon.",
        bestFor: "Vectors, 3D Art & Photos",
        keywords: ["christmas", "holiday background", "christmas ornament", "winter holiday", "gift box", "xmas"]
      }
    ]
  },
  august: {
    monthName: "August",
    bengaliName: "আগস্ট",
    monthOverview: "August is the Back-to-School super-month, end-of-summer travel clearances, and the critical time to upload Autumn, Halloween, and Black Friday content.",
    whatToCreate: [
      "Back to School & Campus: Modern classrooms, kids boarding yellow school bus, university campuses, and digital classroom tablets.",
      "Teacher & Education Tools: Teachers grading papers, blackboard equations, STEM robotic kits, science beakers, and art supplies.",
      "Late Summer Harvest: Golden wheat fields at sunset, apple picking, sunflowers, ripe grapes, and wine harvest.",
      "Autumn Fashion & Cozy Knits: Early fall layering, trench coats, ankle boots, wool cardigans, and holding warm mugs.",
      "Halloween & Thanksgiving Vectors: Pumpkin illustrations, Thanksgiving dinner layouts, Black Friday 3D sale banners."
    ],
    currentTrends: [
      {
        topic: "Back to School Rush & Classroom Life",
        description: "The biggest commercial search category of August: pencils, backpacks, students, teachers, and school supplies.",
        actionGuide: "Bright, energetic colors. Capture excited first-graders, high schoolers in hallway lockers, and university students on campus lawn.",
        bestFor: "Photos, Flat-lays & Icon Sets",
        keywords: ["back to school", "school supplies", "classroom", "student life", "education", "teacher", "schoolbag"]
      },
      {
        topic: "STEM & Digital Learning in Education",
        description: "Schools and EdTech platforms demanding visuals of coding, robotics, 3D printing, and science lab experiments.",
        actionGuide: "Students wearing safety goggles assembling small robots, coding on laptops, peering through microscopes.",
        bestFor: "Photos & Tech Vectors",
        keywords: ["stem education", "robotics", "coding for kids", "science experiment", "chemistry lab", "edtech"]
      },
      {
        topic: "Golden Hour Harvest & Sunflower Fields",
        description: "Surge in demand for blooming sunflowers, golden grain fields, farm tractors harvesting, and late summer sunlight.",
        actionGuide: "Shoot during magical hour: golden light catching sunflowers, hands brushing wheat heads, tractors kicking up dust.",
        bestFor: "Landscape & Agricultural Photos",
        keywords: ["sunflower field", "wheat harvest", "golden hour", "agriculture", "late summer", "farm harvest"]
      },
      {
        topic: "Labor Day & End of Summer Celebrations",
        description: "Long weekend travel, lake house relaxation, boat rentals, and final summer outdoor barbecues.",
        actionGuide: "Friends jumping off wooden lake dock, relaxing in Adirondack chairs, cold beer bottles, and sunset boat cruises.",
        bestFor: "Lifestyle Photos & Video",
        keywords: ["labor day", "lake house", "boat cruise", "summer farewell", "dock jump", "vacation relaxation"]
      }
    ],
    upcomingTrends: [
      {
        topic: "Halloween & Spooky Season Peak Demand",
        targetMonth: "Target: October",
        description: "Buyers are finalizing Halloween ad campaigns, candy packaging, social media graphics, and event posters.",
        actionGuide: "Carved jack-o'-lanterns glowing in darkness, kids in vampire and witch costumes, haunted mansion vector art.",
        bestFor: "Vectors, AI Art & Photos",
        keywords: ["halloween", "jack o lantern", "spooky night", "trick or treat", "halloween costume", "haunted house"]
      },
      {
        topic: "Thanksgiving & Fall Gathering Traditions",
        targetMonth: "Target: November",
        description: "High commercial demand for autumn harvest tables, grateful families, roasted turkeys, and cozy dining.",
        actionGuide: "Rustic farm tables decorated with miniature pumpkins, roasted turkey, gravy boats, and warm wine glasses.",
        bestFor: "Food Photography & Vectors",
        keywords: ["thanksgiving", "thanksgiving feast", "roast turkey", "fall harvest", "family dinner", "pumpkin pie"]
      },
      {
        topic: "Black Friday & Cyber Week E-Commerce",
        targetMonth: "Target: November",
        description: "Massive rush for sales banners, discount badges (30%, 50%, 70% off), shopping carts, and delivery boxes.",
        actionGuide: "Glossy 3D render banners with golden chrome text 'BLACK FRIDAY', hands tapping 'Buy Now' on smartphones.",
        bestFor: "3D Renders, Vectors & Photos",
        keywords: ["black friday", "cyber monday", "mega sale", "discount badge", "online shopping", "ecommerce"]
      },
      {
        topic: "Christmas & Holiday Seasonal Assets",
        targetMonth: "Target: December",
        description: "Every major brand is preparing holiday catalogs and packaging. Christmas assets uploaded now will rank prime.",
        actionGuide: "Festive red and gold backgrounds, decorated fir trees, wrapped gifts with satin ribbons, holiday greeting cards.",
        bestFor: "Vectors, 3D Art & Photos",
        keywords: ["christmas", "merry christmas", "holiday decoration", "christmas tree", "gift box", "winter holidays"]
      }
    ]
  },
  september: {
    monthName: "September",
    bengaliName: "সেপ্টেম্বর",
    monthOverview: "September ushers in Autumn, Oktoberfest beer festivals, the Halloween countdown, flu/health season prep, and intense Q4 corporate goal planning.",
    whatToCreate: [
      "Autumn Foliage & Lifestyle: Forest trails blanketed with maple leaves, pumpkin spice drinks, wool blankets, and leather boots.",
      "Oktoberfest & Craft Beer: Foamy beer steins, salted pretzels, Bavarian lederhosen, and lively festival tavern atmospheres.",
      "Halloween Creative Assets: Jack-o'-lanterns, spooky silhouettes, skeleton art, candy bags, and haunted castle illustrations.",
      "Q4 Corporate Planning & Tech: Corporate boardrooms strategizing year-end targets, data analytics dashboards, and tech conferences.",
      "Seasonal Healthcare & Flu Shots: Pharmacist administering vaccination, senior health checkup, immune boosting vitamins, and tea."
    ],
    currentTrends: [
      {
        topic: "Autumn Leaves & Cozy Fall Aesthetics",
        description: "Skyrocketing searches for vibrant orange, red, and gold autumn leaves, cozy knitwear, and scenic forest walks.",
        actionGuide: "Use warm color grading. Capture people walking through leaf-strewn parks, kicking leaves, and sipping warm lattes.",
        bestFor: "Photos & Autumn Patterns",
        keywords: ["autumn leaves", "fall season", "cozy autumn", "pumpkin spice", "fall foliage", "sweater weather", "nature"]
      },
      {
        topic: "Oktoberfest & Craft Beer Culture",
        description: "Breweries, restaurants, and event organizers downloading beer toasts, Bavarian pretzels, and lively celebrations.",
        actionGuide: "Clinking glass beer mugs with frothy foam spilling, giant baked pretzels with coarse salt, warm wooden pub tables.",
        bestFor: "Food Photography & Vectors",
        keywords: ["oktoberfest", "beer festival", "beer mug", "pretzels", "craft beer", "cheers", "bavarian"]
      },
      {
        topic: "Halloween Preparation & Costumes",
        description: "Retailers, schools, and bloggers actively sourcing jack-o'-lanterns, costume parties, and spooky graphics.",
        actionGuide: "Families carving pumpkins together on newspaper, whimsical ghost illustrations, candy corn flat-lays, and dark mood lighting.",
        bestFor: "Photos, Vectors & AI Art",
        keywords: ["halloween", "pumpkin carving", "jack o lantern", "spooky", "trick or treat", "candy corn", "costume"]
      },
      {
        topic: "Q4 Corporate Kickoff & Strategic Sprints",
        description: "Enterprises focusing on hitting annual targets, financial audits, closing sales deals, and leadership townhalls.",
        actionGuide: "Business leaders presenting in front of data charts, diverse colleagues cheering team milestone, office teamwork.",
        bestFor: "Corporate Photos & Vectors",
        keywords: ["q4 business", "year end goals", "corporate strategy", "business meeting", "financial growth", "team success"]
      }
    ],
    upcomingTrends: [
      {
        topic: "Thanksgiving Day Family Dinners",
        targetMonth: "Target: November",
        description: "Publishers and supermarkets buying imagery of roast turkeys, stuffing, gratitude, and warm festive family tables.",
        actionGuide: "Generations gathered around a richly set dining table, hands joined in gratitude, steam rising from roast dishes.",
        bestFor: "Photos & Vector Cards",
        keywords: ["thanksgiving", "roast turkey", "thanksgiving dinner", "family meal", "autumn feast", "gratitude"]
      },
      {
        topic: "Black Friday & Cyber Monday Madness",
        targetMonth: "Target: November",
        description: "The biggest shopping event of the year! Advertisers need sale tags, 3D typography, shopping bags, and online carts.",
        actionGuide: "Create eye-catching 3D sale badges, high-contrast dark backgrounds with neon or gold lettering, delivery parcels.",
        bestFor: "3D Renders, Vectors & Photos",
        keywords: ["black friday", "cyber monday", "super sale", "discount 50", "ecommerce shopping", "shopping cart"]
      },
      {
        topic: "Christmas Season Magic & Festive Joy",
        targetMonth: "Target: December",
        description: "Peak buying starts now! Christmas trees, Santa Claus, wrapped presents, glittering lights, and holiday baking.",
        actionGuide: "Warm, cozy interiors with glowing fireplace and sparkling Christmas tree, kids unwrapping gifts, holiday cookies.",
        bestFor: "Photos, Vectors & AI Art",
        keywords: ["christmas", "xmas tree", "holiday gift", "santa claus", "winter holiday", "christmas lights", "festive"]
      },
      {
        topic: "New Year Countdown & Resolution Previews",
        targetMonth: "Target: January",
        description: "Health clubs, publishers, and financial apps begin assembling New Year resolution and celebration assets.",
        actionGuide: "Champagne flutes with bubbles, golden 2027 balloons, midnight clock hands, and fitness planning journals.",
        bestFor: "Photos & Vector Art",
        keywords: ["new year", "champagne toast", "new year resolution", "celebration party", "2027", "countdown"]
      }
    ]
  },
  october: {
    monthName: "October",
    bengaliName: "অক্টোবর",
    monthOverview: "October is peak Halloween sales, Breast Cancer Awareness Month, Diwali celebrations, Thanksgiving preparations, and the start of heavy Christmas shopping asset procurement.",
    whatToCreate: [
      "Halloween Extravaganza: Jack-o'-lanterns, spooky haunted houses, trick-or-treating kids in costume, and skull candy flat-lays.",
      "Breast Cancer Awareness: Pink ribbons, supportive women hugging, oncologists consulting patients, and charity marathons.",
      "Diwali (Festival of Lights): Glowing clay diyas, vibrant rangoli floral patterns, traditional ethnic attire, and sparkling sweets.",
      "Thanksgiving Food & Table Settings: Plump pumpkins, roasted turkey, cranberry sauce, pecan pies, and rustic table centerpieces.",
      "Christmas & Winter Holiday Design: Start uploading high-demand Christmas vectors, 3D holiday balls, and snowy winter landscapes."
    ],
    currentTrends: [
      {
        topic: "Halloween Night & Spooky Celebrations",
        description: "Peak downloads for Halloween party invites, eerie backgrounds, trick-or-treating, and pumpkin displays.",
        actionGuide: "Atmospheric fog, dramatic side-lighting on glowing jack-o'-lanterns, kids smiling in costumes, cobweb vectors.",
        bestFor: "Photos, Vectors & Generative AI",
        keywords: ["halloween", "jack o lantern", "spooky", "haunted house", "trick or treat", "costume party", "ghost"]
      },
      {
        topic: "Breast Cancer Awareness & Pink Ribbon",
        description: "Medical clinics, non-profits, and media sourcing pink ribbon symbols, oncology consultations, and survivor stories.",
        actionGuide: "Emphasize dignity and hope: diverse women wearing pink ribbons, warm physician hand holds, charity fun-run runners.",
        bestFor: "Photos & Awareness Vectors",
        keywords: ["breast cancer awareness", "pink ribbon", "womens health", "oncology", "cancer survivor", "support group"]
      },
      {
        topic: "Diwali - Festival of Lights",
        description: "Global celebrations of Diwali: clay diya lamps, colorful rangoli floor art, Indian sweets, and festive firecrackers.",
        actionGuide: "Rich golden and warm light: glowing oil lamps in hands, colorful marigold garlands, families in traditional festive dress.",
        bestFor: "Photos & Cultural Vector Art",
        keywords: ["diwali", "deepavali", "diya lamp", "festival of lights", "rangoli", "indian festival", "sweets"]
      },
      {
        topic: "Autumn Harvest & Pumpkin Patch Fun",
        description: "Families visiting pumpkin patches, picking pumpkins, hayrides, and apple cider tasting on crisp sunny days.",
        actionGuide: "Children sitting among orange pumpkins in muddy boots, rustic farm barns, flannel shirts, and golden corn stalks.",
        bestFor: "Family Lifestyle Photos",
        keywords: ["pumpkin patch", "fall harvest", "apple picking", "family farm", "hayride", "autumn weekend", "pumpkin"]
      }
    ],
    upcomingTrends: [
      {
        topic: "Thanksgiving & Gratitude Feasts",
        targetMonth: "Target: November",
        description: "Rush of food blogs, supermarkets, and greeting cards buying Thanksgiving meals and family gatherings.",
        actionGuide: "Overhead flat-lays of roasted turkey, sweet potato casseroles, pumpkin pies, and hands sharing food dishes.",
        bestFor: "Food Photos & Vector Cards",
        keywords: ["thanksgiving", "thanksgiving feast", "roast turkey", "autumn harvest", "family dinner", "gratitude"]
      },
      {
        topic: "Black Friday & Cyber Monday E-Commerce",
        targetMonth: "Target: November",
        description: "E-commerce platforms everywhere run massive Black Friday campaigns. Clean banners and sales badges needed.",
        actionGuide: "Bold 3D typography ('50% OFF', 'BLACK FRIDAY'), shopping carts piled high with parcels, smartphone checkout.",
        bestFor: "3D Renders, Vectors & Photos",
        keywords: ["black friday", "cyber monday", "sale discount", "shopping spree", "ecommerce", "special offer"]
      },
      {
        topic: "Christmas Magic & Holiday Festivities",
        targetMonth: "Target: December",
        description: "The absolute biggest revenue generator for microstock contributors! Upload Christmas content in volume now.",
        actionGuide: "Decorated pine trees, Santa hats, wrapped presents with glistening ribbon, holiday baking, and snowy cottages.",
        bestFor: "Vectors, 3D Art & Photos",
        keywords: ["christmas", "xmas tree", "santa claus", "holiday gift", "merry christmas", "winter wonderland", "festive"]
      },
      {
        topic: "New Year 2027 Countdown & Party Glam",
        targetMonth: "Target: December-January",
        description: "Parties, nightclubs, and television broadcasts buying champagne cheers, gold foil numbers, and confetti.",
        actionGuide: "Golden confetti falling on happy celebrating crowd, champagne cork popping with foam, elegant evening attire.",
        bestFor: "Party Photos & Vector Banners",
        keywords: ["new year eve", "champagne toast", "2027 celebration", "confetti party", "new year countdown", "midnight"]
      }
    ]
  },
  november: {
    monthName: "November",
    bengaliName: "নভেম্বর",
    monthOverview: "November is packed with Thanksgiving, Black Friday & Cyber Monday shopping madness, Movember men's health, and the biggest stock buying wave for Christmas.",
    whatToCreate: [
      "Black Friday & Shopping Frenzy: 3D render discount banners, bursting shopping carts, courier delivery packages, and mobile sales.",
      "Thanksgiving Feast: Golden roasted turkey, pumpkin pies, autumn centerpieces, diverse multigenerational family dinners.",
      "Christmas Tree & Holiday Warmth: Decorating fir tree with shiny baubles, wrapping gifts, stringing warm lights, and Christmas stockings.",
      "Cozy Winter Indoors: Hot cocoa with fluffy marshmallows, burning fireplace, knitted wool socks, and foggy snowy windows.",
      "Movember & Men's Health: Mustaches, male grooming, men's mental health discussions, barber shop haircuts, and wellness."
    ],
    currentTrends: [
      {
        topic: "Black Friday & Cyber Monday Mega Sales",
        description: "The largest e-commerce shopping week of the year. Unprecedented demand for sale banners, ads, and shopping icons.",
        actionGuide: "Create high-converting 3D render typography ('BLACK FRIDAY SALE', 'SPECIAL DEAL'), parcel delivery vans, and shopping bags.",
        bestFor: "3D Renders, Vectors & Photos",
        keywords: ["black friday", "cyber monday", "black friday sale", "discount banner", "online shopping", "ecommerce", "promo"]
      },
      {
        topic: "Thanksgiving Family Traditions & Feasts",
        description: "Holiday gatherings, gratitude toasts, carving the roasted turkey, and autumn dessert platters.",
        actionGuide: "Warm, inviting lighting. Focus on genuine emotion: laughter at the table, multigenerational hands passing dishes.",
        bestFor: "Photos & Feast Vectors",
        keywords: ["thanksgiving", "thanksgiving feast", "roast turkey", "family dinner", "gratitude", "pumpkin pie", "harvest"]
      },
      {
        topic: "Christmas Holiday Commercial Buying Peak",
        description: "Stock buyers purchase the bulk of their Christmas commercial visuals during November.",
        actionGuide: "Crisp, clean lighting on evergreen branches, glossy red and gold Christmas ornaments, wrapped presents, and cookies for Santa.",
        bestFor: "Photos, Vectors & Patterns",
        keywords: ["christmas", "xmas background", "christmas tree", "wrapped gifts", "holiday decoration", "festive season"]
      },
      {
        topic: "Movember & Men's Health Awareness",
        description: "Men's health campaigns focusing on prostate cancer, testicular cancer, mental health, and grooming.",
        actionGuide: "Classic mustache portraits, men conversing openly with counselors, barber shop straight-razor shaves.",
        bestFor: "Portraits & Grooming Vectors",
        keywords: ["movember", "mens health", "mustache", "barber shop", "mens mental health", "grooming", "beard"]
      }
    ],
    upcomingTrends: [
      {
        topic: "Christmas Eve & Holiday Morning Joy",
        targetMonth: "Target: December",
        description: "Last-minute rush for holiday social posts, family gift opening, and seasonal greeting cards.",
        actionGuide: "Children racing down stairs in pajamas to open gifts, Christmas stockings hung on mantle, fireplace glow.",
        bestFor: "Photos & Card Vectors",
        keywords: ["christmas morning", "gift opening", "christmas eve", "pajamas", "christmas tree", "family holiday"]
      },
      {
        topic: "New Year 2027 Countdown & Party Glow",
        targetMonth: "Target: December-January",
        description: "Nightclubs, party venues, and corporate events sourcing confetti, sparklers, and celebratory champagne.",
        actionGuide: "Sparkling bokeh, golden disco balls, cheers with champagne flutes, clock striking twelve midnight.",
        bestFor: "Photos & Glamour Vectors",
        keywords: ["new year eve", "countdown", "champagne", "midnight party", "confetti", "happy new year 2027"]
      },
      {
        topic: "New Year Health, Fitness & Diet Reset",
        targetMonth: "Target: January",
        description: "Gyms, diet companies, and health apps buy fitness and resolution content throughout December.",
        actionGuide: "Clean running shoes on asphalt, water bottle, measuring tape on green apple, dumbbell workout, and fresh smoothies.",
        bestFor: "Photos & Wellness Vectors",
        keywords: ["fitness reset", "new year resolution", "gym workout", "healthy diet", "weight loss", "active lifestyle"]
      },
      {
        topic: "Tax Preparation & Corporate Planning",
        targetMonth: "Target: January-February",
        description: "Accountants and corporate agencies start assembling Q1 visuals, tax calculators, and business review charts.",
        actionGuide: "Calculator with receipts, tax form paperwork, financial graphs showing upward growth, diverse business teams.",
        bestFor: "Corporate Photos & Vectors",
        keywords: ["tax season", "budgeting", "financial audit", "q1 business", "accounting", "corporate planning"]
      }
    ]
  },
  december: {
    monthName: "December",
    bengaliName: "ডিসেম্বর",
    monthOverview: "December is the holiday climax: Christmas Day, Hanukkah, Boxing Day, New Year's Eve, and the immediate pivot to January fitness resolutions and tax season.",
    whatToCreate: [
      "Christmas Day Celebrations: Kids unwrapping presents in pajamas, decorated evergreen trees, family feasts, gingerbread houses, and Santa.",
      "New Year's Eve Parties: Clinking champagne glasses, gold confetti explosions, 2027 foil balloons, sparklers, and festive dresses.",
      "Winter Wonderland & Snow: Snow-covered fir trees, skiing down slopes, building snowmen, sledding, and ice skating on outdoor rinks.",
      "January Fitness Resolutions: Dumbbells, running shoes, healthy salad bowls, yoga mats, habit trackers, and smart health watches.",
      "Corporate Annual Review & Goal Setting: Business growth charts, annual reports, celebration toasts, and strategic planners."
    ],
    currentTrends: [
      {
        topic: "Christmas Magic & Festive Family Celebrations",
        description: "The peak holiday celebration: gift unwrapping, festive lights, gingerbread baking, and holiday meals.",
        actionGuide: "Capture raw emotional joy: children's faces lighting up at gifts, baking cookies together, hands holding hot cocoa.",
        bestFor: "Photos, Vectors & Video Clips",
        keywords: ["christmas", "merry christmas", "christmas morning", "gift unwrapping", "christmas tree", "holiday cheer", "family holiday"]
      },
      {
        topic: "New Year's Eve 2027 Countdown & Glamour",
        description: "High volume of downloads for party flyers, countdown promotions, luxury gold backgrounds, and champagne cheers.",
        actionGuide: "Golden confetti falling, champagne bubbles in flutes, glittering sequin dresses, sparklers held in hands at midnight.",
        bestFor: "Photos, 3D Renders & Vectors",
        keywords: ["new year eve", "countdown 2027", "champagne toast", "confetti party", "sparkler", "midnight celebration", "glamour"]
      },
      {
        topic: "Winter Wonderland & Snow Activities",
        description: "Scenic outdoor winter recreation: snow sports, frozen lakes, pine forests blanketed in fresh powder, and warm winter coats.",
        actionGuide: "Crisp cold light, blue shadows on pure white snow, breath mist visible in cold air, skiers carving through powder snow.",
        bestFor: "Landscape & Sports Photos",
        keywords: ["winter wonderland", "snow forest", "skiing", "snowboarding", "snowfall", "ice skating", "cold winter"]
      },
      {
        topic: "End of Year Financial & Corporate Review",
        description: "Business publications sourcing annual financial summaries, success celebrations, and corporate strategy.",
        actionGuide: "Executives giving presentations, corporate teams high-fiving over successful year-end results, tablet analytics charts.",
        bestFor: "Corporate Photos & Infographic Vectors",
        keywords: ["annual review", "year end business", "financial growth", "corporate success", "business team", "strategic plan"]
      }
    ],
    upcomingTrends: [
      {
        topic: "New Year Fitness Reset & Healthy Eating",
        targetMonth: "Target: January",
        description: "Surge in fitness apps, gyms, and wellness brands purchasing workout, yoga, and healthy meal prep content.",
        actionGuide: "Energetic morning workouts, runner on road, healthy green salads, water bottles, and smartwatch activity rings.",
        bestFor: "Photos & Wellness Vectors",
        keywords: ["fitness resolution", "workout", "healthy eating", "gym motivation", "weight loss", "activewear", "wellness"]
      },
      {
        topic: "Tax Preparation & Personal Finance",
        targetMonth: "Target: January-February",
        description: "Accounting firms, banks, and software platforms buying tax calculators, spreadsheets, and financial security imagery.",
        actionGuide: "Clean desk flat-lays with calculator, tax return forms, pen in hand, savings piggy bank, and laptop spreadsheets.",
        bestFor: "Photos & Finance Icons",
        keywords: ["tax season", "budgeting", "financial planning", "tax forms", "calculator", "accounting", "savings"]
      },
      {
        topic: "Valentine's Day Love & Romantic Gifts",
        targetMonth: "Target: February",
        description: "E-commerce and card publishers begin aggressive sourcing for Valentine's Day 6 weeks in advance.",
        actionGuide: "Romantic couples, heart jewelry, red roses, handcrafted Valentine greeting cards, and candlelit dinners.",
        bestFor: "Photos, Vectors & Patterns",
        keywords: ["valentines day", "romantic love", "gift box", "red roses", "heart shape", "date night", "love couple"]
      },
      {
        topic: "Spring Cleaning & Early Home Organization",
        targetMonth: "Target: February-March",
        description: "Decluttering, closet organization, deep house cleaning, and indoor plant care.",
        actionGuide: "Neatly folded linens, labeled pantry jars, organized closet shelving, and natural non-toxic cleaning sprays.",
        bestFor: "Photos & Organization Vectors",
        keywords: ["spring cleaning", "home organization", "decluttering", "tidy house", "closet storage", "clean home"]
      }
    ]
  }
};

export function findMonthlyTrends(query: string): MonthTrendDetail | null {
  if (!query) return null;
  const q = query.toLowerCase().trim();

  // English and Bengali mappings
  if (/jan(uary)?|জানু|জানুয়ারি/i.test(q)) return MONTHLY_TRENDS_KNOWLEDGE.january;
  if (/feb(ruary)?|ফেব্রু|ফেব্রুয়ারি/i.test(q)) return MONTHLY_TRENDS_KNOWLEDGE.february;
  if (/mar(ch)?|মার্চ/i.test(q)) return MONTHLY_TRENDS_KNOWLEDGE.march;
  if (/apr(il)?|এপ্রি|এপ্রিল/i.test(q)) return MONTHLY_TRENDS_KNOWLEDGE.april;
  if (/may|মে/i.test(q)) return MONTHLY_TRENDS_KNOWLEDGE.may;
  if (/jun(e)?|জুন/i.test(q)) return MONTHLY_TRENDS_KNOWLEDGE.june;
  if (/jul(y)?|জুলা|জুলাই/i.test(q)) return MONTHLY_TRENDS_KNOWLEDGE.july;
  if (/aug(ust)?|আগ|আগস্ট/i.test(q)) return MONTHLY_TRENDS_KNOWLEDGE.august;
  if (/sep(t|tember)?|সেপ্টে|সেপ্টেম্বর/i.test(q)) return MONTHLY_TRENDS_KNOWLEDGE.september;
  if (/oct(ober)?|অক্টো|অক্টোবর/i.test(q)) return MONTHLY_TRENDS_KNOWLEDGE.october;
  if (/nov(ember)?|নভে|নভেম্বর/i.test(q)) return MONTHLY_TRENDS_KNOWLEDGE.november;
  if (/dec(ember)?|ডিসে|ডিসেম্বর/i.test(q)) return MONTHLY_TRENDS_KNOWLEDGE.december;

  return null;
}
