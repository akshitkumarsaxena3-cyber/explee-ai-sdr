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

// -------------------------------------------------------------
// In-Memory Database State (Production uses PostgreSQL / schema.sql)
// -------------------------------------------------------------
let state = {
  workspace: {
    id: 'ws_demo_8829',
    name: 'Acme Growth Labs',
    credit_balance_cents: 3000, // $30.00 default free credits
    daily_spend_limit_cents: 2000, // $20.00 / day
    spent_today_cents: 360, // $3.60 spent today
    currency: 'USD',
  },
  icpProfile: {
    companyName: 'ScaleVector AI',
    websiteUrl: 'https://scalevector.ai',
    headline: 'Autonomous B2B Outbound SDR & Pipeline Engine',
    valueProposition: 'Help B2B SaaS companies generate qualified pipeline without hiring manual SDRs or configuring custom DNS warmup.',
    targetIndustries: ['B2B SaaS', 'Marketing & Advertising', 'Fintech', 'Staffing & Recruiting'],
    targetHeadcounts: ['11-50 employees', '51-200 employees'],
    targetJobTitles: ['VP of Sales', 'Head of Growth', 'Chief Revenue Officer', 'Founder & CEO'],
    keyPainPoints: [
      'Cold emails landing in spam folders',
      'Spending $6,000+/mo on SDR salaries with low reply rates',
      'Fragmented stack: buying data on Apollo + warmup on Instantly + CRM'
    ]
  },
  mailboxes: [
    { id: 'mb_1', email: 'alex@scalevector-reach.com', name: 'Alex Rivera', status: 'active', dailyLimit: 50, sentToday: 24, reputation: 99.2 },
    { id: 'mb_2', email: 'sophia@scalevector-outreach.com', name: 'Sophia Chen', status: 'active', dailyLimit: 50, sentToday: 18, reputation: 98.7 },
    { id: 'mb_3', email: 'marcus@scalevector-hq.net', name: 'Marcus Vance', status: 'active', dailyLimit: 50, sentToday: 32, reputation: 98.4 },
    { id: 'mb_4', email: 'clara@scalevector-leads.io', name: 'Clara Oswald', status: 'warming', dailyLimit: 25, sentToday: 11, reputation: 97.8 }
  ],
  campaigns: [
    {
      id: 'cmp_101',
      name: 'Q4 US SaaS VPs of Sales — Pain Point Cold Hook',
      status: 'active',
      dailyCap: 45,
      leadsCount: 142,
      sentCount: 94,
      openCount: 66, // 70.2%
      replyCount: 23, // 24.5%
      meetingsBooked: 7,
      steps: [
        {
          stepNumber: 1,
          delayDays: 0,
          subject: 'quick question re: {{company}}\'s outbound pipeline',
          body: 'Hey {{firstName}},\n\nSaw that {{company}} is actively scaling the sales team. Most {{jobTitle}}s we speak with in {{industry}} are hitting a wall with SDR cold email deliverability lately.\n\nWe built an autonomous AI SDR that finds verified decision-makers, sends from pre-warmed inboxes, and books meetings directly into your calendar for ~$0.04/email.\n\nWould you be against a 5-min intro this Thursday to see how it works?\n\nBest,\nAlex Rivera\nScaleVector'
        },
        {
          stepNumber: 2,
          delayDays: 3,
          subject: 'Re: quick question re: {{company}}\'s outbound pipeline',
          body: 'Hey {{firstName}} - following up with a quick stat: one of our B2B SaaS partners booked 18 qualified demos in their first 14 days using this exact flow.\n\nHere is my direct calendar if 10 mins works: https://cal.com/alex-scalevector/demo\n\nCheers,\nAlex'
        }
      ]
    },
    {
      id: 'cmp_102',
      name: 'Fintech Head of Growth — Lead Pipeline Engine',
      status: 'paused',
      dailyCap: 30,
      leadsCount: 88,
      sentCount: 42,
      openCount: 29, // 69.0%
      replyCount: 9, // 21.4%
      meetingsBooked: 3,
      steps: [
        {
          stepNumber: 1,
          delayDays: 0,
          subject: 'cutting outbound CAC for {{company}}',
          body: 'Hi {{firstName}},\n\nI noticed {{company}} has been expanding fast across {{location}}.\n\nCurious if you are looking at ways to generate qualified accounts without burning cash on traditional SDR agencies?\n\nOpen to exchanging notes?\n\nRegards,\nSophia'
        }
      ]
    }
  ],
  leads: [
    {
      id: 'lead_1',
      firstName: 'David',
      lastName: 'Sterling',
      jobTitle: 'VP of Sales',
      company: 'Dataspire Tech',
      domain: 'dataspire.io',
      industry: 'B2B SaaS',
      headcount: '51-200 employees',
      location: 'San Francisco, CA',
      email: 'david.sterling@dataspire.io',
      emailStatus: 'verified',
      linkedin: 'https://linkedin.com/in/david-sterling-sales',
      techStack: ['Salesforce', 'HubSpot', 'Stripe']
    },
    {
      id: 'lead_2',
      firstName: 'Elena',
      lastName: 'Rostova',
      jobTitle: 'Head of Growth',
      company: 'PayFlow Global',
      domain: 'payflowglobal.com',
      industry: 'Fintech',
      headcount: '201-500 employees',
      location: 'New York, NY',
      email: 'e.rostova@payflowglobal.com',
      emailStatus: 'verified',
      linkedin: 'https://linkedin.com/in/elena-rostova-growth',
      techStack: ['Segment', 'Mixpanel', 'Snowflake']
    },
    {
      id: 'lead_3',
      firstName: 'Nathan',
      lastName: 'Cole',
      jobTitle: 'Chief Revenue Officer',
      company: 'CloudMetrics Inc',
      domain: 'cloudmetrics.net',
      industry: 'B2B SaaS',
      headcount: '11-50 employees',
      location: 'Austin, TX',
      email: 'nathan@cloudmetrics.net',
      emailStatus: 'verified',
      linkedin: 'https://linkedin.com/in/nathan-cole-cro',
      techStack: ['AWS', 'Next.js', 'PostgreSQL']
    },
    {
      id: 'lead_4',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      jobTitle: 'VP Business Development',
      company: 'AdScale Media',
      domain: 'adscalemedia.com',
      industry: 'Marketing & Advertising',
      headcount: '51-200 employees',
      location: 'London, UK',
      email: 'sarah.j@adscalemedia.com',
      emailStatus: 'verified',
      linkedin: 'https://linkedin.com/in/sarah-jenkins-adscale',
      techStack: ['Google Ads', 'Meta API', 'Shopify']
    },
    {
      id: 'lead_5',
      firstName: 'Jason',
      lastName: 'Kovac',
      jobTitle: 'Founder & CEO',
      company: 'HireSprint',
      domain: 'hiresprint.io',
      industry: 'Staffing & Recruiting',
      headcount: '11-50 employees',
      location: 'Toronto, Canada',
      email: 'jason@hiresprint.io',
      emailStatus: 'verified',
      linkedin: 'https://linkedin.com/in/jason-kovac-recruiting',
      techStack: ['Greenhouse', 'Slack', 'Linear']
    },
    {
      id: 'lead_6',
      firstName: 'Priya',
      lastName: 'Sharma',
      jobTitle: 'Director of Demand Gen',
      company: 'SecurePulse Systems',
      domain: 'securepulse.com',
      industry: 'Cybersecurity',
      headcount: '100-250 employees',
      location: 'Chicago, IL',
      email: 'psharma@securepulse.com',
      emailStatus: 'verified',
      linkedin: 'https://linkedin.com/in/priya-sharma-demandgen',
      techStack: ['Marketo', 'Palo Alto', 'CrowdStrike']
    }
  ],
  conversations: [
    {
      id: 'conv_1',
      campaignId: 'cmp_101',
      leadId: 'lead_1',
      leadName: 'David Sterling',
      company: 'Dataspire Tech',
      jobTitle: 'VP of Sales',
      email: 'david.sterling@dataspire.io',
      sentiment: 'interested',
      status: 'open',
      isMeetingBooked: false,
      lastMessageAt: '12 mins ago',
      messages: [
        {
          direction: 'outbound',
          from: 'alex@scalevector-reach.com',
          to: 'david.sterling@dataspire.io',
          subject: 'quick question re: Dataspire Tech\'s outbound pipeline',
          body: 'Hey David,\n\nSaw that Dataspire Tech is actively scaling the sales team. Most VP of Saless we speak with in B2B SaaS are hitting a wall with SDR cold email deliverability lately.\n\nWe built an autonomous AI SDR that finds verified decision-makers, sends from pre-warmed inboxes, and books meetings directly into your calendar for ~$0.04/email.\n\nWould you be against a 5-min intro this Thursday to see how it works?\n\nBest,\nAlex Rivera',
          timestamp: 'Yesterday at 3:15 PM'
        },
        {
          direction: 'inbound',
          from: 'david.sterling@dataspire.io',
          to: 'alex@scalevector-reach.com',
          subject: 'Re: quick question re: Dataspire Tech\'s outbound pipeline',
          body: 'Hey Alex,\n\nActually yes, our SDRs have been complaining about Google Workspace burn rates this quarter. Does this include pre-warmed inboxes or do we need to bring our own? Send over your booking link, I have 15 mins Friday afternoon.',
          timestamp: '12 mins ago'
        }
      ]
    },
    {
      id: 'conv_2',
      campaignId: 'cmp_101',
      leadId: 'lead_2',
      leadName: 'Elena Rostova',
      company: 'PayFlow Global',
      jobTitle: 'Head of Growth',
      email: 'e.rostova@payflowglobal.com',
      sentiment: 'objection',
      status: 'open',
      isMeetingBooked: false,
      lastMessageAt: '2 hours ago',
      messages: [
        {
          direction: 'outbound',
          from: 'alex@scalevector-reach.com',
          to: 'e.rostova@payflowglobal.com',
          subject: 'quick question re: PayFlow Global\'s outbound pipeline',
          body: 'Hey Elena,\n\nNoticed PayFlow Global expanding fast. Quick question: are you evaluating ways to automate cold outbound without burning cash on traditional SDR tools?\n\nBest,\nAlex',
          timestamp: 'Yesterday'
        },
        {
          direction: 'inbound',
          from: 'e.rostova@payflowglobal.com',
          to: 'alex@scalevector-reach.com',
          subject: 'Re: quick question re: PayFlow Global\'s outbound pipeline',
          body: 'We currently run Apollo and Instantly. What specific differentiator does your platform provide over that combo?',
          timestamp: '2 hours ago'
        }
      ]
    },
    {
      id: 'conv_3',
      campaignId: 'cmp_101',
      leadId: 'lead_5',
      leadName: 'Jason Kovac',
      company: 'HireSprint',
      jobTitle: 'Founder & CEO',
      email: 'jason@hiresprint.io',
      sentiment: 'interested',
      status: 'closed',
      isMeetingBooked: true,
      lastMessageAt: '1 day ago',
      messages: [
        {
          direction: 'inbound',
          from: 'jason@hiresprint.io',
          to: 'alex@scalevector-reach.com',
          subject: 'Re: quick question',
          body: 'Sounds good Alex. Booked 2:30pm EST via your Cal link. See you then.',
          timestamp: '1 day ago'
        }
      ]
    },
    {
      id: 'conv_4',
      campaignId: 'cmp_101',
      leadId: 'lead_4',
      leadName: 'Sarah Jenkins',
      company: 'AdScale Media',
      jobTitle: 'VP Business Development',
      email: 'sarah.j@adscalemedia.com',
      sentiment: 'unsubscribe',
      status: 'closed',
      isMeetingBooked: false,
      lastMessageAt: '2 days ago',
      messages: [
        {
          direction: 'inbound',
          from: 'sarah.j@adscalemedia.com',
          to: 'alex@scalevector-reach.com',
          subject: 'Re: quick question',
          body: 'Not interested at this time, please remove from your list.',
          timestamp: '2 days ago'
        }
      ]
    }
  ],
  transactions: [
    { id: 'tx_1', description: 'Free Welcome Starter Credits', amountCents: 3000, type: 'bonus', date: '2026-11-18', balanceAfter: 3000 },
    { id: 'tx_2', description: 'Batch Dispatch: 42 emails (Q4 US SaaS VPs)', amountCents: -168, type: 'spend_email', date: '2026-11-19', balanceAfter: 2832 },
    { id: 'tx_3', description: 'Lead Enrichment: 15 verified contacts', amountCents: -15, type: 'spend_enrichment', date: '2026-11-19', balanceAfter: 2817 },
    { id: 'tx_4', description: 'Batch Dispatch: 52 emails (Q4 US SaaS VPs)', amountCents: -208, type: 'spend_email', date: '2026-11-20', balanceAfter: 2609 }
  ]
};

