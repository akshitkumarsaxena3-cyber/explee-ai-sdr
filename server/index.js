import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(distPath));

// Initialize Google Gemini if API key is present
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
let genAI = null;
if (geminiApiKey) {
  try {
    genAI = new GoogleGenerativeAI(geminiApiKey);
  } catch (err) {
    console.warn('[Gemini AI] Initialization notice:', err.message);
  }
}

// Multi-model Gemini caller with fallback
async function generateWithGemini(prompt) {
  if (!genAI) return null;
  const models = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
  for (const mName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: mName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      // try next
    }
  }
  return null;
}

// Live Website Scraper Function
async function scrapeWebsiteContent(targetUrl) {
  try {
    let formattedUrl = targetUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(formattedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Extract Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract Meta Description
    const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                      html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
    const metaDesc = metaMatch ? metaMatch[1].trim() : '';

    // Extract H1 and H2
    const h1s = [...html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi)].map(m => m[1].trim()).slice(0, 3);
    const h2s = [...html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)].map(m => m[1].trim()).slice(0, 5);

    // Clean body text
    let cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 2500);

    return {
      success: true,
      url: formattedUrl,
      title,
      metaDesc,
      headings: [...h1s, ...h2s],
      textContent: cleanText
    };
  } catch (err) {
    return {
      success: false,
      url: targetUrl,
      error: err.message,
      textContent: ''
    };
  }
}

