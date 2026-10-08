export interface EntityMapping {
  queryTerm: string;
  matchedSymbol: string;
  matchedCompanyName: string;
  relationshipType: 'SUBSIDIARY' | 'BRAND' | 'PRODUCT' | 'PARENT' | 'SEGMENT' | 'ALIAS' | 'KEYWORD';
  relationshipNote: string;
  sector: string;
}

export const BRAND_SUBSIDIARY_MAPPINGS: EntityMapping[] = [
  // --- TATA GROUP ---
  {
    queryTerm: 'jlr',
    matchedSymbol: 'TATAMOTORS',
    matchedCompanyName: 'Tata Motors Limited',
    relationshipType: 'SUBSIDIARY',
    relationshipNote: '100% Owned Luxury Automotive Subsidiary (Jaguar Land Rover)',
    sector: 'Automotive',
  },
  {
    queryTerm: 'jaguar',
    matchedSymbol: 'TATAMOTORS',
    matchedCompanyName: 'Tata Motors Limited',
    relationshipType: 'SUBSIDIARY',
    relationshipNote: 'Luxury Car Subsidiary of Tata Motors',
    sector: 'Automotive',
  },
  {
    queryTerm: 'land rover',
    matchedSymbol: 'TATAMOTORS',
    matchedCompanyName: 'Tata Motors Limited',
    relationshipType: 'SUBSIDIARY',
    relationshipNote: 'Premium SUV Subsidiary of Tata Motors',
    sector: 'Automotive',
  },
  {
    queryTerm: 'nexon',
    matchedSymbol: 'TATAMOTORS',
    matchedCompanyName: 'Tata Motors Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: "India's Best-Selling Electric & ICE Compact SUV by Tata Motors",
    sector: 'Automotive',
  },
  {
    queryTerm: 'harrier',
    matchedSymbol: 'TATAMOTORS',
    matchedCompanyName: 'Tata Motors Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Premium SUV Model by Tata Motors',
    sector: 'Automotive',
  },
  {
    queryTerm: 'punch',
    matchedSymbol: 'TATAMOTORS',
    matchedCompanyName: 'Tata Motors Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Micro-SUV Product by Tata Motors',
    sector: 'Automotive',
  },
  {
    queryTerm: 'safari',
    matchedSymbol: 'TATAMOTORS',
    matchedCompanyName: 'Tata Motors Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Flagship 7-Seater SUV by Tata Motors',
    sector: 'Automotive',
  },
  {
    queryTerm: 'tata ev',
    matchedSymbol: 'TATAMOTORS',
    matchedCompanyName: 'Tata Motors Limited',
    relationshipType: 'SEGMENT',
    relationshipNote: 'EV Mobility Division (>70% domestic market share)',
    sector: 'Automotive',
  },
  {
    queryTerm: 'zudio',
    matchedSymbol: 'TRENT',
    matchedCompanyName: 'Trent Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Fast-Fashion Value Retail Chain (>500 stores) owned by Trent (Tata Group)',
    sector: 'Retail & Consumer',
  },
  {
    queryTerm: 'westside',
    matchedSymbol: 'TRENT',
    matchedCompanyName: 'Trent Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Flagship Lifestyle Department Store Chain of Trent',
    sector: 'Retail & Consumer',
  },
  {
    queryTerm: 'star bazaar',
    matchedSymbol: 'TRENT',
    matchedCompanyName: 'Trent Limited',
    relationshipType: 'SUBSIDIARY',
    relationshipNote: 'Hypermarket JV with Tesco owned by Trent',
    sector: 'Retail & Consumer',
  },
  {
    queryTerm: 'tanishq',
    matchedSymbol: 'TITAN',
    matchedCompanyName: 'Titan Company Limited',
    relationshipType: 'BRAND',
    relationshipNote: "India's #1 Jewellery Brand owned by Titan (Tata Group)",
    sector: 'Consumer & Retail',
  },
  {
    queryTerm: 'caratlane',
    matchedSymbol: 'TITAN',
    matchedCompanyName: 'Titan Company Limited',
    relationshipType: 'SUBSIDIARY',
    relationshipNote: 'Omnichannel Fine Jewellery Subsidiary of Titan Company',
    sector: 'Consumer & Retail',
  },
  {
    queryTerm: 'fastrack',
    matchedSymbol: 'TITAN',
    matchedCompanyName: 'Titan Company Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Youth Accessories & Smartwatch Brand of Titan',
    sector: 'Consumer & Retail',
  },
  {
    queryTerm: 'mia',
    matchedSymbol: 'TITAN',
    matchedCompanyName: 'Titan Company Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Workwear Fine Jewellery Brand by Tanishq / Titan',
    sector: 'Consumer & Retail',
  },
  {
    queryTerm: 'tata play',
    matchedSymbol: 'TATAPOWER',
    matchedCompanyName: 'Tata Power Company Limited',
    relationshipType: 'ALIAS',
    relationshipNote: 'Tata Group Enterprise (Related listed infrastructure entity: Tata Power)',
    sector: 'Power & Infrastructure',
  },

  // --- RELIANCE GROUP ---
  {
    queryTerm: 'jio',
    matchedSymbol: 'RELIANCE',
    matchedCompanyName: 'Reliance Industries Limited',
    relationshipType: 'SUBSIDIARY',
    relationshipNote: "India's Largest Telecom Operator (Jio Infocomm) owned by Reliance Industries",
    sector: 'Energy & Conglomerate',
  },
  {
    queryTerm: 'reliance jio',
    matchedSymbol: 'RELIANCE',
    matchedCompanyName: 'Reliance Industries Limited',
    relationshipType: 'SUBSIDIARY',
    relationshipNote: 'Telecom & Digital Services Arm of Reliance Industries',
    sector: 'Energy & Conglomerate',
  },
  {
    queryTerm: 'reliance retail',
    matchedSymbol: 'RELIANCE',
    matchedCompanyName: 'Reliance Industries Limited',
    relationshipType: 'SUBSIDIARY',
    relationshipNote: "India's Largest Retail Network (18,000+ stores) owned by Reliance Industries",
    sector: 'Energy & Conglomerate',
  },
  {
    queryTerm: 'ajio',
    matchedSymbol: 'RELIANCE',
    matchedCompanyName: 'Reliance Industries Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'E-Commerce Fashion Marketplace of Reliance Retail',
    sector: 'Energy & Conglomerate',
  },
  {
    queryTerm: 'jiomart',
    matchedSymbol: 'RELIANCE',
    matchedCompanyName: 'Reliance Industries Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Online Grocery Platform of Reliance Retail',
    sector: 'Energy & Conglomerate',
  },
  {
    queryTerm: 'jio cinema',
    matchedSymbol: 'RELIANCE',
    matchedCompanyName: 'Reliance Industries Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'OTT Streaming Platform of Viacom18 (Reliance Industries)',
    sector: 'Energy & Conglomerate',
  },
  {
    queryTerm: 'jio finance',
    matchedSymbol: 'IRFC',
    matchedCompanyName: 'Indian Railway Finance Corporation / JIOFIN',
    relationshipType: 'ALIAS',
    relationshipNote: 'Non-Banking Financial Corporation (Jio Financial Services)',
    sector: 'Financial Services',
  },

  // --- QUICK COMMERCE & TECH ---
  {
    queryTerm: 'blinkit',
    matchedSymbol: 'ZOMATO',
    matchedCompanyName: 'Zomato Limited',
    relationshipType: 'SUBSIDIARY',
    relationshipNote: "India's Leading Quick Commerce 10-Minute Delivery Service owned 100% by Zomato",
    sector: 'Consumer Internet',
  },
  {
    queryTerm: 'quick commerce',
    matchedSymbol: 'ZOMATO',
    matchedCompanyName: 'Zomato Limited',
    relationshipType: 'KEYWORD',
    relationshipNote: 'High-Growth Instant Delivery Sector (Blinkit / Zomato)',
    sector: 'Consumer Internet',
  },
  {
    queryTerm: 'hyperpure',
    matchedSymbol: 'ZOMATO',
    matchedCompanyName: 'Zomato Limited',
    relationshipType: 'SEGMENT',
    relationshipNote: 'B2B Restaurant Supply Arm of Zomato',
    sector: 'Consumer Internet',
  },
  {
    queryTerm: 'district',
    matchedSymbol: 'ZOMATO',
    matchedCompanyName: 'Zomato Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Live Events & Going-Out Division of Zomato (Acquired from Paytm)',
    sector: 'Consumer Internet',
  },

  // --- AUTOMOTIVE & MOBILITY BRANDS ---
  {
    queryTerm: 'thar',
    matchedSymbol: 'M&M',
    matchedCompanyName: 'Mahindra & Mahindra Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Iconic Off-Road Lifestyle 4x4 SUV by Mahindra',
    sector: 'Automotive',
  },
  {
    queryTerm: 'scorpio',
    matchedSymbol: 'M&M',
    matchedCompanyName: 'Mahindra & Mahindra Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: "High-Volume SUV Brand (Scorpio-N & Classic) by Mahindra",
    sector: 'Automotive',
  },
  {
    queryTerm: 'xuv700',
    matchedSymbol: 'M&M',
    matchedCompanyName: 'Mahindra & Mahindra Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Flagship ADAS-Enabled Premium SUV by Mahindra',
    sector: 'Automotive',
  },
  {
    queryTerm: 'swaraj',
    matchedSymbol: 'M&M',
    matchedCompanyName: 'Mahindra & Mahindra Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Agricultural Tractor & Farm Machinery Brand of Mahindra',
    sector: 'Automotive',
  },
  {
    queryTerm: 'chetak',
    matchedSymbol: 'BAJAJ-AUTO',
    matchedCompanyName: 'Bajaj Auto Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Fast-Growing Electric 2-Wheeler Brand of Bajaj Auto',
    sector: 'Automotive',
  },
  {
    queryTerm: 'pulsar',
    matchedSymbol: 'BAJAJ-AUTO',
    matchedCompanyName: 'Bajaj Auto Limited',
    relationshipType: 'BRAND',
    relationshipNote: "India's Dominant Sports Motorcycle Franchise by Bajaj Auto",
    sector: 'Automotive',
  },
  {
    queryTerm: 'ktm',
    matchedSymbol: 'BAJAJ-AUTO',
    matchedCompanyName: 'Bajaj Auto Limited',
    relationshipType: 'SUBSIDIARY',
    relationshipNote: 'Strategic European Performance Bike Partner & JV of Bajaj Auto',
    sector: 'Automotive',
  },
  {
    queryTerm: 'triumph',
    matchedSymbol: 'BAJAJ-AUTO',
    matchedCompanyName: 'Bajaj Auto Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Global 400cc Mid-Size Motorcycle Alliance manufactured by Bajaj Auto',
    sector: 'Automotive',
  },
  {
    queryTerm: 'swift',
    matchedSymbol: 'MARUTI',
    matchedCompanyName: 'Maruti Suzuki India Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Top-Selling Hatchback Model by Maruti Suzuki',
    sector: 'Automotive',
  },
  {
    queryTerm: 'brezza',
    matchedSymbol: 'MARUTI',
    matchedCompanyName: 'Maruti Suzuki India Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Market-Leading Compact SUV by Maruti Suzuki',
    sector: 'Automotive',
  },
  {
    queryTerm: 'grand vitara',
    matchedSymbol: 'MARUTI',
    matchedCompanyName: 'Maruti Suzuki India Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Strong Hybrid Premium SUV by Maruti Suzuki & Toyota',
    sector: 'Automotive',
  },
  {
    queryTerm: 'fronx',
    matchedSymbol: 'MARUTI',
    matchedCompanyName: 'Maruti Suzuki India Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Fastest 100K Units SUV Crossover by Maruti Suzuki',
    sector: 'Automotive',
  },
  {
    queryTerm: 'bullet',
    matchedSymbol: 'BAJAJ-AUTO',
    matchedCompanyName: 'Bajaj Auto / Eicher Motors Peer',
    relationshipType: 'KEYWORD',
    relationshipNote: 'Cruiser Motorcycle Segment (Listed Peers: Bajaj Auto, Eicher Motors)',
    sector: 'Automotive',
  },

  // --- DEFENCE, AEROSPACE & INFRA ---
  {
    queryTerm: 'tejas',
    matchedSymbol: 'HAL',
    matchedCompanyName: 'Hindustan Aeronautics Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: "Indigenous Light Combat Aircraft (LCA Tejas Mk1A) manufactured by HAL",
    sector: 'Defence & Aerospace',
  },
  {
    queryTerm: 'prachand',
    matchedSymbol: 'HAL',
    matchedCompanyName: 'Hindustan Aeronautics Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Light Combat Helicopter (LCH) developed for Indian Armed Forces by HAL',
    sector: 'Defence & Aerospace',
  },
  {
    queryTerm: 'sukhoi',
    matchedSymbol: 'HAL',
    matchedCompanyName: 'Hindustan Aeronautics Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Su-30MKI Fighter Jet Assembly & Overhaul Prime Contractor: HAL',
    sector: 'Defence & Aerospace',
  },
  {
    queryTerm: 'fighter jet',
    matchedSymbol: 'HAL',
    matchedCompanyName: 'Hindustan Aeronautics Limited',
    relationshipType: 'KEYWORD',
    relationshipNote: "India's Sole Military Aircraft & Helicopter Manufacturer",
    sector: 'Defence & Aerospace',
  },
  {
    queryTerm: 'akash missile',
    matchedSymbol: 'BEL',
    matchedCompanyName: 'Bharat Electronics Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Surface-to-Air Missile Weapon Control & Radar System by BEL',
    sector: 'Defence Electronics',
  },
  {
    queryTerm: 'radar',
    matchedSymbol: 'BEL',
    matchedCompanyName: 'Bharat Electronics Limited',
    relationshipType: 'KEYWORD',
    relationshipNote: 'Military 3D Surveillance & Fire Control Radars Developer: BEL',
    sector: 'Defence Electronics',
  },
  {
    queryTerm: 'bullet train',
    matchedSymbol: 'LT',
    matchedCompanyName: 'Larsen & Toubro Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Mumbai-Ahmedabad High-Speed Rail Viaduct EPC Contractor: L&T',
    sector: 'Capital Goods & Infrastructure',
  },
  {
    queryTerm: 'k9 vajra',
    matchedSymbol: 'LT',
    matchedCompanyName: 'Larsen & Toubro Limited',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Self-Propelled Tracked Howitzer Artillery System built by L&T Defence',
    sector: 'Capital Goods & Infrastructure',
  },

  // --- FMCG, FOOD & CONSUMER ---
  {
    queryTerm: 'aashirvaad',
    matchedSymbol: 'ITC',
    matchedCompanyName: 'ITC Limited',
    relationshipType: 'BRAND',
    relationshipNote: "India's #1 Packaged Atta & Staples Brand (>₹7,500 Cr) owned by ITC",
    sector: 'FMCG & Diversified',
  },
  {
    queryTerm: 'sunfeast',
    matchedSymbol: 'ITC',
    matchedCompanyName: 'ITC Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Major Biscuit & Bakery Brand (Dark Fantasy) of ITC',
    sector: 'FMCG & Diversified',
  },
  {
    queryTerm: 'bingo',
    matchedSymbol: 'ITC',
    matchedCompanyName: 'ITC Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Finger Snacks & Potato Chips Brand of ITC',
    sector: 'FMCG & Diversified',
  },
  {
    queryTerm: 'yippee',
    matchedSymbol: 'ITC',
    matchedCompanyName: 'ITC Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Instant Noodles Brand of ITC',
    sector: 'FMCG & Diversified',
  },
  {
    queryTerm: 'cigarettes',
    matchedSymbol: 'ITC',
    matchedCompanyName: 'ITC Limited',
    relationshipType: 'SEGMENT',
    relationshipNote: 'High-Margin Tobacco Business (Gold Flake, Classic, Wills) of ITC',
    sector: 'FMCG & Diversified',
  },
  {
    queryTerm: 'airtel',
    matchedSymbol: 'BHARTIARTL',
    matchedCompanyName: 'Bharti Airtel Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Global Telecom & Digital Carrier with 500M+ customers',
    sector: 'Telecommunications',
  },
  {
    queryTerm: 'wynk',
    matchedSymbol: 'BHARTIARTL',
    matchedCompanyName: 'Bharti Airtel Limited',
    relationshipType: 'SUBSIDIARY',
    relationshipNote: 'Digital Music & Streaming Division of Bharti Airtel',
    sector: 'Telecommunications',
  },
  {
    queryTerm: 'airtel payments bank',
    matchedSymbol: 'BHARTIARTL',
    matchedCompanyName: 'Bharti Airtel Limited',
    relationshipType: 'SUBSIDIARY',
    relationshipNote: 'Profitable Fintech Payments Bank of Bharti Airtel',
    sector: 'Telecommunications',
  },
  {
    queryTerm: 'royale',
    matchedSymbol: 'ASIANPAINT',
    matchedCompanyName: 'Asian Paints Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Luxury Interior Emulsion Paint Line by Asian Paints',
    sector: 'Consumer & Paints',
  },
  {
    queryTerm: 'tractor emulsion',
    matchedSymbol: 'ASIANPAINT',
    matchedCompanyName: 'Asian Paints Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Economy Distemper & Emulsion Market Leader by Asian Paints',
    sector: 'Consumer & Paints',
  },

  // --- RAILWAYS & EMS ---
  {
    queryTerm: 'railways',
    matchedSymbol: 'IRFC',
    matchedCompanyName: 'Indian Railway Finance Corporation',
    relationshipType: 'KEYWORD',
    relationshipNote: 'Dedicated Financing Arm for Indian Railways Rolling Stock & Infrastructure',
    sector: 'Financial Services',
  },
  {
    queryTerm: 'railway finance',
    matchedSymbol: 'IRFC',
    matchedCompanyName: 'Indian Railway Finance Corporation',
    relationshipType: 'KEYWORD',
    relationshipNote: 'Government NBFC funding Indian Railways capex',
    sector: 'Financial Services',
  },
  {
    queryTerm: 'vande bharat',
    matchedSymbol: 'BHEL',
    matchedCompanyName: 'Bharat Heavy Electricals Limited / IRFC',
    relationshipType: 'PRODUCT',
    relationshipNote: 'Semi-High Speed Trainsets Manufacturing JV (BHEL / Titagarh)',
    sector: 'Capital Goods',
  },
  {
    queryTerm: 'ems',
    matchedSymbol: 'DIXON',
    matchedCompanyName: 'Dixon Technologies (India) Limited',
    relationshipType: 'KEYWORD',
    relationshipNote: "India's Largest Electronic Manufacturing Services (EMS) Company",
    sector: 'Electronics Manufacturing',
  },
  {
    queryTerm: 'contract manufacturing',
    matchedSymbol: 'DIXON',
    matchedCompanyName: 'Dixon Technologies (India) Limited',
    relationshipType: 'KEYWORD',
    relationshipNote: 'Assembling smartphones, TVs, wearables, and lighting for global brands',
    sector: 'Electronics Manufacturing',
  },

  // --- GLOBAL TECH ALIASES ---
  {
    queryTerm: 'google',
    matchedSymbol: 'TCS',
    matchedCompanyName: 'Tata Consultancy Services / Tech Sector',
    relationshipType: 'ALIAS',
    relationshipNote: 'Global Tech Benchmark (Alphabet GOOGL). Top Indian IT Cloud Partners: TCS, INFY, HCLTECH',
    sector: 'IT & Software',
  },
  {
    queryTerm: 'alphabet',
    matchedSymbol: 'INFY',
    matchedCompanyName: 'Infosys Limited / Tech Sector',
    relationshipType: 'ALIAS',
    relationshipNote: 'Parent of Google (NASDAQ: GOOGL). For Indian listed enterprise software see: INFY, TCS',
    sector: 'IT & Software',
  },
  {
    queryTerm: 'apple',
    matchedSymbol: 'DIXON',
    matchedCompanyName: 'Dixon Technologies / Tata Electronics Ecosystem',
    relationshipType: 'ALIAS',
    relationshipNote: 'Global Smartphone Giant (AAPL). Key Indian Assembly Ecosystem: Dixon Technologies, Tata Group',
    sector: 'Electronics Manufacturing',
  },
  {
    queryTerm: 'microsoft',
    matchedSymbol: 'HCLTECH',
    matchedCompanyName: 'HCL Technologies / Tech Sector',
    relationshipType: 'ALIAS',
    relationshipNote: 'Global Cloud Giant (MSFT). Top Indian Systems Integrators: HCL Tech, Infosys, TCS',
    sector: 'IT & Software',
  },
  {
    queryTerm: 'fevicol',
    matchedSymbol: 'PIDILITIND',
    matchedCompanyName: 'Pidilite Industries Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Dominant Adhesive Brand commanding >70% Indian Market Share',
    sector: 'Specialty Chemicals',
  },
  {
    queryTerm: 'dr fixit',
    matchedSymbol: 'PIDILITIND',
    matchedCompanyName: 'Pidilite Industries Limited',
    relationshipType: 'BRAND',
    relationshipNote: 'Waterproofing & Construction Chemicals Brand by Pidilite',
    sector: 'Specialty Chemicals',
  },
  {
    queryTerm: 'semiconductor',
    matchedSymbol: 'TATAPOWER',
    matchedCompanyName: 'Tata Power / Tata Electronics Ecosystem',
    relationshipType: 'KEYWORD',
    relationshipNote: 'Semiconductor Fabrication Ecosystem (Tata Dholera & Morigaon mega-fabs)',
    sector: 'Power & Conglomerate',
  },
];

