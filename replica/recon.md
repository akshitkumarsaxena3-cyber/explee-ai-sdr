# Recon map: Explee (Web)

Scope: Autonomous AI Outbound SDR, B2B Prospecting Database & Cold Outreach Platform  
For: B2B SaaS founders, sales teams, and agencies looking for an automated outbound engine without manual email infrastructure setup  
Date: 2026-11-20

---

## Sources

| # | Source | URL | Notes |
|---|--------|-----|-------|
| 1 | Marketing & Platform Site | `https://explee.com/` | Core pitch, features, pricing model, and product positioning |
| 2 | AutoGTM Transition & Product Docs | `https://explee.com/` (formerly AutoGTM) | AI SDR mechanics, prompt workflows, and credit transition notes |
| 3 | Public Teardowns & Reviews | G2, QuotaEngine, Futurepedia, Salesforge teardowns | Real user workflows, inbox warmup behaviors, and feature sets |
| 4 | Pricing & Credit Structure | `https://explee.com/pricing` | Pay-as-you-go breakdown ($0.04/email, $10/1k decision makers) |
| 5 | Public Discussions & Feedback | Reddit (r/sales, r/SaaS) | User feedback on deliverability, inbox replies, and lead accuracy |

---

## Core loop

**Enter your website URL -> AI learns your ICP & sources verified decision-makers -> AI writes personalized cold emails & sends them via pre-warmed inboxes -> AI qualifies replies and books meetings directly into your calendar.**

---

## Screens

| ID | Screen | Route / How to reach | Purpose | Key Components | States Seen |
|---|--------|----------------------|---------|----------------|-------------|
| **S01** | Landing & Hero | `/` | Explain value prop, input website URL to preview ICP, CTA to start free | URL input box, interactive ICP demo preview, feature highlights, social proof | Default, URL submitted / loading, error |
| **S02** | Authentication | `/login` / `/signup` | Sign in or register account via Google OAuth or Magic Link | OAuth button, email magic link input, Terms of Service checkbox | Empty, submitting, sent link, auth error |
| **S03** | Onboarding / ICP Wizard | `/onboarding` (after S02) | Crawl user domain, confirm value proposition, refine target audience and personas | Website summary card, persona tag editor, target criteria selectors (industry, size, titles), "Start Campaign" CTA | Crawling/analyzing, review & edit, saving |
| **S04** | Main Dashboard | `/dashboard` | High-level overview of outreach health, email volume, replies, and hot leads | KPI metric cards (Sent, Open %, Reply %, Hot Leads), credit meter, active campaigns table, recent activity feed | Empty (no campaigns yet), active, depleted credits warning |
| **S05** | B2B Prospect Search | `/search` or `/leads` | Query company and people database via natural language or filters | Semantic search bar, filter panel (industry, headcount, geography, job level), lead table, lookalike seed input | Empty search, loading results, populated list, lead selection active |
| **S06** | Lead / Company Inspector | Slide-over / Modal from S05/S08 | Inspect company firmographics and verified decision-maker contact details | Company metadata badge, tech stack tags, employee roster, verified email status chip, export/add-to-campaign button | Loading, verified email shown, unverified/catchall warning |
| **S07** | Campaign Builder | `/campaigns/new` | Set campaign targeting criteria, sequence steps, AI copy prompt guidelines, and daily budget | Step-by-step wizard, prompt tone/goal controls, email sequence preview, variable inserter (`{{firstName}}`, `{{company}}`), budget slider | Step 1 (Audience), Step 2 (Copy generation), Step 3 (Review & Test), Launching |
| **S08** | Campaign Detail & Sequences | `/campaigns/:id` | Monitor specific campaign metrics, edit schedule, pause/resume, review sent copy | Status toggle (Active/Paused), sequence performance breakdown (Step 1 vs Step 2), sent email logs, daily cap slider | Active, paused, completed, out of credits |
| **S09** | Unified Inbox | `/inbox` | Multi-inbox reply triage, view prospect responses, classification, and booking links | Split pane (thread list + conversation view), sentiment badge (Interested, Objection, OOO, Unsubscribe), reply composer, book meeting CTA | Empty inbox, selected conversation, AI auto-replied state |
| **S10** | Sender Infrastructure | `/settings/mailboxes` | View managed pre-warmed inbox pools and health status | Mailbox health status cards, warm-up progress meters, custom domain connector (BYO SMTP/Workspace) | Healthy, warming up, reputation caution |
| **S11** | Billing & Credit Ledger | `/settings/billing` | Monitor pay-as-you-go credit balance, top-up credits, set daily spend cap, review invoices | Credit balance display, auto-recharge toggle, Stripe payment card, spend breakdown graph, invoice history table | Active balance, low credit warning ($<5), payment failed alert |

---

## Flows