// -------------------------------------------------------------
// In-Memory Database State: Indian Market & Regional Focus 🇮🇳
// -------------------------------------------------------------
let state = {
  workspace: {
    id: 'ws_india_01',
    name: 'India B2B Growth Engine',
    credit_balance_cents: 3000, // $30.00 (~ ₹2,500 credits)
    daily_spend_limit_cents: 2000,
    spent_today_cents: 360,
    currency: 'USD',
  },
  icpProfile: {
    companyName: 'Bharat B2B & D2C Supply Network',
    websiteUrl: 'https://dehydrated-products-india.in',
    headline: 'Bulk Dehydrated Vegetables, Fruits & Spices Supply for Indian FMCG & D2C Brands',
    valueProposition: 'Direct factory sourcing of premium dehydrated onion, garlic, ginger, and fruit powders with FSSAI & ISO certification at wholesale mandi rates.',
    targetIndustries: ['FMCG & Packaged Foods', 'Spices & Seasoning Manufacturers', 'D2C Snack Brands', 'Cloud Kitchens & HORECA', 'Food Processing Exports'],
    targetHeadcounts: ['10-50 employees', '50-250 employees', '250+ enterprise'],
    targetJobTitles: ['Head of Procurement', 'Purchase Manager', 'VP Supply Chain', 'Co-Founder & COO', 'Head of Sourcing'],
    keyPainPoints: [
      'Seasonal price fluctuations in fresh raw produce',
      'High wastage and short shelf life of raw onions/garlic',
      'Unreliable wholesale mandi suppliers with inconsistent moisture & quality',
      'Difficulty finding FSSAI/APEDA compliant bulk export-grade ingredients'
    ],
    confidenceScore: 98
  },
  mailboxes: [
    { id: 'mb_1', email: 'arjun.sharma@growthreach.in', name: 'Arjun Sharma', status: 'active', dailyLimit: 50, sentToday: 26, reputation: 99.4 },
    { id: 'mb_2', email: 'priya.nair@b2bconnect.co.in', name: 'Priya Nair', status: 'active', dailyLimit: 50, sentToday: 19, reputation: 98.9 },
    { id: 'mb_3', email: 'rahul.verma@salesoutreach.in', name: 'Rahul Verma', status: 'active', dailyLimit: 50, sentToday: 31, reputation: 98.6 },
    { id: 'mb_4', email: 'ananya.iyer@directlead.in', name: 'Ananya Iyer', status: 'warming', dailyLimit: 30, sentToday: 14, reputation: 97.8 }
  ],
  campaigns: [
    {
      id: 'cmp_ind_01',
      name: '🇮🇳 India D2C & FMCG Brands — Bulk Dehydrated Ingredients Hook',
      status: 'active',
      dailyCap: 40,
      leadsCount: 168,
      sentCount: 96,
      openCount: 71, // 73.9%
      replyCount: 26, // 27.0%
      meetingsBooked: 8,
      steps: [
        {
          stepNumber: 1,
          delayDays: 0,
          subject: 'quick question re: {{company}}\'s raw ingredient sourcing',
          body: 'Namaste {{firstName}},\n\nSaw that {{company}} is rapidly expanding its product portfolio in {{location}}.\n\nMost {{jobTitle}}s in the {{industry}} sector we speak with in India struggle with erratic raw produce prices and 15-20% shelf-life wastage with traditional mandi vendors.\n\nWe provide factory-direct, FSSAI-certified dehydrated ingredients (spray-dried & hot-air dried onion, garlic, ginger powders & flakes) with guaranteed uniform quality and wholesale bulk pricing.\n\nWould you be open to a quick 5-min chat or receiving our product catalogue & bulk rate card on WhatsApp?\n\nDhanyawad,\nArjun Sharma\nHead of Enterprise Supply'
        },
        {
          stepNumber: 2,
          delayDays: 3,
          subject: 'Re: quick question re: {{company}}\'s raw ingredient sourcing',
          body: 'Hi {{firstName}},\n\nFollowing up on my previous note. We recently helped a leading D2C snack brand in Bangalore reduce their raw seasoning procurement costs by 22% while eliminating batch moisture variance.\n\nCan dispatch free lab sample pouches to your manufacturing plant if you share your shipping address, or we can connect briefly: https://cal.com/arjun-b2b/15min\n\nRegards,\nArjun Sharma\nMob/WhatsApp: +91 98112 XXXXX'
        }
      ]
    },
    {
      id: 'cmp_ind_02',
      name: '🇮🇳 Cloud Kitchens & HORECA Chains — Food Procurement Sourcing',
      status: 'paused',
      dailyCap: 30,
      leadsCount: 82,
      sentCount: 38,
      openCount: 27,
      replyCount: 9,
      meetingsBooked: 3,
      steps: [
        {
          stepNumber: 1,
          delayDays: 0,
          subject: 'cutting kitchen prep time & raw food costs for {{company}}',
          body: 'Hi {{firstName}},\n\nReaching out directly to {{company}}\'s sourcing team in {{location}}.\n\nCurious if you are evaluating dehydrated vegetable bases to cut kitchen prep time by 40% across your outlets?\n\nHappy to share free sample batches.\n\nBest,\nPriya Nair'
        }
      ]
    }
  ],
  leads: [
    {
      id: 'lead_in_1',
      firstName: 'Rohan',
      lastName: 'Aggarwal',
      jobTitle: 'Founder & CEO',
      company: 'NatureCraft Organics India',
      domain: 'naturecraftfoods.in',
      industry: 'FMCG & Packaged Foods',
      headcount: '51-200 employees',
      location: 'Gurgaon, Haryana 🇮🇳',
      email: 'rohan.aggarwal@naturecraftfoods.in',
      whatsapp: '+91 98112 43210',
      emailStatus: 'verified',
      linkedin: 'https://linkedin.com/in/rohan-aggarwal-d2c',
      techStack: ['Shopify Plus', 'Unicommerce', 'Zoho Books']
    },
    {
      id: 'lead_in_2',
      firstName: 'Ananya',
      lastName: 'Deshmukh',
      jobTitle: 'Head of Procurement & Sourcing',
      company: 'NutriBite Consumer Products Ltd',
      domain: 'nutribiteindia.com',
      industry: 'Food Processing',
      headcount: '201-500 employees',
      location: 'Mumbai, Maharashtra 🇮🇳',
      email: 'ananya.deshmukh@nutribiteindia.com',
      whatsapp: '+91 98201 87654',
      emailStatus: 'verified',
      linkedin: 'https://linkedin.com/in/ananya-deshmukh-procurement',
      techStack: ['SAP S/4HANA', 'TraceX', 'Salesforce']
    },
    {
      id: 'lead_in_3',
      firstName: 'Vikramaditya',
      lastName: 'Singhania',
      jobTitle: 'VP Supply Chain & Operations',
      company: 'SpiceRoots Consumer Brands',
      domain: 'spiceroots.in',
      industry: 'Spices & Seasoning',
      headcount: '100-250 employees',
      location: 'Bangalore, Karnataka 🇮🇳',
      email: 'vikram.singhania@spiceroots.in',
      whatsapp: '+91 98450 12345',
      emailStatus: 'verified',
      linkedin: 'https://linkedin.com/in/vikram-singhania-supplychain',
      techStack: ['Increff', 'Microsoft Dynamics', 'Shopify']
    },
    {
      id: 'lead_in_4',
      firstName: 'Suresh',
      lastName: 'Patel',
      jobTitle: 'General Manager - Raw Procurement',
      company: 'Gujarat Agro Processing & Exports',
      domain: 'gujaratagrofoods.com',
      industry: 'B2B Agri & Wholesale',
      headcount: '150-300 employees',
      location: 'Ahmedabad, Gujarat 🇮🇳',
      email: 'suresh.patel@gujaratagrofoods.com',
      whatsapp: '+91 98250 99887',
      emailStatus: 'verified',
      linkedin: 'https://linkedin.com/in/suresh-patel-agro',
      techStack: ['Tally Prime', 'TradeIndia', 'Indiamart']
    },
    {
      id: 'lead_in_5',
      firstName: 'Neha',
      lastName: 'Kulkarni',
      jobTitle: 'Head of Vendor Partnerships',
      company: 'UrbanPlate Cloud Kitchens',
      domain: 'urbanplate.co.in',
      industry: 'Cloud Kitchens & HORECA',
      headcount: '50-150 employees',
      location: 'Pune, Maharashtra 🇮🇳',
      email: 'neha.kulkarni@urbanplate.co.in',
      whatsapp: '+91 97654 32109',
      emailStatus: 'verified',
      linkedin: 'https://linkedin.com/in/neha-kulkarni-hospitality',
      techStack: ['Petpooja', 'UrbanPiper', 'Slack']
    },
    {
      id: 'lead_in_6',
      firstName: 'Amit',
      lastName: 'Malhotra',
      jobTitle: 'Co-Founder & Director',
      company: 'FreshFarm Direct Wholesale',
      domain: 'freshfarmwholesale.in',
      industry: 'B2B Food & Wholesale',
      headcount: '25-75 employees',
      location: 'New Delhi 🇮🇳',
      email: 'amit@freshfarmwholesale.in',
      whatsapp: '+91 98100 55443',
      emailStatus: 'verified',
      linkedin: 'https://linkedin.com/in/amit-malhotra-wholesale',
      techStack: ['Zoho Inventory', 'WhatsApp Business API']
    },
    {
      id: 'lead_in_7',
      firstName: 'Pooja',
      lastName: 'Iyer',
      jobTitle: 'Chief Marketing & Growth Officer',
      company: 'Aura Lifestyle & Nutrition',
      domain: 'auralifestyle.in',
      industry: 'D2C Snack Brands',
      headcount: '30-90 employees',
      location: 'Bangalore, Karnataka 🇮🇳',
      email: 'pooja.iyer@auralifestyle.in',
      whatsapp: '+91 98860 67890',
      emailStatus: 'verified',
      linkedin: 'https://linkedin.com/in/pooja-iyer-growth',
      techStack: ['Klaviyo', 'Shopify', 'Meta Ads']
    },
    {
      id: 'lead_in_8',
      firstName: 'Rajiv',
      lastName: 'Menon',
      jobTitle: 'Director of Plant Operations',
      company: 'SouthSpice Food Processing Ltd',
      domain: 'southspiceexports.com',
      industry: 'Food Processing Exports',
      headcount: '100-250 employees',
      location: 'Kochi, Kerala 🇮🇳',
      email: 'rajiv.menon@southspiceexports.com',
      whatsapp: '+91 98470 11223',
      emailStatus: 'verified',
      linkedin: 'https://linkedin.com/in/rajiv-menon-foodtech',
      techStack: ['SAP ERP', 'APEDA Portal', 'QuickBooks']
    }
  ],
  conversations: [
    {
      id: 'conv_in_1',
      campaignId: 'cmp_ind_01',
      leadId: 'lead_in_1',
      leadName: 'Rohan Aggarwal',
      company: 'NatureCraft Organics India',
      jobTitle: 'Founder & CEO',
      email: 'rohan.aggarwal@naturecraftfoods.in',
      whatsapp: '+91 98112 43210',
      sentiment: 'interested',
      status: 'open',
      isMeetingBooked: false,
      lastMessageAt: '15 mins ago',
      messages: [
        {
          direction: 'outbound',
          from: 'arjun.sharma@growthreach.in',
          to: 'rohan.aggarwal@naturecraftfoods.in',
          subject: 'quick question re: NatureCraft Organics India\'s raw ingredient sourcing',
          body: 'Namaste Rohan,\n\nSaw that NatureCraft Organics India is expanding its roasted snack line across Delhi NCR.\n\nWe provide factory-direct, FSSAI & ISO certified dehydrated onion & garlic powders at mandi-beating bulk pricing with zero moisture issues.\n\nOpen to reviewing our specification sheet and rate card on WhatsApp?',
          timestamp: 'Yesterday at 4:10 PM'
        },
        {
          direction: 'inbound',
          from: 'rohan.aggarwal@naturecraftfoods.in',
          to: 'arjun.sharma@growthreach.in',
          subject: 'Re: quick question re: NatureCraft Organics India\'s raw ingredient sourcing',
          body: 'Namaste Arjun,\n\nYes, we are actively looking for reliable suppliers for dehydrated onion powder (A-grade 100 mesh) and toasted garlic flakes for our new roasted makhana batch. Can you send 2kg lab samples to our Gurgaon unit? Also please share your per-tonne wholesale quote on WhatsApp at +91 98112 43210.',
          timestamp: '15 mins ago'
        }
      ]
    },
    {
      id: 'conv_in_2',
      campaignId: 'cmp_ind_01',
      leadId: 'lead_in_2',
      leadName: 'Ananya Deshmukh',
      company: 'NutriBite Consumer Products Ltd',
      jobTitle: 'Head of Procurement',
      email: 'ananya.deshmukh@nutribiteindia.com',
      whatsapp: '+91 98201 87654',
      sentiment: 'objection',
      status: 'open',
      isMeetingBooked: false,
      lastMessageAt: '1 hour ago',
      messages: [
        {
          direction: 'inbound',
          from: 'ananya.deshmukh@nutribiteindia.com',
          to: 'arjun.sharma@growthreach.in',
          subject: 'Re: Ingredient specs inquiry',
          body: 'What is your Minimum Order Quantity (MOQ) and do you have third-party Certificate of Analysis (COA) for pesticide residues and heavy metals?',
          timestamp: '1 hour ago'
        }
      ]
    },
    {
      id: 'conv_in_3',
      campaignId: 'cmp_ind_01',
      leadId: 'lead_in_7',
      leadName: 'Pooja Iyer',
      company: 'Aura Lifestyle & Nutrition',
      jobTitle: 'Chief Marketing Officer',
      email: 'pooja.iyer@auralifestyle.in',
      whatsapp: '+91 98860 67890',
      sentiment: 'interested',
      status: 'closed',
      isMeetingBooked: true,
      lastMessageAt: 'Yesterday',
      messages: [
        {
          direction: 'inbound',
          from: 'pooja.iyer@auralifestyle.in',
          to: 'arjun.sharma@growthreach.in',
          subject: 'Re: quick question',
          body: 'Booked 3:30 PM IST via your Cal link. Our purchase manager will also join the call.',
          timestamp: 'Yesterday'
        }
      ]
    }
  ],
  transactions: [
    { id: 'tx_in_1', description: 'Free Welcome Starter Credits', amountCents: 3000, type: 'bonus', date: '2026-11-18', balanceAfter: 3000 },
    { id: 'tx_in_2', description: 'Batch Dispatch: 48 emails (Pan-India D2C Brands)', amountCents: -192, type: 'spend_email', date: '2026-11-19', balanceAfter: 2808 },
    { id: 'tx_in_3', description: 'Lead Enrichment: 20 Indian verified contacts', amountCents: -20, type: 'spend_enrichment', date: '2026-11-19', balanceAfter: 2788 },
    { id: 'tx_in_4', description: 'Batch Dispatch: 48 emails (Gujarat Agro & Mumbai Food)', amountCents: -192, type: 'spend_email', date: '2026-11-20', balanceAfter: 2596 }
  ]
};

