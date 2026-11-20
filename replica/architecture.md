# Architecture: Explee Replica (AI Outbound SDR & B2B Lead Engine)

A clean-room rebuild of Explee's core features: automated website-to-ICP intelligence, B2B lead discovery, AI personalized email generation, pre-warmed inbox delivery, and unified reply management.

---

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| **Web Framework** | Next.js 14+ (App Router) + TypeScript | Full-stack unified React framework with fast server actions, type-safety, and seamless deployment |
| **Styling & UI** | Tailwind CSS + Lucide Icons + Radix UI | Modern, dark-mode ready SaaS aesthetics with high component responsiveness |
| **Database** | PostgreSQL (compatible with Supabase, Neon, or local Docker) | Relational integrity for workspaces, foreign keys, constraints, and JSONB filters |
| **ORM / Data Layer** | Prisma ORM / Typed SQL Client | Strict type generation, safe migrations, and tenant-scoped query filters |
| **AI Engine** | Google Gemini API (`gemini-2.5-flash` / `@google/genai`) | Ultra-fast token generation, reasoning for website ICP extraction, personalized copy, and reply sentiment analysis |
| **B2B Data Provider** | Pluggable Provider Adapter (Apollo / Crustdata / Local Mock Dataset) | Decoupled lead prospecting layer providing instant zero-cost local testing and production API swaps |
| **Email Delivery** | Multi-transport Sender (Resend / Custom SMTP / Simulated Warmed Pool) | Supports both managed warmed pool simulation and custom user-provided mailboxes |
| **Job Queue & Schedulers** | Node.js Task Runner / Inngest / Cron API | Handles rate-limited batch sends, sequence delays, and inbox sync jobs |
| **Payments & Credits** | Stripe Checkout + Atomic Credit Ledger | Pay-as-you-go micro-debits ($0.04/email, $10/1k contacts) with daily budget safety |
| **Hosting** | Vercel or Node.js Container | Zero-config edge routing and scale-to-zero efficiency |

---

## 2. Schema