// -------------------------------------------------------------
// Helper: Fallback / Smart Heuristic ICP Generator
// -------------------------------------------------------------
function generateHeuristicICP(url) {
  let domain = url.replace(/https?:\/\//i, '').replace(/\/.*$/, '').toLowerCase();
  let baseName = domain.split('.')[0] || 'Company';
  baseName = baseName.charAt(0).toUpperCase() + baseName.slice(1);

  return {
    companyName: baseName,
    websiteUrl: url,
    headline: `Modern Solutions & Growth Platform for ${baseName}`,
    valueProposition: `Empowers teams using ${baseName} to accelerate customer acquisition and streamline daily operations with intelligent automation.`,
    targetIndustries: ['B2B SaaS', 'Technology Services', 'Enterprise Software', 'E-commerce'],
    targetHeadcounts: ['11-50 employees', '51-200 employees'],
    targetJobTitles: ['VP of Sales', 'Head of Growth', 'Chief Technology Officer', 'Director of Operations'],
    keyPainPoints: [
      'High cost and friction in acquiring qualified B2B opportunities',
      'Fragmented tech stack and manual data verification tasks',
      'Scaling outreach volume without hurting domain deliverability'
    ],
    confidenceScore: 94
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
    platform: 'Explee AI SDR Replica',
    hasGemini: !!genAI
  });
});