// -------------------------------------------------------------
// Helper: Smart India-Centric ICP Extractor
// -------------------------------------------------------------
function generateIndiaCentricICP(url, scrapedText, manualDesc) {
  let domain = url.replace(/https?:\/\//i, '').replace(/\/.*$/, '').toLowerCase();
  let baseName = domain.split('.')[0] || 'Brand';
  baseName = baseName.charAt(0).toUpperCase() + baseName.slice(1);

  const contextText = `${manualDesc || ''} ${scrapedText || ''}`.toLowerCase();

  // If dehydration / food / agriculture
  if (contextText.includes('dehydrat') || contextText.includes('vegetable') || contextText.includes('food') || contextText.includes('onion') || contextText.includes('spice')) {
    return {
      companyName: baseName + ' Food Ingredients',
      websiteUrl: url,
      headline: `Bulk Dehydrated Food Ingredients & Raw Sourcing for Indian FMCG & Brands`,
      valueProposition: `Factory-direct, FSSAI & ISO certified dehydrated vegetables, fruit powders, and seasoning blends with guaranteed quality and wholesale mandi pricing across India.`,
      targetIndustries: ['FMCG & Packaged Foods', 'Spices & Seasoning Manufacturers', 'D2C Snack Brands', 'Cloud Kitchens & HORECA', 'Food Processing Exports'],
      targetHeadcounts: ['10-50 employees', '50-250 employees', '250+ enterprise'],
      targetJobTitles: ['Head of Procurement', 'Purchase Manager', 'VP Supply Chain', 'Co-Founder & COO', 'Head of Sourcing'],
      keyPainPoints: [
        'Seasonal raw vegetable price spikes in wholesale mandis',
        '15-20% storage and transport spoilage with fresh produce',
        'Inconsistent moisture and batch quality from unorganized local traders',
        'Lack of formal FSSAI & APEDA testing documentation'
      ],
      confidenceScore: 98
    };
  }

  // Default intelligent Indian B2B model
  return {
    companyName: baseName,
    websiteUrl: url,
    headline: `Premier B2B Solutions & Growth Partner for Indian Enterprises`,
    valueProposition: `Empowers Indian businesses to scale operational capacity, cut procurement overheads, and streamline customer acquisition with high-ROI automated systems.`,
    targetIndustries: ['D2C & E-commerce Brands', 'Manufacturing & Sourcing', 'IT & Tech Services', 'FMCG & Retail Distribution'],
    targetHeadcounts: ['10-50 employees', '51-200 employees', '201-500 employees'],
    targetJobTitles: ['Founder & Managing Director', 'Head of Procurement', 'Chief Marketing Officer', 'VP of Sales & Growth'],
    keyPainPoints: [
      'High cost and unreliability in traditional Indian agency / broker channels',
      'Difficulty accessing verified decision-makers across Delhi-NCR, Mumbai & Bangalore',
      'Low response rates on cold outreach without localized Indian business context'
    ],
    confidenceScore: 95
  };
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    platform: 'Explee AI SDR Replica (Indian Market Edition 🇮🇳)',
    hasGemini: !!genAI
  });
});

