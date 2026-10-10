import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Copy,
  Check,
  ArrowUpRight,
  SlidersHorizontal,
  Download,
  FileSpreadsheet,
  Sparkles,
  Layers,
  Filter,
  CheckCircle2,
  Bookmark,
  Plus,
  X,
} from 'lucide-react';

export interface GlobalStorePack {
  id: string;
  code: string;
  title: string;
  niche: string;
  department: 'business' | 'tech' | 'vector' | 'luxury' | 'lifestyle' | 'nature' | 'seasonal' | 'architecture';
  adobeCategory: string;
  adobeCategoryId: number;
  cpcEstimate: string;
  demandLevel: 'Very High' | 'High' | 'Breakout';
  image: string;
  recommendedTitle: string;
  shutterstockCaption: string;
  freepikTitle: string;
  gettyTitle: string;
  keywords: string[];
  midjourneyPrompt: string;
  vectorPrompt: string;
}

export const GLOBAL_COMMERCIAL_PACKS: GlobalStorePack[] = [
  {
    id: 'pack-01-fintech-security',
    code: 'VAULT-01',
    title: 'Biometric Fintech & Cloud Banking Security',
    niche: 'Fintech & Enterprise Security',
    department: 'business',
    adobeCategory: 'Business',
    adobeCategoryId: 3,
    cpcEstimate: '$5.80 CPC',
    demandLevel: 'Very High',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    recommendedTitle: 'Biometric Digital Banking Dashboard And Cloud Financial Security',
    shutterstockCaption: 'Close up of biometric digital banking analytics dashboard and encrypted cloud financial security interface for enterprise wealth management',
    freepikTitle: 'Biometric Fintech Banking Dashboard — Modern Financial Interface',
    gettyTitle: 'Conceptual B2B view of biometric digital banking dashboard and encrypted cloud security',
    keywords: [
      'fintech', 'digital banking', 'cyber security', 'wealth management', 'financial analytics',
      'biometric authentication', 'cloud computing', 'blockchain', 'encrypted data', 'enterprise software',
      'payment gateway', 'investment portfolio', 'stock market', 'corporate finance', 'data protection',
      'network firewall', 'online transaction', 'financial technology', 'business strategy', 'risk management',
      'artificial intelligence', 'predictive analytics', 'capital market', 'asset allocation', 'banking app',
      'smart contract', 'digital currency', 'economic growth', 'secure server', 'information security',
      'compliance', 'audit', 'financial advisor', 'revenue growth', 'dashboard interface',
      'data visualization', 'fintech innovation', 'global economy', 'b2b technology', 'modern business',
      'commercial finance', 'copy space', 'no people', 'high resolution', 'clean composition',
      'professional', 'trust', 'scalability', 'future finance'
    ],
    midjourneyPrompt: 'Minimalist executive fintech analytics glass tablet on warm travertine desk, glowing biometric security graph, subtle golden rim light, architectural shadows, generous copy space on right, shot on Hasselblad H6D 80mm f/2.8, photorealistic commercial stock photography --ar 16:9 --v 6.1',
    vectorPrompt: 'Clean isometric vector illustration of cloud banking firewall and biometric fintech shield, deep slate and champagne gold palette, scalable EPS 10 flat corporate vector graphic, isolated with clean copy space --no text, watermark'
  },
  {
    id: 'pack-02-ai-neural-cloud',
    code: 'VAULT-02',
    title: 'Enterprise Neural Network & Quantum Data Center',
    niche: 'Artificial Intelligence & Cloud',
    department: 'tech',
    adobeCategory: 'Technology',
    adobeCategoryId: 19,
    cpcEstimate: '$6.20 CPC',
    demandLevel: 'Breakout',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    recommendedTitle: 'Quantum Neural Network Processor And Enterprise Cloud Server Matrix',
    shutterstockCaption: 'Abstract visualization of quantum neural network processor nodes and enterprise cloud data center matrix with warm optical light trails',
    freepikTitle: 'Quantum Neural Network Processor — 3D Technology Background',
    gettyTitle: 'High-tech visualization of quantum neural network processor and enterprise cloud infrastructure',
    keywords: [
      'neural network', 'artificial intelligence', 'quantum computing', 'cloud infrastructure', 'data center',
      'machine learning', 'deep learning', 'microchip processor', 'big data', 'digital transformation',
      'cybernetics', 'server room', 'semiconductor', 'automation', 'algorithm',
      'high performance computing', 'network node', 'optical fiber', 'data transmission', 'information technology',
      'enterprise cloud', 'future technology', 'tech innovation', 'silicon wafer', 'hardware engineering',
      'cloud architecture', 'predictive model', 'generative ai', 'supercomputer', 'connected network',
      'cyber infrastructure', 'database server', 'system integration', 'smart technology', 'digital matrix',
      'global connectivity', 'bandwidth', 'IoT network', 'edge computing', 'tech background',
      'copy space', 'no people', 'studio lighting', 'macro photography', '3d render',
      'commercial tech', 'modern design', 'precision', 'scalability'
    ],
    midjourneyPrompt: 'Macro architectural close-up of a quantum silicon processor wafer with subtle warm gold optical fiber nodes, dark obsidian slate surface, shallow depth of field, clean negative space on left for typography, 8k octane commercial render --ar 16:9 --v 6.1',
    vectorPrompt: 'Minimalist geometric neural network node topology vector background, subtle gold and emerald connection lines on deep slate canvas, editable EPS 10 vector graphic for enterprise SaaS hero banner --no text'
  },
  {
    id: 'pack-03-luxury-podium-mockup',
    code: 'VAULT-03',
    title: 'Travertine Stone & Champagne Gold Product Podium',
    niche: '3D Podium & Luxury Packaging',
    department: 'luxury',
    adobeCategory: 'Graphic Resources',
    adobeCategoryId: 8,
    cpcEstimate: '$4.50 CPC',
    demandLevel: 'Very High',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    recommendedTitle: 'Minimalist Travertine Stone Product Podium With Warm Morning Sunlight',
    shutterstockCaption: 'Minimalist natural travertine stone cylinder podium with warm dappled morning sunlight and architectural palm shadows for luxury cosmetic product presentation',
    freepikTitle: 'Minimalist Travertine Stone Podium — 3D Product Mockup Background',
    gettyTitle: 'Minimalist architectural travertine stone product display podium in natural sunlight',
    keywords: [
      'product podium', 'travertine stone', 'pedestal', 'minimalist background', 'luxury mockup',
      'cosmetic display', 'sunlight shadow', '3d render', 'product presentation', 'cylinder stage',
      'warm neutral', 'beige background', 'natural stone', 'architectural shadow', 'empty podium',
      'brand identity', 'skincare showcase', 'perfume display', 'beige aesthetic', 'studio stage',
      'dappled light', 'organic texture', 'modern minimalism', 'commercial display', 'exhibition stand',
      'luxury branding', 'marble texture', 'earth tones', 'packaging mockup', 'clean composition',
      'copy space', 'no people', 'front view', 'geometric form', 'interior design',
      'plaster wall', 'botanical shadow', 'golden hour', 'high end', 'elegance',
      'retail merchandising', 'visual merchandising', 'product photography', 'beauty industry', 'platform',
      'alabaster', 'champagne gold', 'calm aesthetic', 'editorial background'
    ],
    midjourneyPrompt: 'Minimalist beige travertine limestone cylindrical podium on warm plaster surface, natural morning window sunlight casting soft botanical leaf shadow, generous copy space above and right, luxury skincare commercial studio photography, 8k photorealistic --ar 16:9 --v 6.1',
    vectorPrompt: 'Clean 3D vector illustration of minimalist beige geometric cylinder podiums with soft warm shadows, editable gradient mesh EPS 10 commercial background --no text, watermark'
  },
  {
    id: 'pack-04-isometric-vector-saas',
    code: 'VAULT-04',
    title: 'Isometric B2B SaaS Workflow & API Vector System',
    niche: 'EPS 10 Commercial Vectors',
    department: 'vector',
    adobeCategory: 'Graphic Resources',
    adobeCategoryId: 8,
    cpcEstimate: '$4.90 CPC',
    demandLevel: 'Very High',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=900&q=80',
    recommendedTitle: 'Isometric Cloud API Integration And SaaS Workflow Vector Illustration',
    shutterstockCaption: 'Clean isometric vector illustration of cloud API integration, modular SaaS workflow automation, and enterprise database synchronization',
    freepikTitle: 'Isometric Cloud API & SaaS Workflow — Editable Vector Illustration',
    gettyTitle: 'Isometric vector illustration of enterprise cloud API architecture and workflow automation',
    keywords: [
      'isometric vector', 'cloud api', 'workflow automation', 'saas platform', 'vector illustration',
      'eps 10', 'software development', 'system architecture', 'database sync', 'microservices',
      'devops pipeline', 'agile workflow', 'enterprise software', 'ui kit', 'web development',
      'digital ecosystem', 'api gateway', 'cloud migration', 'data integration', 'business process',
      'flat design', 'editable vector', 'scalable graphic', 'tech illustration', 'infographic element',
      'server cluster', 'modular design', 'product management', 'coding environment', 'deployment',
      'network topology', 'landing page graphic', 'app interface', 'corporate technology', 'clean vector',
      'isolated', 'copy space', 'no people', 'modern illustration', 'geometric vector',
      'graphic resource', 'commercial vector', 'design asset', 'b2b marketing', 'digital platform',
      'productivity tool', 'cloud native', 'tech stack', 'vector artwork'
    ],
    midjourneyPrompt: 'Clean 3D isometric icon set of cloud server nodes, API modular blocks, and workflow pipelines, matte dark slate and warm gold materials, orthographic camera view, isolated on clean solid background --ar 16:9 --v 6.1',
    vectorPrompt: 'Pure flat isometric vector illustration of cloud API architecture and modular SaaS data blocks, clean closed paths, no raster effects, EPS 10 compatible commercial stock vector --no text'
  },
  {
    id: 'pack-05-sustainable-solar-esg',
    code: 'VAULT-05',
    title: 'Sustainable ESG Solar Grid & Clean Hydrogen Architecture',
    niche: 'Green Energy & Corporate ESG',
    department: 'nature',
    adobeCategory: 'Environment',
    adobeCategoryId: 6,
    cpcEstimate: '$5.40 CPC',
    demandLevel: 'Breakout',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80',
    recommendedTitle: 'Renewable Solar Energy Grid And Wind Turbines At Golden Sunrise',
    shutterstockCaption: 'Aerial panoramic view of renewable solar photovoltaic panels and offshore wind turbines at golden sunrise for corporate ESG sustainability report',
    freepikTitle: 'Renewable Solar Energy Grid At Sunrise — Sustainable ESG Photo',
    gettyTitle: 'Aerial view of utility-scale solar energy farm and wind turbines at sunrise',
    keywords: [
      'renewable energy', 'solar panel', 'wind turbine', 'sustainability', 'esg report',
      'clean energy', 'carbon neutral', 'green technology', 'net zero', 'climate action',
      'environmental conservation', 'photovoltaic farm', 'green economy', 'eco friendly', 'power grid',
      'energy transition', 'sustainable development', 'alternative energy', 'corporate responsibility', 'clean power',
      'solar energy', 'wind farm', 'ecological balance', 'green hydrogen', 'smart grid',
      'aerial photography', 'golden sunrise', 'natural resources', 'future energy', 'global warming solution',
      'biodiversity', 'circular economy', 'environmental impact', 'electric utility', 'renewable resource',
      'energy storage', 'battery farm', 'sustainable business', 'green investment', 'landscape',
      'copy space', 'no people', 'panoramic', 'sunbeam', 'clear sky',
      'high resolution', 'commercial photography', 'optimism', 'clean environment'
    ],
    midjourneyPrompt: 'Breathtaking aerial drone photography of a modern utility-scale solar panel array and sleek white wind turbines in an alpine valley at golden sunrise, soft morning mist, clean sky copy space on top, shot on Phase One IQ4 150MP --ar 16:9 --v 6.1',
    vectorPrompt: 'Minimalist editorial vector illustration of solar panels, wind turbines, and green hydrogen energy grid in warm sunlit tones, flat EPS 10 vector graphic for corporate ESG annual report --no text'
  },
  {
    id: 'pack-06-biophilic-executive-office',
    code: 'VAULT-06',
    title: 'Biophilic Architectural Workspace & Modern Boardroom',
    niche: 'Architecture & Interior Design',
    department: 'architecture',
    adobeCategory: 'Buildings and Architecture',
    adobeCategoryId: 2,
    cpcEstimate: '$4.75 CPC',
    demandLevel: 'High',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
    recommendedTitle: 'Biophilic Modern Office Interior With Natural Timber And Sunlight',
    shutterstockCaption: 'Spacious biophilic modern corporate office interior featuring sustainable timber architecture, indoor botanical greenery, and warm natural daylight',
    freepikTitle: 'Biophilic Modern Office Interior — Architectural Workspace Photo',
    gettyTitle: 'Contemporary biophilic corporate office interior with natural wood and indoor plants',
    keywords: [
      'biophilic design', 'modern office', 'office interior', 'architectural photography', 'workspace',
      'sustainable architecture', 'corporate headquarters', 'indoor plants', 'natural daylight', 'wooden interior',
      'minimalist architecture', 'coworking space', 'boardroom', 'commercial real estate', 'interior design',
      'green building', 'open plan office', 'contemporary design', 'workplace wellness', 'executive suite',
      'glass partition', 'concrete and wood', 'scandinavian design', 'creative studio', 'business environment',
      'healthy workplace', 'daylight harvesting', 'acoustic panel', 'ergonomic furniture', 'modern furniture',
      'spatial design', 'commercial interior', 'building interior', 'sunlit room', 'architectural detail',
      'copy space', 'no people', 'wide angle', 'clean lines', 'warm atmosphere',
      'luxury office', 'enterprise campus', 'design inspiration', 'urban architecture', 'calm workspace',
      'high ceiling', 'travertine floor', 'professional environment', 'future of work'
    ],
    midjourneyPrompt: 'Wide-angle architectural photograph of a serene biophilic executive studio office, warm oak timber ceiling louvers, travertine floor, lush indoor olive trees, floor-to-ceiling glass with soft morning sunlight, no people, clean composition --ar 16:9 --v 6.1',
    vectorPrompt: 'Clean architectural line-art and flat shading vector illustration of a modern biophilic office interior with indoor plants and sunlight beams, editable EPS 10 graphic --no text'
  },
  {
    id: 'pack-07-biotech-genomics-lab',
    code: 'VAULT-07',
    title: 'Precision Genomics, CRISPR & Pharmaceutical Research',
    niche: 'Healthcare & Biotech Science',
    department: 'tech',
    adobeCategory: 'Science',
    adobeCategoryId: 15,
    cpcEstimate: '$5.95 CPC',
    demandLevel: 'Very High',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80',
    recommendedTitle: 'Biotechnology Laboratory Glassware And Genomic DNA Sequencing Helix',
    shutterstockCaption: 'High-precision biotechnology laboratory micropipette and glass vial with abstract genomic DNA double helix illumination for pharmaceutical research',
    freepikTitle: 'Biotechnology Laboratory & DNA Helix — Medical Science Concept',
    gettyTitle: 'Sterile biotechnology research laboratory equipment and genomic DNA sequencing visualization',
    keywords: [
      'biotechnology', 'genomics', 'pharmaceutical research', 'dna sequencing', 'medical laboratory',
      'clinical trial', 'life sciences', 'molecular biology', 'crispr gene editing', 'biomedical engineering',
      'vaccine development', 'healthcare innovation', 'scientific research', 'laboratory equipment', 'microbiology',
      'precision medicine', 'biochemistry', 'cell therapy', 'diagnostic testing', 'genetic engineering',
      'double helix', 'petri dish', 'micropipette', 'test tube', 'pharma industry',
      'medical technology', 'health science', 'bioinformatics', 'stem cell', 'immunology',
      'pathology', 'drug discovery', 'sterile environment', 'research and development', 'chemistry lab',
      'cleanroom', 'scientific breakthrough', 'longevity science', 'healthtech', 'biotech startup',
      'copy space', 'no people', 'macro shot', 'clean background', 'high precision',
      'commercial science', 'modern healthcare', 'clinical accuracy', 'future medicine'
    ],
    midjourneyPrompt: 'Macro studio photograph of sterile borosilicate laboratory glass vials and a precision micropipette drop, subtle glowing warm amber and emerald bokeh suggesting DNA helix structure, ultra-clean clinical background with copy space --ar 16:9 --v 6.1',
    vectorPrompt: 'Minimalist scientific vector illustration of a DNA double helix and molecular hexagon structure, clean precision vector lines in emerald and gold on dark slate, EPS 10 compatible --no text'
  },
  {
    id: 'pack-08-automated-supply-chain',
    code: 'VAULT-08',
    title: 'Autonomous Warehouse Robotics & Global Supply Chain',
    niche: 'Logistics & Industrial Automation',
    department: 'business',
    adobeCategory: 'Industry',
    adobeCategoryId: 10,
    cpcEstimate: '$5.10 CPC',
    demandLevel: 'High',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
    recommendedTitle: 'Automated Smart Warehouse Robotics And Global Supply Chain Logistics',
    shutterstockCaption: 'Modern automated smart warehouse fulfillment center with autonomous mobile robots sorting e-commerce freight for global supply chain logistics',
    freepikTitle: 'Automated Smart Warehouse Robotics — Supply Chain Logistics',
    gettyTitle: 'High-angle view of automated fulfillment warehouse with autonomous logistics robotics',
    keywords: [
      'supply chain', 'automated warehouse', 'logistics', 'warehouse robotics', 'smart factory',
      'industry 4.0', 'freight distribution', 'e-commerce fulfillment', 'inventory management', 'autonomous robot',
      'global trade', 'cargo shipping', 'industrial automation', 'smart logistics', 'distribution center',
      'supply chain management', 'conveyor system', 'fleet management', 'import export', 'manufacturing technology',
      'robotic arm', 'iot sensor', 'digital twin', 'predictive maintenance', 'commercial transport',
      'warehouse interior', 'pallet rack', 'barcode scanner', 'operational efficiency', 'b2b logistics',
      'shipping container', 'supply network', 'last mile delivery', 'cold chain', 'procurement',
      'industrial engineering', 'modern industry', 'enterprise operations', 'global commerce', 'high tech warehouse',
      'copy space', 'no people', 'architectural symmetry', 'wide angle', 'clean lighting',
      'high resolution', 'commercial stock', 'scalability', 'precision engineering'
    ],
    midjourneyPrompt: 'Architectural symmetrical wide-angle shot of an ultra-clean modern automated fulfillment warehouse, sleek autonomous mobile robots gliding along illuminated floor paths, warm industrial lighting, no people, generous copy space --ar 16:9 --v 6.1',
    vectorPrompt: 'Isometric vector illustration of smart warehouse robotics, conveyor belts, and global supply chain logistics network, clean commercial vector EPS 10 --no text'
  },
  {
    id: 'pack-09-luxury-gold-packaging',
    code: 'VAULT-09',
    title: 'Embossed Gold Foil & Obsidian Stationery Branding Kit',
    niche: 'Corporate Identity & Mockups',
    department: 'luxury',
    adobeCategory: 'Graphic Resources',
    adobeCategoryId: 8,
    cpcEstimate: '$4.35 CPC',
    demandLevel: 'Very High',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=900&q=80',
    recommendedTitle: 'Luxury Matte Black Stationery Mockup On Warm Travertine Stone',
    shutterstockCaption: 'Overhead flat lay of luxury matte black cotton paper business card and envelope mockup on warm travertine stone with natural window shadow',
    freepikTitle: 'Luxury Matte Black & Gold Stationery Mockup — Branding Kit',
    gettyTitle: 'Minimalist overhead view of blank luxury stationery cards on natural travertine stone',
    keywords: [
      'stationery mockup', 'business card mockup', 'luxury branding', 'corporate identity', 'cotton paper',
      'matte black', 'travertine stone', 'flat lay', 'brand guidelines', 'envelope mockup',
      'minimalist mockup', 'paper texture', 'embossed card', 'invitation mockup', 'editorial presentation',
      'graphic design', 'branding template', 'visual identity', 'letterhead', 'design portfolio',
      'warm shadow', 'natural light', 'blank card', 'packaging design', 'boutique branding',
      'creative agency', 'art direction', 'print design', 'high end stationery', 'tactile paper',
      'neutral palette', 'desk top view', 'office stationery', 'wedding suite', 'monochrome aesthetic',
      'copy space', 'no people', 'isolated template', 'top view', 'studio lighting',
      'commercial mockup', 'clean composition', 'elegance', 'craftsmanship', 'modern branding',
      'luxury paper', 'architectural surface', 'mockup scene', 'editable template'
    ],
    midjourneyPrompt: 'Overhead flat-lay photograph of blank thick matte charcoal cotton paper business card and envelope resting on warm beige travertine stone, soft diagonal window sunlight shadow, zero text or logos, ultra-detailed paper grain --ar 16:9 --v 6.1',
    vectorPrompt: 'Realistic vector stationery mockup set with matte black card, envelope, and gold foil border on stone texture background, layered EPS 10 template --no text'
  },
  {
    id: 'pack-10-seasonal-retail-peak',
    code: 'VAULT-10',
    title: 'Q4 Golden Holiday & Black Friday Luxury Retail Campaign',
    niche: 'Seasonal E-Commerce & Retail',
    department: 'seasonal',
    adobeCategory: 'Business',
    adobeCategoryId: 3,
    cpcEstimate: '$4.85 CPC',
    demandLevel: 'Breakout',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80',
    recommendedTitle: 'Luxury Matte Black Gift Boxes With Champagne Gold Silk Ribbon',
    shutterstockCaption: 'Elegant seasonal retail composition of matte black gift boxes tied with champagne gold silk ribbon on warm stone podium with copy space',
    freepikTitle: 'Luxury Black & Gold Gift Boxes — Seasonal Retail Banner',
    gettyTitle: 'Minimalist luxury gift boxes with champagne gold ribbon and copy space for retail campaign',
    keywords: [
      'luxury gift box', 'black friday', 'holiday shopping', 'retail promotion', 'seasonal sale',
      'e-commerce banner', 'gold ribbon', 'cyber monday', 'gift wrapping', 'festive background',
      'special offer', 'luxury retail', 'black and gold', 'present box', 'christmas gift',
      'new year sale', 'vip reward', 'boutique shopping', 'silk bow', 'commercial banner',
      'promotional background', 'winter holiday', 'celebration', 'corporate gift', 'anniversary sale',
      'packaging box', 'minimalist holiday', 'elegant gift', 'online shopping', 'discount event',
      'retail marketing', 'consumerism', 'luxury lifestyle', 'golden bokeh', 'studio podium',
      'copy space', 'no people', 'clean background', 'high contrast', 'warm lighting',
      'advertising background', 'header template', 'hero banner', 'holiday campaign', 'premium quality',
      'festive season', 'champagne gold', 'matte finish', 'commercial photography'
    ],
    midjourneyPrompt: 'Minimalist luxury retail still-life of matte obsidian gift boxes tied with brushed champagne gold silk ribbon on a warm travertine ledge, soft golden bokeh in dark background, 60% negative copy space on left for banner typography --ar 16:9 --v 6.1',
    vectorPrompt: 'Luxury seasonal retail banner background with realistic vector black and gold gift boxes, subtle golden light particles, and wide copy space, EPS 10 vector --no text'
  },
  {
    id: 'pack-11-executive-remote-work',
    code: 'VAULT-11',
    title: 'Minimalist Executive Desk & Digital Nomad Productivity',
    niche: 'Modern Work & Lifestyle',
    department: 'lifestyle',
    adobeCategory: 'Lifestyle',
    adobeCategoryId: 11,
    cpcEstimate: '$4.20 CPC',
    demandLevel: 'High',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80',
    recommendedTitle: 'Minimalist Wooden Executive Desk With Laptop And Morning Coffee',
    shutterstockCaption: 'Clean overhead view of minimalist walnut wood executive desk with unbranded silver laptop, ceramic coffee cup, and warm morning sunlight',
    freepikTitle: 'Minimalist Wooden Desk With Laptop — Remote Work Background',
    gettyTitle: 'Serene minimalist home office desk with unbranded laptop and natural morning light',
    keywords: [
      'minimalist desk', 'remote work', 'home office', 'workspace flat lay', 'digital nomad',
      'productivity', 'business lifestyle', 'laptop on desk', 'morning coffee', 'freelance work',
      'creative workspace', 'walnut desk', 'modern work', 'entrepreneurship', 'online business',
      'work from home', 'executive desk', 'clean desk', 'study space', 'office table',
      'unbranded laptop', 'ceramic mug', 'notebook', 'natural sunlight', 'warm aesthetic',
      'calm workspace', 'time management', 'career growth', 'digital workplace', 'professional life',
      'desk setup', 'ergonomic workspace', 'minimalism', 'interior styling', 'daily routine',
      'copy space', 'no people', 'top view', 'soft shadows', 'neutral tones',
      'blog header', 'website banner', 'commercial lifestyle', 'high resolution', 'organization',
      'focus', 'clarity', 'modern living', 'work life balance'
    ],
    midjourneyPrompt: 'Serene overhead architectural shot of a solid walnut executive desk, unbranded brushed aluminum laptop with blank screen, handmade stoneware espresso cup, warm morning sunlight casting soft window blinds shadow, generous copy space --ar 16:9 --v 6.1',
    vectorPrompt: 'Clean flat vector illustration of a minimalist wooden home office desk with laptop, coffee cup, and indoor plant in warm editorial palette, EPS 10 vector --no text'
  },
  {
    id: 'pack-12-abstract-architectural-silk',
    code: 'VAULT-12',
    title: '3D Architectural Silk Waves & Champagne Glassmorphism',
    niche: 'Abstract Commercial Backgrounds',
    department: 'vector',
    adobeCategory: 'Graphic Resources',
    adobeCategoryId: 8,
    cpcEstimate: '$4.60 CPC',
    demandLevel: 'Very High',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80',
    recommendedTitle: 'Abstract Champagne Gold Silk Wave And Frosted Glass Background',
    shutterstockCaption: 'Abstract 3D architectural wave of flowing champagne gold silk and frosted optical crystal glass layers for luxury corporate presentation background',
    freepikTitle: 'Abstract Champagne Gold Wave — 3D Luxury Background Vector',
    gettyTitle: 'Abstract architectural 3D wave in warm champagne gold and matte obsidian slate',
    keywords: [
      'abstract background', 'champagne gold', 'silk wave', '3d abstract', 'glassmorphism',
      'luxury background', 'fluid wave', 'minimalist background', 'corporate presentation', 'modern abstract',
      'frosted glass', 'golden wave', 'architectural curve', 'smooth gradient', 'velvet texture',
      'elegant background', 'geometric wave', 'light refraction', 'optical crystal', 'premium design',
      'website background', 'ui background', 'banner template', 'dynamic flow', 'satin fabric',
      'dark luxury', 'warm gold', 'metallic sheen', 'contemporary art', 'digital background',
      'presentation slide', 'keynote background', 'brand backdrop', 'soft focus', 'layered depth',
      'copy space', 'no people', 'high resolution', '8k render', 'clean composition',
      'commercial graphic', 'graphic resource', 'vector wave', 'editable background', 'sophistication',
      'harmony', 'motion', 'silk drape', 'minimalist luxury'
    ],
    midjourneyPrompt: 'Abstract 3D architectural sculpture of flowing champagne gold silk ribbons intersecting with translucent frosted crystal glass slabs on deep velvet slate background, soft caustic light refraction, clean copy space --ar 16:9 --v 6.1',
    vectorPrompt: 'Smooth gradient mesh vector background of flowing champagne gold and deep obsidian silk waves, clean layered EPS 10 commercial vector background --no text'
  }
];