// 1. Analyze Website & Generate ICP
app.post('/api/onboarding/analyze-domain', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // If Gemini is available, attempt intelligent reasoning
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Analyze this company website domain: "${url}".
Return ONLY a valid JSON object with the following fields:
{
  "companyName": "string",
  "websiteUrl": "${url}",
  "headline": "one-sentence punchy elevator pitch",
  "valueProposition": "one sentence explaining the transformation/result provided",
  "targetIndustries": ["industry1", "industry2", "industry3"],
  "targetHeadcounts": ["11-50 employees", "51-200 employees"],
  "targetJobTitles": ["Job Title 1", "Job Title 2", "Job Title 3"],
  "keyPainPoints": ["pain1", "pain2", "pain3"],
  "confidenceScore": 95
}`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      state.icpProfile = parsed;
      return res.json(parsed);
    } catch (err) {
      console.warn('[Gemini AI] Falling back to heuristic extractor:', err.message);
    }
  }

  // Fallback to high-quality heuristic extraction
  const icp = generateHeuristicICP(url);
  state.icpProfile = icp;
  return res.json(icp);
});

// 2. Lead Discovery & Search
app.post('/api/leads/search', (req, res) => {
  const { query, jobTitle, industry, headcount, location } = req.body;
  let results = [...state.leads];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(l => 
      l.firstName.toLowerCase().includes(q) ||
      l.lastName.toLowerCase().includes(q) ||
      l.company.toLowerCase().includes(q) ||
      l.jobTitle.toLowerCase().includes(q) ||
      l.industry.toLowerCase().includes(q)
    );
  }

  if (jobTitle && jobTitle !== 'All') {
    results = results.filter(l => l.jobTitle.toLowerCase().includes(jobTitle.toLowerCase()));
  }

  if (industry && industry !== 'All') {
    results = results.filter(l => l.industry.toLowerCase() === industry.toLowerCase());
  }

  res.json({
    total: results.length,
    leads: results
  });
});

// 3. Lookalike Company Finder
app.post('/api/leads/lookalikes', (req, res) => {
  const { domain } = req.body;
  const mockLookalikes = [
    { name: 'ApexScale Technologies', domain: 'apexscale.io', similarity: '98%', headcount: '45-120', industry: 'B2B SaaS', country: 'US' },
    { name: 'SynapseGrowth', domain: 'synapsegrowth.com', similarity: '94%', headcount: '80-200', industry: 'B2B SaaS', country: 'US' },
    { name: 'Vanguard Pipeline', domain: 'vanguardpipeline.net', similarity: '91%', headcount: '30-75', industry: 'Sales Tech', country: 'UK' }
  ];
  res.json({ seed: domain || 'target.com', lookalikes: mockLookalikes });
});

// 4. Create Campaign with AI Copy
app.post('/api/campaigns', async (req, res) => {
  const { name, targetCriteria, dailyCap, customTone } = req.body;

  let sequence = [
    {
      stepNumber: 1,
      delayDays: 0,
      subject: `quick thought for {{company}}`,
      body: `Hi {{firstName}},\n\nSaw that you lead ${targetCriteria?.jobTitle || 'growth'} at {{company}}.\n\nWe helped teams in ${targetCriteria?.industry || 'tech'} replace manual prospecting with an autonomous AI SDR that sends from pre-warmed mailboxes.\n\nAre you open to a brief 5-minute chat to see how many qualified pipeline leads it can generate for {{company}}?\n\nBest,\nAlex Rivera`
    },
    {
      stepNumber: 2,
      delayDays: 3,
      subject: `Re: quick thought for {{company}}`,
      body: `Hey {{firstName}} - following up here.\n\nWe recently enabled a similar team to book 14 qualified discovery calls in week one with zero deliverability issues.\n\nGrab a slot on my calendar if 10 mins works: https://cal.com/founder/demo\n\nCheers,\nAlex`
    }
  ];

  if (genAI && customTone) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Write a high-converting 2-step B2B cold email sequence.
