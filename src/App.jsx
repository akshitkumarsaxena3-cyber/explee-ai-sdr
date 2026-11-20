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
  DollarSign
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workspace, setWorkspace] = useState({
    credit_balance_cents: 3000,
    daily_spend_limit_cents: 2000,
    spent_today_cents: 360
  });

  // ICP Crawl state
  const [crawlUrl, setCrawlUrl] = useState('https://scalevector.ai');
  const [isCrawling, setIsCrawling] = useState(false);
  const [icpData, setIcpData] = useState(null);

  // Campaigns state
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isSendingBatch, setIsSendingBatch] = useState(false);

  // Leads & Search state
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [lookalikeDomain, setLookalikeDomain] = useState('');
  const [lookalikes, setLookalikes] = useState([]);

  // Inbox state
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  // Mailboxes & Billing
  const [mailboxes, setMailboxes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Notification toast helper
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial Data Fetch
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
      const data = await res.json();
      if (data.workspace) setWorkspace(data.workspace);
      if (data.transactions) setTransactions(data.transactions);
    } catch (err) {
      console.error('Error fetching billing:', err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      if (data.campaigns) {
        setCampaigns(data.campaigns);
        if (!selectedCampaign && data.campaigns.length > 0) {
          setSelectedCampaign(data.campaigns[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, industry: selectedIndustry })
      });
      const data = await res.json();
      if (data.leads) setLeads(data.leads);
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  };

  const fetchInbox = async (sentiment = sentimentFilter) => {
    try {
      const url = sentiment && sentiment !== 'all' ? `/api/inbox/conversations?sentiment=${sentiment}` : '/api/inbox/conversations';
      const res = await fetch(url);
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
        if (!selectedConv && data.conversations.length > 0) {
          setSelectedConv(data.conversations[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching inbox:', err);
    }
  };

  const fetchMailboxes = async () => {
    try {
      const res = await fetch('/api/mailboxes');
      const data = await res.json();
      if (data.mailboxes) setMailboxes(data.mailboxes);
    } catch (err) {
      console.error('Error fetching mailboxes:', err);
    }
  };

  // Actions
  const handleAnalyzeDomain = async () => {
    if (!crawlUrl) return;
    setIsCrawling(true);
    try {
      const res = await fetch('/api/onboarding/analyze-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: crawlUrl })
      });
      const data = await res.json();
      setIcpData(data);
      showToast(`Analyzed ${data.companyName}! ICP and personas generated.`);
    } catch (err) {
      showToast('Error analyzing domain', 'error');
    } finally {
      setIsCrawling(false);
    }
  };

  const handleToggleCampaign = async (id) => {
    try {
      const res = await fetch(`/api/campaigns/${id}/toggle`, { method: 'PATCH' });
      const updated = await res.json();
      setCampaigns(prev => prev.map(c => c.id === id ? updated : c));
      if (selectedCampaign?.id === id) setSelectedCampaign(updated);
      showToast(`Campaign is now ${updated.status}`);
    } catch (err) {
      showToast('Failed to toggle campaign', 'error');
    }
  };

  const handleDispatchBatch = async (campaignId) => {
    setIsSendingBatch(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/send-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize: 10 })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Dispatched 10 emails! (Spent $${(data.costCents / 100).toFixed(2)})`);
        fetchBilling();
        fetchCampaigns();
      } else {
        showToast(data.error || 'Batch dispatch failed', 'error');
      }
    } catch (err) {
      showToast('Error dispatching batch', 'error');
    } finally {
      setIsSendingBatch(false);
    }
  };

  const handleGenerateAiReply = async (convId) => {
    setIsGeneratingReply(true);
    try {
      const res = await fetch('/api/inbox/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: convId })
      });
      const data = await res.json();
      setReplyText(data.suggestedReply);
      showToast('AI drafted contextual reply with calendar booking link!');
    } catch (err) {
      showToast('Could not generate AI reply', 'error');
    } finally {
      setIsGeneratingReply(false);
    }
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
      const data = await res.json();
      if (data.success) {
        showToast('Reply dispatched via warmed mailbox!');
        setReplyText('');
        fetchInbox();
        setSelectedConv(data.conversation);
      }
    } catch (err) {
      showToast('Error sending reply', 'error');
    }
  };

  const handleTopupCredits = async (amountCents) => {
    try {
      const res = await fetch('/api/billing/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountCents })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Successfully added $${(amountCents / 100).toFixed(2)} to credit wallet!`);
        fetchBilling();
      }
    } catch (err) {
      showToast('Failed to topup credits', 'error');
    }
  };

  const handleFindLookalikes = async () => {
    if (!lookalikeDomain) return;
    try {
      const res = await fetch('/api/leads/lookalikes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: lookalikeDomain })
      });
      const data = await res.json();
      setLookalikes(data.lookalikes || []);
    } catch (err) {
      showToast('Failed to find lookalikes', 'error');
    }
  };

  return (
    <div className="flex h-screen bg-[#0b0f17] text-slate-100 overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium animate-bounce ${
          toastMessage.type === 'error'
            ? 'bg-rose-950/90 text-rose-200 border-rose-800'
            : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
        }`}>
          {toastMessage.type === 'error' ? <AlertCircle className="w-5 h-5 text-rose-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800/80 bg-[#0d131f] flex flex-col justify-between p-4">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">EXPLEE</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">AI SDR</span>
              </div>
              <p className="text-[11px] text-slate-400">Autonomous Outbound</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Mission Control</span>
            </button>

            <button
              onClick={() => setActiveTab('onboarding')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'onboarding'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>URL to ICP Wizard</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'leads'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Lead Intelligence</span>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'campaigns'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Campaigns & Sequences</span>
            </button>

            <button
              onClick={() => setActiveTab('inbox')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'inbox'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Unified Reply Inbox</span>
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                {conversations.filter(c => c.sentiment === 'interested').length} hot
              </span>
            </button>

            <button
              onClick={() => setActiveTab('mailboxes')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'mailboxes'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Server className="w-4 h-4" />
              <span>Warmed Mailbox Pool</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'billing'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Credits & Billing</span>
            </button>
          </nav>
        </div>

        {/* Credit Balance Card */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Credit Wallet</span>
            <span className="text-emerald-400 font-semibold">$0.04/email</span>
          </div>
          <div className="text-xl font-bold text-white mb-2">
            ${(workspace.credit_balance_cents / 100).toFixed(2)}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (workspace.credit_balance_cents / 3000) * 100)}%` }}
            ></div>
          </div>
          <button
            onClick={() => handleTopupCredits(5000)}
            className="w-full py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>+ $50 Top-up</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0d131f]/60 backdrop-blur-md flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg text-white capitalize">
              {activeTab === 'dashboard' && 'Autonomous Outbound Mission Control'}
              {activeTab === 'onboarding' && 'Website to Ideal Customer Profile (ICP)'}
              {activeTab === 'leads' && 'B2B Lead Engine & Lookalike Accounts'}
              {activeTab === 'campaigns' && 'Campaign Orchestration & AI Sequences'}
              {activeTab === 'inbox' && 'Unified Multi-Inbox & AI Booking Assistant'}
              {activeTab === 'mailboxes' && 'Pre-Warmed Mailbox Health & Sender Pool'}
              {activeTab === 'billing' && 'Pay-As-You-Go Credit Ledger'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>4 Inboxes Active & Warmed</span>
            </div>
            <button
              onClick={() => setActiveTab('onboarding')}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
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
                <div className="p-5 rounded-2xl bg-[#111827]/70 border border-slate-800/80 shadow-sm relative overflow-hidden">
                  <div className="text-xs font-medium text-slate-400">Total Emails Dispatched</div>
                  <div className="text-2xl font-black text-white mt-1">136</div>
                  <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+42 today via warmed pool</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#111827]/70 border border-slate-800/80 shadow-sm relative overflow-hidden">
                  <div className="text-xs font-medium text-slate-400">Average Open Rate</div>
                  <div className="text-2xl font-black text-white mt-1">69.8%</div>
                  <div className="text-xs text-slate-400 mt-2">
                    Industry avg: ~28%
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#111827]/70 border border-slate-800/80 shadow-sm relative overflow-hidden">
                  <div className="text-xs font-medium text-slate-400">Response Rate</div>
                  <div className="text-2xl font-black text-white mt-1">23.5%</div>
                  <div className="text-xs text-emerald-400 mt-2">
                    32 total prospect replies
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 shadow-sm relative overflow-hidden">
                  <div className="text-xs font-medium text-emerald-300">Qualified Meetings Booked</div>
                  <div className="text-3xl font-black text-emerald-400 mt-1">10</div>
                  <div className="text-xs text-emerald-300/80 mt-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Cal.com automated bookings</span>
                  </div>
                </div>
              </div>

              {/* Quick Hero Setup Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#111827] to-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-base">Instant Outbound Setup</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Enter your product website URL. Explee extracts your ICP, finds verified decision-makers, and writes custom cold sequences.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={crawlUrl}
                    onChange={(e) => setCrawlUrl(e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 w-64 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => {
                      setActiveTab('onboarding');
                      handleAnalyzeDomain();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                  >
                    <span>Analyze & Start</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Active Campaigns List */}
              <div className="rounded-2xl bg-[#111827]/70 border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">Active Autonomous Campaigns</h3>
                    <p className="text-xs text-slate-400">Live AI outbound agents running on pay-as-you-go delivery</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('campaigns')}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>Manage all sequences</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {campaigns.map(cmp => (
                    <div key={cmp.id} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-semibold text-sm text-white">{cmp.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            cmp.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {cmp.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-4">
                          <span>🎯 {cmp.leadsCount} Target Leads</span>
                          <span>📤 {cmp.sentCount} Sent</span>
                          <span>📬 {cmp.replyCount} Replies ({(cmp.replyCount / (cmp.sentCount || 1) * 100).toFixed(0)}%)</span>
                          <span className="text-emerald-400 font-medium">📅 {cmp.meetingsBooked} Meetings</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleCampaign(cmp.id)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title={cmp.status === 'active' ? 'Pause Campaign' : 'Resume Campaign'}
                        >
                          {cmp.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
                        </button>
                        <button
                          onClick={() => handleDispatchBatch(cmp.id)}
                          disabled={isSendingBatch || cmp.status !== 'active'}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch 10 Emails ($0.40)</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: URL TO ICP WIZARD */}
          {activeTab === 'onboarding' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-6 rounded-2xl bg-[#111827]/80 border border-slate-800 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    <span>Website Domain Crawl & ICP Synthesis</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Explee’s AI scans your landing page copy, value proposition, and customer transformation to automatically construct your target personas.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={crawlUrl}
                      onChange={(e) => setCrawlUrl(e.target.value)}
                      placeholder="https://yourproduct.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                  <button
                    onClick={handleAnalyzeDomain}
                    disabled={isCrawling}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/25 disabled:opacity-50"
                  >
                    {isCrawling ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Scanning Website...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Analyze Domain</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ICP Results Preview */}
              {icpData && (
                <div className="p-6 rounded-2xl bg-[#111827] border border-emerald-500/30 space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">AI Synthesized ICP</span>
                      <h3 className="text-xl font-bold text-white">{icpData.companyName}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{icpData.headline}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                        {icpData.confidenceScore}% ICP Confidence
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Transformation / Value Prop</h4>
                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        {icpData.valueProposition}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Key Customer Pain Points</h4>
                      <div className="space-y-1.5">
                        {icpData.keyPainPoints?.map((p, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></span>
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                      <div className="text-xs text-slate-400 font-medium mb-2">Target Personas</div>
                      <div className="flex flex-wrap gap-1.5">
                        {icpData.targetJobTitles?.map((t, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                      <div className="text-xs text-slate-400 font-medium mb-2">Target Industries</div>
                      <div className="flex flex-wrap gap-1.5">
                        {icpData.targetIndustries?.map((ind, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 font-medium">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                      <div className="text-xs text-slate-400 font-medium mb-2">Company Size</div>
                      <div className="flex flex-wrap gap-1.5">
                        {icpData.targetHeadcounts?.map((h, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 font-medium">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setActiveTab('leads')}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                    >
                      Search Decision-Makers
                    </button>
                    <button
                      onClick={() => setActiveTab('campaigns')}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Proceed to AI Sequence Builder</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: B2B LEADS & LOOKALIKES */}
          {activeTab === 'leads' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Search & Lookalikes Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-4 rounded-2xl bg-[#111827]/80 border border-slate-800 flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
                      placeholder="Search by name, company, title, or skill..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  </div>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="All">All Industries</option>
                    <option value="B2B SaaS">B2B SaaS</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Marketing & Advertising">Marketing</option>
                    <option value="Staffing & Recruiting">Recruiting</option>
                  </select>
                  <button
                    onClick={fetchLeads}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
                  >
                    Filter
                  </button>
                </div>

                {/* Lookalike Finder */}
                <div className="p-4 rounded-2xl bg-[#111827]/80 border border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={lookalikeDomain}
                    onChange={(e) => setLookalikeDomain(e.target.value)}
                    placeholder="Lookalike seed domain (e.g. stripe.com)"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleFindLookalikes}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-emerald-400 border border-slate-700 transition-colors"
                  >
                    Find
                  </button>
                </div>
              </div>

              {/* Lookalikes results if any */}
              {lookalikes.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-center gap-4 overflow-x-auto">
                  <span className="text-xs font-bold text-emerald-400 whitespace-nowrap">Lookalike Matches:</span>
                  {lookalikes.map((lk, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs whitespace-nowrap">
                      <span className="font-semibold text-white">{lk.name}</span>
                      <span className="text-slate-400 text-[10px]">({lk.headcount})</span>
                      <span className="text-[10px] font-bold text-emerald-400 px-1 rounded bg-emerald-500/10">{lk.similarity} match</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Leads Table */}
              <div className="rounded-2xl bg-[#111827]/70 border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">Verified Decision-Maker Profiles</h3>
                    <p className="text-xs text-slate-400">Validated emails with under 3% bounce guarantee</p>
                  </div>
                  <span className="text-xs text-slate-400">{leads.length} contacts loaded</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Decision Maker</th>
                        <th className="py-3 px-4">Title & Company</th>
                        <th className="py-3 px-4">Industry / Size</th>
                        <th className="py-3 px-4">Verified Email</th>
                        <th className="py-3 px-4">Tech Stack</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {leads.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{lead.firstName} {lead.lastName}</div>
                            <div className="text-[11px] text-slate-400">{lead.location}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-emerald-400 font-medium">{lead.jobTitle}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <span>{lead.company}</span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div>{lead.industry}</div>
                            <div className="text-[11px] text-slate-500">{lead.headcount}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-slate-200">{lead.email}</span>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-0.5">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified Deliverable</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {lead.techStack?.map((t, idx) => (
                                <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                showToast(`Added ${lead.firstName} to Campaign sequence!`);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-medium text-[11px] transition-colors"
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
                  <h3 className="font-bold text-white text-sm">Campaigns</h3>
                  {campaigns.map(cmp => (
                    <div
                      key={cmp.id}
                      onClick={() => setSelectedCampaign(cmp)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedCampaign?.id === cmp.id
                          ? 'bg-slate-900 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                          : 'bg-[#111827]/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-sm text-white">{cmp.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          cmp.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {cmp.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex justify-between">
                        <span>Daily cap: {cmp.dailyCap}/day</span>
                        <span className="text-emerald-400">{cmp.meetingsBooked} Meetings</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sequence Detail Column */}
                {selectedCampaign && (
                  <div className="md:col-span-2 space-y-4">
                    <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-white text-base">{selectedCampaign.name}</h3>
                        <p className="text-xs text-slate-400">Multi-stage cold email sequence powered by pre-warmed mailboxes</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleCampaign(selectedCampaign.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                        >
                          {selectedCampaign.status === 'active' ? 'Pause' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDispatchBatch(selectedCampaign.id)}
                          disabled={isSendingBatch || selectedCampaign.status !== 'active'}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5 disabled:opacity-40"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send 10 Batch Emails</span>
                        </button>
                      </div>
                    </div>

                    {/* Step Cards */}
                    <div className="space-y-4">
                      {selectedCampaign.steps?.map((step, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                                {step.stepNumber}
                              </span>
                              <span className="font-bold text-sm text-white">
                                {step.stepNumber === 1 ? 'Initial Cold Touchpoint' : `Follow-up (+${step.delayDays} days)`}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{step.delayDays === 0 ? 'Sent instantly on match' : `Wait ${step.delayDays} days`}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-xs text-slate-400 font-medium">
                              Subject: <span className="text-slate-200 font-mono">{step.subject}</span>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
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

          {/* TAB 5: UNIFIED REPLY INBOX */}
          {activeTab === 'inbox' && (
            <div className="h-full flex gap-4 max-w-7xl mx-auto">
              {/* Left Pane: Conversations List */}
              <div className="w-80 border-r border-slate-800 pr-4 flex flex-col space-y-3">
                {/* Sentiment Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                  {['all', 'interested', 'objection', 'unsubscribe'].map(f => (
                    <button
                      key={f}
                      onClick={() => {
                        setSentimentFilter(f);
                        fetchInbox(f);
                      }}
                      className={`px-2.5 py-1 rounded-lg capitalize font-medium whitespace-nowrap transition-colors ${
                        sentimentFilter === f
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
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
                          ? 'bg-slate-900 border-emerald-500/50 shadow-md'
                          : 'bg-[#111827]/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-white truncate">{conv.leadName}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                          conv.sentiment === 'interested' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          conv.sentiment === 'objection' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {conv.sentiment}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{conv.company}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{conv.lastMessageAt}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Pane: Thread History & AI Reply Assistant */}
              {selectedConv ? (
                <div className="flex-1 flex flex-col justify-between bg-[#111827]/60 rounded-2xl border border-slate-800 p-5 overflow-hidden">
                  {/* Thread Header */}
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">{selectedConv.leadName}</h3>
                        <span className="text-xs text-slate-400">({selectedConv.jobTitle} at {selectedConv.company})</span>
                      </div>
                      <p className="text-xs font-mono text-slate-400">{selectedConv.email}</p>
                    </div>
                    {selectedConv.isMeetingBooked && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
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
                              ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-700/20'
                              : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                          }`}
                        >
                          {msg.body}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Reply Generator Box */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleGenerateAiReply(selectedConv.id)}
                        disabled={isGeneratingReply}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isGeneratingReply ? 'Generating AI Response...' : 'Auto-Draft Response with Cal.com'}</span>
                      </button>
                      <span className="text-[11px] text-slate-500">Autonomous SDR Mode</span>
                    </div>

                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a message or click 'Auto-Draft Response' above..."
                      rows={3}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5 disabled:opacity-40"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                  Select a conversation thread to inspect and reply
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SENDER MAILBOX POOL */}
          {activeTab === 'mailboxes' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="p-6 rounded-2xl bg-[#111827]/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-emerald-400" />
                    <span>Pre-Warmed Mailbox Infrastructure</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Managed authenticated inboxes with dedicated IP rotation, SPF, DKIM, and DMARC compliance built-in.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-emerald-400">98.5%</div>
                  <div className="text-[11px] text-slate-400">Pool Reputation Score</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mailboxes.map(mb => (
                  <div key={mb.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm text-white">{mb.name}</div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        mb.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {mb.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="font-mono text-xs text-slate-300">{mb.email}</div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-500">Reputation</div>
                        <div className="font-bold text-emerald-400">{mb.reputation}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Sent Today</div>
                        <div className="font-semibold text-white">{mb.sentToday} / {mb.dailyLimit}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Auth Status</div>
                        <div className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>SPF/DKIM</span>
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
              {/* Credit Wallet Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Available Credits</div>
                  <div className="text-3xl font-black text-white mt-1">
                    ${(workspace.credit_balance_cents / 100).toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    ~{Math.floor(workspace.credit_balance_cents / 4)} outbound emails
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Daily Spend Cap</div>
                  <div className="text-3xl font-black text-white mt-1">
                    ${(workspace.daily_spend_limit_cents / 100).toFixed(2)}
                  </div>
                  <div className="text-xs text-emerald-400 mt-2">
                    ${(workspace.spent_today_cents / 100).toFixed(2)} spent today
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Pay-As-You-Go Rates</div>
                    <div className="text-xs text-slate-300 mt-1 font-mono">
                      <div>• $0.04 per cold email sent</div>
                      <div>• $0.01 per lead enriched</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">No recurring subscription lock-in</div>
                </div>
              </div>

              {/* Instant Credit Packs */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#111827] to-slate-900 border border-slate-800 space-y-4">
                <h3 className="font-bold text-white text-sm">Top-Up Credit Packs</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { amount: 5000, label: '$50 Pack', emails: '1,250 emails', popular: false },
                    { amount: 10000, label: '$100 Pack', emails: '2,500 emails', popular: true },
                    { amount: 25000, label: '$250 Pack', emails: '6,250 emails', popular: false }
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border relative flex flex-col justify-between ${
                        p.popular ? 'bg-slate-900 border-emerald-500/60' : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      {p.popular && (
                        <span className="absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-black">
                          Most Popular
                        </span>
                      )}
                      <div>
                        <div className="font-bold text-white text-base">{p.label}</div>
                        <div className="text-xs text-emerald-400 font-medium mt-0.5">{p.emails}</div>
                      </div>
                      <button
                        onClick={() => handleTopupCredits(p.amount)}
                        className="mt-4 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md shadow-emerald-700/20"
                      >
                        Buy Credits
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transactions Ledger */}
              <div className="rounded-2xl bg-[#111827]/70 border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                  <h3 className="font-bold text-white text-sm">Credit Ledger & Transaction History</h3>
                </div>
                <div className="divide-y divide-slate-800/60">
                  {transactions.map(tx => (
                    <div key={tx.id} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-slate-200">{tx.description}</div>
                        <div className="text-[10px] text-slate-500">{tx.date}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono font-bold ${tx.amountCents > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {tx.amountCents > 0 ? `+` : ``}${(tx.amountCents / 100).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Balance: ${(tx.balanceAfter / 100).toFixed(2)}
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