interface GlobalAssetStoreVaultProps {
  isLight: boolean;
  onLoadPackIntoWorkbench: (pack: GlobalStorePack) => void;
  onOpenPromptWithConcept?: (concept: string) => void;
  onOpenSeoCalibratorWithQuery?: (query: string) => void;
  showToast?: (msg: string) => void;
}

export const GlobalAssetStoreVault: React.FC<GlobalAssetStoreVaultProps> = ({
  isLight,
  onLoadPackIntoWorkbench,
  onOpenPromptWithConcept,
  onOpenSeoCalibratorWithQuery,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<'all' | GlobalStorePack['department']>('all');
  const [selectedAgency, setSelectedAgency] = useState<'adobe' | 'shutterstock' | 'freepik' | 'getty'>('adobe');
  const [selectedPackId, setSelectedPackId] = useState<string>(GLOBAL_COMMERCIAL_PACKS[0].id);
  const [isInspectorExpanded, setIsInspectorExpanded] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customBasketTags, setCustomBasketTags] = useState<string[]>([
    'fintech', 'digital banking', 'cyber security', 'neural network', 'product podium',
    'travertine stone', 'isometric vector', 'renewable energy', 'copy space', 'no people'
  ]);
  const [customBasketTitle, setCustomBasketTitle] = useState<string>(
    'Minimalist Commercial Design Asset With Clean Composition And Copy Space'
  );
  const [newTagInput, setNewTagInput] = useState<string>('');

  const filteredPacks = useMemo(() => {
    return GLOBAL_COMMERCIAL_PACKS.filter((pack) => {
      const matchesDept = selectedDepartment === 'all' || pack.department === selectedDepartment;
      if (!matchesDept) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        pack.title.toLowerCase().includes(q) ||
        pack.niche.toLowerCase().includes(q) ||
        pack.recommendedTitle.toLowerCase().includes(q) ||
        pack.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedDepartment]);

  const activePack = useMemo(() => {
    return (
      filteredPacks.find((p) => p.id === selectedPackId) ||
      filteredPacks[0] ||
      GLOBAL_COMMERCIAL_PACKS[0]
    );
  }, [filteredPacks, selectedPackId]);

  const triggerCopy = (text: string, key: string, toastText?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (showToast && toastText) showToast(toastText);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const getFormattedTitleForAgency = (pack: GlobalStorePack) => {
    if (selectedAgency === 'shutterstock') return pack.shutterstockCaption;
    if (selectedAgency === 'freepik') return pack.freepikTitle;
    if (selectedAgency === 'getty') return pack.gettyTitle;
    return pack.recommendedTitle;
  };

  const getFormattedTagsForAgency = (pack: GlobalStorePack) => {
    if (selectedAgency === 'freepik') return pack.keywords.slice(0, 30);
    if (selectedAgency === 'getty') return pack.keywords.slice(0, 35);
    return pack.keywords.slice(0, 49);
  };

  const handleToggleTagInBasket = (kw: string) => {
    setCustomBasketTags((prev) => {
      if (prev.includes(kw)) {
        return prev.filter((t) => t !== kw);
      }
      if (prev.length >= 49) {
        if (showToast) showToast('Basket has reached 49 keywords (Adobe Stock max). Remove a tag first.');
        return prev;
      }
      return [...prev, kw];
    });
  };

  const handleLoadEntirePackToBasket = (pack: GlobalStorePack) => {
    setCustomBasketTitle(pack.recommendedTitle);
    setCustomBasketTags(pack.keywords.slice(0, 49));
    if (showToast) showToast(`✓ Loaded "${pack.title}" (49 tags) into Custom Builder!`);
  };

  const handleDownloadPackCsv = (pack: GlobalStorePack) => {
    const cleanEsc = (val: string) => `"${String(val || '').replace(/"/g, '""')}"`;
    const filename = `${pack.id}.eps`;
    let csvContent = '';
    if (selectedAgency === 'shutterstock') {
      csvContent = [
        'Filename,Description,Keywords,Categories',
        `${cleanEsc(filename)},${cleanEsc(pack.shutterstockCaption)},${cleanEsc(pack.keywords.slice(0, 50).join(', '))},${cleanEsc(pack.adobeCategory)}`,
      ].join('\n');
    } else if (selectedAgency === 'freepik') {
      csvContent = [
        'File name;Title;Keywords',
        `"${filename}";"${pack.freepikTitle}";"${pack.keywords.slice(0, 30).join(', ')}"`,
      ].join('\n');
    } else {
      csvContent = [
        'Filename,Title,Keywords,Category',
        `${cleanEsc(filename)},${cleanEsc(pack.recommendedTitle)},${cleanEsc(pack.keywords.slice(0, 49).join(', '))},${pack.adobeCategoryId}`,
      ].join('\n');
    }

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pack.id}_${selectedAgency}_metadata.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    if (showToast) showToast(`✓ Downloaded ${selectedAgency.toUpperCase()} CSV for "${pack.title}"!`);
  };

  return (
    <section
      id="global-commercial-store-vault"
      className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 pb-36"
    >
      {/* Top Architectural Hairline Separator for Generous Breathing Room */}
      <div
        className={`pt-10 mb-10 border-t flex flex-col lg:flex-row lg:items-end justify-between gap-6 ${
          isLight ? 'border-neutral-200/80' : 'border-white/[0.08]'
        }`}
      >
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2.5 text-[10.5px] font-mono tracking-[0.18em] uppercase tabular-nums text-neutral-400">
            <span className={isLight ? 'text-neutral-950 font-semibold' : 'text-white font-semibold'}>
              02. CURATED COMMERCIAL ARCHIVE
            </span>
            <span aria-hidden="true" className="opacity-30">·</span>
            <span>588+ High-CPC Keywords</span>
            <span aria-hidden="true" className="opacity-30">·</span>
            <span>7-Agency Ready</span>
          </div>
          <h2
            className={`text-2xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.1] ${
              isLight ? 'text-neutral-950' : 'text-white'
            }`}
          >
            Commercial{' '}
            <span className="font-editorial italic font-semibold text-[1.08em] luxury-headline-gradient pr-1">
              Metadata &amp; Prompt
            </span>{' '}
            Archive
          </h2>
          <p
            className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${
              isLight ? 'text-neutral-600' : 'text-neutral-400'
            }`}
          >
            Select any high-CPC commercial pack below to copy verified 49-keyword sets and prompts in one click, or expand the full interactive vault to build custom agency CSVs.
          </p>
        </div>

        {/* Clean Action Controls: Agency Rule + Expand/Collapse Vault Drawer */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div
            className={`inline-flex p-1 rounded-xl border ${
              isLight
                ? 'bg-[#f5f3ef] border-neutral-200/90'
                : 'bg-[#050506] border-white/12'
            }`}
          >
            {[
              { id: 'adobe', label: 'Adobe (49 KW)' },
              { id: 'shutterstock', label: 'Shutterstock (50)' },
              { id: 'freepik', label: 'Freepik (30)' },
              { id: 'getty', label: 'Getty (35)' },
            ].map((ag) => {
              const active = selectedAgency === ag.id;
              return (
                <button
                  key={ag.id}
                  type="button"
                  onClick={() => setSelectedAgency(ag.id as any)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer whitespace-nowrap ${
                    active
                      ? isLight
                        ? 'bg-neutral-950 text-white shadow-xs'
                        : 'bg-white text-black shadow-xs'
                      : isLight
                      ? 'text-neutral-600 hover:text-neutral-950'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {ag.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsInspectorExpanded((prev) => !prev)}
            className={`lumina-tactile-button px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-2 cursor-pointer transition ${
              isInspectorExpanded
                ? isLight
                  ? 'bg-neutral-950 text-white border-neutral-950'
                  : 'bg-white text-black border-white'
                : isLight
                ? 'crystal-glass-panel-light text-neutral-900 hover:border-neutral-950'
                : 'crystal-glass-panel-dark text-white hover:border-white/40'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>
              {isInspectorExpanded ? 'Close Full Inspector' : 'Open Full Vault & Tag Builder (12 Packs)'}
            </span>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* SLEEK 4-CARD EXHIBITION SHOWCASE (DEFAULT UNCLUTTERED VIEW)        */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {GLOBAL_COMMERCIAL_PACKS.slice(0, 4).map((pack) => {
          const isSelected = activePack.id === pack.id && isInspectorExpanded;
          return (
            <div
              key={pack.id}
              onClick={() => {
                setSelectedPackId(pack.id);
                setIsInspectorExpanded(true);
              }}
              className={`group cursor-pointer rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 sovereign-prism-card relative overflow-hidden ${
                isSelected
                  ? isLight
                    ? 'bg-white border-neutral-950 shadow-xl'
                    : 'bg-[#0a0a0d] border-white/50 shadow-2xl'
                  : isLight
                  ? 'crystal-glass-panel-light hover:border-neutral-900'
                  : 'crystal-glass-panel-dark hover:border-white/35'
              }`}
            >
              <div className="space-y-4">
                {/* Clean Unboxed Kicker */}
                <div className="flex items-center justify-between text-[10px] font-mono tabular-nums tracking-[0.14em] uppercase text-neutral-400">
                  <span>{pack.code} · {pack.adobeCategory}</span>
                  <span className={isLight ? 'text-neutral-900 font-semibold' : 'text-white font-semibold'}>
                    {pack.cpcEstimate}
                  </span>
                </div>

                {/* Cover Visual */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-inset ring-white/15">
                  <img
                    src={pack.image}
                    alt={pack.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                  {/* Quick 1-Click Copy 49 Tags Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerCopy(
                        getFormattedTagsForAgency(pack).join(', '),
                        `card_kw_${pack.id}`,
                        `✓ Copied ${getFormattedTagsForAgency(pack).length} ${selectedAgency.toUpperCase()} Keywords!`
                      );
                    }}
                    className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[9.5px] font-semibold bg-white/95 hover:bg-white text-black flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    {copiedKey === `card_kw_${pack.id}` ? (
                      <>
                        <Check className="w-2.5 h-2.5 text-black" />
                        <span>Copied 49 KW</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-2.5 h-2.5" />
                        <span>Copy {getFormattedTagsForAgency(pack).length} KW</span>
                      </>
                    )}
                  </button>

                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white">
                    <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-neutral-200">
                      Inspect Pack &amp; Prompts
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Pack Title & Top Keywords Preview */}
                <div className="space-y-1.5 pt-1">
                  <h3
                    className={`text-[15px] font-bold tracking-tight leading-snug ${
                      isLight ? 'text-neutral-950' : 'text-white'
                    }`}
                  >
                    {pack.title}
                  </h3>
                  <p className="text-[11.5px] text-neutral-400 truncate">
                    {pack.keywords.slice(0, 5).join(' · ')}
                  </p>
                </div>
              </div>

              {/* Bottom Quick Action Bar */}
              <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-white/[0.08] flex items-center justify-between text-[11px] font-medium">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLoadPackIntoWorkbench(pack);
                  }}
                  className={`hover:underline cursor-pointer flex items-center gap-1 font-semibold ${
                    isLight ? 'text-neutral-900' : 'text-white'
                  }`}
                >
                  <span>Load in Studio</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadPackCsv(pack);
                  }}
                  className="text-neutral-400 hover:text-white cursor-pointer font-mono text-[10.5px]"
                >
                  Export CSV
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================================= */}
      {/* EXPANDABLE DEEP VAULT & 49-TAG CUSTOM BUILDER (OPEN ON DEMAND)     */}
      {/* ================================================================= */}
      <AnimatePresence>
        {isInspectorExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`mt-10 rounded-[32px] p-6 sm:p-10 lg:p-12 transition-all duration-500 sovereign-prism-card relative overflow-hidden ${
              isLight ? 'crystal-architectural-slab-light' : 'crystal-architectural-slab-dark'
            }`}
          >
            {/* Top Specular White Horizon Line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent"
            />

            {/* Search & Department Filter Bar */}
            <div className="pb-6 mb-6 border-b border-neutral-200/70 dark:border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search all 12 store packs, niches, or 588+ keywords..."
                  className={`w-full pl-10 pr-8 py-2.5 rounded-xl text-xs font-medium border focus:outline-none transition ${
                    isLight
                      ? 'bg-white border-neutral-200/90 text-neutral-900 focus:border-neutral-950'
                      : 'bg-[#050506] border-white/15 text-white placeholder:text-neutral-500 focus:border-white/50 shadow-inner'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {[
                  { id: 'all', label: 'All Packs (12)' },
                  { id: 'business', label: 'Business & Fintech' },
                  { id: 'tech', label: 'AI & Biotech' },
                  { id: 'luxury', label: 'Podiums & Mockups' },
                  { id: 'vector', label: 'EPS Vectors' },
                  { id: 'nature', label: 'Solar & ESG' },
                  { id: 'architecture', label: 'Architecture' },
                  { id: 'seasonal', label: 'Seasonal Retail' },
                ].map((dept) => {
                  const active = selectedDepartment === dept.id;
                  return (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => setSelectedDepartment(dept.id as any)}
                      className={`px-3 py-2 rounded-xl text-[11px] font-semibold border transition cursor-pointer whitespace-nowrap ${
                        active
                          ? isLight
                            ? 'bg-neutral-950 text-white border-neutral-950'
                            : 'bg-white text-black border-white font-bold shadow-xs'
                          : isLight
                          ? 'bg-white/70 hover:bg-white text-neutral-700 border-neutral-200/80'
                          : 'bg-[#050506] hover:bg-[#0d0d10] text-neutral-300 border-white/12 hover:border-white/35'
                      }`}
                    >
                      {dept.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main 12-Column Master-Detail Store Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 5 Columns: Scrollable Commercial Pack Catalog */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
                  <span>Showing {filteredPacks.length} Commercial Packs</span>
                  <span>Click to Inspect</span>
                </div>

                <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
                  {filteredPacks.map((pack) => {
                    const isSelected = activePack.id === pack.id;
                    return (
                      <div
                        key={pack.id}
                        onClick={() => setSelectedPackId(pack.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? isLight
                              ? 'bg-white border-neutral-950 shadow-md'
                              : 'bg-[#0d0d10] border-white/45 shadow-[0_14px_34px_-10px_rgba(0,0,0,0.95)]'
                            : isLight
                            ? 'bg-white/60 hover:bg-white border-neutral-200/80'
                            : 'bg-[#050506] hover:bg-[#0a0a0c] border-white/10 hover:border-white/25'
                        }`}
                      >
                        <img
                          src={pack.image}
                          alt={pack.title}
                          className="w-20 h-16 rounded-xl object-cover shrink-0 border border-neutral-200/50 dark:border-white/10"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2 text-[10px] font-mono tabular-nums text-neutral-400">
                            <span>
                              {pack.code} · {pack.adobeCategory}
                            </span>
                            <span className={isLight ? 'text-neutral-900 font-semibold' : 'text-neutral-200 font-semibold'}>
                              {pack.cpcEstimate}
                            </span>
                          </div>
                          <h3
                            className={`text-xs sm:text-[13.5px] font-bold leading-snug truncate ${
                              isLight ? 'text-neutral-950' : 'text-white'
                            }`}
                          >
                            {pack.title}
                          </h3>
                          <div className="flex items-center justify-between gap-2 pt-0.5 text-[11px] text-neutral-400">
                            <span className="truncate">{pack.keywords.slice(0, 3).join(' · ')}</span>
                            <span className="font-mono text-[10px] shrink-0">49 KW &rarr;</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right 7 Columns: Active Pack Deep Inspector + Custom 49-Tag Basket Builder */}
              <div className="lg:col-span-7 space-y-6">
                {/* Active Pack Inspector Card */}
                <div
                  className={`rounded-2xl p-6 sm:p-7 border space-y-6 relative overflow-hidden ${
                    isLight
                      ? 'bg-white/90 border-neutral-200/90'
                      : 'crystal-glass-panel-dark border-white/15'
                  }`}
                >
                  {/* Top Pack Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200/70 dark:border-white/10">
                    <div className="flex items-center gap-4">
                      <img
                        src={activePack.image}
                        alt={activePack.title}
                        className="w-24 h-18 rounded-xl object-cover border border-neutral-200 dark:border-white/15 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-mono tabular-nums text-neutral-400">
                          <span>{activePack.code}</span>
                          <span aria-hidden="true">·</span>
                          <span>Category #{activePack.adobeCategoryId} ({activePack.adobeCategory})</span>
                          <span aria-hidden="true">·</span>
                          <span className={isLight ? 'text-neutral-900 font-semibold' : 'text-white font-semibold'}>
                            {activePack.cpcEstimate}
                          </span>
                        </div>
                        <h3
                          className={`text-lg sm:text-xl font-bold tracking-tight ${
                            isLight ? 'text-neutral-950' : 'text-white'
                          }`}
                        >
                          {activePack.title}
                        </h3>
                        <div className="text-xs text-neutral-400">
                          Demand: <strong className={isLight ? 'text-neutral-800' : 'text-neutral-200'}>{activePack.demandLevel}</strong> · { getFormattedTagsForAgency(activePack).length } Verified Keywords Ready
                        </div>
                      </div>
                    </div>

                    {/* Primary Actions: Load in Studio or Download CSV */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDownloadPackCsv(activePack)}
                        className={`lumina-tactile-button px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                          isLight
                            ? 'bg-[#faf8f5] hover:bg-neutral-100 text-neutral-800 border-neutral-300'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-200 border-white/15'
                        }`}
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onLoadPackIntoWorkbench(activePack)}
                        className={`lumina-tactile-button px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isLight
                            ? 'bg-neutral-950 hover:bg-black text-white'
                            : 'bg-white hover:bg-neutral-200 text-black'
                        }`}
                      >
                        <span>Load in Workbench</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Agency-Calibrated Title Box */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                      <span className="text-neutral-400 uppercase tracking-wider">
                        {selectedAgency.toUpperCase()} Subject-First Title
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={isLight ? 'text-neutral-900 font-semibold' : 'text-white font-semibold'}>
                          {getFormattedTitleForAgency(activePack).length} chars
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            triggerCopy(
                              getFormattedTitleForAgency(activePack),
                              `title_${activePack.id}`,
                              `✓ Copied ${selectedAgency.toUpperCase()} Title!`
                            )
                          }
                          className="underline hover:text-white cursor-pointer flex items-center gap-1"
                        >
                          {copiedKey === `title_${activePack.id}` ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Title</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold leading-snug ${
                        isLight
                          ? 'bg-[#faf8f5] border-neutral-200/80 text-neutral-900'
                          : 'bg-[#040405] border-white/12 text-neutral-100 shadow-inner'
                      }`}
                    >
                      {getFormattedTitleForAgency(activePack)}
                    </div>
                  </div>

                  {/* Ranked Keywords Grid */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono tabular-nums">
                      <span className="text-neutral-400 uppercase tracking-wider">
                        Ranked Keywords (01–{getFormattedTagsForAgency(activePack).length}) · Click Any Tag to Add to Custom Set
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            triggerCopy(
                              getFormattedTagsForAgency(activePack).slice(0, 10).join(', '),
                              `top10_${activePack.id}`,
                              '✓ Copied Top-10 Priority Keywords!'
                            )
                          }
                          className={isLight ? 'text-neutral-700 hover:underline cursor-pointer' : 'text-neutral-300 hover:underline cursor-pointer'}
                        >
                          {copiedKey === `top10_${activePack.id}` ? 'Copied Top 10' : 'Copy Top 10'}
                        </button>
                        <span aria-hidden="true" className="opacity-30">·</span>
                        <button
                          type="button"
                          onClick={() =>
                            triggerCopy(
                              getFormattedTagsForAgency(activePack).join(', '),
                              `allkw_${activePack.id}`,
                              `✓ Copied all ${getFormattedTagsForAgency(activePack).length} Keywords!`
                            )
                          }
                          className={`font-semibold hover:underline cursor-pointer ${
                            isLight ? 'text-neutral-950' : 'text-white'
                          }`}
                        >
                          {copiedKey === `allkw_${activePack.id}`
                            ? 'Copied All Tags'
                            : `Copy All (${getFormattedTagsForAgency(activePack).length})`}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto p-1">
                      {getFormattedTagsForAgency(activePack).map((kw, idx) => {
                        const isTop10 = idx < 10;
                        const inBasket = customBasketTags.includes(kw);
                        return (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => handleToggleTagInBasket(kw)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 border transition cursor-pointer ${
                              inBasket
                                ? isLight
                                  ? 'bg-neutral-950 text-white border-neutral-950 font-semibold'
                                  : 'bg-white text-black border-white font-semibold shadow-xs'
                                : isTop10
                                ? isLight
                                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-950 border-neutral-300'
                                  : 'bg-white/[0.08] hover:bg-white/[0.14] text-white border-white/25'
                                : isLight
                                ? 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200/80'
                                : 'bg-[#050506] hover:bg-[#0c0c0e] text-neutral-300 border-white/10 hover:border-white/30'
                            }`}
                          >
                            <span className="text-[9.5px] font-mono tabular-nums opacity-55">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span>{kw}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Production Prompts (Midjourney Photo & EPS Vector) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-200/70 dark:border-white/10">
                    <div
                      className={`p-3.5 rounded-xl border space-y-2 ${
                        isLight
                          ? 'bg-[#faf8f5] border-neutral-200/80'
                          : 'bg-[#040405] border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10.5px] font-mono text-neutral-400">
                        <span>COMMERCIAL PHOTO PROMPT</span>
                        <button
                          type="button"
                          onClick={() =>
                            triggerCopy(
                              activePack.midjourneyPrompt,
                              `mj_${activePack.id}`,
                              '✓ Copied Commercial Photo Prompt!'
                            )
                          }
                          className={isLight ? 'text-neutral-900 hover:underline cursor-pointer font-semibold' : 'text-white hover:underline cursor-pointer font-semibold'}
                        >
                          {copiedKey === `mj_${activePack.id}` ? 'Copied' : 'Copy Prompt'}
                        </button>
                      </div>
                      <p
                        className={`text-[11px] leading-relaxed line-clamp-2 ${
                          isLight ? 'text-neutral-600' : 'text-neutral-300'
                        }`}
                      >
                        {activePack.midjourneyPrompt}
                      </p>
                    </div>

                    <div
                      className={`p-3.5 rounded-xl border space-y-2 ${
                        isLight
                          ? 'bg-[#faf8f5] border-neutral-200/80'
                          : 'bg-[#040405] border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10.5px] font-mono text-neutral-400">
                        <span>EPS 10 VECTOR PROMPT</span>
                        <button
                          type="button"
                          onClick={() =>
                            triggerCopy(
                              activePack.vectorPrompt,
                              `vec_${activePack.id}`,
                              '✓ Copied EPS 10 Vector Prompt!'
                            )
                          }
                          className={isLight ? 'text-neutral-900 hover:underline cursor-pointer font-semibold' : 'text-white hover:underline cursor-pointer font-semibold'}
                        >
                          {copiedKey === `vec_${activePack.id}` ? 'Copied' : 'Copy Vector Prompt'}
                        </button>
                      </div>
                      <p
                        className={`text-[11px] leading-relaxed line-clamp-2 ${
                          isLight ? 'text-neutral-600' : 'text-neutral-300'
                        }`}
                      >
                        {activePack.vectorPrompt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Custom 49-Tag Basket & Manual Builder */}
                <div
                  className={`rounded-2xl p-5 sm:p-6 border space-y-4 ${
                    isLight
                      ? 'bg-[#faf8f5] border-neutral-200/90'
                      : 'crystal-glass-panel-dark border-white/12'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className={`text-[10.5px] font-mono uppercase tracking-[0.12em] font-semibold ${
                        isLight ? 'text-neutral-950' : 'text-white'
                      }`}>
                        CUSTOM METADATA BUILDER ({customBasketTags.length}/49 TAGS)
                      </div>
                      <p className="text-xs text-neutral-400">
                        Mix keywords from any store pack above or type your own tags, then copy or send to Studio.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadEntirePackToBasket(activePack)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                          isLight
                            ? 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
                        }`}
                      >
                        Fill from Active Pack
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          triggerCopy(
                            `${customBasketTitle}\n\n${customBasketTags.join(', ')}`,
                            'basket_copy_all',
                            `✓ Copied Custom Title + ${customBasketTags.length} Keywords!`
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border cursor-pointer flex items-center gap-1.5 ${
                          isLight
                            ? 'bg-neutral-950 text-white border-neutral-950'
                            : 'bg-white text-neutral-950 border-white'
                        }`}
                      >
                        {copiedKey === 'basket_copy_all' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>Copied Set</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Custom Set</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Custom Title Input + Add Custom Tag */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    <div className="sm:col-span-8">
                      <input
                        type="text"
                        value={customBasketTitle}
                        onChange={(e) => setCustomBasketTitle(e.target.value)}
                        placeholder="Custom commercial title (<70 chars recommended)..."
                        className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none ${
                          isLight
                            ? 'bg-white border-neutral-200 text-neutral-900'
                            : 'bg-black/40 border-white/10 text-white'
                        }`}
                      />
                    </div>
                    <div className="sm:col-span-4 flex gap-1.5">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTagInput.trim()) {
                            e.preventDefault();
                            const parts = newTagInput
                              .split(',')
                              .map((s) => s.trim().toLowerCase())
                              .filter(Boolean);
                            setCustomBasketTags((prev) =>
                              Array.from(new Set([...prev, ...parts])).slice(0, 49)
                            );
                            setNewTagInput('');
                          }
                        }}
                        placeholder="Add tag + Enter..."
                        className={`flex-1 min-w-0 px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                          isLight
                            ? 'bg-white border-neutral-200 text-neutral-900'
                            : 'bg-black/40 border-white/10 text-white'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newTagInput.trim()) return;
                          const parts = newTagInput
                            .split(',')
                            .map((s) => s.trim().toLowerCase())
                            .filter(Boolean);
                          setCustomBasketTags((prev) =>
                            Array.from(new Set([...prev, ...parts])).slice(0, 49)
                          );
                          setNewTagInput('');
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                          isLight
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white/10 text-white border-white/15'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Custom Basket Tag Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {customBasketTags.map((tag, idx) => (
                      <span
                        key={tag}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-medium inline-flex items-center gap-1.5 border ${
                          idx === 0
                            ? isLight
                              ? 'bg-neutral-950 text-white border-neutral-950 font-semibold'
                              : 'bg-white text-black border-white font-semibold'
                            : isLight
                            ? 'bg-white text-neutral-700 border-neutral-200'
                            : 'bg-[#050506] text-neutral-300 border-white/10'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setCustomBasketTags((prev) => [
                              tag,
                              ...prev.filter((t) => t !== tag),
                            ]);
                          }}
                          title="Click to promote to Slot #1"
                          className="cursor-pointer hover:underline flex items-center gap-1"
                        >
                          <span className="text-[9.5px] font-mono opacity-60">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span>{tag}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCustomBasketTags((prev) => prev.filter((t) => t !== tag))
                          }
                          className="opacity-50 hover:opacity-100 cursor-pointer"
                          title="Remove tag"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