/**
 * Levenshtein distance for fuzzy matching and typo-tolerance
 */
export function entityLevenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix: number[][] = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;
  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (a[i - 1] === b[j - 1]) matrix[j][i] = matrix[j - 1][i - 1];
      else matrix[j][i] = Math.min(matrix[j - 1][i - 1] + 1, matrix[j][i - 1] + 1, matrix[j - 1][i] + 1);
    }
  }
  return matrix[bn][an];
}

/**
 * Find matching parent companies / subsidiaries / brands for any user search term with relevance ranking
 */
export function lookupBrandOrSubsidiary(query: string): EntityMapping[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();

  const scored = BRAND_SUBSIDIARY_MAPPINGS.map((item) => {
    const term = item.queryTerm.toLowerCase();
    const sym = item.matchedSymbol.toLowerCase();
    const compName = item.matchedCompanyName.toLowerCase();
    const sec = item.sector.toLowerCase();
    let score = 0;

    // 1. Exact Match on Brand / QueryTerm or Parent Symbol (Highest Priority)
    if (term === q || sym === q) {
      score += 100;
    }
    // 2. Prefix Match on Brand or Symbol
    else if (term.startsWith(q) || sym.startsWith(q)) {
      score += 85;
    }
    // 3. Word Prefix Match on Brand or Company Name (e.g. "reli" matching "Reliance Retail")
    else if (
      term.split(/\s+/).some((w) => w.startsWith(q)) ||
      compName.split(/\s+/).some((w) => w.startsWith(q))
    ) {
      score += 70;
    }
    // 4. Substring Match in QueryTerm or Parent Symbol
    else if (term.includes(q) || sym.includes(q)) {
      score += 50;
    }
    // 5. Substring Match in Company Full Name
    else if (compName.includes(q)) {
      score += 40;
    }
    // 6. Fuzzy / Typo Tolerance for query >= 3 chars
    else if (q.length >= 3) {
      // Check queryTerm
      const distTerm = entityLevenshteinDistance(q, term);
      if (distTerm <= (q.length <= 4 ? 1 : 2)) {
        score += 35;
      } else {
        // Check words in queryTerm and compName
        const words = [...term.split(/\s+/), ...compName.split(/\s+/)];
        for (const w of words) {
          if (w.length >= 3) {
            const prefix = w.slice(0, Math.max(q.length, 3));
            if (entityLevenshteinDistance(q, prefix) <= 1) {
              score += 30;
              break;
            }
          }
        }
      }
    }

    // 7. Sector match (only if query is descriptive and >= 4 chars)
    if (score === 0 && q.length >= 4 && (sec.startsWith(q) || sec.includes(q))) {
      score += 15;
    }

    return { item, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
}