// 1. Analyze Website & Extract ICP (Real Scraper + Indian B2B AI)
app.post('/api/onboarding/analyze-domain', async (req, res) => {
  const { url, manualDescription } = req.body;
  if (!url && !manualDescription) {
    return res.status(400).json({ error: 'Website URL or business description is required' });
  }

  const targetUrl = url || 'https://mybusiness.in';

  // 1. Real Website Crawl
  let crawlResult = { textContent: '', title: '', metaDesc: '', headings: [] };
  if (url && (url.includes('.') || url.startsWith('http'))) {
    crawlResult = await scrapeWebsiteContent(url);
  }

  const fullContext = `
Website URL: ${targetUrl}
Page Title: ${crawlResult.title}
Meta Description: ${crawlResult.metaDesc}
Headings: ${crawlResult.headings.join(' | ')}
Page Text: ${crawlResult.textContent}
User's Direct Business Notes: ${manualDescription || 'None provided'}
  `.trim();

  // 2. Call Gemini AI with India-Focused Prompt
  if (genAI) {
    try {
      const prompt = `You are a top-tier Indian B2B Outbound Sales Director and Go-To-Market Strategist.
Carefully examine this real company website and business description:

---
${fullContext}
---

Your goal is to build a laser-targeted B2B Ideal Customer Profile (ICP) for the INDIAN MARKET 🇮🇳.
Identify:
1. Exact Company Name and clean elevator pitch headline.
2. Value Proposition (the core business transformation provided).
3. TARGET INDUSTRIES IN INDIA: (e.g. FMCG & Packaged Foods, D2C Snack Brands, Cloud Kitchens & HORECA, Spices & Seasonings, Manufacturing, etc.).
4. TARGET DECISION-MAKER JOB TITLES IN INDIA: (e.g. Head of Procurement, Purchase Manager, VP Supply Chain, Founder & CEO, Head of Sourcing).
5. REAL PAIN POINTS INDIAN BUYERS FACE in this category (mandi price spikes, storage wastage, unorganized quality, etc.).

Return ONLY a valid JSON object matching this exact schema:
{
  "companyName": "string",
  "websiteUrl": "${targetUrl}",
  "headline": "one-sentence punchy headline",
  "valueProposition": "one sentence explaining the clear transformation/benefit",
  "targetIndustries": ["industry 1", "industry 2", "industry 3", "industry 4"],
  "targetHeadcounts": ["10-50 employees", "51-200 employees", "201-500 employees"],
  "targetJobTitles": ["Job Title 1", "Job Title 2", "Job Title 3", "Job Title 4"],
  "keyPainPoints": ["pain 1", "pain 2", "pain 3", "pain 4"],
  "confidenceScore": 98
}`;
      const text = await generateWithGemini(prompt);
      if (text) {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        state.icpProfile = parsed;
        return res.json(parsed);
      }
    } catch (err) {
      console.warn('[Gemini AI] Analysis notice:', err.message);
    }
  }

  // 3. Smart Heuristic Fallback
  const icp = generateIndiaCentricICP(targetUrl, crawlResult.textContent, manualDescription);
  state.icpProfile = icp;
  return res.json(icp);
});

