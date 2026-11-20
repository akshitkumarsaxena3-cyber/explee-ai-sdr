-- ====================================================================
-- SCHEMA: Explee Replica (AI Outbound SDR & B2B Lead Engine)
-- Target Database: PostgreSQL 14+
-- Features: Row Level Security (RLS) Ready, Strict Constraints, Indexes
-- ====================================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Enums
create type user_role as enum ('owner', 'admin', 'member');
create type campaign_status as enum ('draft', 'active', 'paused', 'completed', 'budget_exhausted');
create type email_status as enum ('queued', 'sending', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'failed');
create type sentiment_type as enum ('interested', 'objection', 'ooo', 'unsubscribe', 'neutral', 'requires_human');
create type mailbox_status as enum ('active', 'warming', 'paused', 'burned');
create type credit_tx_type as enum ('purchase', 'bonus', 'spend_email', 'spend_enrichment', 'refund');

-- 1. WORKSPACES (Tenants)
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  credit_balance_cents integer not null default 3000 check (credit_balance_cents >= 0), -- default $30 starter credits
  daily_spend_limit_cents integer not null default 2000, -- default $20/day
  auto_recharge_enabled boolean not null default false,
  auto_recharge_threshold_cents integer default 500,
  auto_recharge_amount_cents integer default 5000,
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. USERS
create table users (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  role user_role not null default 'member',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_users_workspace on users(workspace_id);

-- 3. ICP PROFILES (Ideal Customer Profiles derived from URL crawl)
create table icp_profiles (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  website_url text not null,
  company_name text not null,
  company_summary text not null,
  value_proposition text not null,
  target_industries text[] not null default '{}',
  target_headcounts text[] not null default '{}',
  target_job_titles text[] not null default '{}',
  target_geographies text[] not null default '{}',
  raw_crawl_data jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_icp_workspace on icp_profiles(workspace_id);

-- 4. COMPANIES (Discovered & Enriched B2B Accounts)
create table companies (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  domain text not null,
  name text not null,
  description text,
  industry text,
  headcount_range text,
  country text,
  city text,
  linkedin_url text,
  technologies text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_workspace_company_domain unique (workspace_id, domain)
);
create index idx_companies_workspace_domain on companies(workspace_id, domain);
create index idx_companies_industry on companies(industry);

-- 5. LEADS (Decision-Maker Contacts)
create table leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  company_id uuid references companies(id) on delete set null,
  first_name text not null,
  last_name text not null,
  job_title text not null,
  seniority text not null default 'manager',
  email text not null,
  email_verification_status text not null default 'verified'
    check (email_verification_status in ('verified', 'catchall', 'unverified', 'invalid')),
  linkedin_url text,
  location text,
  is_unsubscribed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_workspace_lead_email unique (workspace_id, email)
);
create index idx_leads_workspace on leads(workspace_id);
create index idx_leads_company on leads(company_id);
create index idx_leads_email on leads(email);

-- 6. SENDER MAILBOXES (Pre-warmed pool or BYO custom domains)
create table sender_mailboxes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  email_address text not null,
  sender_name text not null,
  is_managed_pool boolean not null default true,
  daily_max_limit integer not null default 50,
  daily_sent_count integer not null default 0,
  reputation_score numeric(4,2) not null default 98.50,
  status mailbox_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_mailboxes_workspace on sender_mailboxes(workspace_id);
create index idx_mailboxes_status on sender_mailboxes(status);

-- 7. CAMPAIGNS
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  icp_profile_id uuid references icp_profiles(id) on delete set null,
  name text not null,
  status campaign_status not null default 'draft',
  daily_email_cap integer not null default 30,
  daily_spend_limit_cents integer not null default 1000,
  target_filter_json jsonb not null default '{}',
  total_leads_targeted integer not null default 0,
  total_emails_sent integer not null default 0,
  total_replies_received integer not null default 0,
  total_meetings_booked integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_campaigns_workspace on campaigns(workspace_id);
create index idx_campaigns_status on campaigns(status);

-- 8. CAMPAIGN SEQUENCE STEPS
create table campaign_sequence_steps (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  step_number integer not null check (step_number >= 1),
  delay_days integer not null default 0 check (delay_days >= 0),
  subject_template text not null,
  body_template text not null,
  ai_prompt_instruction text,
  created_at timestamptz not null default now(),
  constraint unique_campaign_step unique (campaign_id, step_number)
);
create index idx_steps_campaign on campaign_sequence_steps(campaign_id);

-- 9. CAMPAIGN LEADS (Join table with progression tracking)
create table campaign_leads (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  lead_id uuid not null references leads(id) on delete cascade,
  current_step integer not null default 1,
  is_completed boolean not null default false,
  next_send_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint unique_campaign_lead unique (campaign_id, lead_id)
);
create index idx_cl_next_send on campaign_leads(campaign_id, next_send_at) where is_completed = false;

-- 10. SENT EMAILS (Audit Log & Deliverability)
create table sent_emails (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  lead_id uuid not null references leads(id) on delete cascade,
  sender_mailbox_id uuid references sender_mailboxes(id) on delete set null,
  step_number integer not null,
  subject text not null,
  body_text text not null,
  status email_status not null default 'queued',
  message_id text,
  sent_at timestamptz,
  opened_at timestamptz,
  replied_at timestamptz,
  cost_cents integer not null default 4, -- 4 cents per email
  created_at timestamptz not null default now()
);
create index idx_sent_emails_campaign on sent_emails(campaign_id);
create index idx_sent_emails_lead on sent_emails(lead_id);
create index idx_sent_emails_workspace on sent_emails(workspace_id);

-- 11. CONVERSATIONS & REPLIES (Unified Inbox)
create table conversations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  lead_id uuid not null references leads(id) on delete cascade,
  latest_sentiment sentiment_type not null default 'neutral',
  is_meeting_booked boolean not null default false,
  is_read boolean not null default false,
  status text not null default 'open' check (status in ('open', 'replied', 'closed')),
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index idx_conversations_workspace on conversations(workspace_id);
create index idx_conversations_sentiment on conversations(latest_sentiment);

-- 12. MESSAGES (Within a Conversation)
create table conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound')),
  from_email text not null,
  to_email text not null,
  subject text not null,
  body_text text not null,
  ai_auto_replied boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_messages_conversation on conversation_messages(conversation_id);

-- 13. CREDIT TRANSACTIONS (Pay-as-you-go Ledger)
create table credit_transactions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  amount_cents integer not null, -- positive for purchase/bonus, negative for spend
  type credit_tx_type not null,
  description text not null,
  reference_id text, -- e.g. stripe_charge_id or sent_email_id
  balance_after_cents integer not null,
  created_at timestamptz not null default now()
);
create index idx_credits_workspace on credit_transactions(workspace_id);
