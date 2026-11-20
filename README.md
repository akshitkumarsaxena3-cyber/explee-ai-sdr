# Explee AI SDR — Autonomous B2B Outbound & Lead Engine

A clean-room production replica of **Explee** (`explee.com`, formerly AutoGTM). An autonomous AI sales development representative that converts website URLs into ideal customer profiles (ICPs), sources verified decision-makers, writes hyper-personalized cold outreach sequences, delivers through pre-warmed inboxes, and books meetings directly into your calendar.

---

## 🌟 Key Features

1. **Instant Website-to-ICP Discovery (`/api/onboarding/analyze-domain`)**
   - Automatically crawls any company domain.
   - Extracts value propositions, core pain points, target job titles (VP Sales, Head of Growth, CRO), and industry firmographics using Google Gemini AI.

2. **B2B Decision-Maker Intelligence & Lookalikes (`/api/leads/search`, `/api/leads/lookalikes`)**
   - Filter leads by seniority, title, headcount, and industry.
   - Verified email badges (<3% bounce rate guarantee).
   - Enter any company domain to discover similar lookalike B2B accounts.

3. **AI Cold Email Sequence Generator (`/api/campaigns`)**
   - Dynamic prompt generation combining lead profile data with user offer.
   - Multi-step sequences (Initial Cold Hook + Follow-ups with variable tags: `{{firstName}}`, `{{company}}`, `{{jobTitle}}`).

4. **Pre-Warmed Mailbox Pool & Deliverability Protection (`/api/mailboxes`)**
   - Built-in warmed inboxes with dedicated IP rotation.
   - Real-time mailbox health scores (98%+ reputation), daily limits, and SPF/DKIM/DMARC compliance.

5. **Unified Multi-Inbox with Sentiment Classification (`/api/inbox`)**
   - Real-time sentiment tagging: `Interested` (green), `Objection` (amber), `Out of Office` (blue), `Unsubscribe` (red).
   - 1-Click AI Auto-Reply Assistant: Automatically drafts contextual responses and injects Cal.com demo booking links.

6. **Pay-As-You-Go Credit Ledger (`/api/billing`)**
   - Consumption-based pricing ($0.04 per email sent, $0.01 per lead enriched).
   - Atomic debit balance with safety daily spend caps and instant Stripe top-ups.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, Tailwind CSS v4, Lucide Icons, Vite
* **Backend:** Node.js, Express 5, Google Generative AI (Gemini)
* **Database & Schema:** PostgreSQL 14+ schema with Row-Level Security (`replica/schema.sql`)
* **Documentation & Blueprint:** `replica/recon.md`, `replica/features.csv`, `replica/architecture.md`

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone https://github.com/akshitkumarsaxena3-cyber/explee-ai-sdr.git
cd explee-ai-sdr
npm install
```

### 2. Environment Configuration (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Add your `GEMINI_API_KEY` for live AI generation, or leave blank to use the built-in smart heuristic model).*

### 3. Build & Run
```bash
# Build the React frontend
npm run build

# Start the full-stack server
npm run server
```
Open **`http://localhost:5000`** in your browser.

For simultaneous development with live hot-reloading:
```bash
npm run dev
```

---

## 📁 Repository Structure

```
explee-ai-sdr/
├── replica/
│   ├── recon.md          # Reverse-engineered blueprint & screen inventory
│   ├── features.csv       # Must / Should / Could feature matrix
│   ├── architecture.md   # System architecture & stack specification
│   └── schema.sql         # Production PostgreSQL database schema
├── server/
│   └── index.js          # Express API endpoints & AI engine
├── src/
│   ├── App.jsx           # All-in-one responsive SaaS application UI
│   ├── main.jsx          # React DOM root entry
│   └── index.css         # Tailwind CSS v4 styling & dark theme
├── vite.config.js        # Vite & Tailwind configuration
├── package.json          # Dependencies & npm scripts
└── README.md
```

---

## 📜 License
MIT License. Built clean-room style based on public SaaS patterns.