// 2. Lead Discovery & Search (Filter by Indian Cities, Industries, Titles)
app.post('/api/leads/search', (req, res) => {
  const { query, jobTitle, industry, location } = req.body;
  let results = [...state.leads];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(l =>
      l.firstName.toLowerCase().includes(q) ||
      l.lastName.toLowerCase().includes(q) ||
      l.company.toLowerCase().includes(q) ||
      l.jobTitle.toLowerCase().includes(q) ||
      l.industry.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q)
    );
  }

  if (jobTitle && jobTitle !== 'All') {
    results = results.filter(l => l.jobTitle.toLowerCase().includes(jobTitle.toLowerCase()));
  }

  if (industry && industry !== 'All') {
    results = results.filter(l => l.industry.toLowerCase() === industry.toLowerCase());
  }

  if (location && location !== 'All') {
    results = results.filter(l => l.location.toLowerCase().includes(location.toLowerCase()));
  }

  res.json({
    total: results.length,
    leads: results
  });
});

// 3. Indian Lookalike Company Finder
app.post('/api/leads/lookalikes', (req, res) => {
  const { domain } = req.body;
  const mockLookalikes = [
    { name: 'Vedic Roots Consumer Products', domain: 'vedicroots.in', similarity: '98%', headcount: '80-150', industry: 'D2C Food & FMCG', location: 'Gurgaon, Haryana 🇮🇳' },
    { name: 'Bhoomi Agro Spices Ltd', domain: 'bhoomiagro.com', similarity: '95%', headcount: '120-300', industry: 'Food Processing', location: 'Ahmedabad, Gujarat 🇮🇳' },
    { name: 'PureHarvest Organics', domain: 'pureharvest.in', similarity: '92%', headcount: '40-100', industry: 'Packaged Foods', location: 'Bangalore, Karnataka 🇮🇳' }
  ];
  res.json({ seed: domain || 'indian-brand.in', lookalikes: mockLookalikes });
});