### F01: Instant Onboarding & First Campaign Generation
```
S01 Landing -> Input company URL -> S02 Fast Sign up -> S03 AI crawls domain & proposes ICP ->
S07 Confirm personas & generate first sequence -> S04 Dashboard with live active campaign
Happy path clicks: 5 clicks
Edge cases:
- Domain has strict bot protection / cannot be crawled (fallback to manual text description prompt)
- No target titles matched (prompt user to broaden title search)
- User signs up without payment method (provide starter trial credits e.g. $30 / 750 emails)
```

### F02: Semantic Prospect Search & Lookalike Discovery
```
S04 Dashboard -> S05 Search -> Type prompt (e.g. "Fintech CTOs in UK with 20-100 staff") ->
S06 Inspect company & verified contacts -> Select rows -> Click "Add to Campaign"
Happy path clicks: 4 clicks
Edge cases:
- Low match count (suggest query expansions and alternative job titles)
- Email unverified / bounce risk (flag with caution chip, allow user to exclude from sending)
```

### F03: Autonomous Campaign Launch with Budget Cap
```
S04 Dashboard -> S07 New Campaign -> Select target audience criteria ->
AI generates 2-step sequence -> User edits subject/body tokens -> Set daily spend limit ($10/day) -> Launch
Happy path clicks: 6 clicks
Edge cases:
- Spam word trigger in AI copy (real-time deliverability warnings before launch)
- Budget exceeded / insufficient credits (modal prompt to top up via S11)
```

### F04: Reply Triage & Meeting Booking
```
Notification / S04 Dashboard -> S09 Unified Inbox -> Filter by "Interested" ->
View AI auto-drafted reply with booking link -> Confirm or manually edit reply -> Send
Happy path clicks: 3 clicks
Edge cases:
- Prospect asks an unusual technical or pricing objection (AI tags "Needs Human Review")
- Prospect replies "Unsubscribe" (automatic domain/lead suppression without human intervention)
```

### F05: Credit Auto-Recharge & Spend Management
```
S04 Dashboard (Credit Meter alert) -> S11 Billing -> Configure auto-recharge threshold ->
Enter Stripe details -> Set maximum monthly safety cap -> Save
Happy path clicks: 4 clicks
Edge cases:
- Credit card charge fails (grace period notification, pause sending until resolved)
```

---

## Components

| Component | Variants | States | Used On |
|-----------|----------|--------|---------|
| **Button** | Primary (solid accent), Secondary (outline), Ghost, Danger | Default, Hover, Focus, Disabled, Loading | All screens |
| **DomainCrawlInput** | Large hero input, compact form input | Empty, Valid URL, Crawling/Spinner, Error | S01, S03 |
| **StatCard** | Number with %, Currency, Simple counter | Default, Loading skeleton, Trend up, Trend down | S04, S08, S11 |
| **CreditMeter** | Header badge, Full card with progress bar | Normal (>20%), Low (<20%), Depleted (0%), Recharging | S04, S08, S11 |
| **LeadTable** | Selectable rows, compact list | Default, Row selected, Multi-selected, Empty, Loading | S05, S08 |
| **SentimentBadge** | Interested (green), Objection (yellow), OOO (blue), Unsubscribe (red) | Static tag | S09 |
| **SequenceStepCard** | Step 1 (Initial), Step 2+ (Follow-up), Delay indicator | Collapsed, Expanded/Editing, Dragging | S07, S08 |
| **VariablePill** | `{{firstName}}`, `{{company}}`, `{{customHook}}` | Default, Clicked to insert, Invalid token | S07, S08, S09 |
| **ConversationPane** | Split chat/email view, message bubble | Incoming, Outgoing, AI-Generated draft | S09 |
| **FilterDrawer** | Multi-select accordion, range slider (headcount), tag input | Open, Closed, Applied count | S05, S07 |
| **Modal / SlideOver** | Centered modal (Checkout/Confirm), Right slide-over (Lead details) | Hidden, Visible, Animating | S05, S06, S11 |

---

## Inferred data model