- **Total Tables:** 13 tables (`workspaces`, `users`, `icp_profiles`, `companies`, `leads`, `sender_mailboxes`, `campaigns`, `campaign_sequence_steps`, `campaign_leads`, `sent_emails`, `conversations`, `conversation_messages`, `credit_transactions`)
- **Access Rules:** Multi-tenant workspace isolation. Every database query enforces `workspace_id = current_workspace_id`.
- **Full SQL Definition:** See [schema.sql](file:///c:/Users/HP/Desktop/replica/schema.sql).

---

## 3. API Routes & Server Actions

| Method & Route | What It Does | Who | Input | Output | Flow |
|---|---|---|---|---|---|
| `POST /api/onboarding/analyze-domain` | Crawls website & extracts ICP via Gemini AI | Auth User | `{ url: string }` | `{ summary, valueProp, targetTitles, industries }` | F01 |
| `POST /api/leads/search` | Natural language / filtered B2B lead discovery | Auth User | `{ query?, titles?, industries?, headcount?, location? }` | `{ leads: Lead[], total: number }` | F02 |
| `POST /api/leads/lookalikes` | Finds lookalike companies from seed domain | Auth User | `{ domain: string, limit?: number }` | `{ companies: Company[] }` | F02 |
| `POST /api/campaigns` | Creates new campaign with AI-generated sequence | Auth User | `{ name, icpId, filterJson, dailyCap, promptInstructions }` | `{ campaign: Campaign, steps: Step[] }` | F03 |
| `GET /api/campaigns/:id` | Fetches campaign analytics, send logs, and status | Auth User | `id: string` | `{ campaign, stats, sequence, sentEmails }` | F03 |
| `PATCH /api/campaigns/:id/status` | Toggles campaign status (Active / Paused) | Auth User | `{ status: "active" \| "paused" }` | `{ success: boolean }` | F03 |
| `POST /api/campaigns/:id/send-batch` | Trigger batch worker to dispatch emails via warmed mailboxes | Worker/Cron | `{ campaignId, batchSize }` | `{ dispatchedCount, debitedCents }` | F03 |
| `GET /api/inbox/conversations` | Lists reply threads with sentiment classifications | Auth User | `{ sentimentFilter?, status? }` | `{ conversations: Conversation[] }` | F04 |
| `POST /api/inbox/reply` | Sends manual or AI-assisted response to a prospect | Auth User | `{ conversationId, bodyText }` | `{ message: Message }` | F04 |
| `POST /api/inbox/classify-sentiment` | Classifies incoming reply and auto-generates booking response | Internal | `{ inboundBody: string }` | `{ sentiment, suggestedReply, shouldAutoSend }` | F04 |
| `GET /api/billing/ledger` | Returns credit balance, daily spend, and history | Auth User | none | `{ balanceCents, dailySpentCents, transactions }` | F05 |
| `POST /api/billing/create-topup` | Creates Stripe Checkout session for credits | Auth User | `{ packAmountCents: number }` | `{ checkoutUrl: string }` | F05 |
| `POST /api/webhooks/stripe` | Listens for checkout completion & credits balance | Stripe | Stripe event payload | `{ received: boolean }` | F05 |
| `POST /api/webhooks/inbound-email` | Ingests reply from email provider, maps to lead thread | Email Provider | Inbound MIME email payload | `{ conversationId: string }` | F04 |

---

## 4. Background Jobs & Workers

1. **`email-dispatcher` (Runs every 1–5 minutes):**
   - Fetches active campaigns with `next_send_at <= now()`.
   - Checks workspace credit balance (must be $\ge$ 4 cents) and daily spend limit.
   - Rotates through available `sender_mailboxes` under reputation limits.
   - Dispatches email, updates `campaign_leads.current_step`, and debits 4 cents from workspace credits.
2. **`mailbox-warmup-simulator` (Daily):**
   - Simulates gradual sending ramp-up and health checks on virtual inboxes.
3. **`lead-enrichment-cleaner` (On demand):**
   - Verifies email syntax and domain MX records before queueing leads.

---

## 5. The Parts That Bite

* **Deliverability & Spam Traps:** Sending too fast from a single domain burns inboxes. Architecture mandates round-robin mailbox rotation with strict pacing (maximum 30–50 emails per sender per day).
* **Credit Concurrency & Over-drafts:** Two parallel workers dispatching emails could charge a zero-credit account. Architecture requires atomic PostgreSQL debits (`UPDATE workspaces SET credit_balance_cents = credit_balance_cents - 4 WHERE id = $1 AND credit_balance_cents >= 4`).
* **Unsubscribes & Legal Compliance:** Immediate suppression list enforcement. When an inbound reply is classified as `unsubscribe`, all future sequence steps across all campaigns for that lead email are permanently halted.
* **Webhook Idempotency:** Stripe and email delivery webhooks can arrive multiple times. Every transaction uses a unique `reference_id` to prevent double-crediting.

---

## 6. Build Order

1. **Milestone 1 — Vertical Slice (Days 1–3):**
   * Setup Next.js + Tailwind + App Shell.
   * Landing Page (`S01`) + URL input.
   * AI Domain ICP Extractor (`POST /api/onboarding/analyze-domain`).
   * Lead Search Table (`S05`) with mock/seed B2B dataset.
   * AI Cold Email Sequence Preview (`S07`).
2. **Milestone 2 — Execution & Deliverability (Days 4–7):**
   * Campaign runner with daily caps (`S08`).
   * Warmed Mailbox Pool manager (`S10`).
   * Email Dispatcher worker with credit atomic debit.
3. **Milestone 3 — Intelligence & Inbox (Days 8–10):**
   * Unified Inbox (`S09`) with sentiment badges (Interested, Objection, OOO, Unsubscribe).
   * AI autonomous meeting-booking response generator.
   * Credit Wallet & Daily Spend Limit management (`S11`).
