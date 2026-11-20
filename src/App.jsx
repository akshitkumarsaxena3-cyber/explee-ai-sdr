import React, { useState, useEffect } from 'react';
import {
  Zap,
  Globe,
  Search,
  Mail,
  Send,
  Inbox,
  Server,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  Sparkles,
  Play,
  Pause,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Filter,
  DollarSign,
  Phone,
  MessageSquare,
  MapPin,
  Building2,
  FileText
} from 'lucide-react';

const INITIAL_LEADS = [
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
];

const INITIAL_CAMPAIGNS = [
  {
    id: 'cmp_ind_01',
    name: '🇮🇳 India D2C & FMCG Brands — Bulk Dehydrated Ingredients Hook',
    status: 'active',
    dailyCap: 40,
    leadsCount: 168,
    sentCount: 96,
    openCount: 71,
    replyCount: 26,
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
];

const INITIAL_CONVERSATIONS = [
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
];

const INITIAL_MAILBOXES = [
  { id: 'mb_1', email: 'arjun.sharma@growthreach.in', name: 'Arjun Sharma', status: 'active', dailyLimit: 50, sentToday: 26, reputation: 99.4 },
  { id: 'mb_2', email: 'priya.nair@b2bconnect.co.in', name: 'Priya Nair', status: 'active', dailyLimit: 50, sentToday: 19, reputation: 98.9 },
  { id: 'mb_3', email: 'rahul.verma@salesoutreach.in', name: 'Rahul Verma', status: 'active', dailyLimit: 50, sentToday: 31, reputation: 98.6 },
  { id: 'mb_4', email: 'ananya.iyer@directlead.in', name: 'Ananya Iyer', status: 'warming', dailyLimit: 30, sentToday: 14, reputation: 97.8 }
];

const INITIAL_TRANSACTIONS = [
  { id: 'tx_in_1', description: 'Free Welcome Starter Credits', amountCents: 3000, type: 'bonus', date: '2026-11-18', balanceAfter: 3000 },
  { id: 'tx_in_2', description: 'Batch Dispatch: 48 emails (Pan-India D2C Brands)', amountCents: -192, type: 'spend_email', date: '2026-11-19', balanceAfter: 2808 },
  { id: 'tx_in_3', description: 'Lead Enrichment: 20 Indian verified contacts', amountCents: -20, type: 'spend_enrichment', date: '2026-11-19', balanceAfter: 2788 },
  { id: 'tx_in_4', description: 'Batch Dispatch: 48 emails (Gujarat Agro & Mumbai Food)', amountCents: -192, type: 'spend_email', date: '2026-11-20', balanceAfter: 2596 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workspace, setWorkspace] = useState({
    credit_balance_cents: 3000,
    daily_spend_limit_cents: 2000,
    spent_today_cents: 360
  });

  // ICP Crawl state
  const [crawlUrl, setCrawlUrl] = useState('https://dehydrated-products-india.in');
  const [manualDescription, setManualDescription] = useState('We are manufacturers and bulk wholesale suppliers of dehydrated onion flakes, garlic powder, ginger powder, and spray-dried fruit powders with FSSAI & ISO certification in India.');
  const [isCrawling, setIsCrawling] = useState(false);
  const [icpData, setIcpData] = useState({
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
  });

  // Campaigns state
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState(INITIAL_CAMPAIGNS[0]);
  const [isSendingBatch, setIsSendingBatch] = useState(false);

  // Leads & Search state
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [lookalikeDomain, setLookalikeDomain] = useState('');
  const [lookalikes, setLookalikes] = useState([]);

  // Inbox state
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [selectedConv, setSelectedConv] = useState(INITIAL_CONVERSATIONS[0]);
  const [replyText, setReplyText] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  // Mailboxes & Billing
  const [mailboxes, setMailboxes] = useState(INITIAL_MAILBOXES);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [toastMessage, setToastMessage] = useState(null);

  // Notification toast helper
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial Data Fetch from backend if available
  useEffect(() => {
    fetchBilling();
    fetchCampaigns();
    fetchLeads();
    fetchInbox();
    fetchMailboxes();
  }, []);

  const fetchBilling = async () => {
    try {
      const res = await fetch('/api/billing/ledger');
      if (!res.ok) return;
      const data = await res.json();
      if (data.workspace) setWorkspace(data.workspace);
      if (data.transactions) setTransactions(data.transactions);
    } catch (err) {}
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      if (!res.ok) return;
      const data = await res.json();
      if (data.campaigns && data.campaigns.length > 0) {
        setCampaigns(data.campaigns);
        setSelectedCampaign(data.campaigns[0]);
      }
    } catch (err) {}
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          industry: selectedIndustry,
          location: selectedLocation
        })
      });
      if (!res.ok) throw new Error('Not ok');
      const data = await res.json();
      if (data.leads) setLeads(data.leads);
    } catch (err) {
      // Client-side filtering fallback for GitHub Pages
      let filtered = [...INITIAL_LEADS];
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(l =>
          l.firstName.toLowerCase().includes(q) ||
          l.lastName.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.jobTitle.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q)
        );
      }
      if (selectedIndustry !== 'All') {
        filtered = filtered.filter(l => l.industry.toLowerCase() === selectedIndustry.toLowerCase());
      }
      if (selectedLocation !== 'All') {
        filtered = filtered.filter(l => l.location.toLowerCase().includes(selectedLocation.toLowerCase()));
      }
      setLeads(filtered);
    }
  };

  const fetchInbox = async (sentiment = sentimentFilter) => {
    try {
      const url = sentiment && sentiment !== 'all' ? `/api/inbox/conversations?sentiment=${sentiment}` : '/api/inbox/conversations';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Not ok');
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
        if (!selectedConv && data.conversations.length > 0) {
          setSelectedConv(data.conversations[0]);
        }
      }
    } catch (err) {
      let convs = [...INITIAL_CONVERSATIONS];
      if (sentiment && sentiment !== 'all') {
        convs = convs.filter(c => c.sentiment === sentiment);
      }
      setConversations(convs);
      if (convs.length > 0) setSelectedConv(convs[0]);
    }
  };

  const fetchMailboxes = async () => {
    try {
      const res = await fetch('/api/mailboxes');
      if (!res.ok) return;
      const data = await res.json();
      if (data.mailboxes) setMailboxes(data.mailboxes);
    } catch (err) {}
  };

  // Actions
  const handleAnalyzeDomain = async () => {
    if (!crawlUrl && !manualDescription) return;
    setIsCrawling(true);
    try {
      const res = await fetch('/api/onboarding/analyze-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: crawlUrl,
          manualDescription
        })
      });
      if (!res.ok) throw new Error('Not ok');
      const data = await res.json();
      setIcpData(data);
      showToast(`Website analyzed! Indian ICP and personas tailored for ${data.companyName}.`);
    } catch (err) {
      // Client-side simulation on GitHub Pages
      let baseName = crawlUrl.replace(/https?:\/\//i, '').split('.')[0] || 'My Brand';
      baseName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
      const generated = {
        companyName: baseName + ' Supply Network',
        websiteUrl: crawlUrl || 'https://mybrand.in',
        headline: 'Bulk Direct Procurement for Indian FMCG, Spices & Food Manufacturers',
        valueProposition: 'Factory-direct, FSSAI-certified dehydrated vegetable flakes, fruit powders, and raw seasonings with uniform moisture and bulk wholesale pricing across India.',
        targetIndustries: ['FMCG & Packaged Foods', 'D2C Snack Brands', 'Spices & Seasoning Manufacturers', 'Cloud Kitchens & HORECA'],
        targetHeadcounts: ['10-50 employees', '50-250 employees', '250+ enterprise'],
        targetJobTitles: ['Head of Procurement', 'Purchase Manager', 'VP Supply Chain', 'Co-Founder & COO'],
        keyPainPoints: [
          'High seasonal price spikes in fresh mandi produce',
          'Storage and transportation wastage of raw produce',
          'Inconsistent batch quality and moisture from local middlemen',
          'Lack of standardized lab COA documentation'
        ],
        confidenceScore: 97
      };
      setIcpData(generated);
      showToast(`Analyzed ${baseName}! Indian ICP and buyer personas generated.`);
    } finally {
      setIsCrawling(false);
    }
  };

  const handleToggleCampaign = async (id) => {
    try {
      const res = await fetch(`/api/campaigns/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        const updated = await res.json();
        setCampaigns(prev => prev.map(c => c.id === id ? updated : c));
        if (selectedCampaign?.id === id) setSelectedCampaign(updated);
        showToast(`Campaign is now ${updated.status}`);
        return;
      }
    } catch (err) {}

    // Fallback simulation
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'active' ? 'paused' : 'active';
        showToast(`Campaign is now ${nextStatus}`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleDispatchBatch = async (campaignId) => {
    setIsSendingBatch(true);
    const costCents = 40; // 10 emails * $0.04 = $0.40 (~ ₹33)

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/send-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize: 10 })
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`Dispatched 10 emails via Indian warmed pool! (Spent $${(data.costCents / 100).toFixed(2)})`);
        fetchBilling();
        fetchCampaigns();
        setIsSendingBatch(false);
        return;
      }
    } catch (err) {}

    // Client-side simulation
    setWorkspace(prev => ({
      ...prev,
      credit_balance_cents: Math.max(0, prev.credit_balance_cents - costCents),
      spent_today_cents: prev.spent_today_cents + costCents
    }));

    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          sentCount: c.sentCount + 10,
          openCount: c.openCount + 7,
          replyCount: c.replyCount + 3,
          meetingsBooked: c.meetingsBooked + 1
        };
      }
      return c;
    }));

    setTransactions(prev => [
      {
        id: `tx_${Date.now()}`,
        description: 'Batch Dispatch: 10 emails (Indian Food & FMCG Sourcing)',
        amountCents: -costCents,
        type: 'spend_email',
        date: new Date().toISOString().split('T')[0],
        balanceAfter: workspace.credit_balance_cents - costCents
      },
      ...prev
    ]);

    showToast(`Dispatched 10 emails via Indian warmed pool! (Debited ₹33 / $0.40)`);
    setIsSendingBatch(false);
  };

  const handleGenerateAiReply = async (convId) => {
    setIsGeneratingReply(true);
    try {
      const res = await fetch('/api/inbox/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: convId })
      });
      if (res.ok) {
        const data = await res.json();
        setReplyText(data.suggestedReply);
        showToast('AI drafted Indian B2B reply with WhatsApp & sample dispatch details!');
        setIsGeneratingReply(false);
        return;
      }
    } catch (err) {}

    // Client-side simulation
    const conv = conversations.find(c => c.id === convId);
    let reply = '';
    if (conv?.sentiment === 'interested') {
      reply = `Namaste ${conv.leadName.split(' ')[0]},\n\nThank you for your response! We can definitely dispatch the 2kg lab sample pouches to your Gurgaon facility right away.\n\nI will also ping you on WhatsApp at ${conv.whatsapp || '+91 98112 XXXXX'} with our complete FSSAI lab COA and wholesale price sheet.\n\nIf you prefer a quick 10-minute briefing call with our plant head, feel free to pick a time here:\nhttps://cal.com/arjun-b2b/15min\n\nDhanyawad,\nArjun Sharma\nHead of Sourcing`;
    } else {
      reply = `Namaste ${conv?.leadName.split(' ')[0] || 'Sir'},\n\nOur standard Minimum Order Quantity (MOQ) is 50 kg for trial production batches, and 500 kg for regular commercial orders. All our batches come with comprehensive NABL-accredited third-party Certificate of Analysis (COA) for moisture, ash, pesticide residue, and heavy metal testing.\n\nHappy to email you our standard COA report right now?`;
    }
    setReplyText(reply);
    showToast('AI drafted Indian B2B reply with WhatsApp & sample details!');
    setIsGeneratingReply(false);
  };

  const handleSendReply = async () => {
    if (!replyText || !selectedConv) return;
    try {
      const res = await fetch('/api/inbox/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConv.id,
          bodyText: replyText
        })
      });
      if (res.ok) {
        const data = await res.json();
        showToast('Reply dispatched to prospect!');
        setReplyText('');
        fetchInbox();
        setSelectedConv(data.conversation);
        return;
      }
    } catch (err) {}

    // Client-side simulation
    const newMessage = {
      direction: 'outbound',
      from: 'arjun.sharma@growthreach.in',
      to: selectedConv.email,
      subject: `Re: procurement discussion`,
      body: replyText,
      timestamp: 'Just now'
    };

    const updatedConv = {
      ...selectedConv,
      messages: [...selectedConv.messages, newMessage],
      status: 'replied',
      lastMessageAt: 'Just now',
      isMeetingBooked: replyText.includes('cal.com') || replyText.includes('sample') || selectedConv.isMeetingBooked
    };

    setConversations(prev => prev.map(c => c.id === selectedConv.id ? updatedConv : c));
    setSelectedConv(updatedConv);
    setReplyText('');
    showToast('Reply dispatched via warmed mailbox!');
  };

  const handleTopupCredits = async (amountCents) => {
    try {
      const res = await fetch('/api/billing/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountCents })
      });
      if (res.ok) {
        showToast(`Added $${(amountCents / 100).toFixed(2)} (~ ₹${((amountCents / 100) * 85).toFixed(0)}) to wallet!`);
        fetchBilling();
        return;
      }
    } catch (err) {}

    // Client-side simulation
    setWorkspace(prev => ({
      ...prev,
      credit_balance_cents: prev.credit_balance_cents + amountCents
    }));
    setTransactions(prev => [
      {
        id: `tx_${Date.now()}`,
        description: `Credit Top-Up ($${(amountCents / 100).toFixed(2)} / ~₹${((amountCents / 100) * 85).toFixed(0)}) via UPI/Card`,
        amountCents: amountCents,
        type: 'purchase',
        date: new Date().toISOString().split('T')[0],
        balanceAfter: workspace.credit_balance_cents + amountCents
      },
      ...prev
    ]);
    showToast(`Added $${(amountCents / 100).toFixed(2)} (~ ₹${((amountCents / 100) * 85).toFixed(0)}) to wallet!`);
  };

  const handleFindLookalikes = async () => {
    if (!lookalikeDomain) return;
    try {
      const res = await fetch('/api/leads/lookalikes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: lookalikeDomain })
      });
      if (res.ok) {
        const data = await res.json();
        setLookalikes(data.lookalikes || []);
        return;
      }
    } catch (err) {}

    setLookalikes([
      { name: 'Vedic Roots Consumer Products', domain: 'vedicroots.in', similarity: '98%', headcount: '80-150', industry: 'D2C Food & FMCG', location: 'Gurgaon, Haryana 🇮🇳' },
      { name: 'Bhoomi Agro Spices Ltd', domain: 'bhoomiagro.com', similarity: '95%', headcount: '120-300', industry: 'Food Processing', location: 'Ahmedabad, Gujarat 🇮🇳' },
      { name: 'PureHarvest Organics', domain: 'pureharvest.in', similarity: '92%', headcount: '40-100', industry: 'Packaged Foods', location: 'Bangalore, Karnataka 🇮🇳' }
    ]);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium ${
          toastMessage.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {toastMessage.type === 'error' ? <AlertCircle className="w-5 h-5 text-rose-600" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Sidebar Navigation (Crisp Light Theme) */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between p-4 shadow-xs">
        <div>
          {/* Logo & Region Badge */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">EXPLEE</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">🇮🇳 INDIA</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">B2B Outbound SDR</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Mission Control</span>
            </button>

            <button
              onClick={() => setActiveTab('onboarding')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'onboarding'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Website to ICP Setup</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'leads'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Search className="w-4 h-4 text-indigo-600" />
              <span>Indian B2B Leads</span>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'campaigns'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Mail className="w-4 h-4 text-amber-600" />
              <span>Campaigns & Sequences</span>
            </button>

            <button
              onClick={() => setActiveTab('inbox')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'inbox'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Inbox className="w-4 h-4 text-purple-600" />
              <span>Replies & WhatsApp</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                {conversations.filter(c => c.sentiment === 'interested').length} hot
              </span>
            </button>

            <button
              onClick={() => setActiveTab('mailboxes')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'mailboxes'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Server className="w-4 h-4 text-slate-600" />
              <span>Warmed Senders</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'billing'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Wallet & Billing</span>
            </button>
          </nav>
        </div>

        {/* Credit Balance Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Credit Wallet</span>
            <span className="text-emerald-700 font-semibold">₹3.30/email</span>
          </div>
          <div className="text-xl font-bold text-slate-900 mb-2">
            ${(workspace.credit_balance_cents / 100).toFixed(2)}{' '}
            <span className="text-xs font-medium text-slate-500">
              (~₹{((workspace.credit_balance_cents / 100) * 85).toFixed(0)})
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (workspace.credit_balance_cents / 3000) * 100)}%` }}
            ></div>
          </div>
          <button
            onClick={() => handleTopupCredits(5000)}
            className="w-full py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>+ ₹4,250 Top-up ($50)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between px-6 shadow-xs">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg text-slate-900">
              {activeTab === 'dashboard' && 'Autonomous Outbound Mission Control (India 🇮🇳)'}
              {activeTab === 'onboarding' && 'Analyze Your Website & Build Indian B2B ICP'}
              {activeTab === 'leads' && 'Indian Decision-Maker Leads (Delhi, Mumbai, Bangalore)'}
              {activeTab === 'campaigns' && 'Campaign Orchestration & Indian Outreach Sequences'}
              {activeTab === 'inbox' && 'Unified Multi-Inbox, Replies & WhatsApp Connect'}
              {activeTab === 'mailboxes' && 'Warmed Senders & Deliverability Protection'}
              {activeTab === 'billing' && 'Pay-As-You-Go Credit Ledger'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>4 Inboxes Active & Warmed</span>
            </div>
            <button
              onClick={() => setActiveTab('onboarding')}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch New Campaign</span>
            </button>
          </div>
        </header>

        {/* View Switcher */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: MISSION CONTROL / DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs font-medium text-slate-500">Total Emails Dispatched</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">134</div>
                  <div className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+48 today to Indian FMCG / D2C</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs font-medium text-slate-500">Average Open Rate</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">73.9%</div>
                  <div className="text-xs text-slate-500 mt-2">
                    Industry avg in India: ~24%
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs font-medium text-slate-500">Indian Response Rate</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">27.0%</div>
                  <div className="text-xs text-emerald-700 font-semibold mt-2">
                    35 total prospect replies
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-xs">
                  <div className="text-xs font-medium text-emerald-800">Meetings & Samples Requested</div>
                  <div className="text-3xl font-black text-emerald-700 mt-1">11</div>
                  <div className="text-xs text-emerald-800 mt-2 flex items-center gap-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Gurgaon, Mumbai & Bangalore leads</span>
                  </div>
                </div>
              </div>

              {/* Instant Website Input Hero Box */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">Analyze Your Business / Website (Live Scrape)</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Apni website URL daalein ya product description likhein (e.g. Dehydrated vegetables, B2B wholesale, D2C agency). Explee live website read karke exact Indian B2B buyers aur custom pitch generate karega.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="url"
                    value={crawlUrl}
                    onChange={(e) => setCrawlUrl(e.target.value)}
                    placeholder="https://yourcompany.in (or .com)"
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualDescription}
                      onChange={(e) => setManualDescription(e.target.value)}
                      placeholder="e.g. Bulk dehydrated onion & garlic manufacturer in India"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                    <button
                      onClick={() => {
                        setActiveTab('onboarding');
                        handleAnalyzeDomain();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                    >
                      <span>Analyze Site</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Campaigns List */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Active Indian Outbound Campaigns</h3>
                    <p className="text-xs text-slate-500">Autonomous outreach running across Indian hubs (NCR, Mumbai, Bangalore)</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('campaigns')}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>Manage all campaigns</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {campaigns.map(cmp => (
                    <div key={cmp.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-semibold text-sm text-slate-900">{cmp.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            cmp.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {cmp.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-4">
                          <span>🎯 {cmp.leadsCount} Indian Leads</span>
                          <span>📤 {cmp.sentCount} Dispatched</span>
                          <span>📬 {cmp.replyCount} Replies ({(cmp.replyCount / (cmp.sentCount || 1) * 100).toFixed(0)}%)</span>
                          <span className="text-emerald-700 font-semibold">📅 {cmp.meetingsBooked} Deals/Meetings</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleCampaign(cmp.id)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title={cmp.status === 'active' ? 'Pause Campaign' : 'Resume Campaign'}
                        >
                          {cmp.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-600" />}
                        </button>
                        <button
                          onClick={() => handleDispatchBatch(cmp.id)}
                          disabled={isSendingBatch || cmp.status !== 'active'}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40"
                        >
                          <Send className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Send 10 Batch Emails (₹33)</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: URL TO ICP WIZARD (LIGHT THEME) */}
          {activeTab === 'onboarding' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span>Real Website Scraper & Indian B2B ICP Extractor</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Explee aapki live website ke HTML copy aur text ko crawl karega aur pata lagayega ke Indian market me kaunsi companies aur decision-makers (Purchase Managers, D2C Founders) aapka product khareedenge.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Website URL (Live Crawl)
                    </label>
                    <input
                      type="url"
                      value={crawlUrl}
                      onChange={(e) => setCrawlUrl(e.target.value)}
                      placeholder="https://yourwebsite.in"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Aapka Product / Business Kya Hai? (Direct Details)
                    </label>
                    <textarea
                      value={manualDescription}
                      onChange={(e) => setManualDescription(e.target.value)}
                      rows={2}
                      placeholder="e.g. Dehydrated onion flakes, garlic powder, spray-dried fruit powders manufacturer for FMCG brands in India."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <button
                    onClick={handleAnalyzeDomain}
                    disabled={isCrawling}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isCrawling ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Live Crawling Website & Running Gemini AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Analyze Website & Generate Indian ICP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ICP Results Preview */}
              {icpData && (
                <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Targeted Indian ICP</span>
                      <h3 className="text-xl font-bold text-slate-900">{icpData.companyName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{icpData.headline}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        {icpData.confidenceScore}% Indian Market Match
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Value Proposition for Indian Buyers</h4>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                        {icpData.valueProposition}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Pain Points Solved in India</h4>
                      <div className="space-y-1.5">
                        {icpData.keyPainPoints?.map((p, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5"></span>
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500 font-semibold mb-2">Indian Decision Makers</div>
                      <div className="flex flex-wrap gap-1.5">
                        {icpData.targetJobTitles?.map((t, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 font-medium shadow-2xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500 font-semibold mb-2">Target Industries (India)</div>
                      <div className="flex flex-wrap gap-1.5">
                        {icpData.targetIndustries?.map((ind, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 font-medium shadow-2xs">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500 font-semibold mb-2">Company Size</div>
                      <div className="flex flex-wrap gap-1.5">
                        {icpData.targetHeadcounts?.map((h, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 font-medium shadow-2xs">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setActiveTab('leads')}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                    >
                      Search Indian Decision-Makers
                    </button>
                    <button
                      onClick={() => setActiveTab('campaigns')}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Proceed to Indian Sequence Builder</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INDIAN B2B LEADS & LOOKALIKES */}
          {activeTab === 'leads' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Filter Bar with Indian Cities */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
                      placeholder="Search company, founder, procurement, or city..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  <button
                    onClick={fetchLeads}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors"
                  >
                    Filter
                  </button>
                </div>

                {/* City / Hub Selector */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      setTimeout(fetchLeads, 10);
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="All">Pan India 🇮🇳 (All Hubs)</option>
                    <option value="Gurgaon">Delhi-NCR / Gurgaon</option>
                    <option value="Mumbai">Mumbai / Maharashtra</option>
                    <option value="Bangalore">Bangalore / Karnataka</option>
                    <option value="Ahmedabad">Gujarat / Ahmedabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Kochi">Kerala / South India</option>
                  </select>
                </div>

                {/* Industry Selector */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <select
                    value={selectedIndustry}
                    onChange={(e) => {
                      setSelectedIndustry(e.target.value);
                      setTimeout(fetchLeads, 10);
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="FMCG & Packaged Foods">FMCG & Foods</option>
                    <option value="Food Processing">Food Processing</option>
                    <option value="Spices & Seasoning">Spices & Seasoning</option>
                    <option value="Cloud Kitchens & HORECA">Cloud Kitchens & HORECA</option>
                    <option value="D2C Snack Brands">D2C Brands</option>
                  </select>
                </div>
              </div>

              {/* Leads Table */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Verified Indian Business Contacts</h3>
                    <p className="text-xs text-slate-500">Verified emails & direct WhatsApp contacts with FSSAI/procurement roles</p>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{leads.length} contacts loaded</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-bold">Decision Maker</th>
                        <th className="py-3 px-4 font-bold">Title & Company</th>
                        <th className="py-3 px-4 font-bold">Indian Hub</th>
                        <th className="py-3 px-4 font-bold">Verified Email & WhatsApp</th>
                        <th className="py-3 px-4 font-bold">Software Stack</th>
                        <th className="py-3 px-4 text-right font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {leads.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{lead.firstName} {lead.lastName}</div>
                            <div className="text-[11px] text-slate-500">{lead.industry}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-emerald-700 font-semibold">{lead.jobTitle}</div>
                            <div className="text-[11px] text-slate-600 font-medium">
                              {lead.company}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1 font-medium text-slate-800">
                              <MapPin className="w-3.5 h-3.5 text-rose-500" />
                              <span>{lead.location}</span>
                            </div>
                            <div className="text-[10px] text-slate-500">{lead.headcount}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-mono text-slate-900 text-[11px]">{lead.email}</div>
                            {lead.whatsapp && (
                              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium mt-0.5">
                                <Phone className="w-3 h-3 text-emerald-600" />
                                <span>WhatsApp: {lead.whatsapp}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {lead.techStack?.map((t, idx) => (
                                <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                showToast(`Added ${lead.firstName} (${lead.company}) to active campaign!`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-[11px] transition-colors"
                            >
                              + Add to Campaign
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CAMPAIGNS & SEQUENCES */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Campaigns List Column */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">Campaigns</h3>
                  {campaigns.map(cmp => (
                    <div
                      key={cmp.id}
                      onClick={() => setSelectedCampaign(cmp)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedCampaign?.id === cmp.id
                          ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-slate-900">{cmp.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          cmp.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {cmp.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex justify-between">
                        <span>Daily cap: {cmp.dailyCap} emails/day</span>
                        <span className="text-emerald-700 font-bold">{cmp.meetingsBooked} Meetings</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sequence Detail Column */}
                {selectedCampaign && (
                  <div className="md:col-span-2 space-y-4">
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{selectedCampaign.name}</h3>
                        <p className="text-xs text-slate-500">Targeted Indian B2B outreach sequence with WhatsApp + sample dispatch</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleCampaign(selectedCampaign.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                        >
                          {selectedCampaign.status === 'active' ? 'Pause' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDispatchBatch(selectedCampaign.id)}
                          disabled={isSendingBatch || selectedCampaign.status !== 'active'}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-40"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch 10 Batch Emails (₹33)</span>
                        </button>
                      </div>
                    </div>

                    {/* Step Cards */}
                    <div className="space-y-4">
                      {selectedCampaign.steps?.map((step, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                                {step.stepNumber}
                              </span>
                              <span className="font-bold text-sm text-slate-900">
                                {step.stepNumber === 1 ? 'Touchpoint 1: Cold Procurement Hook' : `Touchpoint 2: Follow-up & Lab Sample (+${step.delayDays} days)`}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{step.delayDays === 0 ? 'Sent on lead discovery' : `Wait ${step.delayDays} days`}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-xs text-slate-500 font-semibold">
                              Subject: <span className="text-slate-900 font-mono font-normal">{step.subject}</span>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-line leading-relaxed">
                              {step.body}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: UNIFIED REPLY INBOX & WHATSAPP */}
          {activeTab === 'inbox' && (
            <div className="h-full flex gap-4 max-w-7xl mx-auto">
              {/* Left Pane: Conversations List */}
              <div className="w-80 border-r border-slate-200 pr-4 flex flex-col space-y-3">
                {/* Sentiment Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                  {['all', 'interested', 'objection', 'unsubscribe'].map(f => (
                    <button
                      key={f}
                      onClick={() => {
                        setSentimentFilter(f);
                        fetchInbox(f);
                      }}
                      className={`px-3 py-1 rounded-lg capitalize font-medium whitespace-nowrap transition-colors ${
                        sentimentFilter === f
                          ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-200'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                  {conversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setSelectedConv(conv);
                        setReplyText('');
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedConv?.id === conv.id
                          ? 'bg-emerald-50/60 border-emerald-400 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 truncate">{conv.leadName}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                          conv.sentiment === 'interested' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          conv.sentiment === 'objection' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {conv.sentiment}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium truncate">{conv.company}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{conv.lastMessageAt}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Pane: Thread History & AI Reply Assistant */}
              {selectedConv ? (
                <div className="flex-1 flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-5 shadow-xs overflow-hidden">
                  {/* Thread Header */}
                  <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{selectedConv.leadName}</h3>
                        <span className="text-xs text-slate-500">({selectedConv.jobTitle} at {selectedConv.company})</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs font-mono text-slate-600">{selectedConv.email}</span>
                        {selectedConv.whatsapp && (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{selectedConv.whatsapp}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedConv.isMeetingBooked && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Meeting Confirmed</span>
                      </span>
                    )}
                  </div>

                  {/* Messages Bubble List */}
                  <div className="flex-1 overflow-y-auto py-4 space-y-3">
                    {selectedConv.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col max-w-[80%] ${
                          msg.direction === 'outbound' ? 'ml-auto items-end' : 'mr-auto items-start'
                        }`}
                      >
                        <div className="text-[10px] text-slate-400 mb-1">
                          {msg.direction === 'outbound' ? 'You' : selectedConv.leadName} • {msg.timestamp}
                        </div>
                        <div
                          className={`p-3.5 rounded-2xl text-xs whitespace-pre-line leading-relaxed ${
                            msg.direction === 'outbound'
                              ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                              : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none font-medium'
                          }`}
                        >
                          {msg.body}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Reply Generator Box */}
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleGenerateAiReply(selectedConv.id)}
                        disabled={isGeneratingReply}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isGeneratingReply ? 'Generating AI Response...' : 'Auto-Draft Indian B2B Reply (WhatsApp + Samples)'}</span>
                      </button>
                      <span className="text-[11px] text-slate-400">Autonomous Indian SDR</span>
                    </div>

                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write message or click 'Auto-Draft Indian B2B Reply' above..."
                      rows={3}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-40"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                  Select a prospect conversation thread to reply
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SENDER MAILBOX POOL */}
          {activeTab === 'mailboxes' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Server className="w-5 h-5 text-emerald-600" />
                    <span>Pre-Warmed Senders Pool (India Optimized)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Managed authenticated inboxes with dedicated IP rotation, SPF, DKIM, and DMARC compliance built-in.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-700">98.7%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Pool Health Score</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mailboxes.map(mb => (
                  <div key={mb.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-slate-900">{mb.name}</div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        mb.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {mb.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="font-mono text-xs text-slate-700">{mb.email}</div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">Reputation</div>
                        <div className="font-bold text-emerald-700">{mb.reputation}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Sent Today</div>
                        <div className="font-semibold text-slate-900">{mb.sentToday} / {mb.dailyLimit}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Deliverability</div>
                        <div className="text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>100% Inbox</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CREDITS & BILLING */}
          {activeTab === 'billing' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">Available Credits</div>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    ${(workspace.credit_balance_cents / 100).toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 mt-2 font-medium">
                    ~₹{((workspace.credit_balance_cents / 100) * 85).toFixed(0)} ({Math.floor(workspace.credit_balance_cents / 4)} emails)
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">Daily Spend Cap</div>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    ${(workspace.daily_spend_limit_cents / 100).toFixed(2)}
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold mt-2">
                    ${(workspace.spent_today_cents / 100).toFixed(2)} spent today (~₹306)
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Transparent Rates</div>
                    <div className="text-xs text-slate-700 mt-1 font-mono font-medium">
                      <div>• ₹3.30 ($0.04) per cold email</div>
                      <div>• ₹0.85 ($0.01) per lead enriched</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-bold">No recurring lock-in contracts</div>
                </div>
              </div>

              {/* Instant Credit Packs */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Top-Up Credit Packs</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { amount: 5000, label: '₹4,250 ($50)', emails: '1,250 verified emails', popular: false },
                    { amount: 10000, label: '₹8,500 ($100)', emails: '2,500 verified emails', popular: true },
                    { amount: 25000, label: '₹21,250 ($250)', emails: '6,250 verified emails', popular: false }
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border relative flex flex-col justify-between ${
                        p.popular ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {p.popular && (
                        <span className="absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                          Most Popular in India
                        </span>
                      )}
                      <div>
                        <div className="font-bold text-slate-900 text-base">{p.label}</div>
                        <div className="text-xs text-emerald-700 font-bold mt-0.5">{p.emails}</div>
                      </div>
                      <button
                        onClick={() => handleTopupCredits(p.amount)}
                        className="mt-4 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                      >
                        Buy Credits (UPI / Card)
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transactions Ledger */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900 text-sm">Credit Ledger & Transaction History</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {transactions.map(tx => (
                    <div key={tx.id} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-800">{tx.description}</div>
                        <div className="text-[10px] text-slate-400">{tx.date}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono font-bold ${tx.amountCents > 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
                          {tx.amountCents > 0 ? `+` : ``}${(tx.amountCents / 100).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Balance: ${(tx.balanceAfter / 100).toFixed(2)} (~₹{((tx.balanceAfter / 100) * 85).toFixed(0)})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