```
Workspace
  id: uuid
  name: string
  created_at: timestamp
  credit_balance_cents: integer
  auto_recharge_enabled: boolean
  auto_recharge_threshold_cents: integer
  auto_recharge_amount_cents: integer
  daily_spend_limit_cents: integer
  evidence: S04 credit meter, S11 billing settings
  confidence: high

User
  id: uuid
  workspace_id: uuid (foreign key)
  email: string
  name: string
  role: string (owner | member)
  created_at: timestamp
  evidence: S02 auth, S11 settings
  confidence: high

ICPProfile
  id: uuid
  workspace_id: uuid
  website_url: string
  company_summary: text
  value_proposition: text
  target_industries: text[]
  target_headcounts: string[]
  target_job_titles: text[]
  target_geographies: text[]
  evidence: S03 onboarding wizard, S07 campaign targeting
  confidence: high

Company
  id: uuid
  domain: string
  name: string
  description: text
  industry: string
  headcount_range: string
  country: string
  city: string
  linkedin_url: string
  technologies: text[]
  evidence: S05 prospect search, S06 company inspector
  confidence: high

Lead
  id: uuid
  company_id: uuid (foreign key)
  first_name: string
  last_name: string
  job_title: string
  seniority: string
  email: string
  email_verification_status: string (valid | catchall | invalid)
  linkedin_url: string
  location: string
  evidence: S05 lead table, S06 inspector
  confidence: high

Campaign
  id: uuid
  workspace_id: uuid
  icp_profile_id: uuid
  name: string
  status: string (draft | active | paused | completed)
  daily_email_cap: integer
  daily_spend_limit_cents: integer
  target_filter_json: jsonb
  created_at: timestamp
  evidence: S07 builder, S08 detail
  confidence: high

CampaignSequenceStep
  id: uuid
  campaign_id: uuid (foreign key)
  step_number: integer
  delay_days: integer
  subject_template: text
  body_template: text
  ai_generation_prompt: text
  evidence: S07 sequence builder
  confidence: high

SentEmail
  id: uuid
  campaign_id: uuid
  lead_id: uuid
  sender_mailbox_id: uuid
  step_number: integer
  subject: text
  body_text: text
  status: string (queued | sent | delivered | bounced | opened | replied)
  sent_at: timestamp
  opened_at: timestamp
  replied_at: timestamp
  evidence: S08 email logs, S09 inbox
  confidence: high

ConversationThread
  id: uuid
  campaign_id: uuid
  lead_id: uuid
  latest_sentiment: string (interested | objection | ooo | unsubscribe | neutral)
  status: string (open | replied | booked | closed)
  updated_at: timestamp
  evidence: S09 unified inbox
  confidence: high

SenderMailbox
  id: uuid
  workspace_id: uuid (nullable for shared pool)
  email_address: string
  is_managed_pool: boolean
  daily_sent_count: integer
  daily_max_limit: integer
  reputation_score: float
  status: string (active | warming | paused | burned)
  evidence: S10 mailboxes view, auto-warmup disclosures
  confidence: medium
```

### Entity Relationships
- `Workspace` 1-n `User`
- `Workspace` 1-n `ICPProfile`
- `Workspace` 1-n `Campaign`
- `Campaign` 1-n `CampaignSequenceStep`
- `Company` 1-n `Lead`
- `Campaign` 1-n `SentEmail` (links `Lead` and `SenderMailbox`)
- `Campaign` + `Lead` 1-1 `ConversationThread`

---

## Feature matrix summary

See [features.csv](file:///c:/Users/HP/Desktop/replica/features.csv) for full list.
- **Must**: 17 features (Core MVP vertical slice: website ICP crawl, B2B lead search, email verification, AI copy generation, sending via pre-warmed pool, unified inbox with sentiment, pay-as-you-go credit ledger)
- **Should**: 5 features (Lookalike search, manual copy approval mode, custom BYO domain SMTP, autonomous meeting booking link, Zapier/webhook integration)
- **Could**: 3 features (CSV lead export, team multi-seat permissions, custom sender IP warmup)
- **Skip**: 2 features (Explee's internal 105M proprietary raw data lake & proprietary server IP clusters — replaced in clone by third-party B2B data APIs e.g. Apollo/Crustdata and managed sender infrastructure)

---

## Out of scope (cannot or should not be cloned)

1. **Proprietary Data Lake (105M+ Companies / 500M+ Profiles):** Sourcing and updating a massive global raw crawling cluster is prohibitively capital intensive. The clean-room clone delegates lead lookups and enrichment to external B2B data providers (Apollo, Crustdata, Enrow, People Data Labs) behind an abstraction adapter.
2. **Proprietary Managed Dedicated IP Hardware Pools:** The clone should use managed infrastructure APIs (such as Smartlead, Instantly API, or Postmark/Resend for transactional) and automated Google Workspace/Outlook BYO mailbox pools rather than raw data-center IP warming.

---

## Size & Complexity

- **Screens**: 11
- **Flows**: 5
- **Entities**: 10
- **Hard parts**:
  1. *Email deliverability & sender pool management*: Handling rotation, SPF/DKIM/DMARC compliance, bounce spikes, and volume throttling to keep inboxes out of spam.
  2. *AI reply sentiment parsing & conversational context*: Accurately distinguishing between soft nos, real objections, OOO autoresponders, and booking intent.
  3. *Credit metering & concurrency safety*: Precise pay-as-you-go atomic debit transactions per email/enrichment to avoid credit balance under-runs.

**Size Rating**: **M (Medium)** — A focused 3-to-4 week vertical slice (website crawl -> lead enrichment API -> AI cold email generator -> unified inbox) delivers a fully functional product without needing Explee's capital-intensive data warehouse.