// 4. Create Campaign with India-Centric AI Copy
app.post('/api/campaigns', async (req, res) => {
  const { name, targetCriteria, dailyCap, customTone } = req.body;

  let sequence = [
    {
      stepNumber: 1,
      delayDays: 0,
      subject: `raw ingredient procurement inquiry for {{company}}`,
      body: `Namaste {{firstName}},\n\nReaching out directly regarding {{company}}\'s sourcing operations in {{location}}.\n\nWe provide factory-direct, FSSAI & ISO certified ingredients with guaranteed zero batch variance and wholesale mandi rates.\n\nWould you be open to receiving our specification sheet and wholesale rate card on WhatsApp (+91)?\n\nDhanyawad,\nArjun Sharma`
    },
    {
      stepNumber: 2,
      delayDays: 3,
      subject: `Re: raw ingredient procurement inquiry for {{company}}`,
      body: `Hi {{firstName}} - following up with a quick note.\n\nWe can dispatch free sample pouches directly to your factory or procurement office in {{location}} this week.\n\nLet me know if 10 mins works for a quick phone call: https://cal.com/arjun-b2b/demo\n\nRegards,\nArjun`
    }
  ];

  if (genAI && customTone) {
    try {
      const prompt = `Write a high-converting 2-step B2B cold email sequence tailored for INDIAN BUSINESSES 🇮🇳.
Target Persona: ${targetCriteria?.jobTitle || 'Head of Procurement'} in ${targetCriteria?.industry || 'FMCG & Food Processing'}.
Value Proposition: ${state.icpProfile.valueProposition}.
Tone: ${customTone || 'professional, respectful, direct value focus with WhatsApp option'}.
Use {{firstName}}, {{company}}, and {{location}} as variable tags.
Return ONLY valid JSON:
[
  { "stepNumber": 1, "delayDays": 0, "subject": "string", "body": "string" },
  { "stepNumber": 2, "delayDays": 3, "subject": "string", "body": "string" }
]`;
      const text = await generateWithGemini(prompt);
      if (text) {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        sequence = JSON.parse(cleaned);
      }
    } catch (e) {
      console.warn('[Gemini AI] Sequence generation fallback:', e.message);
    }
  }

  const newCampaign = {
    id: `cmp_${Date.now()}`,
    name: name || 'Pan-India B2B Outbound Campaign',
    status: 'active',
    dailyCap: parseInt(dailyCap, 10) || 35,
    leadsCount: state.leads.length,
    sentCount: 0,
    openCount: 0,
    replyCount: 0,
    meetingsBooked: 0,
    steps: sequence
  };

  state.campaigns.unshift(newCampaign);
  res.json(newCampaign);
});