Target Persona: ${targetCriteria?.jobTitle || 'VP of Sales'} in ${targetCriteria?.industry || 'B2B SaaS'}.
Value Proposition: ${state.icpProfile.valueProposition}.
Tone: ${customTone || 'conversational, concise, value-focused'}.
Use {{firstName}} and {{company}} as variable tags.
Return ONLY valid JSON:
[
  { "stepNumber": 1, "delayDays": 0, "subject": "string", "body": "string" },
  { "stepNumber": 2, "delayDays": 3, "subject": "string", "body": "string" }
]`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      sequence = JSON.parse(cleaned);
    } catch (e) {
      console.warn('[Gemini AI] Sequence generation fallback:', e.message);
    }
  }

  const newCampaign = {
    id: `cmp_${Date.now()}`,
    name: name || 'New Autonomous Outbound Campaign',
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

  const costPerEmailCents = 4; // $0.04
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
  const simulatedOpens = Math.floor(batchSize * 0.7);
  const simulatedReplies = Math.floor(batchSize * 0.22);
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

// 9. AI Reply Assistant: Generates tailored response based on sentiment
app.post('/api/inbox/generate-reply', async (req, res) => {
  const { conversationId } = req.body;
  const conv = state.conversations.find(c => c.id === conversationId);

  if (!conv) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  const lastInbound = conv.messages.slice().reverse().find(m => m.direction === 'inbound');
  const inboundText = lastInbound ? lastInbound.body : '';

  let replyText = '';
  if (conv.sentiment === 'interested') {
    replyText = `Hi ${conv.leadName.split(' ')[0]},\n\nGreat to hear! Yes, we handle the entire sender mailbox infrastructure and warm-up automatically so you don't need to configure Google Workspace or DNS records.\n\nFeel free to pick any slot that fits your schedule here:\nhttps://cal.com/alex-scalevector/15min\n\nLooking forward to speaking!\n\nBest,\nAlex`;
  } else if (conv.sentiment === 'objection') {
    replyText = `Hi ${conv.leadName.split(' ')[0]},\n\nGreat question. The main difference is speed and consolidation: unlike Apollo + Instantly where you have to manually buy domains, configure SPF/DKIM/DMARC, and wait 3 weeks for warmup, Explee handles autonomous sourcing and sending from pre-warmed pools out of the box with zero setup.\n\nHappy to share a 3-minute video showing the side-by-side workflow if helpful?\n\nBest,\nAlex`;
  } else if (conv.sentiment === 'unsubscribe') {
    replyText = `Hi ${conv.leadName.split(' ')[0]},\n\nYou have been removed from our list and all future communications have been suppressed. Have a great week!`;
  } else {
    replyText = `Hi ${conv.leadName.split(' ')[0]},\n\nThanks for following up! Happy to answer any questions or show you a quick demo whenever convenient.`;
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
    from: 'alex@scalevector-reach.com',
    to: conv.email,
    subject: `Re: follow-up`,
    body: bodyText,
    timestamp: 'Just now'
  };

  conv.messages.push(newMessage);
  conv.status = 'replied';
  conv.lastMessageAt = 'Just now';

  if (bodyText.includes('cal.com') || bodyText.includes('calendar')) {
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
      averageReputation: 98.5,
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
    description: `Credit Top-Up ($${(cents / 100).toFixed(2)}) via Stripe`,
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