// 5. Get Campaigns
app.get('/api/campaigns', (req, res) => {
  res.json({ campaigns: state.campaigns });
});

// 6. Toggle Campaign Status
app.patch('/api/campaigns/:id/toggle', (req, res) => {
  const { id } = req.params;
  const campaign = state.campaigns.find(c => c.id === id);
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }

  campaign.status = campaign.status === 'active' ? 'paused' : 'active';
  res.json(campaign);
});

// 7. Dispatch Batch of Emails (Consumes Credits Atomically)
app.post('/api/campaigns/:id/send-batch', (req, res) => {
  const { id } = req.params;
  const batchSize = parseInt(req.body.batchSize, 10) || 10;
  const campaign = state.campaigns.find(c => c.id === id);

  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }

  const costPerEmailCents = 4; // $0.04 (~ ₹3.30)
  const totalCostCents = batchSize * costPerEmailCents;

  if (state.workspace.credit_balance_cents < totalCostCents) {
    return res.status(402).json({
      error: 'Insufficient credit balance',
      requiredCents: totalCostCents,
      currentBalanceCents: state.workspace.credit_balance_cents
    });
  }

  // Deduct credits
  state.workspace.credit_balance_cents -= totalCostCents;
  state.workspace.spent_today_cents += totalCostCents;

  // Update campaign stats
  campaign.sentCount += batchSize;
  const simulatedOpens = Math.floor(batchSize * 0.74);
  const simulatedReplies = Math.floor(batchSize * 0.26);
  const simulatedMeetings = Math.random() > 0.4 ? 1 : 0;

  campaign.openCount += simulatedOpens;
  campaign.replyCount += simulatedReplies;
  campaign.meetingsBooked += simulatedMeetings;

  // Record transaction
  state.transactions.unshift({
    id: `tx_${Date.now()}`,
    description: `Batch Dispatch: ${batchSize} emails (${campaign.name.slice(0, 25)}...)`,
    amountCents: -totalCostCents,
    type: 'spend_email',
    date: new Date().toISOString().split('T')[0],
    balanceAfter: state.workspace.credit_balance_cents
  });

  res.json({
    success: true,
    dispatchedCount: batchSize,
    costCents: totalCostCents,
    newBalanceCents: state.workspace.credit_balance_cents,
    campaignStats: {
      sentCount: campaign.sentCount,
      openCount: campaign.openCount,
      replyCount: campaign.replyCount,
      meetingsBooked: campaign.meetingsBooked
    }
  });
});

// 8. Unified Inbox: Conversations & Sentiment
app.get('/api/inbox/conversations', (req, res) => {
  const { sentiment } = req.query;
  let convs = [...state.conversations];
  if (sentiment && sentiment !== 'all') {
    convs = convs.filter(c => c.sentiment === sentiment);
  }
  res.json({ conversations: convs });
});

// 9. AI Reply Assistant: Generates Indian Contextual Responses (WhatsApp / Cal)
app.post('/api/inbox/generate-reply', async (req, res) => {
  const { conversationId } = req.body;
  const conv = state.conversations.find(c => c.id === conversationId);

  if (!conv) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  let replyText = '';
  if (conv.sentiment === 'interested') {
    replyText = `Namaste ${conv.leadName.split(' ')[0]},\n\nThank you for your response! We can definitely dispatch the 2kg lab sample pouches to your Gurgaon facility right away.\n\nI will also ping you on WhatsApp at ${conv.whatsapp || '+91 98112 XXXXX'} with our complete FSSAI lab COA and wholesale price sheet.\n\nIf you prefer a quick 10-minute briefing call with our plant head, feel free to pick a time here:\nhttps://cal.com/arjun-b2b/15min\n\nDhanyawad,\nArjun Sharma\nHead of Sourcing`;
  } else if (conv.sentiment === 'objection') {
    replyText = `Namaste ${conv.leadName.split(' ')[0]},\n\nOur standard Minimum Order Quantity (MOQ) is 50 kg for trial production batches, and 500 kg for regular commercial orders. All our batches come with comprehensive NABL-accredited third-party Certificate of Analysis (COA) for moisture, ash, pesticide residue, and heavy metal testing.\n\nHappy to email you our standard COA report right now?`;
  } else if (conv.sentiment === 'unsubscribe') {
    replyText = `Namaste ${conv.leadName.split(' ')[0]},\n\nUnderstood. You have been removed from our list and will not receive any further emails. Thank you!`;
  } else {
    replyText = `Namaste ${conv.leadName.split(' ')[0]},\n\nThanks for reaching out! Let us know whenever you would like to test our samples or connect for a quick discussion.`;
  }

  res.json({ suggestedReply: replyText });
});

// 10. Send Reply in Conversation
app.post('/api/inbox/reply', (req, res) => {
  const { conversationId, bodyText } = req.body;
  const conv = state.conversations.find(c => c.id === conversationId);

  if (!conv) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  const newMessage = {
    direction: 'outbound',
    from: 'arjun.sharma@growthreach.in',
    to: conv.email,
    subject: `Re: procurement discussion`,
    body: bodyText,
    timestamp: 'Just now'
  };

  conv.messages.push(newMessage);
  conv.status = 'replied';
  conv.lastMessageAt = 'Just now';

  if (bodyText.includes('cal.com') || bodyText.includes('WhatsApp') || bodyText.includes('sample')) {
    conv.isMeetingBooked = true;
  }

  res.json({ success: true, conversation: conv });
});

// 11. Mailbox Infrastructure & Health
app.get('/api/mailboxes', (req, res) => {
  res.json({
    mailboxes: state.mailboxes,
    poolSummary: {
      totalMailboxes: state.mailboxes.length,
      activeMailboxes: state.mailboxes.filter(m => m.status === 'active').length,
      averageReputation: 98.7,
      totalSentToday: state.mailboxes.reduce((acc, m) => acc + m.sentToday, 0)
    }
  });
});

// 12. Billing & Credit Ledger
app.get('/api/billing/ledger', (req, res) => {
  res.json({
    workspace: state.workspace,
    transactions: state.transactions
  });
});

// 13. Top-up Credits
app.post('/api/billing/topup', (req, res) => {
  const { amountCents } = req.body;
  const cents = parseInt(amountCents, 10) || 5000;

  state.workspace.credit_balance_cents += cents;

  state.transactions.unshift({
    id: `tx_${Date.now()}`,
    description: `Credit Top-Up ($${(cents / 100).toFixed(2)} / ~₹${((cents / 100) * 85).toFixed(0)}) via UPI/Card`,
    amountCents: cents,
    type: 'purchase',
    date: new Date().toISOString().split('T')[0],
    balanceAfter: state.workspace.credit_balance_cents
  });

  res.json({
    success: true,
    addedCents: cents,
    newBalanceCents: state.workspace.credit_balance_cents
  });
});

// Fallback to SPA frontend for non-API routes
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  next();
});

app.listen(PORT, () => {
  console.log(`[Explee AI SDR API] Backend running on http://localhost:${PORT}`);
});
